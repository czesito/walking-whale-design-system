# 狀態標記 Status badge

## 何時使用

- 專案、功能、文件的狀態。

## 何時不用

- 分類標籤，請用 Chip。
- 只用顏色表達狀態。標記一定要有文字。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-badge` | 圓點加文字 |
| `ww-badge--success / --info / --warning / --danger / --neutral` | 五種狀態 |

## 規則

- 每一種狀態的文字顏色在其底色上都達到 4.5:1（tokens/contrast-pairs.json）。

## 最小範例

```html
<span class="ww-badge ww-badge--success">已上線</span>
```
