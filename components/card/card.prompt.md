# 卡片 Card

## 何時使用

- 可以被引用的單位：一項服務、一篇文章、一個功能。
- 放在 `ww-grid` 裡排成一列。

## 何時不用

- 單純想加框線時。請用 `ww-section--wash` 或 `ww-divider`。
- 卡片裡再放卡片。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-card` | 白底、細線、2px 圓角、2px Abyss 頂邊（DR-013） |
| `ww-card--wash` | Mist 底 |
| `ww-card--plain` | 沒有 Abyss 頂邊 |
| `ww-card__no` | 編號，等寬字 |
| `ww-card__title` | 標題，用 `<h3>` |
| `ww-card__body` | 內文 |
| `ww-card__meta` | 底部的中繼資料，等寬字，上方細線 |
| `ww-card__media` | 頂部的滿版圖片 |
| `ww-card__link` | 加在標題的 `<a>` 上，整張卡片都可以點 |

## 無障礙

- 整張卡片可點時，只有標題是連結，螢幕閱讀器只會讀到一次。

## 最小範例

```html
<article class="ww-card">
  <p class="ww-card__no">01</p>
  <h3 class="ww-card__title">營運與內部系統</h3>
  <p class="ww-card__body">預約、會員、排班與薪資結算。</p>
  <p class="ww-card__meta">營運 · 內部系統</p>
</article>
```
