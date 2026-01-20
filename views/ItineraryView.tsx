import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { DaySchedule } from '../types';
import MiniMap from '../components/MiniMap';
import DayEditor, { DayEditorHandle } from '../components/DayEditor';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { getNaverMapLink } from '../utils/naverMap';

type ItineraryViewProps = {
  itinerary: DaySchedule[];
  expandedDay: number;
  onToggleDay: (day: number) => void;
  onSaveDay: (day: DaySchedule) => void;
  isSaving: boolean;
  saveError: string;
};

const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  expandedDay,
  onToggleDay,
  onSaveDay,
  isSaving,
  saveError,
}) => {
  const [activeEditorDay, setActiveEditorDay] = useState<DaySchedule | null>(null);
  const editorRef = useRef<DayEditorHandle | null>(null);

  const handleSave = () => {
    const draft = editorRef.current?.getDraft();
    if (draft) {
      onSaveDay(draft);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto mt-4 md:mt-0">
      <Dialog open={!!activeEditorDay} onOpenChange={(open) => !open && setActiveEditorDay(null)}>
        <DialogContent className="flex flex-col w-full max-w-3xl h-[92vh] overflow-hidden rounded-t-3xl sm:rounded-3xl sm:top-1/2 sm:-translate-y-1/2 top-auto bottom-0 translate-y-0">
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
              />
            )}
          </div>
          <DialogFooter className="shrink-0 border-t border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
            <DialogClose asChild>
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600"
              >
                Cancel
              </button>
            </DialogClose>
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
              <h3 className="text-xl font-bold">{day.date} - {day.title}</h3>
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveEditorDay(day)}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest hover:bg-white/20"
              >
                Edit
              </button>
              <button
                onClick={() => onToggleDay(expandedDay === day.day ? -1 : day.day)}
                className="rounded-full bg-white/10 p-2 hover:bg-white/20"
              >
                {expandedDay === day.day ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {expandedDay === day.day && (
            <div className="p-6 space-y-6 animate-slideDown bg-slate-50/50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {day.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full mt-2 ring-4 ring-white shadow-sm ${
                          item.type === 'flight' ? 'bg-orange-500' :
                          item.type === 'food' ? 'bg-green-500' :
                          item.type === 'spot' ? 'bg-blue-500' : 'bg-slate-400'
                        }`} />
                        {idx !== day.items.length - 1 && <div className="w-0.5 h-full bg-slate-200 my-1 rounded-full" />}
                      </div>
                      <div className="flex-1 pb-4">
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
                        <h4 className="font-bold text-slate-800 text-lg leading-tight">{item.title}</h4>
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                      </div>
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
