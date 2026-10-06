# 表單 Form controls

## 何時使用

- 聯絡、需求問卷、報名。

## 何時不用

- 用 placeholder 取代 label。每一個欄位都要有看得見的 label。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-form` | 表單外框，最寬 36rem |
| `ww-field` | 一個欄位：label、控制項、說明或錯誤 |
| `ww-field__label` | 標籤 |
| `ww-field__optional` | 標示「選填」。預設欄位都是必填，只標示選填的 |
| `ww-field__hint` | 說明文字，用 `aria-describedby` 連結 |
| `ww-field__error` | 錯誤訊息，用 `aria-describedby` 連結 |
| `ww-input / ww-textarea / ww-select` | 控制項，輸入文字 16px |
| `ww-select-wrap` | 包住 select，提供箭頭 |
| `aria-invalid="true"` | 錯誤狀態，邊框變紅 |
| `ww-fieldset` | 一組選項，用 `<legend>` 當標題 |
| `ww-check` | checkbox 或 radio，label 包住 input |
| `ww-switch` | 開關：`ww-switch__input`（`role="switch"`）加 `ww-switch__track` |

## 無障礙

- 錯誤訊息要說明怎麼修正，例如「請輸入完整的電子郵件，例如 name@example.com。」
- 控制項邊框用 `border.control`，對比 3:1（DR-011）。
