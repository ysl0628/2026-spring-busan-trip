import React, { useEffect, useImperativeHandle, useState } from 'react';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { DaySchedule, ScheduleItem } from '../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type DayEditorProps = {
  day: DaySchedule;
  isSaving: boolean;
  saveError: string;
  onSaveDay: (day: DaySchedule) => void;
  onDraftChange?: (draft: DaySchedule | null) => void;
};

export type DayEditorHandle = {
  getDraft: () => DaySchedule | null;
};

const emptyItem = (): ScheduleItem => ({
  time: '',
  title: '',
  description: '',
  type: 'other',
  useBusanPass: false
});

type ItemRowProps = {
  item: ScheduleItem;
  index: number;
  isExpanded: boolean;
  onChange: (patch: Partial<ScheduleItem>) => void;
  onRemove: () => void;
  onMove: (from: number, to: number) => void;
  onToggle: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
};

const ItemRow: React.FC<ItemRowProps> = ({
  item,
  index,
  isExpanded,
  onChange,
  onRemove,
  onMove,
  onToggle,
  canMoveUp,
  canMoveDown
}) => {
  const rowRef = React.useRef<HTMLDivElement>(null);
  const handleRef = React.useRef<HTMLButtonElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    const element = rowRef.current;
    if (!element) return;

    const cleanupDraggable = handleRef.current
      ? draggable({
        element: handleRef.current,
        getInitialData: () => ({ type: 'day-item', index })
      })
      : () => { };

    const cleanupDropTarget = dropTargetForElements({
      element,
      getData: () => ({ index }),
      onDragEnter: () => setIsDragOver(true),
      onDragLeave: () => setIsDragOver(false),
      onDrop: ({ source }) => {
        if (source.data.type !== 'day-item') return;
        const fromIndex = Number(source.data.index);
        if (Number.isNaN(fromIndex) || fromIndex === index) return;
        onMove(fromIndex, index);
        setIsDragOver(false);
      }
    });

    return () => {
      cleanupDraggable();
      cleanupDropTarget();
    };
  }, [index, onMove]);

  return (
    <div
      ref={rowRef}
      className={`rounded-2xl border border-slate-100 bg-slate-50/60 p-4 ${isDragOver ? 'border-2 border-blue-500' : ''
        }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          ref={handleRef}
          className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex flex-col gap-1 sm:hidden">
          <button
            type="button"
            onClick={() => canMoveUp && onMove(index, index - 1)}
            disabled={!canMoveUp}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 disabled:opacity-40"
            aria-label="Move up"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => canMoveDown && onMove(index, index + 1)}
            disabled={!canMoveDown}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 disabled:opacity-40"
            aria-label="Move down"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="flex-1 text-left"
        >
          <div className="text-sm font-bold text-slate-800">
            {item.time || 'Time'} · {item.title || 'Title'}
          </div>
          <div className="text-xs text-slate-400 truncate">{item.description || 'Description'}</div>
        </button>
        <button
          type="button"
          onClick={onToggle}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-600"
          aria-label="Toggle details"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* 基本資訊 */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">時間</label>
                <input
                  type="time"
                  value={item.time}
                  onChange={(event) => onChange({ time: event.target.value })}
                  className="w-full min-w-[130px] rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">類型</label>
                <Select
                  value={item.type}
                  onValueChange={(value) => onChange({ type: value as ScheduleItem['type'] })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flight">航班</SelectItem>
                    <SelectItem value="spot">景點</SelectItem>
                    <SelectItem value="food">美食</SelectItem>
                    <SelectItem value="transport">交通</SelectItem>
                    <SelectItem value="hotel">住宿</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">標題</label>
                <input
                  value={item.title}
                  onChange={(event) => onChange({ title: event.target.value })}
                  placeholder="行程名稱"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">備註</label>
              <textarea
                value={item.description}
                onChange={(event) => onChange({ description: event.target.value })}
                placeholder="詳細說明..."
                rows={2}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 resize-none"
              />
            </div>
          </div>

          {/* 地點與選項 */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
            <input
              value={item.naverPlaceId || ''}
              onChange={(event) => onChange({ naverPlaceId: event.target.value })}
              placeholder="Naver Place ID"
              className="flex-1 min-w-[120px] rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
            />
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">₩</span>
              <input
                type="number"
                value={item.cost ?? ''}
                onChange={(event) => onChange({ cost: event.target.value ? parseInt(event.target.value, 10) : undefined })}
                onFocus={(event) => event.target.select()}
                placeholder="費用"
                min="0"
                className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={item.showOnMap !== false}
                onChange={(event) => onChange({ showOnMap: event.target.checked })}
                className="rounded border-slate-300"
              />
              <span className="text-xs">地圖</span>
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={item.useBusanPass === true}
                onChange={(event) => onChange({ useBusanPass: event.target.checked })}
                className="rounded border-slate-300"
              />
              <span className="text-xs">PASS</span>
            </label>
            <button
              type="button"
              onClick={onRemove}
              className="rounded-xl border border-red-200 px-3 py-2 text-sm font-bold text-red-600 hover:text-red-700 hover:border-red-300"
            >
              移除
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const DayEditor = React.forwardRef<DayEditorHandle, DayEditorProps>(({ day, isSaving, saveError, onDraftChange }, ref) => {
  const [draft, setDraft] = useState<DaySchedule | null>(day);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setDraft({
      ...day,
      items: day.items.map(item => ({ ...item }))
    });
    const nextExpanded: Record<string, boolean> = {};
    day.items.forEach((item, index) => {
      const key = item.id || `index-${index}`;
      nextExpanded[key] = false;
    });
    setExpandedItems(nextExpanded);
  }, [day]);

  useEffect(() => {
    if (onDraftChange) {
      onDraftChange(draft);
    }
  }, [draft, onDraftChange]);

  if (!draft) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-400">
        No day data to edit yet.
      </div>
    );
  }

  const updateItem = (index: number, patch: Partial<ScheduleItem>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const items = prev.items.map((item, idx) => (idx === index ? { ...item, ...patch } : item));
      return { ...prev, items };
    });
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const nextItems = [...prev.items];
      const [moved] = nextItems.splice(fromIndex, 1);
      nextItems.splice(toIndex, 0, moved);
      return { ...prev, items: nextItems };
    });
  };

  useImperativeHandle(ref, () => ({
    getDraft: () => draft
  }), [draft]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-md font-bold text-slate-800">{draft.title}</p>
        </div>
        <div className="text-xs font-bold text-slate-400">
          {isSaving ? 'Saving...' : ' '}
        </div>
      </div>

      {saveError && <p className="mt-3 text-sm font-bold text-red-500">{saveError}</p>}

      <div className="mt-2 space-y-4">
        {draft.items.map((item, index) => (
          <ItemRow
            key={item.id || index}
            item={item}
            index={index}
            isExpanded={expandedItems[item.id || `index-${index}`] ?? false}
            onChange={(patch) => updateItem(index, patch)}
            onRemove={() => setDraft(prev => {
              if (!prev) return prev;
              setExpandedItems((current) => {
                const copy = { ...current };
                delete copy[item.id || `index-${index}`];
                return copy;
              });
              return { ...prev, items: prev.items.filter((_, idx) => idx !== index) };
            })}
            onMove={moveItem}
            onToggle={() => {
              const key = item.id || `index-${index}`;
              setExpandedItems((current) => ({ ...current, [key]: !current[key] }));
            }}
            canMoveUp={index > 0}
            canMoveDown={index < draft.items.length - 1}
          />
        ))}
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => {
            const nextItem = emptyItem();
            setDraft({ ...draft, items: [...draft.items, nextItem] });
            setExpandedItems((current) => ({ ...current, [`index-${draft.items.length}`]: true }));
          }}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600"
        >
          Add Item
        </button>
      </div>
    </div>
  );
});

DayEditor.displayName = 'DayEditor';

export default DayEditor;

