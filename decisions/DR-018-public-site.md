# DR-018 公開的設計系統網站

- 狀態：已採納
- 日期：2026-10-07
- 決策者：Czesio

## 背景

repo 已經是 public。元件、規範與決策紀錄本身就能展示我們的做事方式，但目前只能在 GitHub 上讀原始檔。

## 決策

1. 用 GitHub Pages 發布設計系統網站，網址先用 `czesito.github.io/walking-whale-design-system`。
2. 每次推送到 `main`，CI 通過後自動部署（`.github/workflows/pages.yml`）。
3. 網站內容：首頁（中英各一頁）、元件與頁面模式、色彩與字體。規範與決策紀錄連回 GitHub 閱讀。
4. 首頁本身用系統元件組成，並通過輸出驗證器與文案 lint。

## 理由

- 零成本，沒有另外要維護的伺服器。
- 首頁用系統本身組成，等於持續的驗收測試。

## 影響

- `site/` 放首頁原始檔，`scripts/site.mjs` 組出 `_site/`（不進版本控制）。
- 之後要換成自己的網域時，只需要加一筆 CNAME 與 Pages 設定。

## 不採用的選項

- **立刻使用 design.walking-whales.com**：需要先處理 DNS，可以之後再換。
- **不公開網站**：失去展示價值。
