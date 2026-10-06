# 耳塞年層 Growth layers

## 何時使用

- 步驟指示（最多 7 步）。
- 分頁與簡報頁碼（24 頁以內）。
- 閱讀進度（20 至 24 層）。
- 時間軸，一層代表一年或一個里程碑。

## 何時不用

- 裝飾、分隔線、背景紋理、Hero 的點綴。年層只在承載資訊時出現（DR-014）。
- 不確定的載入狀態，請用 Loading。
- 步驟超過 7 步時，先拆流程。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-layers` | 外框，加 `aria-hidden="true"`。每一層是一個空的 `<i>` |
| `is-done` | 已完成 |
| `is-current` | 目前 |
| `ww-layers--sm` | 16px 高 |
| `ww-layers--lg` | 32px 高 |
| `ww-layers--on-dark` | Abyss 底的顏色；在 `ww-on-dark` 內會自動套用 |
| `ww-reveal` | 進入畫面時由左到右浮現一次（需要 js/ww.js） |
| `data-ww-progress="id"` | 依 #id 元素的閱讀進度自動填滿（需要 js/ww.js） |
| `data-ww-progress-label="id"` | 同步更新百分比文字的元素 |
| `ww-index` | 年層加文字的外框 |
| `ww-index__count` | 等寬字的數字，例如 `03 / 07` |
| `ww-index__label` | 目前步驟的名稱 |
| `ww-index__text` | 把數字和名稱包在一起 |

## 無障礙

- 年層本身對輔助技術隱藏。狀態一定要同時寫成文字，例如「03 / 07　使用者與情境」。
- 「未到」的顏色刻意低於 3:1，資訊由文字承擔。

## 規則

- 層的形狀與寬度每 7 層循環一次，同樣的數量永遠長得一樣。
- 形狀由 tools/layers/generate.mjs 產生，不要手改 CSS 裡的遮罩。

## 最小範例

```html
<p class="ww-index">
  <span class="ww-layers ww-reveal" aria-hidden="true"><i class="is-done"></i><i class="is-done"></i><i class="is-current"></i><i></i><i></i><i></i><i></i></span>
  <span class="ww-index__text"><span class="ww-index__count">03 / 07</span><span class="ww-index__label">使用者與情境</span></span>
</p>
```
