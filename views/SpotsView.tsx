import React from 'react';
import { MapPin } from 'lucide-react';
import { Spot } from '../types';
import { getNaverMapLink } from '../utils/naverMap';

type SpotsViewProps = {
  spots: Spot[];
};

const SpotsView: React.FC<SpotsViewProps> = ({ spots }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn mt-4 md:mt-0">
    {spots.map((spot) => (
      <div key={spot.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
        <div className="relative h-56 overflow-hidden">
          <img src={spot.imageUrl} alt={spot.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
             <span className="text-white text-xs font-bold">點擊查看地圖</span>
          </div>
          <div className="absolute top-4 right-4 bg-white/95 p-2 rounded-2xl shadow-xl hover:bg-blue-600 hover:text-white transition-colors">
            <a href={getNaverMapLink(spot.naverPlaceId, spot)} target="_blank" rel="noopener noreferrer">
              <MapPin className="w-5 h-5" />
            </a>
          </div>
          <div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shadow-lg">
              {spot.category}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-black text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{spot.name}</h3>
          <p className="text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed">{spot.description}</p>
          <div className="flex flex-wrap gap-2 mt-5">
            {spot.tags?.map(t => (
              <span key={t} className="text-[10px] font-bold bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default SpotsView;
