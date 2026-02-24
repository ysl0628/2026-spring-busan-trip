
export interface Flight {
  type: 'departure' | 'return';
  airline: string;
  flightNumber: string;
  aircraft: string;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  duration: string;
  cabin: string;
}

export interface LocationCoords {
  lat: number;
  lng: number;
}

export interface Spot extends LocationCoords {
  id: string;
  name: string;
  description: string;
  address?: string;
  openHours?: string;
  category: string;
  imageUrl: string;
  link?: string;
  naverPlaceId?: string;
  tags?: string[];
}

export interface Restaurant extends LocationCoords {
  id: string;
  name: string;
  description: string;
  address?: string;
  recommendation?: string;
  imageUrl: string;
  category: 'bbq' | 'gukbap' | 'seafood' | 'market' | 'cafe' | 'bread' | 'other';
  naverPlaceId?: string;
}

export type TransportMethod = 'walk' | 'subway' | 'bus' | 'taxi' | 'train' | 'cable' | 'other';

export interface TransportInfo {
  method: TransportMethod;
  duration: number; // 分鐘
  description?: string; // 例如 "1號線往海雲台方向"
  cost?: number; // 韓元
}

export interface ScheduleItem {
  id?: string;
  order?: number;
  time: string;
  title: string;
  description: string;
  type: 'flight' | 'spot' | 'food' | 'transport' | 'hotel' | 'other';
  duration?: string;
  location?: string;
  coords?: LocationCoords;
  naverPlaceId?: string;
  showOnMap?: boolean;
  useBusanPass?: boolean;
  transportToNext?: TransportInfo; // 到下一個點的交通方式
  cost?: number; // 預估費用（韓元）- 門票、餐費等
  splitCount?: number; // 分攤人數（預設為總人數）
}

// 額外費用類型（行程外的事前支出或其他支出）
export type ExtraExpenseCategory = 'flight' | 'hotel' | 'insurance' | 'pass' | 'prepaid' | 'other';

export interface ExtraExpense {
  id: string;
  title: string;
  description?: string;
  category: ExtraExpenseCategory;
  cost: number; // 韓元或台幣
  currency: 'KRW' | 'TWD';
  splitCount?: number; // 分攤人數（預設為總人數）
  paidBy?: string; // 誰先付的
  date?: string; // 支出日期
  recordedBy?: string; // 記錄者
}

export interface DaySchedule {
  day: number;
  date: string;
  title: string;
  items: ScheduleItem[];
}

export interface Member {
  name: string;
  role: string;
  avatar: string;
}

export enum TabType {
  ITINERARY = 'itinerary',
  FLIGHT = 'flight',
  SPOTS = 'spots',
  FOOD = 'food',
  BUDGET = 'budget',
  INFO = 'info'
}
