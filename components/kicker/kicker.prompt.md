# 區塊標籤 Kicker

## 何時使用

- 區塊標題上方的短標籤。
- 需要編號時加 `ww-kicker__no`。

## 何時不用

- 不要拿來當標題本身，也不要整段文字都用 kicker。
- 編號沒有意義（例如只有一個區塊）時不要加。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-kicker` | 標籤本體（定義於 type.css）。英文為等寬大寫，中文為 UI 字體、13px、不轉大小寫 |
| `ww-kicker__no` | B1 的編號，例如 `No. 01`（DR-013） |
| `ww-on-dark` | Abyss 底上，標籤自動換成 Bone 色 |

## 規則

- 英文 kicker 以句首大寫撰寫，大寫由 CSS 轉換（content/en.md）。

## 最小範例

```html
<p class="ww-kicker"><span class="ww-kicker__no">No. 01</span>我們做什麼</p>
```
