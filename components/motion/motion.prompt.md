# 動態 Motion

## 何時使用

- `ww-rise`：Hero 與主要區塊進入畫面時。
- `ww-reveal`：耳塞年層、線條、圖表，由左到右展開。
- `ww-stagger`：一組卡片或能力區塊，加在外層，子元素依序浮現。

## 何時不用

- 錯誤、警示、通知與 `role="alert"` 的內容。這些一律直接出現（DR-017 會檢查）。
- 每個元素都加。一頁只在幾個重點區塊使用，像大型生物在水中移動，不是煙火。
- 循環動畫、hover 時重播。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-rise` | 淡入並上升 `motion.distance.rise`（14px），`motion.duration.rise` |
| `ww-reveal` | 由左到右展開，`motion.duration.reveal` |
| `ww-stagger` | 子元素依序浮現，每個間隔 80ms，第 6 個以後同時出現 |
| `is-revealed` | 由 js/ww.js 加上，不要手寫 |

## 無障礙

- 沒有 js/ww.js 或使用者開啟減少動態時，內容直接顯示，不會卡在隱藏狀態。

## 規則

- 五種模式：浮現上升、水平展開、依序浮現、即時回應（hover 與按壓，150ms，已內建在按鈕）、不動（錯誤與警示）。
- 數值見 foundations/motion.md。
