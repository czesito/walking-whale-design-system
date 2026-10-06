# 動態

> 「精準為先，溫度隨後。」像大型生物在水中移動：穩定、沉著，不炫技。
> 數值的唯一來源是 `tokens/tokens.json`，用法見 [components/motion](../components/motion/motion.prompt.md)。

## 五種模式

| 模式 | Class | 用在哪裡 | 時長 |
|---|---|---|---|
| 浮現上升 | `ww-rise` | Hero 與主要區塊進入畫面 | `motion.duration.rise` 650ms，位移 `motion.distance.rise` 14px |
| 水平展開 | `ww-reveal` | 耳塞年層、線條、圖表 | `motion.duration.reveal` 600ms |
| 依序浮現 | `ww-stagger` | 一組卡片或能力區塊 | 每個 650ms，間隔 80ms |
| 即時回應 | 內建於元件 | hover、按壓（下移 1px）、狀態切換 | `motion.duration.instant` 150ms；狀態變化 `motion.duration.base` 220ms |
| 不動 | — | 錯誤、警示、通知、需要快速讀取的資訊 | 無 |

所有動態使用同一條曲線 `motion.ease`：cubic-bezier(0.4, 0, 0.2, 1)。

## 規則

1. 入場動態只播一次，不循環，不在 hover 時重播。
2. 錯誤、警示、通知與 `role="alert"` 不加入場動態，驗證器會檢查（[DR-017](../decisions/DR-017-component-contracts.md)）。
3. 使用者開啟減少動態（`prefers-reduced-motion`）時，所有動畫與轉場縮短到幾乎為零，內容直接顯示（`css/base.css`）。
4. 沒有 js/ww.js 時，內容也直接顯示。隱藏狀態只在腳本載入後才生效，不會讓內容卡在看不見的狀態。
5. 一頁只在幾個重點區塊使用入場動態，不是每個元素都動。
6. 不用霓虹光、粒子、誇張的科技感轉場。
7. 動態只用於 Walking Whale 自己的輸出，不套用到客戶的產品。
