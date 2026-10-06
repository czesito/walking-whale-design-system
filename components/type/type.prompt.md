# 文字樣式 Type

## 何時使用

- 每一段文字都先決定它的角色，再選 class。

## 何時不用

- 自己調字級、行高或字距。所有數值都由 token 決定，中文會自動切換（DR-005、DR-006）。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-hero` | 最大的標題，用於 Hero，一頁一次 |
| `ww-em` | 標題中要強調的詞。英文為斜體，中文為粗體加 Tidal 色（DR-007） |
| `ww-lede` | 標題下方的導言，一到兩句，Slate 色 |
| `ww-body` | 一般內文 |
| `ww-prose` | 文章正文的外框，見 prose 元件 |
| `ww-ui` | 介面文字：按鈕旁的說明、表格 |
| `ww-sm` | 說明與中繼資料，13px，Slate 色 |
| `ww-kicker` | 區塊標籤，見 kicker 元件 |
| `ww-label` | 表單與表格的標籤 |
| `ww-mono` | 等寬字：編號、日期、代碼 |
| `ww-on-dark` | Abyss 底的區塊，裡面的標題、內文、導言、kicker 自動換成淺色 |

## 規則

- `h1` 到 `h4` 不加 class 也有預設樣式。
- 這些 class 的 CSS 在 css/type.css，不在本目錄。
