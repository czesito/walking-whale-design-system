# 版面 Layout

## 何時使用

- 組任何頁面時，先用這些 class 排版，再放元件。
- 需要欄位、間距、對齊時。

## 何時不用

- 不要為了排版自己寫 CSS 或 style 屬性（DR-016）。缺少的版面需求，回到本 repo 新增。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-container` | 置中容器，最寬 1180px，左右留白隨視窗縮放 |
| `ww-container--narrow` | 最寬 940px，適合文章 |
| `ww-section` | 區塊上下留白；`--lg` 加大；`--wash`、`--warm` 換底色 |
| `ww-on-dark` | Abyss 底的區塊，文字自動換成淺色（定義於 type.css） |
| `ww-stack` | 垂直排列；`--xs`、`--sm`、`--lg`、`--xl` 調整間距 |
| `ww-cluster` | 水平排列並自動換行；`--sm`、`--lg`、`--between`、`--end` |
| `ww-grid` | 自動欄數；`--2`、`--3`、`--4` 固定欄數，窄螢幕自動減欄 |
| `ww-split` | 兩欄；`--start` 左寬右窄、`--aside` 側欄加內容、`--center` 垂直置中；860px 以下改為一欄 |
| `ww-measure` | 限制行長為 68ch |
| `ww-divider` | 1px 細線；`--strong` 改為 Abyss |
| `ww-visually-hidden` | 視覺上隱藏，螢幕閱讀器仍會讀到 |
| `ww-skip-link` | 「跳到主要內容」連結，聚焦時才出現 |

## 無障礙

- 每一頁都要有 `<main>`，第一個可聚焦元素放 `ww-skip-link`。
- 語言切換的區塊要設定 `lang`，token 會跟著切換（DR-006）。

## 最小範例

```html
<main id="main" class="ww-container ww-section ww-stack ww-stack--lg">
  <div class="ww-grid ww-grid--3">…</div>
</main>
```
