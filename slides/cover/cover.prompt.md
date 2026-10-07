# 封面 Cover

## 何時使用

- 第一頁。品牌語句、提案名稱或演講題目。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-slide--cover` | 版型 |
| `ww-cover__brand` | 左上的 wordmark：`<svg viewBox="…"><use href="#ww-deck-wordmark"></use></svg>` |
| `ww-slide__display` | 大標，用 `<h1>`，中文不超過 20 字 |
| `ww-cover__meta` | 底部的 `<dl>`：對象、日期、版本 |

## 規則

- 加 `data-ww-chrome="off"`，封面不需要頁碼。
- 中文 wordmark 的 viewBox 是 `0 0 2227.91 401.78`，英文是 `0 0 3387.19 401.78`；省略時由執行時補上。

## 可以發揮的地方

- 底色可以換成 `ww-on-dark`；大標可以是一個問題，而不是公司名。
