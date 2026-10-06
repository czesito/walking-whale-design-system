# 表格 Table

## 何時使用

- 需要比較的結構化資料。

## 何時不用

- 排版。版面請用 `ww-grid` 或 `ww-split`。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-table-wrap` | 外層，窄螢幕可橫向捲動 |
| `ww-table` | 2px Abyss 頂線、細線分隔 |
| `ww-num` | 數字欄，靠右、等寬數字 |
| `caption` | 表格標題，等寬字 |

## 無障礙

- 欄標題用 `<th scope="col">`，列標題用 `<th scope="row">`。
- 每一張表都要有 `<caption>`。
