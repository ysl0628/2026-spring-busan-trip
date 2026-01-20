
import { Flight, DaySchedule, Spot, Restaurant, Member } from './types';

export const MEMBERS: Member[] = [
  { name: '庭瑜', role: '大人', avatar: '👩‍🦰' },
  { name: 'Yang', role: '大人', avatar: '👨‍🦱' },
  { name: '淯丞', role: '孩童', avatar: '👦' },
  { name: '智棋', role: '嬰兒', avatar: '👶' },
  { name: '宏翔', role: '大人', avatar: '👨' },
  { name: '小藍', role: '大人', avatar: '👩' },
];

export const FLIGHTS: Flight[] = [
  {
    type: 'departure',
    airline: '釜山航空',
    flightNumber: 'BX792',
    aircraft: '空中巴士 A321',
    departureTime: '2/26 17:40',
    arrivalTime: '2/26 21:00',
    departureAirport: 'TPE 桃園國際機場 T2',
    arrivalAirport: 'PUS 釜山金海機場',
    duration: '2h 20m',
    cabin: '經濟艙 R'
  },
  {
    type: 'return',
    airline: '釜山航空',
    flightNumber: 'BX793',
    aircraft: '空中巴士 A321',
    departureTime: '3/3 10:50',
    arrivalTime: '3/3 12:25',
    departureAirport: 'PUS 釜山金海機場',
    arrivalAirport: 'TPE 桃園國際機場 T2',
    duration: '2h 35m',
    cabin: '經濟艙 D'
  }
];

export const ITINERARY: DaySchedule[] = [
  {
    day: 1,
    date: '2/26 (三)',
    title: '抵達與入住',
    items: [
      { time: '17:40', title: '搭機前往釜山', description: 'BX792 桃園 T2 啟程', type: 'flight' },
      { time: '21:00', title: '抵達金海機場', description: '辦理入境、領取行李 (約 1 小時)', type: 'transport' },
      { time: '22:00', title: '前往廣安里', description: '搭乘 Uber/Taxi 直達住宿點 (約 30-40 分鐘)', type: 'transport' },
      { time: '22:45', title: 'Check-in Coco House', description: '廣安里海景住宿', type: 'hotel', coords: { lat: 35.153, lng: 129.118 } },
      { time: '23:15', title: '深夜晚餐/宵夜', description: '推薦：83海池或附近烤肉、豬肉湯飯', type: 'food' }
    ]
  },
  {
    day: 2,
    date: '2/27 (四)',
    title: '東釜山歡樂行',
    items: [
      { time: '09:30', title: '出發前往東釜山', description: '車程約 30 分鐘', type: 'transport' },
      { time: '10:00', title: 'Skyline Luge Busan', description: '玩斜坡滑車', type: 'spot', coords: { lat: 35.195, lng: 129.215 } },
      { time: '12:30', title: '午餐：龍宮寺炸醬麵', description: '海東龍宮寺前必吃', type: 'food' },
      { time: '14:00', title: '海東龍宮寺', description: '韓國唯一海邊佛寺', type: 'spot', coords: { lat: 35.188, lng: 129.223 } },
      { time: '16:00', title: '新世界 SPA LAND', description: '汗蒸幕放鬆 (使用釜山PASS)', type: 'spot', coords: { lat: 35.168, lng: 129.130 } },
      { time: '19:00', title: '晚餐', description: '汗蒸幕內簡單吃或新世界百貨美食', type: 'food' }
    ]
  },
  {
    day: 3,
    date: '2/28 (五)',
    title: '海港風情與文化',
    items: [
      { time: '10:00', title: '松島海上纜車', description: '跨海纜車體驗 (使用釜山PASS)', type: 'spot', coords: { lat: 35.076, lng: 129.023 } },
      { time: '11:30', title: '松島龍宮天空步道', description: '漫步海面之上', type: 'spot' },
      { time: '13:00', title: '午餐：影島/松島附近', description: '隨選在地美食', type: 'food' },
      { time: '14:30', title: '甘川洞文化村', description: '尋找小王子與彩色屋頂', type: 'spot', coords: { lat: 35.097, lng: 129.010 } },
      { time: '17:00', title: '影島足浴咖啡', description: '邊泡腳邊喝咖啡賞海景', type: 'spot', coords: { lat: 35.079, lng: 129.060 } },
      { time: '19:00', title: '晚餐：南浦/札嘎其', description: '國際市場、札嘎其市場小吃', type: 'food' }
    ]
  },
  {
    day: 4,
    date: '3/1 (六)',
    title: '文化村與購物',
    items: [
      { time: '10:30', title: '白險灘文化村', description: '影島絕美海岸村落', type: 'spot', coords: { lat: 35.078, lng: 129.044 } },
      { time: '12:30', title: '午餐：南浦洞區域', description: '國際市場、富平罐頭市場小吃', type: 'food' },
      { time: '14:30', title: 'BIFF 廣場', description: '必吃昇基堅果黑糖餅', type: 'spot' },
      { time: '16:00', title: 'Lotte Premium Outlets', description: '東釜山店購物', type: 'spot', coords: { lat: 35.191, lng: 129.213 } },
      { time: '19:30', title: '釜山塔', description: '欣賞城市夜景', type: 'spot', coords: { lat: 35.101, lng: 129.032 } }
    ]
  },
  {
    day: 5,
    date: '3/2 (日)',
    title: '海雲台全攻略',
    items: [
      { time: '10:00', title: '海雲台藍線公園', description: '海岸列車之旅', type: 'spot', coords: { lat: 35.160, lng: 129.167 } },
      { time: '12:00', title: '午餐：31cm海鮮刀削麵', description: '滿滿貝類海鮮麵', type: 'food' },
      { time: '14:00', title: 'SEA LIFE 水族館', description: '親子首選行程', type: 'spot', coords: { lat: 35.159, lng: 129.161 } },
      { time: '16:30', title: 'BUSAN X the SKY', description: '釜山最高觀景台', type: 'spot', coords: { lat: 35.158, lng: 129.169 } },
      { time: '19:00', title: '晚餐：烤肉大餐', description: '「熟成道」或「Jejutgan」烤肉', type: 'food' }
    ]
  },
  {
    day: 6,
    date: '3/3 (一)',
    title: '歸途',
    items: [
      { time: '07:30', title: '退房前往機場', description: '車程約 45 分鐘', type: 'transport' },
      { time: '08:30', title: '機場報到', description: '金海機場 PUS', type: 'other' },
      { time: '10:50', title: '搭機返台', description: 'BX793 返程', type: 'flight' },
      { time: '12:25', title: '抵達桃園', description: '旅程圓滿結束', type: 'flight' }
    ]
  }
];

