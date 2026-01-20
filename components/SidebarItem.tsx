import React from 'react';

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
      isActive 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
    }`}
  >
    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
      {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
    </div>
    <span className="hidden lg:block font-bold text-sm tracking-tight">{label}</span>
  </button>
);

export default SidebarItem;
