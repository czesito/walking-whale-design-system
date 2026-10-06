# Walking Whale Design System

走路鯨魚的設計系統，是 Walking Whale 所有數位輸出的唯一源頭：官網、數位服務與產品、簡報、文件。

> 狀態：v0.1 建置中。色彩、字體、logo、品牌語句、中英寫作規範、28 個元件與 7 個頁面模式已完成；SKILL.md 與發版進行中。

## 內容

| 位置 | 內容 |
|---|---|
| [`tokens/`](tokens/) | 唯一的 token 源頭：`tokens.json`（預設）、`lang-zh.json`（中文覆寫）、`contrast-pairs.json`（允許的色彩組合） |
| [`css/`](css/) | 手寫的基礎樣式、文字樣式、字體載入，只使用 token |
| [`dist/`](dist/) | 產生物，不要手改：`tokens.css`、`ww.css`（tokens、基礎樣式、所有元件與模式）、`tokens.ts`、`ww.js` |
| [`components/`](components/) | 元件：每個目錄有 `.css`、中英範例 `.html`、給 Claude 的 `.prompt.md`；順序見 `index.json` |
| [`patterns/`](patterns/) | 頁面模式：Hero、區塊開頭、服務、案例、團隊、CTA、聯絡 |
| [`js/`](js/) | 選用的小型互動：浮現動畫、Drawer、篩選、閱讀進度、通知。沒有它頁面也能正常使用 |
| [`assets/`](assets/) | Logo：直式與橫式 wordmark、骨架標誌、icon，各有 currentColor、Abyss、Pearl、Bone 版本；規格見 [foundations/logo.md](foundations/logo.md) |
| [`foundations/`](foundations/) | 色彩、字體、logo 等規格說明 |
| [`content/`](content/) | 品牌語句與命名、語氣、中英寫作規範、用字表 `glossary.csv` |
| [`tools/`](tools/) | 不在 CI 裡執行的產生工具，例如 logo |
| [`specimens/`](specimens/) | 中英並排的驗證頁：`index.html`（色彩與字體）、`components.html`（所有元件與模式） |
| [`decisions/`](decisions/README.md) | 決策紀錄 DR-001 起 |
| [`specs/`](specs/) | 範圍與功能規格 |

## 使用

在頁面上載入字體（見 [foundations/typography.md](foundations/typography.md#載入)）與 `dist/ww.css`，並在 `<html>` 標上語言：

```html
<html lang="zh-Hant">
<head>
  <!-- Google Fonts <link>，見 foundations/typography.md -->
  <link rel="stylesheet" href="dist/ww.css">
</head>
<body>
  …
  <script src="dist/ww.js"></script>  <!-- 選用 -->
</body>
```

頁面只用系統的 class 組成，不寫 CSS、不加 style 屬性、不用 hex 色（DR-016）。寫完後驗證：

```sh
node scripts/validate-output.mjs page.html
```

專案中安裝：

```sh
npm i github:czesito/walking-whale-design-system#v0.1.0
```

```css
@import "walking-whale-design-system/ww.css";
```

## 修改

1. 只改 `tokens/*.json`、`css/*.css`、`components/`、`patterns/` 或 `js/ww.js`。新增元件時同時更新 `index.json`。
2. 執行 `npm run build`，重新產生 `dist/`、`specimens/` 與 `foundations/color-contrast.md`。
3. 執行 `npm run check`。CI 會跑同一個檢查：
   - 色彩組合對比是否符合 WCAG 2.2 AA
   - 中文字級是否都在 13px 以上
   - `css/`、`components/`、`patterns/`、`specimens/src/` 裡有沒有寫死的 hex 色或不存在的 token
   - 元件與模式的範例是否通過輸出驗證器（DR-016）
   - 文案 lint：中英空格、全形標點、中文標題句號、用字表的避用詞
   - 產生物是否已更新
4. 推進 `main`（DR-003）。需要負責人判斷的設計決定，先提案、決定後再推送。

需要 Node 20 以上，沒有其他相依套件。

負責人：Czesio。

## 授權

- 程式碼、tokens 與文件：MIT，見 [LICENSE](LICENSE)
- Walking Whale／走路鯨魚的名稱、logo、wordmark 與 `assets/`：保留所有權利，見 [TRADEMARKS.md](TRADEMARKS.md)
- 字體：各自的 SIL Open Font License 1.1

## 貢獻規則

本 repo 為 public。客戶提供的材料、客戶專案文件、未公開的案例內容一律不得 commit，git 歷史視同公開。
