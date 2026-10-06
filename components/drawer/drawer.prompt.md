# 行動版選單 Drawer

## 何時使用

- 860px 以下的主要導覽。

## 何時不用

- 一般對話框或確認視窗。v0.1 沒有 Modal 元件。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-drawer` | 加在 `<dialog>` 上，從右側滑入 |
| `ww-drawer--preview` | 只用於文件展示：非 modal、不固定位置 |
| `ww-drawer__head` | logo 與關閉按鈕 |
| `ww-drawer__nav` | 導覽連結；目前頁面加 `aria-current="page"` |
| `ww-drawer__foot` | 主要按鈕與語言切換 |
| `data-ww-open="id"` | 加在觸發按鈕上（需要 js/ww.js） |
| `data-ww-close` | 加在關閉按鈕上 |

## 無障礙

- 使用原生 `<dialog>` 與 `showModal()`，焦點鎖定與 Esc 關閉由瀏覽器處理。
- 關閉後焦點回到觸發按鈕；點了頁內錨點時，焦點移到該區塊（js/ww.js 已處理）。
