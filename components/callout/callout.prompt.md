# 提示框 Callout

## 何時使用

- `ww-callout`：補充說明。
- `ww-callout--warn`：需要讀者注意的條件。
- `ww-callout--danger`：無法復原的後果。

## 何時不用

- 一般強調，請用文字本身。
- 連續放兩個以上的 callout。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-callout` | info，Tidal 頂邊 |
| `ww-callout--warn` | 警示，Clay 頂邊 |
| `ww-callout--danger` | 危險，Rust 頂邊 |
| `ww-callout__label` | 標籤，等寬字，可加圖示 |
| `ww-callout__body` | 內文 |

## 無障礙

- `--danger` 若是即時出現的訊息，加 `role="alert"`。
- 標籤一定要有文字，不只靠顏色。
