# 流程與圖解 Flow and diagram

## 何時使用

- 由左到右的流程，三到六步。
- 有分支、回圈或層級的圖，用 SVG 圖解元件 `ww-dia` 自己畫。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-slide--flow` | 版型 |
| `ww-flow` | `<ol>`，節點之間自動加箭頭，最多 6 個 |
| `ww-flow__node` | 人做的步驟：實線 |
| `ww-flow__node--machine` | 機器做的步驟：虛線 |
| `ww-flow__node--end` | 成果：實心 Abyss |
| `ww-flow__no` `__name` `__note` | 編號、名稱、一句說明 |
| `ww-legend` `__item` `__key` | 圖例；`__key--machine`、`--end`、`--line`、`--dashed`、`--1` 到 `--4` |
| `ww-dia` | SVG 圖解：`__box`（`--machine`、`--end`、`--soft`）、`__line`（`--dashed`、`--soft`）、`__band`、`__head`、`__text`、`__sub`、`__no` |

## 規則

- 有虛線節點時一定加圖例，三種線的意思在所有簡報裡都一樣。
- SVG 的座標寫在屬性，顏色只用 class。

## 可以發揮的地方

- 節點加 `data-ww-step`，邊講邊長出流程。