export const SPOTS: Spot[] = [
  { id: 'luge', name: 'Skyline Luge Busan', description: '斜坡滑車，親子必玩。', imageUrl: 'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&q=80&w=600', category: '樂園', tags: ['親子', '刺激'], lat: 35.195, lng: 129.215 },
  { id: 'yonggungsa', name: '海東龍宮寺', description: '海邊佛寺，景觀壯麗。', imageUrl: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&q=80&w=600', category: '文化', tags: ['海景'], lat: 35.188, lng: 129.223 },
  { id: 'blueline', name: '海雲台海邊列車', description: 'Blue Line Park 復古列車。', imageUrl: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=600', category: '交通', tags: ['拍照'], lat: 35.160, lng: 129.167 },
  { id: 'spaland', name: '新世界 SPA LAND', description: '豪華汗蒸幕體驗。', imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600', category: '休閒', tags: ['放鬆'], lat: 35.168, lng: 129.130 },
  { id: 'songdocable', name: '松島海上纜車', description: '跨海纜車與天空步道。', imageUrl: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=600', category: '交通', tags: ['海景'], lat: 35.076, lng: 129.023 },
  { id: 'gamcheon', name: '甘川洞文化村', description: '釜山聖托里尼，尋找小王子。', imageUrl: 'https://images.unsplash.com/photo-1534001265532-393289eb8ed3?auto=format&fit=crop&q=80&w=600', category: '文化', tags: ['拍照'], lat: 35.097, lng: 129.010 },
  { id: 'whitevillage', name: '白險灘文化村', description: '影島絕美崖邊小村。', imageUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&q=80&w=600', category: '文化', tags: ['海景'], lat: 35.078, lng: 129.044 },
  { id: 'intermarket', name: '國際市場/富平罐頭市場', description: '道地釜山市場體驗。', imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=600', category: '購物', tags: ['小吃'], lat: 35.101, lng: 129.027 },
  { id: 'biff', name: 'BIFF 廣場', description: '電影殿堂與黑糖餅。', imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=600', category: '文化', tags: ['美食'], lat: 35.098, lng: 129.026 },
  { id: 'lotteoutlet', name: 'Lotte Premium Outlets', description: '東釜山店，精品購物。', imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600', category: '購物', tags: ['血拼'], lat: 35.191, lng: 129.213 },
  { id: 'busantower', name: '釜山塔', description: '釜山市中心地標。', imageUrl: 'https://images.unsplash.com/photo-1531266752426-aad4966a757d?auto=format&fit=crop&q=80&w=600', category: '地標', tags: ['夜景'], lat: 35.101, lng: 129.032 },
  { id: 'sealife', name: 'SEA LIFE 釜山水族館', description: '海雲台親子景點。', imageUrl: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&q=80&w=600', category: '樂園', tags: ['親子'], lat: 35.159, lng: 129.161 },
  { id: 'xthesky', name: 'BUSAN X the SKY', description: '100層樓高的震撼。', imageUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600', category: '地標', tags: ['高空'], lat: 35.158, lng: 129.169 },
  { id: 'centumcity', name: '新世界百貨 Centum City', description: '世界最大百貨公司。', imageUrl: 'https://images.unsplash.com/photo-1481437156560-3201fb1ff997?auto=format&fit=crop&q=80&w=600', category: '購物', tags: ['豪華'], lat: 35.169, lng: 129.130 },
];

export const FOOD: Restaurant[] = [
  { id: 'redbean', name: '釜山國際市場紅豆麵包', description: '釜山站內必買早餐。', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600', category: 'bread', lat: 35.115, lng: 129.040 },
  { id: 'eomuk1', name: '黃金魚板 (釜山站內)', description: '釜山站內魚板名店。', imageUrl: 'https://images.unsplash.com/photo-1589113103503-49655034c751?auto=format&fit=crop&q=80&w=600', category: 'other', lat: 35.115, lng: 129.040 },
  { id: 'samjin', name: '三進魚板 (釜山站外)', description: '老字號魚板總店。', imageUrl: 'https://images.unsplash.com/photo-1589113103503-49655034c751?auto=format&fit=crop&q=80&w=600', category: 'other', lat: 35.114, lng: 129.039 },
  { id: 'chosun', name: '朝鮮豬肉湯飯', description: '釜山站外經典選擇。', imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=600', category: 'gukbap', lat: 35.113, lng: 129.038 },
  { id: 'byeolmi', name: '別味清豬肉湯飯', description: '釜山站外在地人大推。', imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=600', category: 'gukbap', lat: 35.114, lng: 129.037 },
  { id: 'gaemijib', name: '개米屋 螞蟻家', description: '釜山站內人氣辣炒章魚。', imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=600', category: 'other', lat: 35.115, lng: 129.040 },
  { id: '83hatch', name: '83海池 (83해치)', description: '廣安里第一代烤肉店。', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600', category: 'bbq', lat: 35.155, lng: 129.117 },
  { id: 'okgyegwan', name: '玉桂館 (옥계관)', description: '廣安里本店人氣烤肉。', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600', category: 'bbq', lat: 35.154, lng: 129.118 },
  { id: 'sukseong', name: '「熟成道」烤肉店', description: '超厚切熟成五花肉。', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600', category: 'bbq', lat: 35.157, lng: 129.128 },
  { id: 'jejutgan', name: 'Jejutgan (濟州間)', description: '西面站特色烤肉店。', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600', category: 'bbq', lat: 35.154, lng: 129.060 },
  { id: 'noodle31', name: '31cm 海鮮刀削麵', description: '大份量澎湃海鮮。', imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=600', category: 'seafood', lat: 35.163, lng: 129.164 },
  { id: 'cowrib', name: '海雲台母牛肋排家', description: '釜山必吃高端烤肉。', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600', category: 'bbq', lat: 35.162, lng: 129.163 },
  { id: 'seolleong', name: '南浦雪濃湯', description: '早餐暖胃首選。', imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=600', category: 'other', lat: 35.099, lng: 129.028 },
  { id: 'donkatsu', name: '巨大人王敦炸豬排', description: '份量十足的酥脆豬排。', imageUrl: 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?auto=format&fit=crop&q=80&w=600', category: 'other', lat: 35.158, lng: 129.165 },
  { id: 'puradak', name: 'Puradak 炸雞', description: '精品等級美味炸雞。', imageUrl: 'https://images.unsplash.com/photo-1567622646639-b76964766f7d?auto=format&fit=crop&q=80&w=600', category: 'other', lat: 35.153, lng: 129.119 },
  { id: 'footbath', name: '泡腳咖啡 뷰 (View)', description: '可以邊泡腳邊看海。', imageUrl: 'https://images.unsplash.com/photo-1544145945-f904253d0c7b?auto=format&fit=crop&q=80&w=600', category: 'cafe', lat: 35.079, lng: 129.060 },
  { id: 'bblack', name: 'B-Black 咖啡廳', description: '白色極簡露天平台。', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600', category: 'cafe', lat: 35.078, lng: 129.059 },
];
