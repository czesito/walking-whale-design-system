# 無障礙

> 門檻是 WCAG 2.2 AA（[DR-011](../decisions/DR-011-accessibility-threshold.md)）。能檢查的規則都放進 CI：色彩對比在 build，結構規則在驗證器（[DR-017](../decisions/DR-017-component-contracts.md)）。

## 自動檢查

| 項目 | 檢查方式 |
|---|---|
| 色彩對比：文字 4.5:1、大字與介面元件 3:1 | `tokens/contrast-pairs.json` 列出所有允許的組合，build 時計算，見 [color-contrast.md](color-contrast.md) |
| 中文字級不小於 13px | build 檢查 `lang-zh.json` 解析後的所有字級 |
| `<html lang>`、圖片 `alt`、圖示按鈕 `aria-label`、表單 label、表格 `<caption>` | 驗證器 |
| 耳塞年層對輔助技術隱藏，並有文字說明同一件事 | 驗證器 |
| 錯誤與警示不加入場動態 | 驗證器 |

## 撰寫時要做的事

1. **語言**：`<html lang>` 一定要設定；同一頁換語言的元素也設定 `lang`。螢幕閱讀器靠它選擇發音，字體也靠它切換（DR-006）。
2. **鍵盤**：所有互動元素都能用 Tab 抵達，聚焦時有 2px 的 `color.focus` 外框（`css/base.css`）。不要移除 outline。
3. **跳到主要內容**：每一頁第一個可聚焦的元素是 `ww-skip-link`。
4. **觸控目標**：按鈕最小高度 44px（`ww-btn`），小按鈕 36px，chip 32px，都高於 WCAG 2.2 的 24px。
5. **狀態不只靠顏色**：狀態標記一定有文字，耳塞年層一定有數字，錯誤欄位同時有紅框與錯誤訊息。
6. **表單**：每個欄位都有看得見的 label；說明與錯誤用 `aria-describedby` 連結；錯誤訊息要說明怎麼修正。
7. **動態**：遵守減少動態設定（見 [motion.md](motion.md)）。
8. **圖**：資訊性的圖要有 `alt` 或 `<title>` 與 `<desc>`；純裝飾的圖 `alt=""` 或 `aria-hidden="true"`。
9. **Drawer**：使用原生 `<dialog>`，焦點鎖定與 Esc 關閉由瀏覽器處理，關閉後焦點回到觸發的按鈕。

## 刻意的例外

耳塞年層「未到」的顏色（`color.index.todo`）低於 3:1。年層本身對輔助技術隱藏，資訊由旁邊的文字承擔，所以不屬於必要的圖形資訊（DR-014）。
