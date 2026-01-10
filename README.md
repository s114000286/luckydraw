# 抽籤與分組小幫手 (HR Pro Event Toolbox)

這是一個基於 React + Vite 開發的活動工具，支援名單管理、隨機抽籤、自動分組以及 AI 隊名生成功能。

## 功能特點

- **名單管理**：手動輸入或大量貼上成員名單。
- **獎品抽籤**：從名單中隨機抽取中獎者，支援多輪抽籤。
- **自動分組**：根據指定人數自動分組成員。
- **AI 隊名生成**：整合 Google Gemini API，根據自訂主題生成創意隊名。

## 本地開發教學

### 1. 環境需求
- Node.js (推薦 v18+)
- npm 或 yarn

### 2. 安裝與執行
```bash
# 安裝相依套件
npm install

# 啟動開發伺服器
npm run dev
```

### 3. 設定 API Key (選填)
若要啟用 AI 隊名生成功能，請在根目錄建立 `.env` 檔案並加入您的 Gemini API Key：
```env
GEMINI_API_KEY=您的_API_KEY
```

## 部署與 CI/CD

專案已內建 **GitHub Actions** 自動化部署設定 (`.github/workflows/deploy.yml`)。

### 自動部署步驟：
1. 將專案推送至 GitHub 倉庫。
2. 在 GitHub Repository 的 **Settings > Secrets and variables > Actions** 中新增秘密值：
   - `GEMINI_API_KEY`: 您的 Gemini API 金鑰。
3. 推送至 `main` 分支時，系統會自動構建並部署至 **GitHub Pages**。

## 專案架構
- `src/components`: UI 元件
- `src/services`: 外部服務整合 (如 Gemini API)
- `src/utils`: 工具函數
- `src/types.ts`: TypeScript 型別定義
