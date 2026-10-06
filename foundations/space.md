# 間距、圓角與陰影

> 數值的唯一來源是 `tokens/tokens.json`。頁面不直接寫數值，用版面元件（`components/layout`）與各元件內建的間距。

## 間距

| Token | 數值 | 常見用途 |
|---|---|---|
| `space.1` | 4px | 圖示與文字之間、極小的內距 |
| `space.2` | 8px | 標籤與欄位之間、清單項目之間 |
| `space.3` | 12px | kicker 與標題之間、小元件的群組 |
| `space.4` | 16px | 手機版左右留白的最小值、卡片內的段落 |
| `space.5` | 22px | 卡片內距、格線的欄距 |
| `space.6` | 28px | 區塊內的大段落 |
| `space.7` | 36px | 區塊開頭與內容之間 |
| `space.8` | 48px | 桌面版左右留白的最大值、兩欄之間 |
| `space.9` | 64px | 大區塊之間 |
| `space.10` | 88px | Hero 上方 |

間距只往上或往下跳一級，不在兩個數值中間另取。

## 版面

| Token | 數值 | 說明 |
|---|---|---|
| `layout.container` | 1180px | 一般頁面的最大寬度（`ww-container`） |
| `layout.container-narrow` | 940px | 文章與表單頁（`ww-container--narrow`） |
| `layout.measure-body` | 68ch，中文 34em | 內文的最大行長。中文約每行 34 字 |
| `layout.section-gap` | 56px | 區塊上下留白（`ww-section`） |

斷點不做成 token，固定三個：640px（一欄）、860px（兩欄改一欄、topbar 改成選單）、960px（四欄與三欄改兩欄）。引線標註另外以圖本身的寬度 640px 切換（container query，DR-015）。

## 圓角

依 [DR-013](../decisions/DR-013-component-language.md)，系統以 2px 為主。

| Token | 數值 | 用途 |
|---|---|---|
| `radius.xs` | 2px | 卡片、按鈕、輸入框、圖版，預設值 |
| `radius.sm` | 4px | 圖片與媒體外框 |
| `radius.md` | 8px | 浮層：Drawer、Toast |
| `radius.lg` | 12px | 很少用；B1 版面中避免 |
| `radius.pill` | 999px | 只用於 Chip 與 Status badge |

## 陰影

卡片不用陰影，層次靠細線與 Abyss 頂邊區分（DR-013）。陰影只給浮在頁面上的東西。

| Token | 用途 |
|---|---|
| `shadow.sm` | 保留，v0.1 未使用 |
| `shadow.md` | Toast |
| `shadow.lg` | Drawer |
