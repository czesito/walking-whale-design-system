# Walking Whale Design System

走路鯨魚的設計系統，是 Walking Whale 所有數位輸出的唯一源頭：官網、數位服務與產品、簡報、文件。

> 狀態：v0.1 建置中。色彩與字體已完成，元件與頁面模式進行中。

## 內容

| 位置 | 內容 |
|---|---|
| [`tokens/`](tokens/) | 唯一的 token 源頭：`tokens.json`（預設）、`lang-zh.json`（中文覆寫）、`contrast-pairs.json`（允許的色彩組合） |
| [`css/`](css/) | 手寫的基礎樣式、文字樣式、字體載入，只使用 token |
| [`dist/`](dist/) | 產生物，不要手改：`tokens.css`、`ww.css`、`tokens.ts` |
| [`foundations/`](foundations/) | 色彩、字體等規格說明 |
| [`specimens/`](specimens/) | 中英並排的驗證頁，直接用瀏覽器開啟 `specimens/index.html` |
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
```

專案中安裝：

```sh
npm i github:czesito/walking-whale-design-system#v0.1.0
```

```css
@import "walking-whale-design-system/ww.css";
```

## 修改

1. 只改 `tokens/*.json` 或 `css/*.css`。
2. 執行 `npm run build`，重新產生 `dist/`、`specimens/index.html` 與 `foundations/color-contrast.md`。
3. 執行 `npm run check`。CI 會跑同一個檢查：
   - 色彩組合對比是否符合 WCAG 2.2 AA
   - 中文字級是否都在 13px 以上
   - `css/` 與 `specimens/src/` 裡有沒有寫死的 hex 色或不存在的 token
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
