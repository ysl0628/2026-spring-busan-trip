# 釜山 228 漫遊指南

專為庭瑜、Yang、淯丞、智棋、宏翔與小藍設計的六天五夜釜山親子旅遊行程應用程式。

## 功能特色

- 📅 **行程規劃** - 查看與編輯每日行程，支援即時儲存至 Google Sheets
- ✈️ **飛行資訊** - 快速查看往返航班詳細資訊
- 📍 **必訪景點** - 精選景點清單，內建地圖定位與分類標籤
- 🍜 **釜山美食** - 分類瀏覽在地美食推薦
- ℹ️ **行前必知** - 成員資訊與旅遊須知

## 技術棧

- **前端框架**: React 19 + TypeScript
- **建置工具**: Vite
- **樣式**: Tailwind CSS
- **UI 元件**: Radix UI
- **地圖**: Naver Map API
- **資料來源**: Google Sheets (透過 Apps Script API)
- **拖曳排序**: Atlassian Pragmatic Drag and Drop

## 開始使用

### 環境需求

- Node.js 18+ 
- npm 或 yarn

### 安裝步驟

1. 安裝依賴套件：
```bash
npm install
```

2. 設定環境變數（可選）：
   
   建立 `.env.local` 檔案，設定 Google Sheets API URL：
```bash
VITE_SHEET_API_URL=your_google_apps_script_url
```

   如果未設定，開發環境會使用 `/sheet` 代理，生產環境會使用預設的 Apps Script URL。

3. 啟動開發伺服器：
```bash
npm run dev
```

4. 開啟瀏覽器訪問 `http://localhost:5173`

### 建置生產版本

```bash
npm run build
```

建置完成後，可使用以下指令預覽：
```bash
npm run preview
```

## 專案結構

```
├── components/          # React 元件
│   ├── ui/             # 通用 UI 元件（Dialog, Select 等）
│   ├── AppIcon.tsx     # 應用程式圖示
│   ├── DayEditor.tsx   # 行程編輯器
│   └── ...
├── views/              # 頁面視圖
│   ├── ItineraryView.tsx  # 行程規劃頁
│   ├── FlightsView.tsx    # 飛行資訊頁
│   ├── SpotsView.tsx      # 景點頁
│   ├── FoodView.tsx       # 美食頁
│   └── InfoView.tsx       # 資訊頁
├── hooks/              # React Hooks
│   └── useSheetData.ts    # Google Sheets 資料管理
├── utils/              # 工具函數
│   └── naverMap.ts        # Naver Map 整合
├── constants.tsx        # 常數定義（航班、成員等）
├── types.ts            # TypeScript 型別定義
└── App.tsx             # 主應用程式元件
```

## 資料管理

行程資料儲存在 Google Sheets，透過 Google Apps Script 提供的 Web API 進行讀寫。應用程式支援：

- 即時載入行程資料
- 編輯每日行程項目
- 拖曳排序行程項目
- 儲存變更回 Google Sheets

## 授權

本專案為私人旅遊規劃應用，僅供內部使用。
