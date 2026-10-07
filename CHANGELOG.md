# 變更紀錄

格式依 [Keep a Changelog](https://keepachangelog.com/)，版本依 [Semantic Versioning](https://semver.org/)。

## v0.2.0（未發布）

3:2 簡報系統，所有設計決定見 [DR-019](decisions/DR-019-slides.md)。

### 簡報

- 固定 1500 × 1000 的舞台，依視窗縮放；頁面不捲動，放不下時在頁面畫出紅色虛線框。
- 依用途分兩種密度：`data-ww-use="talk"`（現場講）與 `"send"`（寄出去讀）。
- 16 種版型：封面、議程、章節開頭、一句話、主張與證據、左主張右證據、大數字、卡片格、對照、流程與圖解、畫面導覽、圖表、引言、滿版圖片、下一步、結尾。
- 頁內互動：逐步揭示（可讓前面的項目退成次要色）、情境切換、可調數字。
- 總覽、閱讀模式（每頁加講稿，手機直式自動進入）、全螢幕、黑畫面、深連結。
- 頁碼用耳塞年層，每頁一層。
- 列印成 3:2 PDF，所有逐步揭示都顯示；在閱讀模式列印就是附講稿的 PDF。
- 中英範例簡報 `dist/deck-zh.html`、`dist/deck-en.html`，樣式、程式與標誌都已內嵌，可以直接複製。

### 給 Claude

- 驗證器檢查簡報契約：用途宣告、一頁一個主張、標題長度、文字預算（talk 中文 120 字、英文 60 words，send 加倍）、清單、卡片格、流程與表格的大小、可調數字的假設、圖表的標題。
- `SKILL.md` 加上「做簡報」。

### 公開網站

- 導覽加上範例簡報。

## v0.1.0（2026-10-07）

第一個版本。範圍見 [v0.1 規格](specs/2026-10-07-v0.1-scope-spec.md)，所有設計決定見 [decisions/](decisions/README.md) 的 DR-001 至 DR-018。

### 品牌與內容

- 品牌語句中英定稿：主張、定位、業務說明、tagline、工作原則（DR-002）。
- 語氣、zh-TW 寫作規範、英文寫作規範（Chicago 加例外、美式拼字）、用字表。
- 服務內容依問題分成三組：對外的門面、對內的系統、看不見的資料層（`content/services.md`）。
- 官方網域 walking-whales.com 與聯絡信箱（DR-012、`content/brand.md`）。

### 視覺

- 色彩 token 與 71 組通過 WCAG 2.2 AA 的色彩組合（DR-011）。
- 中英字體：Cormorant Garamond、Source Serif 4、Inter、IBM Plex Mono、思源宋體、思源黑體；中文語境的字級、行高、字距自動切換（DR-005、DR-006、DR-007）。
- Wordmark 向量重建：直式、中英橫式，各四個色版（DR-010）。
- 元件視覺語言 B1 標本卡；圓角改為 2px 為主（DR-013）。
- 招牌元素「耳塞年層」，只在承載資訊時出現（DR-014）。
- 引線標註：斜引線加托線，640px 以下改為編號（DR-015）。
- 間距、圓角與陰影、動態、無障礙的 foundations 文件。

### 元件與模式

- 30 個元件：版面、文字樣式、標誌、區塊標籤、標題短線、動態、耳塞年層、按鈕與連結、卡片、標籤、狀態標記、引言、提示框、重點摘要、數據、表格、程式碼、圖與引線標註、文章排版、目錄、文章列表、標籤篩選、表單、載入中、空狀態、錯誤、通知、頂部導覽、行動版選單、頁尾。
- 8 個頁面模式：主視覺、區塊開頭、服務卡片區、流程步驟、案例列表、團隊、行動呼籲、聯絡。
- 每個都有 CSS、中英範例與 `.prompt.md`；`specimens/components.html` 中英並排渲染全部。
- `js/ww.js`：選用的入場動態、Drawer、篩選、閱讀進度、通知。

### 給 Claude

- `SKILL.md`：讀取順序與不能違反的規則。
- 輸出驗證器：只能用系統的 class，不能有 style 與 hex 色（DR-016），並檢查元件契約（DR-017）。
- 文案 lint：中英空格、全形標點、刪節號與破折號、標題句號、驚嘆號與 emoji、用字表。

### 發布管道

- claude.ai 的 Design System artifact，由 `tools/claude-artifact/` 從 repo 產生。

### 公開網站

- GitHub Pages 網站：中英首頁、元件、色彩與字體（DR-018）。

### 已知事項

- 驗收情境 2（Safari、iOS、Edge 實機截圖）尚未執行。
- GitHub Pages 需要在 repo 設定中把來源設為 GitHub Actions 後才會部署。
- `v0.1.0` tag 已在本機建立，推送被 session 的網路政策擋下，需要從本機推送或在 GitHub 建立 release。
- Design System artifact 需要在 claude.ai 設為預設。
- secret scanning 與 push protection 需要在 GitHub 設定頁確認。
- 舊的 walking-whale-html、walking-whale-slides skill 暫時不動。
- 尚未涵蓋：深色模式、簡報與文件模板、產品介面元件、Modal、AI agent 對話語氣（簡報已在 v0.2.0 加入）。
