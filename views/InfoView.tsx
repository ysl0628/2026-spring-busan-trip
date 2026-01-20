import React from 'react';
import { Clock, CreditCard, DollarSign, Train } from 'lucide-react';
import { Member } from '../types';
import InfoCard from '../components/InfoCard';

type InfoViewProps = {
  members: Member[];
};

const InfoView: React.FC<InfoViewProps> = ({ members }) => (
  <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto mt-4 md:mt-0">
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden relative">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50" />
      <h3 className="font-black text-2xl text-slate-800 mb-8 relative">成員 <span className="text-slate-300 font-medium ml-2 text-lg">6 人</span></h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 relative">
        {members.map((m, i) => (
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

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <InfoCard icon={<Train className="text-blue-500" />} title="交通" items={[
        '下載 Naver Map 導航 (必備)',
        '購買 T-Money 卡可搭乘地鐵/公車',
        '釜山地鐵出口多樓梯，推車找 Elevator',
        'KakaoTaxi 或 Uber 可綁台灣信用卡'
      ]} />
      <InfoCard icon={<DollarSign className="text-green-500" />} title="換錢與付款" items={[
        'Wowpass 在地鐵站可直接換錢/領卡',
        '大多數餐廳接受海外信用卡',
        '路邊攝影建議準備少量韓幣現金',
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

export default InfoView;
