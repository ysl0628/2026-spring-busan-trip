
import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Plane, 
  MapPin, 
  Utensils, 
  Info, 
  Clock, 
  CreditCard, 
  DollarSign, 
  Train,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { TabType, LocationCoords, DaySchedule, Spot, Restaurant, ScheduleItem } from './types';
import { FLIGHTS, ITINERARY, MEMBERS } from './constants';
import AppIcon from './components/AppIcon';
import FoodCategoryIcon from './components/FoodCategoryIcon';
import MiniMap from './components/MiniMap';
import SidebarItem from './components/SidebarItem';
import NavItem from './components/NavItem';
import InfoCard from './components/InfoCard';

const getNaverMapLink = (placeId?: string, coords?: LocationCoords) => {
  if (placeId) {
    return `https://map.naver.com/p/entry/place/${placeId}`;
  }
  if (coords) {
    return `https://map.naver.com/v5/search/${coords.lat},${coords.lng}`;
  }
  return '#';
};

const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbxDap_R1NV5Z3FsmjrRmaRjWA0Gw1s4y8mxVrY_dkWTQ-rFqa9GxRFH5zqwFk2thNc_hw/exec';

type SheetRow = {
  id?: string;
  day?: string | number;
  date?: string;
  time?: string;
  title?: string;
  description?: string;
  type?: string;
  naverPlaceId?: string;
  lat?: string | number;
  lng?: string | number;
  tags?: string;
  imageUrl?: string;
  category?: string;
  dayTitle?: string;
};

const cleanCell = (value?: string) => {
  if (!value) return '';
  return value.startsWith("'") ? value.slice(1) : value;
};

