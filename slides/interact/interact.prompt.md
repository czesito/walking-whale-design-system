# 頁內互動 Interactions

HTML 簡報能做到 PDF 做不到的事。互動只在讓內容更好懂時才加，而且每一種都要能用滑鼠、鍵盤操作，列印時也看得懂。

## 情境切換 Views

同一頁、同一個位置，在幾種狀態之間切換：現在與導入後、不同角色看到的畫面、三個方案。

| Class 或屬性 | 用途 |
|---|---|
| `ww-views` `data-ww-views` | 容器；`data-ww-views="steps"` 讓右鍵依序切換分頁，講者不用碰滑鼠 |
| `ww-views__tabs` | `role="tablist"` 加 `aria-label` |
| `ww-views__tab` | `<button role="tab">`，`aria-controls` 指向分頁，`aria-selected` |
| `ww-views__panel` | `role="tabpanel"`，非預設的加 `hidden` |

列印與 PDF 只出現第一個分頁，最重要的放第一個。

## 可調數字 Dials

拉桿帶動數字與圖，適合和客戶一起估算。

| Class 或屬性 | 用途 |
|---|---|
| `ww-dial` `data-ww-dial` | 容器 |
| `ww-dial__row` `__label` `__value` | 一列：`<label for>`、目前的值（`<output data-ww-calc="變數">`） |
| `ww-dial__input` | `<input type="range" data-ww-var="變數">` |
| `ww-dial__result` `__big` `__unit` | 結果區、大數字、單位 |
| `data-ww-calc="式子"` | 用變數計算，只支援 `+ - * / ( )` 與 `min max round floor ceil abs`，不用 eval |
| `data-ww-round="0"` | 小數位數 |
| `data-ww-calc-attr="width"` | 把結果寫進 SVG 屬性，例如長條的寬度 |
| `ww-dial__note` | 必填：寫出假設，例如「估算：假設六成步驟可以自動化」 |

## 規則

- 互動的結果不能比靜態的數字更不誠實：估算就寫估算，假設寫在旁邊。
- 不加音效、自動播放或跟內容無關的動畫。
