import React from 'react';
import { Plane } from 'lucide-react';
import { Flight } from '../types';

type FlightsViewProps = {
  flights: Flight[];
};

const FlightsView: React.FC<FlightsViewProps> = ({ flights }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn max-w-5xl mx-auto mt-4 md:mt-0">
    {flights.map((flight, idx) => (
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
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="w-full max-w-[220px] text-center sm:text-left sm:max-w-none sm:w-auto">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tighter">{flight.departureTime.split(' ')[1]}</p>
            <p className="text-sm font-bold text-slate-500 mt-2">{flight.departureAirport}</p>
          </div>
          <div className="flex items-center gap-4 sm:flex-col sm:gap-2">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{flight.duration}</span>
            <div className="w-0.5 h-16 sm:w-16 sm:h-0.5 bg-slate-100 relative rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div className="w-full max-w-[220px] text-center sm:text-right sm:max-w-none sm:w-auto">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tighter">{flight.arrivalTime.split(' ')[1]}</p>
            <p className="text-sm font-bold text-slate-500 mt-2">{flight.arrivalAirport}</p>
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

export default FlightsView;
