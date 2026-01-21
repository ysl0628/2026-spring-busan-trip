import React from 'react';
import { ScheduleItem } from '../types';

const MiniMap: React.FC<{ items: ScheduleItem[]; day: number }> = ({ items, day }) => {
  const placeNames = items
    .filter(i => i.showOnMap !== false)
    .map(i => i.title)
    .filter(Boolean);

    if (placeNames.length === 0) {
    return (
      <div className="w-full h-64 md:h-80 lg:h-96 mt-4 rounded-2xl border border-dashed border-slate-200 bg-white/70 flex items-center justify-center text-sm text-slate-400">
        No map locations yet.
      </div>
    );
  }

  const encoded = placeNames.map(name => encodeURIComponent(name));
  const mapUrl = encoded.length === 1
    ? `https://maps.google.com/maps?output=embed&q=${encoded[0]}&z=13`
    : `https://maps.google.com/maps?output=embed&f=d&saddr=${encoded[0]}&daddr=${encoded.slice(1).join('+to:')}`;

  return (
    <iframe
      title={`Day ${day} map`}
      src={mapUrl}
      className="w-full h-64 md:h-80 lg:h-96 mt-4 rounded-2xl border border-slate-200 shadow-inner overflow-hidden"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
};

export default MiniMap;
