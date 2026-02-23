import React, { useMemo } from 'react';
import { Wallet, Train, Ticket, Utensils, Building, ChevronDown, ChevronUp } from 'lucide-react';
import { DaySchedule } from '../types';

type CostSummaryProps = {
  itinerary: DaySchedule[];
  memberCount?: number;
};

const KRW_TO_TWD = 0.024; // 匯率：1 韓元 ≈ 0.024 台幣

const formatKRW = (amount: number) => {
  return `₩${amount.toLocaleString()}`;
};

const formatTWD = (amount: number) => {
  return `NT$${Math.round(amount).toLocaleString()}`;
};

const CostSummary: React.FC<CostSummaryProps> = ({ itinerary, memberCount = 6 }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const costs = useMemo(() => {
    let transportTotal = 0;
    let spotTotal = 0;
    let foodTotal = 0;
    let hotelTotal = 0;
    let otherTotal = 0;

    const dailyCosts: { day: number; date: string; transport: number; spot: number; food: number; hotel: number; other: number }[] = [];

    itinerary.forEach((day) => {
      let dayTransport = 0;
      let daySpot = 0;
      let dayFood = 0;
      let dayHotel = 0;
      let dayOther = 0;

      day.items.forEach((item) => {
        // 行程本身的費用
        if (item.cost) {
          switch (item.type) {
            case 'spot':
              daySpot += item.cost;
              break;
            case 'food':
              dayFood += item.cost;
              break;
            case 'hotel':
              dayHotel += item.cost;
              break;
            case 'transport':
              dayTransport += item.cost;
              break;
            default:
              dayOther += item.cost;
          }
        }

        // 交通費用
        if (item.transportToNext?.cost) {
          dayTransport += item.transportToNext.cost;
        }
      });

      transportTotal += dayTransport;
      spotTotal += daySpot;
      foodTotal += dayFood;
      hotelTotal += dayHotel;
      otherTotal += dayOther;

      dailyCosts.push({
        day: day.day,
        date: day.date,
        transport: dayTransport,
        spot: daySpot,
        food: dayFood,
        hotel: dayHotel,
        other: dayOther,
      });
    });

    const total = transportTotal + spotTotal + foodTotal + hotelTotal + otherTotal;

    return {
      transport: transportTotal,
      spot: spotTotal,
      food: foodTotal,
      hotel: hotelTotal,
      other: otherTotal,
      total,
      daily: dailyCosts,
    };
  }, [itinerary]);

  if (costs.total === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-800">預估費用</h3>
            <p className="text-xs text-slate-400">
              {formatKRW(costs.total)} ≈ {formatTWD(costs.total * KRW_TO_TWD)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-lg font-bold text-emerald-600">{formatTWD(costs.total * KRW_TO_TWD)}</p>
            <p className="text-xs text-slate-400">每人約 {formatTWD((costs.total * KRW_TO_TWD) / memberCount)}</p>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-5 border-t border-slate-100 animate-slideDown">
          {/* 分類統計 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
            {costs.transport > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50">
                <Train className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-xs text-blue-600 font-medium">交通</p>
                  <p className="text-sm font-bold text-blue-700">{formatKRW(costs.transport)}</p>
                </div>
              </div>
            )}
            {costs.spot > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50">
                <Ticket className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-xs text-purple-600 font-medium">景點</p>
                  <p className="text-sm font-bold text-purple-700">{formatKRW(costs.spot)}</p>
                </div>
              </div>
            )}
            {costs.food > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50">
                <Utensils className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-xs text-orange-600 font-medium">餐飲</p>
                  <p className="text-sm font-bold text-orange-700">{formatKRW(costs.food)}</p>
                </div>
              </div>
            )}
            {costs.hotel > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-pink-50">
                <Building className="w-4 h-4 text-pink-500" />
                <div>
                  <p className="text-xs text-pink-600 font-medium">住宿</p>
                  <p className="text-sm font-bold text-pink-700">{formatKRW(costs.hotel)}</p>
                </div>
              </div>
            )}
          </div>

          {/* 每日明細 */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">每日費用</p>
            {costs.daily.map((day) => {
              const dayTotal = day.transport + day.spot + day.food + day.hotel + day.other;
              if (dayTotal === 0) return null;
              return (
                <div key={day.day} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Day {day.day}</span>
                    <span className="text-sm text-slate-600">{day.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {day.transport > 0 && (
                      <span className="text-xs text-blue-500">{formatKRW(day.transport)}</span>
                    )}
                    {day.spot > 0 && (
                      <span className="text-xs text-purple-500">{formatKRW(day.spot)}</span>
                    )}
                    {day.food > 0 && (
                      <span className="text-xs text-orange-500">{formatKRW(day.food)}</span>
                    )}
                    <span className="text-sm font-bold text-slate-700">{formatKRW(dayTotal)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 匯率說明 */}
          <p className="text-[10px] text-slate-400 mt-4">
            * 匯率以 1 KRW = {KRW_TO_TWD} TWD 估算，實際依當時匯率為準
          </p>
        </div>
      )}
    </div>
  );
};

export default CostSummary;
