
import React, { useState } from 'react';
import { 
  Calendar, 
  Plane, 
  MapPin, 
  Utensils, 
  Info
} from 'lucide-react';
import { TabType } from './types';
import { FLIGHTS, MEMBERS } from './constants';
import AppIcon from './components/AppIcon';
import SidebarItem from './components/SidebarItem';
import NavItem from './components/NavItem';
import FlightsView from './views/FlightsView';
import ItineraryView from './views/ItineraryView';
import SpotsView from './views/SpotsView';
import FoodView from './views/FoodView';
import InfoView from './views/InfoView';
import { useSheetData } from './hooks/useSheetData';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.ITINERARY);
  const [expandedDay, setExpandedDay] = useState<number>(1);
  const { itinerary, spots, food, isLoading, loadError, isSaving, saveError, saveDay } = useSheetData();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="py-10 text-center text-slate-400 font-bold">
          Loading trip data...
        </div>
      );
    }
    if (loadError) {
      return (
        <div className="py-10 text-center text-red-500 font-bold">
          {loadError}
        </div>
      );
    }

    switch (activeTab) {
      case TabType.ITINERARY:
        return (
          <ItineraryView
            itinerary={itinerary}
            expandedDay={expandedDay}
            onToggleDay={setExpandedDay}
            onSaveDay={saveDay}
            isSaving={isSaving}
            saveError={saveError}
          />
        );
      case TabType.FLIGHT:
        return <FlightsView flights={FLIGHTS} />;
      case TabType.SPOTS:
        return <SpotsView spots={spots} />;
      case TabType.FOOD:
        return <FoodView food={food} />;
      case TabType.INFO:
        return <InfoView members={MEMBERS} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row h-screen md:h-auto overflow-hidden md:overflow-visible">
      {/* Tablet & Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 z-50 overflow-y-auto no-scrollbar">
        <div className="p-6 flex items-center justify-center lg:justify-start gap-4 mb-8">
          <AppIcon size={32} />
          <h1 className="hidden lg:block text-xl font-black text-slate-900 tracking-tighter">釜山 228 漫遊指南</h1>
        </div>
        <nav className="flex-1 px-3 space-y-2">
          <SidebarItem icon={<Calendar />} label="行程規劃" isActive={activeTab === TabType.ITINERARY} onClick={() => setActiveTab(TabType.ITINERARY)} />
          <SidebarItem icon={<Plane />} label="飛行資訊" isActive={activeTab === TabType.FLIGHT} onClick={() => setActiveTab(TabType.FLIGHT)} />
          <SidebarItem icon={<MapPin />} label="必訪景點" isActive={activeTab === TabType.SPOTS} onClick={() => setActiveTab(TabType.SPOTS)} />
          <SidebarItem icon={<Utensils />} label="釜山美食" isActive={activeTab === TabType.FOOD} onClick={() => setActiveTab(TabType.FOOD)} />
          <SidebarItem icon={<Info />} label="行前必知" isActive={activeTab === TabType.INFO} onClick={() => setActiveTab(TabType.INFO)} />
        </nav>
        <div className="p-6 border-t border-slate-100 hidden lg:block">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Family Busan 2026</p>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 md:ml-20 lg:ml-64 pb-16 md:pb-8 flex flex-col min-h-0">
        <header className="px-6 py-4 md:px-12 md:py-12 bg-white/60 backdrop-blur-md sticky top-0 z-40 md:static md:bg-transparent">
          <div className="max-w-7xl mx-auto flex flex-row items-start justify-between items-center gap-4">
            <div className="flex items-center flex-row md:flex-col gap-3">
              <div className="flex items-center gap-3 md:hidden md:mb-2">
                <AppIcon size={24} />
              </div>
              <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight">
                {activeTab === TabType.ITINERARY && '行程規劃'}
                {activeTab === TabType.FLIGHT && '飛行資訊'}
                {activeTab === TabType.SPOTS && '必訪景點'}
                {activeTab === TabType.FOOD && '釜山美食'}
                {activeTab === TabType.INFO && '行前必知'}
              </h2>
              </div>
              <p className="text-slate-400 font-bold mt-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> 2025.02.26 - 03.03
              </p>
            </div>
        </header>
        
        <main className="flex-1 min-h-0 px-6 md:px-12 max-w-7xl mx-auto w-full overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-slate-200 z-50">
        <div className="px-6 h-14 flex justify-between items-center">
          <NavItem icon={<Calendar className="w-6 h-6" />} isActive={activeTab === TabType.ITINERARY} onClick={() => setActiveTab(TabType.ITINERARY)} />
          <NavItem icon={<Plane className="w-6 h-6" />} isActive={activeTab === TabType.FLIGHT} onClick={() => setActiveTab(TabType.FLIGHT)} />
          <NavItem icon={<MapPin className="w-6 h-6" />} isActive={activeTab === TabType.SPOTS} onClick={() => setActiveTab(TabType.SPOTS)} />
          <NavItem icon={<Utensils className="w-6 h-6" />} isActive={activeTab === TabType.FOOD} onClick={() => setActiveTab(TabType.FOOD)} />
          <NavItem icon={<Info className="w-6 h-6" />} isActive={activeTab === TabType.INFO} onClick={() => setActiveTab(TabType.INFO)} />
        </div>
      </nav>
    </div>
  );
};

export default App;






