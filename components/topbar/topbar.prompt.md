# 頂部導覽 Topbar

## 何時使用

- 每一個公開頁面的最上方。

## 何時不用

- 產品內頁的工具列。v0.1 不涵蓋產品介面。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-topbar` | 外框，固定在頂部，底部 1px Abyss 線 |
| `ww-topbar__inner` | 內層，搭配 `ww-container` |
| `ww-topbar__brand` | 包住 logo 的首頁連結 |
| `ww-topbar__nav` | 主要導覽，860px 以下隱藏 |
| `ww-topbar__link` | 導覽連結；目前頁面加 `aria-current="page"` |
| `ww-topbar__actions` | 右側動作區 |
| `ww-topbar__cta` | 加在主要按鈕上，860px 以下隱藏 |
| `ww-topbar__menu` | 加在選單按鈕上，860px 以下才出現，用 `data-ww-open` 開啟 Drawer |
| `ww-lang` | 語言切換，兩個連結；目前語言加 `aria-current="true"` |

## 無障礙

- 導覽包在 `<nav aria-label>` 裡。
- 選單按鈕要有 `aria-label` 與 `aria-expanded`。
- 語言連結加上 `lang` 屬性。

## 規則

- Topbar 最多一個主要按鈕。
- Logo 用 `ww-logo--sm`（28px，橫式的最小尺寸）。
