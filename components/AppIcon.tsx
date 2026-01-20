import React from 'react';

const AppIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
    <circle cx="50" cy="50" r="45" fill="#2563EB" />
    <path d="M25 65C35 55 65 55 75 65V75H25V65Z" fill="white" fillOpacity="0.8" />
    <rect x="42" y="30" width="16" height="30" rx="4" fill="white" />
    <path d="M40 30L50 20L60 30H40Z" fill="white" />
    <path d="M30 45H70M40 38H60M45 52H55" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default AppIcon;
