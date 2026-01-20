import React from 'react';

const NavItem: React.FC<{ icon: React.ReactNode; isActive: boolean; onClick: () => void }> = ({ icon, isActive, onClick }) => (
  <button 
    onClick={onClick} 
    className={`p-2 rounded-2xl transition-all duration-300 ${
      isActive 
      ? 'text-blue-600 bg-blue-50' 
      : 'text-slate-300'
    }`}
  >
    {icon}
  </button>
);

export default NavItem;
