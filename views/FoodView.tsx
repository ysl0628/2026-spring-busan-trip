import React from 'react';
import { MapPin } from 'lucide-react';
import { Restaurant } from '../types';
import FoodCategoryIcon from '../components/FoodCategoryIcon';
import { getNaverMapLink } from '../utils/naverMap';

type FoodViewProps = {
  food: Restaurant[];
};

const FoodView: React.FC<FoodViewProps> = ({ food }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn mt-4 md:mt-0">
    {food.map((item) => (
      <div key={item.id} className="bg-white rounded-3xl p-6 flex flex-col gap-4 shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
        <div className="h-40 w-full mb-2">
          <FoodCategoryIcon category={item.category} imageUrl={item.imageUrl} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-black text-slate-800 text-lg truncate group-hover:text-orange-600 transition-colors">{item.name}</h3>
            <a 
              href={getNaverMapLink(item.naverPlaceId, item)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-700 p-1.5 hover:bg-orange-50 rounded-xl transition-all"
            >
              <MapPin className="w-4 h-4" />
            </a>
          </div>
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed h-10">{item.description}</p>
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg uppercase tracking-widest">
              {item.category}
            </span>
            <span className="text-[10px] font-bold text-slate-300 uppercase">Busan Local</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default FoodView;
