# 標誌 Logo

## 何時使用

- Topbar、頁尾、簡報封面、文件抬頭。

## 何時不用

- 不要重新排列、拉伸、加陰影或改色。需要其他色版時，用 assets/ 裡現成的檔案。
- 不要把 currentColor 版本放進 `<img>`，在 img 中它會變成黑色。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-logo` | 加在 `<img>` 上，以高度決定大小 |
| `ww-logo--sm` | 28px，橫式的最小尺寸 |
| `ww-logo--md` | 36px |
| `ww-logo--lg` | 56px |
| `ww-logo--xl` | 96px |
| `ww-logo--stacked` | 直式，寬 220px（最小 160px） |

## 無障礙

- `alt` 寫品牌名：中文頁「走路鯨魚」，英文頁「Walking Whale」。純裝飾時 `alt=""`。

## 規則

- 淺色底用 `-abyss`，Abyss 底用 `-pearl`。檔案與最小尺寸見 foundations/logo.md。

## 最小範例

```html
<img class="ww-logo ww-logo--sm" src="assets/wordmark/walking-whale-wordmark-horizontal-zh-abyss.svg" alt="走路鯨魚">
```
