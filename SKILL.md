---
name: walking-whale-design-system
description: Walking Whale design system. Use for any Walking Whale output — web pages, artifacts, 3:2 slide decks, documents, product UI, copy in zh-TW or English. Covers tokens, 30 components, 8 page patterns, 16 slide layouts with a deck runtime, the growth-layer signature element, logo use, voice and writing rules, and a validator for generated HTML. 走路鯨魚設計系統
---

# Walking Whale Design System

走路鯨魚所有數位輸出的唯一源頭。中文與英文同等重要。

做任何 Walking Whale 的輸出之前先讀這份檔案。規則的出處標在括號裡，例如（DR-014）指 [decisions/DR-014](decisions/DR-014-signature-element.md)。

## 讀取順序

依任務只讀需要的部分，不要整個 repo 讀進來。

| 任務 | 讀這些 |
|---|---|
| 做簡報 | 本檔「做簡報」→ [slides/index.json](slides/index.json) → [slides/deck/deck.prompt.md](slides/deck/deck.prompt.md) → 用到的版型 `*.prompt.md` → 範例 `dist/deck-zh.html` 或 `dist/deck-en.html` |
| 做頁面或 artifact | 本檔 → [components/index.json](components/index.json) 與 [patterns/index.json](patterns/index.json)（`use` 欄說明何時用）→ 用到的元件 `*.prompt.md` → 需要時看同目錄的 `*.html` 範例 |
| 寫文案 | [content/brand.md](content/brand.md) → [content/voice.md](content/voice.md) → [content/zh-tw.md](content/zh-tw.md) 或 [content/en.md](content/en.md) → [content/glossary.csv](content/glossary.csv) |
| 放 logo | [foundations/logo.md](foundations/logo.md) |
| 選顏色或字體 | [foundations/color.md](foundations/color.md)、[foundations/typography.md](foundations/typography.md)。只能用 token，不能自己調色 |
| 改系統本身 | [README.md](README.md) 的「修改」與 [decisions/](decisions/README.md) |

## 做頁面

### 骨架

```html
<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>頁面標題 · 走路鯨魚</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap">
<link rel="stylesheet" href="dist/ww.css">
</head>
<body>
<a class="ww-skip-link" href="#main">跳到主要內容</a>
<!-- components/topbar -->
<main id="main">
  <div class="ww-container"><!-- patterns/hero：直接放在容器裡，不包 ww-section --></div>
  <section class="ww-section" id="services"><div class="ww-container"><!-- 每個區塊：section-opener 加內容 --></div></section>
</main>
<!-- components/footer -->
<script src="dist/ww.js"></script>
</body>
</html>
```

字體也可以改成連結 `css/fonts.css`，內容相同。英文頁把 `lang` 改成 `en`。同一頁混用兩種語言時，在換語言的元素上設定 `lang`，字體、行高、字距會自動切換（DR-006）。

### 在 claude.ai artifact 裡

Artifact 無法連到 repo 的檔案：

- 把 `dist/ww.css` 原封不動放進 `<style data-ww-system>`，一個字都不改。
- 需要互動時，把 `dist/ww.js` 放進頁尾的 `<script>`。
- Logo 用 currentColor 版本的 SVG 直接寫進頁面，加上 `class="ww-logo ww-logo--sm"`、`role="img"` 與 `aria-label`。顏色跟著文字色走，Abyss 底上自動變成 Pearl。

### 組頁面的方式

1. 先選頁面模式（patterns/），再用元件（components/）填內容，最後用版面 class（`ww-container`、`ww-section`、`ww-stack`、`ww-grid`、`ww-split`、`ww-cluster`）排列。
2. 只用系統的 class。不寫 CSS、不加 `style` 屬性、不用 hex 色（DR-016）。系統缺少需要的樣式時，停下來說明缺什麼，回到本 repo 新增，而不是在輸出裡自己寫。
3. 寫完執行驗證，兩個都要通過。驗證器同時檢查元件契約：alt、label、年層旁的文字、每個區塊一個 primary、數據的來源、中文標題 20 字以內等（DR-017）。

```sh
node scripts/validate-output.mjs page.html
node scripts/copy-lint.mjs page.html
```

## 做簡報

簡報是固定 1500 × 1000（3:2）的舞台，頁面不捲動，放不下就是錯（DR-019）。

1. 先確定用途：現場講（`data-ww-use="talk"`）還是寄出去讀（`data-ww-use="send"`）。這決定文字預算：talk 每頁內文中文 120 字、英文 60 words，send 加倍。目標寫預算的一半。
2. 先寫標題串：每頁一句完整的主張。只讀標題，故事要通。十頁以上的簡報先給 Czesio 確認標題串。
3. 每頁選一個證據：畫面、流程、圖表、照片、表格、數字。細節放 `<aside class="ww-slide__notes">`，閱讀模式與附講稿的 PDF 會顯示。
4. 從 `dist/deck-zh.html` 或 `dist/deck-en.html` 複製（樣式、程式與標誌都已內嵌），只換 `slides:start` 與 `slides:end` 之間的頁面。
5. 版型是起點，不是規定。能讓內容更好懂、更好看時，用系統的 class 自己組頁面；HTML 簡報可以用逐步揭示、情境切換、可調數字，主動提出。
6. 驗證：`node scripts/validate-output.mjs deck.html` 檢查 class、預算、標題長度、清單大小；再打開簡報按 R 進閱讀模式，確認沒有任何一頁出現紅色虛線框（溢出）。

