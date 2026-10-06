# 標籤 Chip

## 何時使用

- 分類、產業、技術等短標籤。
- 篩選條件：用 `<button>` 加 `aria-pressed`。

## 何時不用

- 狀態（上線、暫停），請用 Status badge。
- 超過五個字的內容。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-chip` | 等寬字、膠囊形 |
| `aria-pressed="true"` | 按鈕型 chip 的選取狀態，Abyss 底 |
| `ww-chip__count` | 數量 |
| `data-ww-toggle` | 點擊時切換 aria-pressed（需要 js/ww.js） |
| `data-ww-single` | 加在外層，同一組只能選一個 |

## 最小範例

```html
<span class="ww-chip">運動</span>
```
