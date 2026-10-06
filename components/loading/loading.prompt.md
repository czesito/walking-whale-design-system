# 載入中 Loading

## 何時使用

- 等待時間無法預估的載入。
- 內容版面已知時，用 skeleton 先占位。

## 何時不用

- 可以計算進度的等待。請用耳塞年層加百分比。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-loading` | spinner 加文字，加 `role="status"` |
| `ww-spinner` | 旋轉圈 |
| `ww-skeleton` | 占位塊；`--title`、`--text`、`--short`、`--block` |

## 無障礙

- 一定要有文字「載入中」，不能只有 spinner。
- 載入中的區塊加 `aria-busy="true"`。
