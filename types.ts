
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
}

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  type: 'flight' | 'spot' | 'food' | 'transport' | 'hotel' | 'other';
  duration?: string;
  location?: string;
  coords?: LocationCoords;
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
  INFO = 'info'
}
