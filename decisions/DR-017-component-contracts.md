# DR-017 元件契約

- 狀態：已採納
- 日期：2026-10-07
- 決策者：Czesio

## 背景

DR-016 的驗證器只檢查 class、style 屬性與 hex 色。驗收測試發現，頁面可以通過這三項檢查，卻仍然違反品牌與無障礙規則，例如沒有文字的年層、同一區塊兩個主要按鈕。這些規則原本只寫在文件裡。

## 決策

驗證器加上「元件契約」，把以下規則改成機器檢查（`scripts/contracts.mjs`）：

| 類別 | 規則 |
|---|---|
| 無障礙 | `<html>` 有 `lang`；`<img>` 有 `alt`；圖示按鈕有 `aria-label`；裝飾圖示有 `aria-hidden`；表單控制項有 label；`ww-table` 有 `<caption>`；引線標註的 SVG 有 `role="img"` 與 `<title>` |
| 耳塞年層 | `aria-hidden="true"`；放在 `ww-index` 裡並有文字數字；不在 Hero 裡；最多 24 層；只有一層 `is-current`（DR-014） |
| 按鈕 | 每個區塊最多一個 primary、一個 signal；topbar 不用 primary |
| 誠實 | `ww-stat` 要有來源；`ww-pullquote` 要有出處 |
| 動態 | 錯誤、警示、通知與 `role="alert"` 不加入場動態 |
| 品牌 | kicker 編號寫成 `No. 01`；logo 的 `<img>` 不用 currentColor 檔；引線標註最多 5 個；中文標題不超過 20 字；一頁一個 `ww-hero` |

元件與模式的範例都要通過，CI 會檢查。

## 理由

- 寫在文件裡的規則會被忽略，能檢查的規則才會被遵守。
- 這些規則都是結構性的，不需要判斷語意，誤判的機率低。

## 影響

- 驗證器從單純的樣式檢查，變成 Claude 每次產出後的自我審查。
- 新增元件時，有結構性規則的，同時在 `scripts/contracts.mjs` 加上檢查。

## 不採用的選項

- **只檢查無障礙**：品牌規則一樣容易被忽略。
- **維持現狀**：驗收測試已證明不足。
