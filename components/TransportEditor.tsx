import React, { useState, useEffect } from 'react';
import { X, Bus, Train, PersonStanding, Car, CableCar, MoreHorizontal } from 'lucide-react';
import { TransportInfo, TransportMethod } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from './ui/dialog';

type TransportEditorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromTitle: string;
  toTitle: string;
  transport?: TransportInfo;
  onSave: (transport: TransportInfo | undefined) => void;
  isSaving?: boolean;
};

const TRANSPORT_OPTIONS: { value: TransportMethod; label: string; icon: React.ReactNode }[] = [
  { value: 'walk', label: '步行', icon: <PersonStanding className="w-5 h-5" /> },
  { value: 'subway', label: '地鐵', icon: <Train className="w-5 h-5" /> },
  { value: 'bus', label: '公車', icon: <Bus className="w-5 h-5" /> },
  { value: 'taxi', label: '計程車', icon: <Car className="w-5 h-5" /> },
  { value: 'train', label: '火車/KTX', icon: <Train className="w-5 h-5" /> },
  { value: 'cable', label: '纜車', icon: <CableCar className="w-5 h-5" /> },
  { value: 'other', label: '其他', icon: <MoreHorizontal className="w-5 h-5" /> },
];

export const getTransportIcon = (method: TransportMethod) => {
  const option = TRANSPORT_OPTIONS.find(o => o.value === method);
  return option?.icon || <MoreHorizontal className="w-4 h-4" />;
};

export const getTransportLabel = (method: TransportMethod) => {
  const option = TRANSPORT_OPTIONS.find(o => o.value === method);
  return option?.label || '其他';
};

const TransportEditor: React.FC<TransportEditorProps> = ({
  open,
  onOpenChange,
  fromTitle,
  toTitle,
  transport,
  onSave,
  isSaving = false,
}) => {
  const [method, setMethod] = useState<TransportMethod>(transport?.method || 'subway');
  const [duration, setDuration] = useState<string>(transport?.duration?.toString() || '');
  const [description, setDescription] = useState<string>(transport?.description || '');
  const [cost, setCost] = useState<string>(transport?.cost?.toString() || '');

  useEffect(() => {
    if (open) {
      setMethod(transport?.method || 'subway');
      setDuration(transport?.duration?.toString() || '');
      setDescription(transport?.description || '');
      setCost(transport?.cost?.toString() || '');
    }
  }, [open, transport]);

  const handleSave = () => {
    const durationNum = parseInt(duration, 10);
    if (!duration || isNaN(durationNum) || durationNum <= 0) {
      onSave(undefined);
    } else {
      onSave({
        method,
        duration: durationNum,
        description: description || undefined,
        cost: cost ? parseInt(cost, 10) : undefined,
      });
    }
  };

  const handleClear = () => {
    onSave(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !isSaving && onOpenChange(open)}>
      <DialogContent className="flex flex-col w-full max-w-md h-[90vh] sm:h-fit sm:max-h-[90vh] overflow-hidden rounded-t-3xl rounded-b-none sm:rounded-3xl sm:top-1/2 sm:-translate-y-1/2 top-auto bottom-0 translate-y-0">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-6 py-4">
          <DialogTitle className="text-lg">編輯交通方式</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* 路線顯示 */}
          <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-3">
            <span className="font-medium truncate flex-1">{fromTitle}</span>
            <span className="text-slate-400">→</span>
            <span className="font-medium truncate flex-1 text-right">{toTitle}</span>
          </div>

          {/* 交通方式選擇 */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              交通方式
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TRANSPORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMethod(option.value)}
                  disabled={isSaving}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-3 text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    method === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 時間和費用 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                所需時間 (分鐘)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="例如: 25"
                min="1"
                disabled={isSaving}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                費用 (₩) <span className="text-slate-400 font-normal">選填</span>
              </label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="例如: 1400"
                min="0"
                disabled={isSaving}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* 備註 */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              備註 <span className="text-slate-400 font-normal">選填</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例如: 1號線往海雲台方向"
              disabled={isSaving}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t border-slate-100 px-6 py-4">
          {transport && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isSaving}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              清除
            </button>
          )}
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? '儲存中...' : '儲存'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransportEditor;
