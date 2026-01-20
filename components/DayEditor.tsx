import React, { useEffect, useImperativeHandle, useState } from 'react';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
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
};

export type DayEditorHandle = {
  getDraft: () => DaySchedule | null;
};

const emptyItem = (): ScheduleItem => ({
  time: '',
  title: '',
  description: '',
  type: 'other'
});

type ItemRowProps = {
  item: ScheduleItem;
  index: number;
  onChange: (patch: Partial<ScheduleItem>) => void;
  onRemove: () => void;
  onMove: (from: number, to: number) => void;
};

const ItemRow: React.FC<ItemRowProps> = ({ item, index, onChange, onRemove, onMove }) => {
  const rowRef = React.useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    const element = rowRef.current;
    if (!element) return;

    const cleanupDraggable = draggable({
      element,
      getInitialData: () => ({ type: 'day-item', index })
    });

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
      className={`rounded-2xl border border-slate-100 bg-slate-50/60 p-4 cursor-grab active:cursor-grabbing ${
        isDragOver ? 'outline outline-2 outline-blue-400' : ''
      }`}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
        <input
          value={item.time}
          onChange={(event) => onChange({ time: event.target.value })}
          placeholder="Time"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
        />
        <input
          value={item.title}
          onChange={(event) => onChange({ title: event.target.value })}
          placeholder="Title"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 md:col-span-2"
        />
        <input
          value={item.description}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder="Description"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 md:col-span-3"
        />
        <Select
          value={item.type}
          onValueChange={(value) => onChange({ type: value as ScheduleItem['type'] })}
        >
          <SelectTrigger>
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
        <input
          value={item.naverPlaceId || ''}
          onChange={(event) => onChange({ naverPlaceId: event.target.value })}
          placeholder="Naver place id"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 md:col-span-2"
        />
        <input
          value={item.coords?.lat ?? ''}
          onChange={(event) => onChange({ coords: { lat: Number(event.target.value), lng: item.coords?.lng ?? 0 } })}
          placeholder="Lat"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
        />
        <input
          value={item.coords?.lng ?? ''}
          onChange={(event) => onChange({ coords: { lat: item.coords?.lat ?? 0, lng: Number(event.target.value) } })}
          placeholder="Lng"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
        />
        <button
          type="button"
          onClick={onRemove}
          className="rounded-xl border border-red-200 px-3 py-2 text-sm font-bold text-red-600 hover:text-red-700 hover:border-red-300"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

const DayEditor = React.forwardRef<DayEditorHandle, DayEditorProps>(({ day, isSaving, saveError }, ref) => {
  const [draft, setDraft] = useState<DaySchedule | null>(day);

  useEffect(() => {
    setDraft({
      ...day,
      items: day.items.map(item => ({ ...item }))
    });
  }, [day]);

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
    <div className="mt-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            <input
              value={draft.date}
              onChange={(event) => setDraft({ ...draft, date: event.target.value })}
              placeholder="Date"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
            />
            <input
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              placeholder="Day title"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 min-w-[12rem]"
            />
          </div>
        </div>
        <div className="text-xs font-bold text-slate-400">
          {isSaving ? 'Saving...' : ' '}
        </div>
      </div>

      {saveError && <p className="mt-3 text-sm font-bold text-red-500">{saveError}</p>}

      <div className="mt-6 space-y-4">
        {draft.items.map((item, index) => (
          <ItemRow
            key={item.id || index}
            item={item}
            index={index}
            onChange={(patch) => updateItem(index, patch)}
            onRemove={() => setDraft(prev => {
              if (!prev) return prev;
              return { ...prev, items: prev.items.filter((_, idx) => idx !== index) };
            })}
            onMove={moveItem}
          />
        ))}
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setDraft({ ...draft, items: [...draft.items, emptyItem()] })}
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