## 不能違反的規則

### 視覺

- 視覺語言是 B1 標本卡：1px 細線、2px 圓角、可引用的單位加 2px Abyss 頂邊、編號與中繼資料用等寬字（DR-013）。卡片不用陰影。
- 招牌元素是**耳塞年層**（`ww-layers`），只在承載資訊時出現：讀者正在進行的步驟（最多 7 步）、頁碼、閱讀進度、時間軸。不可以當裝飾，狀態一定同時寫成文字（DR-014）。介紹一個固定流程（例如合作的三個階段）不算進度，用 `steps` 模式。
- 標題下方用 38×4 的 Bone 短線 `ww-rule`，它不是招牌元素（DR-014）。
- 一個畫面最多一個 `ww-btn--primary`，第一個畫面的 primary 屬於 Hero，所以 topbar 的按鈕用 secondary。`ww-btn--signal` 一頁最多一次。
- 引線標註用 L2 斜引線加托線，寫成一個 viewBox 寬 1200 的 SVG（DR-015）。
- Logo 不重排、不拉伸、不改色、不加效果。淺色底用 `-abyss`，Abyss 底用 `-pearl`（foundations/logo.md）。
- 中文強調用字重加 Tidal 色，絕不用斜體（DR-007）。`<em>` 與 `ww-em` 會自動處理。

### 文字

- 品牌語句一字不改：主張「先與人同行，再著手系統」、定位、tagline「理性為骨，人性為聲，生命為動」、工作原則「精準為先，溫度隨後」。中英不逐字對譯（content/brand.md）。
- 中文：稱讀者為「您」、用「台」不用「臺」、中英文與數字之間加半形空格、全形標點、標題不加句號、引號用「」（content/zh-tw.md）。
- 英文：Chicago 加上 content/en.md 的例外、美式拼字、標題句首大寫（DR-009）。
- 不用驚嘆號、不用 emoji、不誇大、不製造急迫感（content/voice.md）。
- 不捏造事實：數字要有來源，案例要已公開，承諾（例如回覆時間）要已確認。示意內容標成「範例」。
- 官方聯絡信箱是 agiblida@gmail.com，不要用其他地址。行動按鈕連到同一頁的聯絡區（`#contact`），沒有聯絡區時用 `mailto:`。
- 服務內容以 [content/services.md](content/services.md) 為準。

### 無障礙

- WCAG 2.2 AA：只使用 [tokens/contrast-pairs.json](tokens/contrast-pairs.json) 列出的色彩組合（DR-011）。
- 中文字級不小於 13px。
- 每張圖有 `alt`，純裝飾的圖 `alt=""`；圖示按鈕有 `aria-label`；表單欄位有看得見的 label。

### 公開 repo

本 repo 是 public。客戶提供的材料、客戶專案文件、未公開的案例內容不得放進來，git 歷史視同公開（DR-003）。

## 元件一覽

詳細用法在各目錄的 `*.prompt.md`。

| 類別 | 元件 |
|---|---|
| 版面與文字 | `layout`（含清單）、`type`（文字角色） |
| 品牌 | `logo`、`kicker`、`rule-accent`、`layers`（耳塞年層） |
| 動作 | `button`（含文字連結與圖示） |
| 內容 | `card`、`chip`、`status-badge`、`pull-quote`、`callout`、`tldr`、`stat`、`table`、`code`、`figure`（含引線標註） |
| 文章 | `prose`、`toc`、`article-list`、`filter` |
| 表單 | `form`（input、textarea、select、checkbox、radio、switch、驗證狀態） |
| 狀態 | `loading`、`empty`、`error`、`toast` |
| 頁框 | `topbar`、`drawer`、`footer` |
| 頁面模式 | `hero`、`section-opener`、`services`、`steps`、`case-list`、`team`、`cta`、`contact` |
| 簡報（slides/） | `deck`（引擎）、`cover`、`agenda`、`section`、`statement`、`evidence`、`side`、`stats`、`grid`、`compare`、`flow`、`screen`、`chart`、`quote`、`image`、`next`、`end`、`interact` |

所有元件與模式的中英渲染：`specimens/components.html`。範例簡報：`dist/deck-zh.html`、`dist/deck-en.html`。

## 還沒有的東西

目前不涵蓋：深色模式、文件模板、產品介面元件（資料表格、儀表板）、Modal、AI agent 的對話語氣。簡報裡的 SVG 圖表見 slides/chart，網頁上還沒有圖表元件。遇到這些需求時，說明系統尚未涵蓋，用最接近的元件做，並列出缺口。範圍見 [specs/2026-10-07-v0.1-scope-spec.md](specs/2026-10-07-v0.1-scope-spec.md)。
