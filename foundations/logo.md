# Logo

> 骨架標誌與 curled icon 是鎖定的圖形，只能縮放與換色。Wordmark 的字樣已經轉成外框，不依賴字體安裝。
> 所有檔案由 `tools/logo/build_logo.py` 從 `assets/source/` 的兩個原始向量產生；比例參數記錄在 [DR-010](../decisions/DR-010-wordmark-vector.md) 與 `assets/manifest.json`。

## 版本

| 版本 | 檔案 | 長寬比 | 用途 |
|---|---|---|---|
| 直式 wordmark | `assets/wordmark/walking-whale-wordmark-stacked*.svg` | 2.44 : 1 | 主要版本：封面、名片、提案首頁。v0.1 只有英文，所以網頁頁尾改用該頁語言的橫式 |
| 橫式英文 | `assets/wordmark/walking-whale-wordmark-horizontal-en*.svg` | 8.43 : 1 | 英文頁面的導覽列、頁首、簡報頁角 |
| 橫式中文 | `assets/wordmark/walking-whale-wordmark-horizontal-zh*.svg` | 5.55 : 1 | 中文頁面的導覽列、頁首、簡報頁角 |
| 骨架標誌 | `assets/mark/walking-whale-mark*.svg` | 2.70 : 1 | 不需要名稱的場合，或名稱已經以文字出現在旁邊 |
| Icon | `assets/icon/walking-whale-icon*.svg` | 1.38 : 1 | 方形空間：社群頭像、app、favicon 的來源 |
| 小尺寸點陣 | `assets/icon/walking-whale-favicon-16.png`、`-32.png`、`walking-whale-icon-128/256/512.png` | 1 : 1 | 32px 以下一律用這些檔案，不要縮小向量 icon |

每個 SVG 有四個檔案：

| 後綴 | 顏色 | 用途 |
|---|---|---|
| 無後綴 | `currentColor` | 內嵌在網頁中，由 CSS 決定顏色 |
| `-abyss` | Abyss | 淺色背景 |
| `-pearl` | Pearl | 深色背景（反白） |
| `-bone` | Bone | 只用於裝飾，例如深色背景上的浮水印 |

wordmark 另外有 PNG 匯出（`@1600w`、`@2400w`），給無法使用 SVG 的地方，例如簡報軟體與文件。

## 比例

| 版本 | 規則 |
|---|---|
| 直式 | 字樣寬度 = 標誌寬度 × 1.40；字高 = 標誌高度 × 0.255；字樣與標誌間距 = 1.13 個字高；字樣中心比標誌中心偏左 0.8% 標誌寬 |
| 橫式英文 | 字高 = 標誌高度 × 0.36；間距 = 1.07 個字高；字樣垂直置中於標誌 |
| 橫式中文 | 字身 = 標誌高度 × 0.58；字距 0.10em；間距 = 0.64 個字身；字身垂直置中於標誌 |
| 字樣 | Cormorant Garamond SemiBold，全大寫，字距 0.09em；中文用思源宋體 SemiBold |

## 最小尺寸

| 版本 | 最小 | 說明 |
|---|---|---|
| 直式 | 寬 160px | 此時英文字高約 11px |
| 橫式 | 標誌高 28px | 此時英文字高約 10px、中文字身約 16px |
| Icon | 寬 32px | 更小時改用 favicon PNG |

## 留白

四周至少保留 **0.5 倍標誌高度** 的空間，不放任何文字、圖片或邊緣。直式與橫式都以 lockup 中骨架標誌的高度計算。這個數值與舊規範「0.5 倍鯨魚頭骨高度」相當，頭骨約占標誌高度的 97%。

## 顏色

1. 淺色背景（Pearl、White、Mist、Sediment）用 Abyss 版。
2. 深色背景（Abyss、abyss-raised）用 Pearl 反白版。
3. Bone 版只用於裝飾，不能是頁面上唯一的 logo。
4. 不使用這三色以外的顏色，也不加漸層。

## 語言

- 中文頁面用橫式中文版，英文頁面用橫式英文版。網站切換語言時，導覽列的 logo 跟著切換。兩者的視覺份量相當，切換時不會忽大忽小。
- v0.1 的直式只有英文版本。

## 禁止事項

- 不重畫骨架標誌，也不調整它的比例。
- 不加陰影、外光暈、漸層或立體效果。
- 不放在複雜照片、密集圖表或對比不足的背景上。
- 不把 icon 當成重複的裝飾圖案。
- 不拉伸或壓扁，縮放時一律等比例。
- 不用即時排版的文字拼出 lockup，一律使用 `assets/` 的檔案。官網導覽列目前用即時文字，改版時要換成橫式 SVG。
- 不再使用舊的 `walking-whale-logo-primary.png`。

## 重新產生

只有在原始向量或 DR-010 的比例改變時才需要重新產生，步驟見 [tools/logo/README.md](../tools/logo/README.md)。
