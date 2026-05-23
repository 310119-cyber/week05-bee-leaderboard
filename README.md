# 🐝 小蜜蜂嗡嗡排行榜 (Bee Leaderboard)

這是一個基於 **Next.js (App Router)**、**React**、**TypeScript** 與 **Tailwind CSS** 開發的趣味小蜜蜂主題排行榜網頁應用。玩家可以在這裡登記自己的分數，並與其他「嗡嗡高手」一決高下！

---

## 🌟 專案特色

- **🐝 趣味蜜蜂主題設計**：精緻的蜂巢背景圖案與飄浮小蜜蜂動畫，給使用者溫馨活潑的視覺體驗。
- **🏆 嗡嗡高手榜**：
  - 即時從高分到低分排序。
  - 前三名尊享專屬獎牌（🥇 🥈 🥉）與醒目的底色突顯。
  - 支援千分位格式化顯示（例如 `9,999`）。
- **📝 便捷的成績登錄**：
  - 支援限制輸入玩家名稱（最多 15 字）。
  - 自動防呆與輸入驗證（禁止空白名字、非整數或小於 0 的分數）。
  - 送出成功或失敗時，提供親切的即時卡片提示資訊。
- **⚡ 即時資料同步**：送出分數後立即無縫更新排行榜，無須重新整理頁面。

---

## 🛠️ 技術棧

- **前端框架**：[Next.js](https://nextjs.org/) (React 19 / App Router)
- **程式語言**：TypeScript
- **樣式設計**：Tailwind CSS (包含客製化動畫如 `bee-float` 與蜂巢背景 `honeycomb-pattern`)
- **後端 API**：Next.js Route Handlers (API 路由)
- **資料儲存**：目前使用伺服器記憶體暫存（重新啟動開發伺服器時會重置）

---

## 📂 專案目錄結構

```text
week05-bee-leaderboard/
├── app/
│   ├── api/
│   │   └── scores/
│   │       └── route.ts     # 後端分數 API (GET 取得排行榜 / POST 提交分數)
│   ├── globals.css          # 全域樣式與客製化動畫效果 (如小蜜蜂飄浮等)
│   ├── layout.tsx           # 全域版面配置與頁面 Metadata
│   └── page.tsx             # 排行榜主頁面 (React Client Component)
├── public/                  # 靜態資源檔案
├── package.json             # 專案依賴與腳本設定
└── tsconfig.json            # TypeScript 設定檔
```

---

## 🚀 快速開始

### 1. 安裝依賴項目

在專案根目錄下執行以下指令安裝必要的套件：

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 2. 啟動開發伺服器

執行以下指令啟動本地開發伺服器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

啟動後，請在瀏覽器中打開 [http://localhost:3000](http://localhost:3000) 即可開始體驗！

### 3. 專案編譯與部署

若要編譯成生產環境版本：

```bash
npm run build
```

編譯完成後，使用以下指令運行生產環境服務：

```bash
npm run start
```

---

## 📡 API 端點說明

本專案提供了一個簡單的分數管理 API：

### 1. 取得所有排行
- **URL**: `/api/scores`
- **Method**: `GET`
- **回傳內容**: 依分數由高至低排列的玩家清單 JSON。

### 2. 提交新分數
- **URL**: `/api/scores`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "玩家名稱",
    "score": 5000
  }
  ```
- **回傳內容**: 更新後且已排序的排行榜 JSON。
