# 圖與引線標註 Figure and annotation

## 何時使用

- 有圖說的圖片、截圖、架構圖。
- 需要指出局部時，用 `ww-figure--annotated`（DR-015）。

## 何時不用

- 純裝飾的圖片，不需要圖說。
- 同一張圖超過 5 個標註。請拆成兩張。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-figure` | 加在 `<figure>` 上 |
| `ww-figure__media` | 圖片外框，Sediment 底；`--plain` 改為白底 |
| `ww-figure__caption` | 圖說，用 `<figcaption>` |
| `ww-figure__no` | 圖號，例如 `Fig. 01` |
| `ww-figure--annotated` | 引線標註的圖 |
| `ww-annot` | 標註用的 SVG，viewBox 寬度固定為 1200 |
| `ww-annot__item` | 一個標註；標籤在左側時加 `ww-annot__item--end` |
| `ww-annot__line` | 引線：斜線加水平托線，一個 path |
| `ww-annot__dot` | 標記點，r=6 |
| `ww-annot__title` | 標題，放在托線上方約 12 單位 |
| `ww-annot__sub` | 說明，放在托線下方約 30 單位 |
| `ww-annot__marker` | 窄寬度時的編號：一個 circle（r=34）加一個 text |
| `ww-annot__legend` | 窄寬度時的編號清單，`<ol>`，每項 `<strong>` 加 `<span>` |

## 無障礙

- SVG 加 `role="img"`，並用 `<title>` 與 `<desc>` 描述圖的內容。
- 圖寬小於 640px 時，引線與標籤自動收起，改顯示編號與清單。標籤是 SVG 文字，會隨圖縮放，這個寬度以下會小於 13px。

## 規則

- 位置全部用 SVG 座標表達，不使用 style 屬性（DR-016）。
- 托線長度要蓋過說明文字：中文約每字 25 單位，英文約每字 14 單位。
