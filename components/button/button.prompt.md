# 按鈕與連結 Button and link

## 何時使用

- `ww-btn--primary`：一個畫面裡最主要的動作，最多一個。Topbar 的按鈕不用 primary
- `ww-btn--secondary`：次要動作。
- `ww-btn--ghost`：低強調的動作、工具列與圖示按鈕。
- `ww-btn--signal`：Biolum 的強調動作，一頁最多一次。
- `ww-link`：內文中的連結；`ww-link--arrow`：區塊結尾的「閱讀更多」。

## 何時不用

- 導覽到別頁時用 `<a>`，在頁面內執行動作時用 `<button>`，不要互換。
- 不要用按鈕包住整張卡片，請用 `ww-card__link`。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-btn` | 基本樣式，最小高度 44px |
| `ww-btn--primary / --secondary / --ghost / --signal` | 四種強調程度 |
| `ww-btn--sm / --lg` | 36px／52px 高 |
| `ww-btn--block` | 滿版寬度 |
| `ww-btn--icon` | 只有圖示的正方形按鈕，必須加 `aria-label` |
| `ww-icon` | Lucide 圖示的 inline SVG |
| `ww-icon--arrow` | 箭頭，hover 時往右移 2px |
| `ww-link` | 內文連結 |
| `ww-link--quiet` | 繼承文字顏色 |
| `ww-link--arrow` | 帶箭頭的連結 |

## 無障礙

- 停用時用 `disabled`（button）或 `aria-disabled="true"`（a）。
- 按鈕文字是動作，例如「開始對話」，不寫「點這裡」。

## 規則

- Abyss 底上，primary 自動換成 Pearl 底。
- 圖示用 Lucide 的路徑，`viewBox="0 0 24 24"`，不加 fill 與 stroke 屬性，顏色由 class 控制。

## 最小範例

```html
<a class="ww-btn ww-btn--primary" href="#contact">開始對話<svg class="ww-icon ww-icon--arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
```
