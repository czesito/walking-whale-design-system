# 錯誤 Error state

## 何時使用

- 載入失敗、送出失敗、找不到頁面。

## 何時不用

- 欄位驗證錯誤。請用 `ww-field__error`。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-error` | Rust 頂邊，加 `role="alert"` |
| `ww-error__code` | 錯誤代碼，等寬字 |
| `ww-error__title` | 發生了什麼 |
| `ww-error__body` | 讀者可以怎麼做 |

## 規則

- 不要怪讀者，也不要用驚嘆號。說明發生什麼、怎麼處理，並附上代碼方便回報。
