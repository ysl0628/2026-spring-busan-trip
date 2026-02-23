import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Pencil } from 'lucide-react';
import { DaySchedule, ScheduleItem, TransportInfo } from '../types';
import MiniMap from '../components/MiniMap';
import DayEditor, { DayEditorHandle } from '../components/DayEditor';
import TransportEditor, { getTransportIcon, getTransportLabel } from '../components/TransportEditor';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { getNaverMapLink } from '../utils/naverMap';

type ItineraryViewProps = {
  itinerary: DaySchedule[];
  expandedDay: number;
  onToggleDay: (day: number) => void;
  onSaveDay: (day: DaySchedule) => Promise<void>;
  isSaving: boolean;
  saveError: string;
  isOfflineMode?: boolean;
};

const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  expandedDay,
  onToggleDay,
  onSaveDay,
  isSaving,
  saveError,
  isOfflineMode = false,
}) => {
  const [activeEditorDay, setActiveEditorDay] = useState<DaySchedule | null>(null);
  const editorRef = useRef<DayEditorHandle | null>(null);
  const [activeDraft, setActiveDraft] = useState<DaySchedule | null>(null);
  
  // Transport editor state
  const [transportEditorOpen, setTransportEditorOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState<{
    dayIndex: number;
    itemIndex: number;
    fromTitle: string;
    toTitle: string;
    transport?: TransportInfo;
  } | null>(null);

  const handleSave = async () => {
    const draft = activeDraft || editorRef.current?.getDraft() || activeEditorDay;
    if (draft) {
      try {
        await onSaveDay(draft);
        setActiveDraft(null);
        setActiveEditorDay(null);
      } catch {
        // saveError will be displayed by the parent
      }
    }
  };

  const handleTransportEdit = (dayIndex: number, itemIndex: number, items: ScheduleItem[]) => {
    const currentItem = items[itemIndex];
    const nextItem = items[itemIndex + 1];
    setEditingTransport({
      dayIndex,
      itemIndex,
      fromTitle: currentItem.title,
      toTitle: nextItem.title,
      transport: currentItem.transportToNext,
    });
    setTransportEditorOpen(true);
  };

  const handleTransportSave = async (transport: TransportInfo | undefined) => {
    if (!editingTransport) return;
    
    const day = itinerary[editingTransport.dayIndex];
    const updatedItems = day.items.map((item, idx) => {
      if (idx === editingTransport.itemIndex) {
        return { ...item, transportToNext: transport };
      }
      return item;
    });
    
    await onSaveDay({ ...day, items: updatedItems });
    setTransportEditorOpen(false);
    setEditingTransport(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto mt-4 md:mt-0">
      {/* Transport Editor Dialog */}
      <TransportEditor
        open={transportEditorOpen}
        onOpenChange={setTransportEditorOpen}
        fromTitle={editingTransport?.fromTitle || ''}
        toTitle={editingTransport?.toTitle || ''}
        transport={editingTransport?.transport}
        onSave={handleTransportSave}
        isSaving={isSaving}
      />

      <Dialog open={!!activeEditorDay} onOpenChange={(open) => !isSaving && !open && setActiveEditorDay(null)}>
        <DialogContent className="flex flex-col w-full max-w-3xl h-[92vh] overflow-hidden rounded-t-3xl rounded-b-none sm:rounded-3xl sm:top-1/2 sm:-translate-y-1/2 top-auto bottom-0 translate-y-0">
          <DialogHeader className="shrink-0 border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
            <DialogTitle>Edit Day {activeEditorDay?.day ?? ''}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {activeEditorDay && (
              <DayEditor
                ref={editorRef}
                day={activeEditorDay}
                isSaving={isSaving}
                saveError={saveError}
                onSaveDay={onSaveDay}
                onDraftChange={setActiveDraft}
              />
            )}
          </div>
          <DialogFooter className="shrink-0 border-t border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
            <button
              type="button"
              onClick={() => setActiveEditorDay(null)}
              disabled={isSaving}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save Day'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {itinerary.map((day) => (
        <div key={day.day} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 hover:shadow-md transition-shadow">
          <div className="bg-blue-600 px-6 py-5 text-white flex items-center justify-between gap-4">
            <button
              onClick={() => onToggleDay(expandedDay === day.day ? -1 : day.day)}
              className="flex-1 text-left"
            >
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">Day {day.day}</span>
              <h3 className="text-base font-bold sm:text-lg md:text-xl">{day.date} - {day.title}</h3>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleDay(expandedDay === day.day ? -1 : day.day)}
                className="rounded-full bg-white/10 p-2 hover:bg-white/20"
              >
                {expandedDay === day.day ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {expandedDay === day.day && (
            <div className="relative p-6 animate-slideDown bg-slate-50/50">
              {!isOfflineMode && (
                <div className="absolute right-6 top-6 lg:static lg:mb-4 lg:flex lg:justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveEditorDay(day)}
                    aria-label="Edit day"
                    className="rounded-full bg-slate-900/5 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-900/10 sm:px-3"
                  >
                    <span className="hidden sm:inline">Edit</span>
                    <Pencil className="w-4 h-4 sm:hidden" />
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-0">
                  {day.items.map((item, idx) => (
                    <div key={idx}>
                      {/* Schedule Item */}
                      <div className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full mt-2 ring-4 ring-white shadow-sm ${
                            item.type === 'flight' ? 'bg-orange-500' :
                            item.type === 'food' ? 'bg-green-500' :
                            item.type === 'spot' ? 'bg-blue-500' : 'bg-slate-400'
                          }`} />
                          {idx !== day.items.length - 1 && (
                            <div className="w-0.5 flex-1 bg-slate-200 my-1 rounded-full min-h-[20px]" />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-slate-400 font-mono tracking-tighter">{item.time}</span>
                            {(item.naverPlaceId || item.coords) && (
                              <a
                                href={getNaverMapLink(item.naverPlaceId, item.coords)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                              >
                                <MapPin className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-slate-800 text-lg leading-tight">{item.title}</h4>
                            {item.useBusanPass && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                                Busan Pass
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                        </div>
                      </div>

                      {/* Transport Connector (between items) */}
                      {idx !== day.items.length - 1 && (
                        <div className="flex gap-4 group/transport">
                          <div className="flex flex-col items-center w-3">
                            <div className="w-0.5 h-full bg-slate-200 rounded-full" />
                          </div>
                          <div className="flex-1 py-2">
                            {item.transportToNext ? (
                              <button
                                type="button"
                                onClick={() => !isOfflineMode && handleTransportEdit(itinerary.indexOf(day), idx, day.items)}
                                disabled={isOfflineMode}
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all ${
                                  isOfflineMode
                                    ? 'border-slate-200 bg-slate-50 text-slate-500 cursor-default'
                                    : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 cursor-pointer'
                                }`}
                              >
                                {getTransportIcon(item.transportToNext.method)}
                                <span className="font-medium">{getTransportLabel(item.transportToNext.method)}</span>
                                <span className="text-blue-500">{item.transportToNext.duration}分</span>
                                {item.transportToNext.cost && (
                                  <span className="text-blue-400">₩{item.transportToNext.cost.toLocaleString()}</span>
                                )}
                                {item.transportToNext.description && (
                                  <span className="text-blue-400 hidden sm:inline">· {item.transportToNext.description}</span>
                                )}
                              </button>
                            ) : (
                              !isOfflineMode && (
                                <button
                                  type="button"
                                  onClick={() => handleTransportEdit(itinerary.indexOf(day), idx, day.items)}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-400 hover:text-slate-500 hover:bg-slate-50 transition-all"
                                >
                                  <span>+ 新增交通方式</span>
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="lg:sticky lg:top-4 h-fit">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Day {day.day} Route</h5>
                  <MiniMap items={day.items} day={day.day} />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ItineraryView;
