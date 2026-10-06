# 文章排版 Article typography

## 何時使用

- 文章、案例、說明文件的正文。

## 何時不用

- 介面文字與短句。請用 `ww-ui` 或 `ww-sm`。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-prose` | 正文外框（定義於 type.css）。內部的 h2 到 h4、清單、引用、分隔線、連結自動套用樣式 |
| `ww-article-head` | 文章開頭：kicker、h1、meta、短線 |
| `ww-meta` | 等寬字的中繼資料列；每個項目用 `<span>`，分隔點由 CSS 產生 |

## 規則

- 文章標題用 `<h1>`，內文段落標題從 `<h2>` 開始。
- 中文強調用 `<em>`，會顯示為粗體與 Tidal 色，不會變成斜體（DR-007）。
