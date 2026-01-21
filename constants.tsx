
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
    date: '2/26 (四)',
    title: '抵達與入住',
    items: [
      { id: 'day1-item1', order: 1, time: '17:40', title: '搭機前往釜山', description: 'BX792 桃園 T2 啟程', type: 'flight', showOnMap: false },
      { id: 'day1-item2', order: 2, time: '21:00', title: '抵達金海機場', description: '辦理入境、領取行李 (約 1 小時)', type: 'transport', showOnMap: true },
      { id: 'day1-item3', order: 3, time: '22:00', title: '前往廣安里', description: '搭乘 Uber/Taxi 直達住宿點 (約 30-40 分鐘)', type: 'transport', showOnMap: true },
      { id: 'day1-item4', order: 4, time: '22:45', title: 'Check-in Coco House', description: '廣安里海景住宿', type: 'hotel', coords: { lat: 35.153, lng: 129.118 }, showOnMap: false },
      { id: 'day1-item5', order: 5, time: '23:15', title: '深夜晚餐/宵夜', description: '推薦：83海池或附近烤肉、豬肉湯飯', type: 'food', showOnMap: false }
    ]
  },
  {
    day: 2,
    date: '2/27 (五)',
    title: '東釜山歡樂行',
    items: [
      { id: 'day2-item1', order: 1, time: '09:30', title: '出發前往東釜山', description: '車程約 30 分鐘', type: 'transport', showOnMap: false },
      { id: 'day2-item2', order: 2, time: '10:00', title: 'Skyline Luge Busan', description: '玩斜坡滑車', type: 'spot', coords: { lat: 35.195, lng: 129.215 }, naverPlaceId: '1927608921', showOnMap: true },
      { id: 'day2-item3', order: 3, time: '12:30', title: '午餐：龍宮寺炸醬麵', description: '海東龍宮寺前必吃', type: 'food', naverPlaceId: '11838227', showOnMap: true },
      { id: 'day2-item4', order: 4, time: '14:00', title: '海東龍宮寺', description: '韓國唯一海邊佛寺', type: 'spot', coords: { lat: 35.188, lng: 129.223 }, naverPlaceId: '11737443', showOnMap: true },
      { id: 'day2-item5', order: 5, time: '16:00', title: '新世界 SPA LAND', description: '汗蒸幕放鬆 (使用釜山PASS)', type: 'spot', coords: { lat: 35.168, lng: 129.130 }, naverPlaceId: '1964044668', showOnMap: true },
      { id: 'day2-item6', order: 6, time: '19:00', title: '晚餐', description: '汗蒸幕內簡單吃或新世界百貨美食', type: 'food', showOnMap: false }
    ]
  },
  {
    day: 3,
    date: '2/28 (六)',
    title: '海港風情與文化',
    items: [
      { id: 'day3-item1', order: 1, time: '10:00', title: '松島海上纜車', description: '跨海纜車體驗 (使用釜山PASS)', type: 'spot', coords: { lat: 35.076, lng: 129.023 }, naverPlaceId: '1962824676', showOnMap: true },
      { id: 'day3-item2', order: 2, time: '11:30', title: '松島龍宮天空步道', description: '漫步海面之上', type: 'spot', naverPlaceId: '1202664243', showOnMap: true },
      { id: 'day3-item3', order: 3, time: '13:00', title: '午餐：影島/松島附近', description: '隨選在地美食', type: 'food', showOnMap: false },
      { id: 'day3-item4', order: 4, time: '14:30', title: '甘川洞文化村', description: '尋找小王子與彩色屋頂', type: 'spot', coords: { lat: 35.097, lng: 129.010 }, naverPlaceId: '21884707', showOnMap: true },
      { id: 'day3-item5', order: 5, time: '17:00', title: '影島足浴咖啡', description: '邊泡腳邊喝咖啡賞海景', type: 'spot', coords: { lat: 35.079, lng: 129.060 }, showOnMap: true },
      { id: 'day3-item6', order: 6, time: '19:00', title: '晚餐：南浦/札嘎其', description: '國際市場、札嘎其市場小吃', type: 'food', naverPlaceId: '11535750', showOnMap: false }
    ]
  },
  {
    day: 4,
    date: '3/1 (日)',
    title: '文化村與購物',
    items: [
      { id: 'day4-item1', order: 1, time: '10:30', title: '白淺灘文化村', description: '影島絕美海岸村落', type: 'spot', coords: { lat: 35.078, lng: 129.044 }, naverPlaceId: '37418047', showOnMap: true },
      { id: 'day4-item2', order: 2, time: '12:30', title: '午餐：南浦洞區域', description: '國際市場、富平罐頭市場小吃', type: 'food', showOnMap: false },
      { id: 'day4-item3', order: 3, time: '14:30', title: 'BIFF 廣場', description: '必吃昇基堅果黑糖餅', type: 'spot', naverPlaceId: '11672349', showOnMap: true },
      { id: 'day4-item4', order: 4, time: '16:00', title: 'Lotte Premium Outlets', description: '東釜山店購物', type: 'spot', coords: { lat: 35.191, lng: 129.213 }, naverPlaceId: '35816951', showOnMap: true },
      { id: 'day4-item5', order: 5, time: '19:30', title: '釜山塔', description: '欣賞城市夜景', type: 'spot', coords: { lat: 35.101, lng: 129.032 }, naverPlaceId: '20058995', showOnMap: true }
    ]
  },
  {
    day: 5,
    date: '3/2 (一)',
    title: '海雲台全攻略',
    items: [
      { id: 'day5-item1', order: 1, time: '10:00', title: '海雲台藍線公園', description: '海岸列車之旅', type: 'spot', coords: { lat: 35.160, lng: 129.167 }, naverPlaceId: '1287134328', showOnMap: true },
      { id: 'day5-item2', order: 2, time: '12:00', title: '午餐：31cm海鮮刀削麵', description: '滿滿貝類海鮮麵', type: 'spot', naverPlaceId: '1812508466', showOnMap: true },
      { id: 'day5-item3', order: 3, time: '14:00', title: 'SEA LIFE 水族館', description: '親子首選行程', type: 'spot', coords: { lat: 35.159, lng: 129.161 }, naverPlaceId: '11589853', showOnMap: true },
      { id: 'day5-item4', order: 4, time: '16:30', title: 'BUSAN X the SKY', description: '釜山最高觀景台', type: 'spot', coords: { lat: 35.158, lng: 129.169 }, naverPlaceId: '1328539259', showOnMap: true },
      { id: 'day5-item5', order: 5, time: '19:00', title: '晚餐：烤肉大餐', description: '「熟成道」或「Jejutgan」烤肉', type: 'food', naverPlaceId: '1142753247', showOnMap: false }
    ]
  },
  {
    day: 6,
    date: '3/3 (二)',
    title: '歸途',
    items: [
      { id: 'day6-item1', order: 1, time: '07:30', title: '退房前往機場', description: '車程約 45 分鐘', type: 'transport', showOnMap: false },
      { id: 'day6-item2', order: 2, time: '08:30', title: '機場報到', description: '金海機場 PUS', type: 'other', showOnMap: true },
      { id: 'day6-item3', order: 3, time: '10:50', title: '搭機返台', description: 'BX793 返程', type: 'flight', showOnMap: false },
      { id: 'day6-item4', order: 4, time: '12:25', title: '抵達桃園', description: '旅程圓滿結束', type: 'flight', showOnMap: true }
    ]
  }
];

