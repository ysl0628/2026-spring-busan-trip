import React, { useMemo } from 'react';
import { Wallet, Train, Ticket, Utensils, Building, ChevronDown, ChevronUp, Plane, CreditCard, Users } from 'lucide-react';
import { DaySchedule, ExtraExpense } from '../types';

type CostSummaryProps = {
  itinerary: DaySchedule[];
  extraExpenses?: ExtraExpense[];
  memberCount?: number;
};

const KRW_TO_TWD = 0.024; // 匯率：1 韓元 ≈ 0.024 台幣

const formatKRW = (amount: number) => {
  return `₩${amount.toLocaleString()}`;
};

const formatTWD = (amount: number) => {
  return `NT$${Math.round(amount).toLocaleString()}`;
};

// 將韓元轉成台幣（用於統一計算）
const toTWD = (amount: number, currency: 'KRW' | 'TWD' = 'KRW') => {
  return currency === 'KRW' ? amount * KRW_TO_TWD : amount;
};

const CostSummary: React.FC<CostSummaryProps> = ({ itinerary, extraExpenses = [], memberCount = 6 }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const costs = useMemo(() => {
    let transportTotal = 0;
    let spotTotal = 0;
    let foodTotal = 0;
    let hotelTotal = 0;
    let otherTotal = 0;

    // 每人分攤總計（考量不同分攤人數）
    let perPersonTotal = 0;

    const dailyCosts: { day: number; date: string; transport: number; spot: number; food: number; hotel: number; other: number; perPerson: number }[] = [];

    itinerary.forEach((day) => {
      let dayTransport = 0;
      let daySpot = 0;
      let dayFood = 0;
      let dayHotel = 0;
      let dayOther = 0;
      let dayPerPerson = 0;

      day.items.forEach((item) => {
        const splitCount = item.splitCount ?? memberCount;
        
        // 行程本身的費用
        if (item.cost) {
          const costTWD = item.cost * KRW_TO_TWD;
          const perPersonShare = costTWD / splitCount;
          dayPerPerson += perPersonShare;

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

        // 交通費用（交通都是全員分攤）
        if (item.transportToNext?.cost) {
          dayTransport += item.transportToNext.cost;
          const transportTWD = item.transportToNext.cost * KRW_TO_TWD;
          dayPerPerson += transportTWD / memberCount;
        }
      });

      transportTotal += dayTransport;
      spotTotal += daySpot;
      foodTotal += dayFood;
      hotelTotal += dayHotel;
      otherTotal += dayOther;
      perPersonTotal += dayPerPerson;

      dailyCosts.push({
        day: day.day,
        date: day.date,
        transport: dayTransport,
        spot: daySpot,
        food: dayFood,
        hotel: dayHotel,
        other: dayOther,
        perPerson: dayPerPerson,
      });
    });

    // 計算額外費用
    let extraFlightTotal = 0; // 台幣
    let extraHotelTotal = 0;
    let extraOtherTotal = 0;
    let extraPerPerson = 0;

    extraExpenses.forEach((expense) => {
      const amountTWD = toTWD(expense.cost, expense.currency);
      const splitCount = expense.splitCount ?? memberCount;
      extraPerPerson += amountTWD / splitCount;

      switch (expense.category) {
        case 'flight':
          extraFlightTotal += amountTWD;
          break;
        case 'hotel':
          extraHotelTotal += amountTWD;
          break;
        default:
          extraOtherTotal += amountTWD;
      }
    });

    const itineraryTotalTWD = (transportTotal + spotTotal + foodTotal + hotelTotal + otherTotal) * KRW_TO_TWD;
    const extraTotalTWD = extraFlightTotal + extraHotelTotal + extraOtherTotal;
    const grandTotalTWD = itineraryTotalTWD + extraTotalTWD;
    const totalPerPerson = perPersonTotal + extraPerPerson;

    return {
      // 行程費用（韓元）
      transport: transportTotal,
      spot: spotTotal,
      food: foodTotal,
      hotel: hotelTotal,
      other: otherTotal,
      itineraryTotal: transportTotal + spotTotal + foodTotal + hotelTotal + otherTotal,
      // 額外費用（台幣）
      extraFlight: extraFlightTotal,
      extraHotel: extraHotelTotal,
      extraOther: extraOtherTotal,
      extraTotal: extraTotalTWD,
      // 總計（台幣）
      grandTotalTWD,
      totalPerPerson,
      daily: dailyCosts,
    };
  }, [itinerary, extraExpenses, memberCount]);

  if (costs.grandTotalTWD === 0) {
    return null;
  }

  const hasExtraExpenses = extraExpenses.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-800">預估費用</h3>
            <p className="text-xs text-slate-400 hidden sm:block">
              行程 {formatKRW(costs.itineraryTotal)}{hasExtraExpenses ? ` + 額外 ${formatTWD(costs.extraTotal)}` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-base sm:text-lg font-bold text-emerald-600">{formatTWD(costs.grandTotalTWD)}</p>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-400 justify-end">
              <Users className="w-3 h-3" />
              <span>每人 {formatTWD(costs.totalPerPerson)}</span>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-100 animate-slideDown">
          {/* 行程費用分類 */}
          {costs.itineraryTotal > 0 && (
            <>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide pt-4 pb-2">行程費用 (韓元)</p>
              <div className="grid grid-cols-2 gap-2">
                {costs.transport > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50">
                    <Train className="w-4 h-4 text-blue-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-blue-600">交通</p>
                      <p className="text-sm font-bold text-blue-700 truncate">{formatKRW(costs.transport)}</p>
                    </div>
                  </div>
                )}
                {costs.spot > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50">
                    <Ticket className="w-4 h-4 text-purple-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-purple-600">景點</p>
                      <p className="text-sm font-bold text-purple-700 truncate">{formatKRW(costs.spot)}</p>
                    </div>
                  </div>
                )}
                {costs.food > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50">
                    <Utensils className="w-4 h-4 text-orange-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-orange-600">餐飲</p>
                      <p className="text-sm font-bold text-orange-700 truncate">{formatKRW(costs.food)}</p>
                    </div>
                  </div>
                )}
                {costs.hotel > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-pink-50">
                    <Building className="w-4 h-4 text-pink-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-pink-600">住宿</p>
                      <p className="text-sm font-bold text-pink-700 truncate">{formatKRW(costs.hotel)}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* 額外費用分類 */}
          {hasExtraExpenses && (
            <>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide pt-4 pb-2">額外費用 (台幣)</p>
              <div className="grid grid-cols-2 gap-2">
                {costs.extraFlight > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50">
                    <Plane className="w-4 h-4 text-orange-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-orange-600">機票</p>
                      <p className="text-sm font-bold text-orange-700 truncate">{formatTWD(costs.extraFlight)}</p>
                    </div>
                  </div>
                )}
                {costs.extraHotel > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-pink-50">
                    <Building className="w-4 h-4 text-pink-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-pink-600">住宿</p>
                      <p className="text-sm font-bold text-pink-700 truncate">{formatTWD(costs.extraHotel)}</p>
                    </div>
                  </div>
                )}
                {costs.extraOther > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50">
                    <CreditCard className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-indigo-600">其他</p>
                      <p className="text-sm font-bold text-indigo-700 truncate">{formatTWD(costs.extraOther)}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* 每日明細 */}
          <div className="pt-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide pb-2">每日費用</p>
            <div className="space-y-1">
              {costs.daily.map((day) => {
                const dayTotal = day.transport + day.spot + day.food + day.hotel + day.other;
                if (dayTotal === 0) return null;
                return (
                  <div key={day.day} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">D{day.day}</span>
                      <span className="text-xs text-slate-400">{day.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-700">{formatKRW(dayTotal)}</span>
                      <span className="text-[11px] text-slate-400 bg-white px-1.5 py-0.5 rounded">
                        {formatTWD(day.perPerson)}/人
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 匯率說明 */}
          <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
            * 匯率 1 KRW = {KRW_TO_TWD} TWD
            {hasExtraExpenses && <> · 每人分攤依各項目設定</>}
          </p>
        </div>
      )}
    </div>
  );
};

export default CostSummary;
