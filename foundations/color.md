# 色彩

> 海洋的深度、化石的溫度、科學的精準。
> 數值的唯一來源是 `tokens/tokens.json`。本文件說明怎麼用，對比數據見 [color-contrast.md](color-contrast.md)。

## 色盤

| Token | HEX | 角色 | 淺色背景上當文字 |
|---|---|---|---|
| `color.pearl` | #FBFAF6 | 頁面背景 | — |
| `color.white` | #FFFFFF | 卡片、表格 | — |
| `color.mist` | #F7F4EE | 區塊交替底色 | — |
| `color.sediment` | #E8E0D0 | 溫暖的編輯感底色 | — |
| `color.abyss` | #0D1F3C | 主色：標題、內文、logo、深色區塊 | 可以 |
| `color.abyss-raised` | #12345C | Abyss 的漸層搭配色、深色區塊的上層 | — |
| `color.tidal` | #2E5F7A | 次要色：次要文字、輔助區塊、資訊 | 可以 |
| `color.surface` | #A8C5D6 | 淺色資訊填色：圖表、資料欄位 | 不可以 |
| `color.bone` | #C8B99A | 裝飾線、分隔線、rule | 不可以 |
| `color.biolum` | #6DBFA0 | 稀少的訊號色 | 不可以 |
| `color.biolum-ink` | #2F7A60 | 綠色文字、focus ring | 可以 |
| `color.clay-ink` | #A05138 | 警告文字 | 可以 |
| `color.rust-ink` | #A8352A | 危險、錯誤文字 | 可以 |
| `color.slate` | #546174 | 次要中性文字：說明、圖說、metadata | 可以 |
| `color.steel` | #868F9E | 表單元件邊框 | 不可以（只用於邊框） |

## 語意 token

寫元件與頁面時用語意 token，不要直接用色盤 token。色盤 token 只在定義語意 token 時使用。

| 群組 | Token | 指向 |
|---|---|---|
| 文字 | `color.text.primary` | abyss |
| | `color.text.secondary` | tidal |
| | `color.text.muted` | slate |
| | `color.text.accent` | biolum-ink |
| | `color.text.emphasis` | tidal |
| | `color.text.on-dark` | pearl |
| | `color.text.on-dark-secondary` | surface |
| | `color.text.on-dark-label` | bone |
| | `color.text.on-signal` | abyss |
| 背景 | `color.background.page` / `card` / `wash` / `warm` | pearl / white / mist / sediment |
| | `color.background.deep` / `deep-raised` | abyss / abyss-raised |
| | `color.background.signal` | biolum |
| 邊框 | `color.border.decorative` / `decorative-soft` | Bone 55% / 30%，裝飾用，不受對比限制 |
| | `color.border.control` | steel，必須達 3:1 |
| Focus | `color.focus` | biolum-ink |
| 狀態 | `color.status.success` / `warning` / `danger` / `info` | biolum-ink / clay-ink / rust-ink / tidal |
| | `color.status.*-wash` | 對應的淡色底 |
| 圖表 | `color.chart.1` 到 `4`、`other` | 四個系列色加一個「其他」 |
| | `color.chart.grid` / `label` | Bone 35% / slate |

CSS 變數名稱是把路徑的點換成連字號，再加上 `--ww-` 前綴，例如 `color.text.primary` 對應 `--ww-color-text-primary`。

## 規則

1. **預設組合是 Abyss 搭 Pearl 或 White。** Abyss 搭 Sediment 是較溫暖的編輯感組合。
2. **只能用對比表上的組合。** 每一組前景與背景都由 CI 檢查，未列在 [color-contrast.md](color-contrast.md) 的組合不允許使用。要新增組合時，先加進 `tokens/contrast-pairs.json`，通過檢查後才能用。
3. **Bone、Surface、Biolum 不當淺色背景上的文字。** 三者對 Pearl 的對比都低於 2.1:1。
4. **Biolum 只出現在兩種地方。** 一是 Abyss 文字底下的填色，例如 signal 按鈕；二是深色背景上的強調。在淺色背景上，它不能當唯一的狀態指示。每個畫面最多一個 Biolum 行動按鈕。
5. **綠色文字與 focus ring 用 biolum-ink。** 它在淺色與 Abyss 背景上都達標。
6. **不用半透明 Abyss 當文字色。** 需要較淡的文字時用 `color.text.muted`。半透明文字的實際對比會隨底色變動，無法檢查。
7. **圖表最多四個系列色。** 第五個以上的系列併入 `color.chart.other`，不再增加新色相。刻度與軸標籤屬於文字，用 `color.chart.label`。
8. **不用新色相。** 需要新顏色時，先提出決策紀錄。

## v0.1 與舊規格的差異

| 項目 | 舊規格 | v0.1 | 原因 |
|---|---|---|---|
| 綠色文字 | `biolum-ink` #3D8A6B（3.98:1） | #2F7A60（4.94:1） | DR-011；官網已在使用 |
| 次要文字 | Tidal，或官網寫死的 Abyss 64–72% 半透明 | 新增 `slate` #546174 | 用實色確保在 Sediment 上也達 4.5:1 |
| 表單邊框 | Bone 55% | 新增 `steel` #868F9E | 表單元件邊框必須達 3:1 |
| Focus ring | Biolum（2.09:1） | biolum-ink | DR-011 |
| 危險色 | 官網寫死 #A8352A，沒有 token | `rust-ink` | 收編既有用法 |
| 警告色 | `warn-ink` | `clay-ink` | 改名，數值不變 |
| 圖表色 | 只在官網 `charts.css` | 收進 tokens | 收編既有用法 |
| 圖表刻度文字 | Abyss 55%（3.73:1） | slate | 刻度是文字，必須達 4.5:1 |
| `abyss-12` | 名稱不明確 | `abyss-raised` | 改名，數值不變 |
