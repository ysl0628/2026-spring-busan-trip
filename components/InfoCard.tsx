import React from 'react';

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; items: string[] }> = ({ icon, title, items }) => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1 group">
    <div className="flex items-center gap-3 mb-5">
      <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
        {icon}
      </div>
      <h4 className="font-black text-slate-800 group-hover:text-blue-600 transition-colors">{title}</h4>
    </div>
    <ul className="space-y-3">
      {items.map((it, idx) => (
        <li key={idx} className="text-sm text-slate-500 flex gap-2 leading-relaxed">
          <span className="text-blue-300 font-bold">-</span>
          {it}
        </li>
      ))}
    </ul>
  </div>
);

export default InfoCard;