export const SPOTS: Spot[] = [
  { id: 'luge', name: 'Skyline Luge Busan', description: '斜坡滑車，親子必玩。', imageUrl: 'https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/rjfnrcty8bskscfts2d2.jpg', category: '樂園', tags: ['親子', '刺激'], lat: 35.195, lng: 129.215, naverPlaceId: '1927608921' },
  { id: 'yonggungsa', name: '海東龍宮寺', description: '海邊佛寺，景觀壯麗。', imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/18/2751918_image2_1.jpg', category: '文化', tags: ['海景'], lat: 35.188, lng: 129.223, naverPlaceId: '11737443' },
  { id: 'blueline', name: '海雲台海邊列車', description: 'Blue Line Park 復古列車。', imageUrl: 'https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/iewij5wcrmvdefurbnuv.jpg', category: '交通', tags: ['拍照'], lat: 35.160, lng: 129.167, naverPlaceId: '1287134328' },
  { id: 'spaland', name: '新世界 SPA LAND', description: '豪華汗蒸幕體驗。', imageUrl: 'https://cdn.walkerland.com.tw/images/upload/article/2023/11/m36174/51f06698b47b101070e060a77ae473b89af6c4f4.jpg', category: '休閒', tags: ['放鬆'], lat: 35.168, lng: 129.130, naverPlaceId: '1964044668' },
  { id: 'songdocable', name: '松島海上纜車', description: '跨海纜車與天空步道。', imageUrl: 'https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_770/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/ulhfkzn47rllnnvupgtb/%E6%9D%BE%E5%B3%B6%E6%B5%B7%E4%B8%8A%E7%BA%9C%E8%BB%8A%E9%96%80%E7%A5%A8.jpg', category: '交通', tags: ['海景'], lat: 35.076, lng: 129.023, naverPlaceId: '1962824676' },
  { id: 'gamcheon', name: '甘川洞文化村', description: '釜山聖托里尼，尋找小王子。', imageUrl: 'https://res.klook.com/image/upload/Gamcheon_Culture_Village_Busan_nq0nyx.jpg', category: '文化', tags: ['拍照'], lat: 35.097, lng: 129.010, naverPlaceId: '21884707' },
  { id: 'whitevillage', name: '白淺灘文化村', description: '影島絕美崖邊小村。', imageUrl: 'https://www.visitbusan.net/uploadImgs/files/cntnts/20191222164810698_oen', category: '文化', tags: ['海景'], lat: 35.078, lng: 129.044, naverPlaceId: '37418047' },
  { id: 'intermarket', name: '國際市場/富平罐頭市場', description: '道地釜山市場體驗。', imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/34/3088434_image2_1.jpg', category: '購物', tags: ['小吃'], lat: 35.101, lng: 129.027, naverPlaceId: '13491723' },
  { id: 'biff', name: 'BIFF 廣場', description: '電影殿堂與黑糖餅。', imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/83/2364283_image2_1.jpg', category: '文化', tags: ['美食'], lat: 35.098, lng: 129.026, naverPlaceId: '11672349' },
  { id: 'lotteoutlet', name: 'Lotte Premium Outlets', description: '東釜山店，精品購物。', imageUrl: 'https://photo.settour.com.tw/900x600/https://www.settour.com.tw/ss_img/info/location/PUS/S0/PUS0000429/PUS0000429_151002.jpg', category: '購物', tags: ['血拼'], lat: 35.191, lng: 129.213, naverPlaceId: '35816951' },
  { id: 'busantower', name: '釜山塔', description: '釜山市中心地標。', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA966kIwAhNHNudiDTycYJYWZrsqzk--6GfQ&s', category: '地標', tags: ['夜景'], lat: 35.101, lng: 129.032, naverPlaceId: '20058995' },
  { id: 'sealife', name: 'SEA LIFE 釜山水族館', description: '海雲台親子景點。', imageUrl: 'https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_728/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/wz0z5ma62zjppbmmvg3l/SeaLife%E9%87%9C%E5%B1%B1%E6%B0%B4%E6%97%8F%E9%A4%A8%E9%96%80%E7%A5%A8.jpg', category: '樂園', tags: ['親子'], lat: 35.159, lng: 129.161, naverPlaceId: '11589853' },
  { id: 'xthesky', name: 'BUSAN X the SKY', description: '100層樓高的震撼。', imageUrl: 'https://niny.tw/wp-content/uploads/2024/11/busan-x-the-sky-00.jpg', category: '地標', tags: ['高空'], lat: 35.158, lng: 129.169, naverPlaceId: '1328539259' },
  { id: 'centumcity', name: '新世界百貨 Centum City', description: '世界最大百貨公司。', imageUrl: 'https://static.wixstatic.com/media/0505b9_eb6e436e1e2e4096bc6a4179dd96e962~mv2.jpg/v1/fill/w_1922,h_1118,al_c/0505b9_eb6e436e1e2e4096bc6a4179dd96e962~mv2.jpg', category: '購物', tags: ['豪華'], lat: 35.169, lng: 129.130, naverPlaceId: '13067134' },
];

export const FOOD: Restaurant[] = [
  { id: 'redbean', name: '釜山國際市場紅豆麵包', description: '釜山站內必買早餐。', imageUrl: '', category: 'bread', lat: 35.115, lng: 129.040 },
  { id: 'eomuk1', name: '黃金魚板 (釜山站內)', description: '釜山站內魚板名店。', imageUrl: '', category: 'other', lat: 35.115, lng: 129.040 },
  { id: 'samjin', name: '三進魚板 (釜山站外)', description: '老字號魚板總店。', imageUrl: '', category: 'other', lat: 35.114, lng: 129.039 },
  { id: 'chosun', name: '朝鮮豬肉湯飯', description: '釜山站外經典選擇。', imageUrl: '', category: 'gukbap', lat: 35.113, lng: 129.038 },
  { id: 'byeolmi', name: '別味清豬肉湯飯', description: '釜山站外在地人大推。', imageUrl: '', category: 'gukbap', lat: 35.114, lng: 129.037 },
  { id: 'gaemijib', name: '개미집 螞蟻家', description: '釜山站內人氣辣炒章魚。', imageUrl: 'https://pimg.1px.tw/pobiguesthouse/1416978482-993522362.jpg', category: 'other', lat: 35.115, lng: 129.040 },
  { id: '83hatch', name: '83海池 (83해치)', description: '廣安里第一代烤肉店。', imageUrl: '', category: 'bbq', lat: 35.155, lng: 129.117 },
  { id: 'okgyegwan', name: '玉桂館 (옥계관)', description: '廣安里本店人氣烤肉。', imageUrl: '', category: 'bbq', lat: 35.154, lng: 129.118 },
  { id: 'sukseong', name: '「熟成道」烤肉店', description: '超厚切熟成五花肉。', imageUrl: 'https://static.popdaily.com.tw/u/202410/28d42294-4355-4186-a517-37b7a42055c9.jpeg', category: 'bbq', lat: 35.157, lng: 129.128, naverPlaceId: '1021236949' },
  { id: 'jejutgan', name: 'Jejutgan (濟州間)', description: '西面站特色烤肉店。', imageUrl: '', category: 'bbq', lat: 35.154, lng: 129.060, naverPlaceId: '1142753247' },
  { id: 'noodle31', name: '31cm 海鮮刀削麵', description: '大份量澎湃海鮮。', imageUrl: '', category: 'seafood', lat: 35.163, lng: 129.164, naverPlaceId: '1812508466' },
  { id: 'cowrib', name: '海雲台母牛肋排家', description: '釜山必吃高端烤肉。', imageUrl: '', category: 'bbq', lat: 35.162, lng: 129.163 },
  { id: 'seolleong', name: '南浦雪濃湯', description: '早餐暖胃首選。', imageUrl: '', category: 'other', lat: 35.099, lng: 129.028 },
  { id: 'donkatsu', name: '巨大王炸豬排', description: '份量十足的酥脆豬排。', imageUrl: '', category: 'other', lat: 35.158, lng: 129.165, naverPlaceId: '1928881097' },
  { id: 'puradak', name: 'Puradak 炸雞', description: '精品等級美味炸雞。', imageUrl: 'https://cf.creatrip.com/original/spot/13016/z7tsayferagry4q4fs6atg873i16q74t.jpg', category: 'other', lat: 35.153, lng: 129.119 },
  { id: 'footbath', name: '泡腳咖啡 뷰 (View)', description: '可以邊泡腳邊看海。', imageUrl: '', category: 'cafe', lat: 35.079, lng: 129.060 },
  { id: 'bblack', name: 'B-Black 咖啡廳', description: '白色極簡露天平台。', imageUrl: '', category: 'cafe', lat: 35.078, lng: 129.059 },
];
