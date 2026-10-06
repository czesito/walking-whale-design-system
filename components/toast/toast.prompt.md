# 通知 Toast

## 何時使用

- 動作完成後的短暫確認，例如「已儲存」。

## 何時不用

- 需要讀者回應的訊息。請改用頁面內的提示。
- 錯誤。錯誤要留在畫面上，請用 Error 或 Callout。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-toast` | Abyss 底，固定在底部中央，加 `role="status"` |
| `ww-toast--static` | 只用於文件展示 |
| `ww-toast__icon` | 圖示 |
| `ww-toast__text` | 訊息 |
| `hidden` | 隱藏；`data-ww-toast="id"` 會顯示 4 秒（需要 js/ww.js） |

## 規則

- 一句話，不超過 20 個中文字。
