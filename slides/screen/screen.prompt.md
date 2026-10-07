# 畫面導覽 Screen tour

## 何時使用

- 介紹產品畫面：哪裡是什麼、為什麼這樣設計。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-slide--screen` | 版型 |
| `ww-tour` | 兩欄：畫面與說明 |
| `ww-device` `__bar` `__view` | 標本卡外框、網址列式的標籤、畫面；`__view--16x9`、`--4x3`、`--phone` 改比例（預設 16:10） |
| `ww-device--phone` | 手機外框 |
| `ww-device__ui` | 在畫面裡用 HTML 重建介面時的容器 |
| `ww-tour__overlay` | 疊在畫面上的 SVG，viewBox 與畫面同比例（16:10 用 `0 0 800 500`），`preserveAspectRatio="none"` |
| `ww-tour__spot` `__ring` `__pin` `__pin-no` | 一個標註：框、圓點、編號 |
| `ww-tour__list` `__item` `__no` | 說明列表，`<strong>` 是名稱 |

## 規則

- 一個畫面最多 5 個標註。
- 截圖要拿掉真實的個資；重建的畫面一律用範例資料，`ww-device__bar` 寫「範例」。
- 重建畫面裡的字不算預算，但仍要清楚可讀。

## 可以發揮的地方

- 標註與說明用同一個 `data-ww-step`，列表加 `ww-build--focus`，一次講一個位置。
- 用 SVG 或 HTML 重建畫面，而不是截圖：字永遠清楚，也能隨時改。