const toNumber = (value?: string | number) => {
  if (value === null || value === undefined || value === '') return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.ITINERARY);
  const [expandedDay, setExpandedDay] = useState<number>(1);
  const [itinerary, setItinerary] = useState<DaySchedule[]>([]);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [food, setFood] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string>('');

  useEffect(() => {
    const loadSheet = async () => {
      try {
        const response = await fetch(SHEET_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const payload = await response.json();
        const rows = Array.isArray(payload?.data) ? payload.data as SheetRow[] : [];

        const dayTitleMap = ITINERARY.reduce<Record<number, string>>((acc, day) => {
          acc[day.day] = day.title;
          return acc;
        }, {});

        const scheduleItems = rows.filter(row => row.day !== '' && row.day !== undefined && row.day !== null);
        const grouped: Record<number, { date: string; title: string; items: ScheduleItem[] }> = {};

        scheduleItems.forEach(row => {
          const dayNum = Number(row.day);
          if (!Number.isFinite(dayNum)) return;
          const date = cleanCell(row.date);
          const title = cleanCell(row.dayTitle) || dayTitleMap[dayNum] || '';
          const coords = (row.lat || row.lng) ? { lat: toNumber(row.lat) ?? 0, lng: toNumber(row.lng) ?? 0 } : undefined;

          const item: ScheduleItem = {
            time: cleanCell(row.time),
            title: cleanCell(row.title),
            description: cleanCell(row.description),
            type: (row.type as ScheduleItem['type']) || 'other',
            naverPlaceId: row.naverPlaceId || undefined,
            coords
          };

          if (!grouped[dayNum]) {
            grouped[dayNum] = { date, title, items: [] };
          }

          grouped[dayNum].items.push(item);
        });

        const itineraryData = Object.keys(grouped)
          .map(day => Number(day))
          .sort((a, b) => a - b)
          .map(day => ({
            day,
            date: grouped[day].date,
            title: grouped[day].title,
            items: grouped[day].items
          }));

        const spotRows = rows.filter(row => row.type === 'spot' && (row.day === '' || row.day === undefined || row.day === null));
        const spotData: Spot[] = spotRows.map(row => ({
          id: row.id || '',
          name: cleanCell(row.title),
          description: cleanCell(row.description),
          category: cleanCell(row.category),
          imageUrl: row.imageUrl || '',
          tags: row.tags ? row.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
          lat: toNumber(row.lat) ?? 0,
          lng: toNumber(row.lng) ?? 0,
          naverPlaceId: row.naverPlaceId || undefined
        }));

        const foodRows = rows.filter(row => row.type === 'food' && (row.day === '' || row.day === undefined || row.day === null));
        const foodData: Restaurant[] = foodRows.map(row => ({
          id: row.id || '',
          name: cleanCell(row.title),
          description: cleanCell(row.description),
          category: (row.category as Restaurant['category']) || 'other',
          imageUrl: row.imageUrl || '',
          lat: toNumber(row.lat) ?? 0,
          lng: toNumber(row.lng) ?? 0,
          naverPlaceId: row.naverPlaceId || undefined
        }));

        setItinerary(itineraryData);
        setSpots(spotData);
        setFood(foodData);
        setLoadError('');
      } catch (error) {
        setLoadError('Failed to load sheet data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSheet();
  }, []);

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
          <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto mt-4 md:mt-0">
            {itinerary.map((day) => (
              <div key={day.day} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 hover:shadow-md transition-shadow">
                <button 
                  onClick={() => setExpandedDay(expandedDay === day.day ? -1 : day.day)}
                  className="w-full bg-blue-600 px-6 py-5 text-white flex justify-between items-center transition-colors hover:bg-blue-700"
                >
                  <div className="text-left">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-80">Day {day.day}</span>
                    <h3 className="text-xl font-bold">{day.date} - {day.title}</h3>
                  </div>
                  {expandedDay === day.day ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </button>
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
                         <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">第{day.day}日路線</h5>
                         <MiniMap items={day.items} day={day.day} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case TabType.FLIGHT:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn max-w-5xl mx-auto mt-4 md:mt-0">
            {FLIGHTS.map((flight, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 bg-slate-50 rounded-bl-3xl">
                   <span className="text-xs font-black text-slate-300 uppercase">{flight.flightNumber}</span>
                </div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                    <Plane className="w-8 h-8 transform group-hover:rotate-12 transition-transform" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-800">{flight.type === 'departure' ? '出發' : '回程'}班機</h3>
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{flight.airline} {flight.aircraft}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-left flex-1">
                    <p className="text-4xl font-black text-slate-900 font-mono tracking-tighter">{flight.departureTime.split(' ')[1]}</p>
                    <p className="text-sm font-bold text-slate-500 mt-2 min-h-[3rem]">{flight.departureAirport}</p>
                  </div>
                  <div className="flex-none px-4 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-black text-slate-300 mb-2 uppercase tracking-tighter">{flight.duration}</span>
                    <div className="w-16 h-0.5 bg-slate-100 relative rounded-full">
                      <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-4xl font-black text-slate-900 font-mono tracking-tighter">{flight.arrivalTime.split(' ')[1]}</p>
                    <p className="text-sm font-bold text-slate-500 mt-2 min-h-[3rem]">{flight.arrivalAirport}</p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center text-xs font-bold text-slate-400">
                   <span>座位: {flight.cabin}</span>
                   <span>出發: {flight.departureTime.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        );
      case TabType.SPOTS:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn mt-4 md:mt-0">
            {spots.map((spot) => (
              <div key={spot.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
                <div className="relative h-56 overflow-hidden">
                  <img src={spot.imageUrl} alt={spot.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                     <span className="text-white text-xs font-bold">點擊詳細資訊</span>
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
      case TabType.FOOD:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn mt-4 md:mt-0">
            {food.map((food) => (
              <div key={food.id} className="bg-white rounded-3xl p-6 flex flex-col gap-4 shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                <div className="h-40 w-full mb-2">
                  <FoodCategoryIcon category={food.category} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-slate-800 text-lg truncate group-hover:text-orange-600 transition-colors">{food.name}</h3>
                    <a 
                      href={getNaverMapLink(food.naverPlaceId, food)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-700 p-1.5 hover:bg-orange-50 rounded-xl transition-all"
                    >
                      <MapPin className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed h-10">{food.description}</p>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                      {food.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Busan Local</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case TabType.INFO:
        return (
          <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto mt-4 md:mt-0">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden relative">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50" />
              <h3 className="font-black text-2xl text-slate-800 mb-8 relative">Members <span className="text-slate-300 font-medium ml-2 text-lg">4 people</span></h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 relative">
                {MEMBERS.map((m, i) => (
                  <div key={i} className="flex flex-col items-center group">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-4xl mb-3 shadow-sm group-hover:shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      {m.avatar}
                    </div>
                    <span className="text-base font-black text-slate-800 group-hover:text-blue-600 transition-colors">{m.name}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <InfoCard icon={<Train className="text-blue-500" />} title="地鐵交通" items={[
                '下載 Naver Map 導航 (必備)',
                '購買 T-Money 卡可搭乘地鐵/公車',
                '釜山地鐵出口多樓梯，推車找 Elevator',
                'KakaoTaxi 或 Uber 可綁台灣信用卡'
              ]} />
              <InfoCard icon={<DollarSign className="text-green-500" />} title="換錢與付款" items={[
                'Wowpass 在地鐵站可直接換錢/領卡',
                '大多數餐廳接受海外信用卡',
                '路邊攤建議準備少量韓幣現金',
                '匯率通常是機場 < 市區換錢所'
              ]} />
              <InfoCard icon={<CreditCard className="text-orange-500" />} title="必備 APP" items={[
                'Naver Map (導航)',
                'Papago (精準翻譯)',
                'Baedal Minjok (外送 app - 需認證)',
                'Shuttle Delivery (英文外送 app)'
              ]} />
              <InfoCard icon={<Clock className="text-red-500" />} title="行程注意事項" items={[
                '2月底氣溫約 0-10 度，洋蔥式穿法',
                'SPA LAND 13歲以下需家長陪同',
                '海岸列車建議提早預約 (容易售罄)',
                '餐廳多有兒童椅，帶嬰兒建議避開尖峰'
              ]} />
            </div>
          </div>
        );
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
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Family Busan 2025</p>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 md:ml-20 lg:ml-64 pb-16 md:pb-8 flex flex-col min-h-0">
        <header className="px-6 py-4 md:px-12 md:py-12 bg-white/60 backdrop-blur-md sticky top-0 z-40 md:static md:bg-transparent">
          <div className="max-w-7xl mx-auto flex flex-row items-start justify-between gap-4">
            <div className="flex items-center flex-col gap-3">
              <div className="flex items-center gap-3 md:hidden md:mb-2">
                <AppIcon size={24} />
                <span className="font-black text-slate-900">Busan 2025</span>
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
                <Calendar className="w-4 h-4" /> 2025.02.26 - 03.03 釜山漫遊指南
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


