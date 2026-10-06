# DR-004 元件形式

- 狀態：已採納
- 日期：2026-10-07
- 決策者：Czesio

## 背景

Claude 產生的頁面與簡報都是純 HTML，官網與產品則是 React。Claude Design 匯出包裡的元件是 React（`.jsx`、`.d.ts`、`.prompt.md`），而官網實際上用了 510 處 inline style，沒有引用那套元件。

## 決策

v0.1 的元件以 CSS class 加 HTML 範例交付，不綁定框架。

每個元件包含：

- `components/<name>/<name>.css`：只用 token，不寫死顏色與字級
- `components/<name>/<name>.html`：中英範例，涵蓋各種變體與狀態
- `components/<name>/<name>.prompt.md`：何時使用、何時不用、可用的 class 與屬性

React 包裝留到產品實際需要時再做，屆時以這份 CSS 為基礎。

## 理由

- Claude 不需要任何建置步驟就能直接使用。
- React 包裝很薄，之後補上的成本低；反過來從 React 抽出純 CSS 則困難。

## 影響

- Claude Design 匯出包的 React 元件在 v0.1 不沿用，只作為視覺參考。
- 官網改版時，要把 inline style 換成這套 class。
