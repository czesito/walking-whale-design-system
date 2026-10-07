# 圖表 Chart

## 何時使用

- 數字之間的關係才是重點時：趨勢、比較、組成。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-slide--chart` | 版型 |
| `ww-chart` | `<svg role="img">`，第一個子元素是說明資料的 `<title>` |
| `ww-chart__bar` | 安靜的長條（chart-other）；`--accent` 是承載重點的 Abyss；`--1` 到 `--4` 是分類色 |
| `ww-chart__line` | 折線；`--accent`、`--1` 到 `--4`、`--dashed` |
| `ww-chart__dot` `--hollow` | 資料點 |
| `ww-chart__grid` `__axis` `__band` | 格線、軸、區間底色 |
| `ww-chart__label` `__value` `__note` | 刻度（不算預算）、數值、標註 |

## 規則

- 一張圖只用一個顏色承載重點，其他用 `ww-chart__bar`。分類色只在真的有多個並列的數列時用。
- 數值直接標在圖上；兩個以上有顏色的數列才加 `ww-legend`。
- 圖表放在淺色頁。
- 範例數字加 `ww-slide__flag`「範例資料」，真實數字寫 `ww-slide__source`。

## 可以發揮的地方

- 搭配可調數字，用 `data-ww-calc-attr="width"` 讓長條跟著拉桿變化。
