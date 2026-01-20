import React from 'react';
import { Coffee, Croissant, Fish, Flame, ShoppingBag, Soup, UtensilsCrossed } from 'lucide-react';
import { Restaurant } from '../types';

const FoodCategoryIcon: React.FC<{ category: Restaurant['category'], imageUrl: string }> = ({ category, imageUrl }) => {
  const baseClass = "w-full h-full flex items-center justify-center rounded-xl shadow-inner transition-transform group-hover:scale-110";
  if (imageUrl) {
    return <img src={imageUrl} alt={category} className="w-full h-full object-cover rounded-xl" />;
  }
  switch (category) {
    case 'bbq':
      return <div className={`${baseClass} bg-red-100 text-red-500`}><Flame className="w-8 h-8 md:w-10 md:h-10" /></div>;
    case 'gukbap':
      return <div className={`${baseClass} bg-orange-100 text-orange-500`}><Soup className="w-8 h-8 md:w-10 md:h-10" /></div>;
    case 'seafood':
      return <div className={`${baseClass} bg-blue-100 text-blue-500`}><Fish className="w-8 h-8 md:w-10 md:h-10" /></div>;
    case 'market':
      return <div className={`${baseClass} bg-amber-100 text-amber-500`}><ShoppingBag className="w-8 h-8 md:w-10 md:h-10" /></div>;
    case 'cafe':
      return <div className={`${baseClass} bg-stone-100 text-stone-500`}><Coffee className="w-8 h-8 md:w-10 md:h-10" /></div>;
    case 'bread':
      return <div className={`${baseClass} bg-yellow-100 text-yellow-500`}><Croissant className="w-8 h-8 md:w-10 md:h-10" /></div>;
    default:
      return <div className={`${baseClass} bg-slate-100 text-slate-500`}><UtensilsCrossed className="w-8 h-8 md:w-10 md:h-10" /></div>;
  }
};

export default FoodCategoryIcon;
