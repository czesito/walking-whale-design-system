# 字體

> 四種聲音，同一個語調。
> 數值的唯一來源是 `tokens/tokens.json`（預設）與 `tokens/lang-zh.json`（中文覆寫）。實際效果見 `specimens/index.html`。

## 角色與字體

依 [DR-005](../decisions/DR-005-cjk-typefaces.md)，全部採用 Google Fonts 上的開源字型（SIL OFL）。

| 角色 | 西文 | 中文 | 用途 |
|---|---|---|---|
| Display | Cormorant Garamond 500、600、Italic 500 | 思源宋體 Noto Serif TC 500、600、700 | Hero、標題 |
| Body | Source Serif 4 400、600、Italic 400 | 思源宋體 Noto Serif TC 400、600 | 文章、提案、文件 |
| UI | Inter 400、500、600、700 | 思源黑體 Noto Sans TC 400、500、700 | 導覽、按鈕、表單、標籤、產品介面 |
| Mono | IBM Plex Mono 400、500 | 思源黑體 Noto Sans TC | 程式碼、token、數據 |

Cormorant Garamond 不用在 18px 以下、表格或介面元件上。Mono 只用於技術內容，中文的區塊標籤改用 UI 字體。

## 載入

在 HTML 的 `<head>` 用 `<link>`，比 CSS 的 `@import` 快：

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap">
```

無法改 HTML 時，改用 `css/fonts.css`。中文字體會依實際用到的字分片下載，不需要整套載入。

## 字級

| Token | 值 | 約當 px | 用途 |
|---|---|---|---|
| `font.size.hero` | clamp(2.6rem, 7vw, 4.6rem) | 42–74 | 首屏主標 |
| `font.size.h1` | clamp(2rem, 5vw, 3rem) | 32–48 | 頁面標題 |
| `font.size.h2` | clamp(1.6rem, 4vw, 2.2rem) | 26–35 | 區塊標題 |
| `font.size.h3` | 1.5rem | 24 | 小節標題 |
| `font.size.h4` | 1.25rem | 20 | 卡片標題 |
| `font.size.lede` | clamp(1.0625rem, 2vw, 1.25rem) | 17–20 | 標題下的引言 |
| `font.size.body` | 1.0625rem | 17 | 內文 |
| `font.size.ui` | 0.9375rem | 15 | 按鈕、導覽、表單 |
| `font.size.sm` | 0.8125rem | 13 | 說明文字、圖說 |
| `font.size.kicker` | 英 0.75rem／中 0.8125rem | 12／13 | 區塊標籤 |

字級只有這十級。官網目前寫死了 43 種字級，改版時全部要對應回這張表。

## 中英差異

同一個 class 在 `:lang(zh)` 底下會自動換成中文數值，不需要另寫中文版樣式。

| 項目 | 英文 | 中文 | 原因 |
|---|---|---|---|
| Display 行高 | 1.0 | 1.25 | 漢字填滿整個字身框，沒有西文上下伸部的留白；行高太緊，兩行會疊在一起 |
| 標題行高 | 1.15 | 1.35 | 同上 |
| 內文行高 | 1.62 | 1.85 | 中文筆畫密，需要更多行距 |
| Display 字距 | -0.03em | 0.04em | 西文大字收緊字距；漢字是方塊字，負字距會讓字黏在一起 |
| 標題字距 | -0.01em | 0.04em | 同上 |
| 內文字距 | 0 | 0.02em | 輕微放鬆，提高中文長文的可讀性 |
| 區塊標籤 | IBM Plex Mono 12px，全大寫，字距 0.1em | 思源黑體 13px，不轉換大小寫，字距 0.12em | 大小寫對中文沒有意義；中文最小 13px |
| 強調 | Cormorant Italic | 思源宋體 700 加 Tidal 色 | 中文沒有斜體（DR-007） |
| 每行長度 | 68ch | 34em（約 34 字） | |

## 規則

1. **在改變語言的區塊元素上標 `lang`**（DR-006）。整頁的語言標在 `<html>`。英文頁面中的中文標題、引文、段落要標 `lang="zh-Hant"`，反之標 `lang="en"`。
2. **語言切換只放在區塊元素上，不放在行內的 `<span>`。** 字體、行高、字距是從父元素繼承的計算結果，行內元素即使標了 `lang` 也不會重新計算。標了 `lang` 的區塊要套用標題元素或文字樣式 class，才會換成該語言的數值。中文句子裡夾的英文單字不必另外標記，會直接用思源字體內建的西文字形。
3. **中文最小字級 13px。** CI 會檢查所有中文字級 token。
4. **中文標題不加句號**（DR-008）。英文標題用 sentence case。
5. **標點一律全形。** 破折號是兩個 U+2014（——），刪節號是兩個 U+2026（……）。思源字體下的實際渲染，依 specimens 的驗收項目在三個平台確認。
6. **中文不用斜體。** 系統已經把中文的 `em`、`i`、`cite`、`blockquote` 設為正體，不要再另外指定 `font-style: italic`。
7. **不寫死字級、行高、字距。** 一律用 token 或下方的文字樣式 class。

## 文字樣式 class

定義在 `css/type.css`，已包含在 `dist/ww.css`。

| Class | 用途 |
|---|---|
| `.ww-hero` | 首屏主標 |
| `.ww-em` | 標題中的強調詞 |
| `.ww-lede` | 標題下的引言 |
| `.ww-body` | 單段內文 |
| `.ww-prose` | 多段內文，含每行長度與段距 |
| `.ww-ui` | 介面文字 |
| `.ww-sm` | 說明文字、圖說 |
| `.ww-kicker` | 區塊標籤 |
| `.ww-label` | 表單與介面標籤 |
| `.ww-mono` | 程式碼、token |
| `.ww-rule` | 區塊開頭的 38×4 Bone 短線 |
| `.ww-on-dark` | 深色區塊，內部文字自動換成深色背景用的色彩 |

`h1` 到 `h4` 已有預設樣式，不需要另加 class。

## v0.1 與舊規格的差異

| 項目 | 舊規格 | v0.1 | 原因 |
|---|---|---|---|
| 中文字體 | 蘭陽明體 W2、凝明朝体、驚鴻手書（只寫在官網程式碼） | 思源宋體、思源黑體 | DR-005 |
| 中文字體順序 | 一律西文優先 | 中文語境中文優先 | DR-006 |
| UI 字級 | 0.9rem（14.4px） | 0.9375rem（15px） | 對齊整數 px |
| 小字字級 | 0.8rem（12.8px） | 0.8125rem（13px） | 中文最小 13px |
| Mono 字級 | 0.72rem | 移除，改用 `font.size.sm` | 減少字級數量 |
| 區塊標籤 | 0.64rem，Bone 色（1.85:1） | 英 12px／中 13px，Tidal 色（6.63:1） | DR-011 |
| Lede | Cormorant 斜體 | Source Serif 正體，muted 色 | 與官網實際用法一致；中文不用斜體 |
| Source Serif 斜體 | 沒有載入，由瀏覽器合成 | 載入真正的斜體 | 合成斜體品質差 |
