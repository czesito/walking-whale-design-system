# DR-006 中英混排的字體順序

- 狀態：已採納
- 日期：2026-10-07
- 決策者：Czesio

## 背景

官網的字體堆疊一律是西文字體優先，中文逐字回退到中文字體。這造成兩個問題：

- 中文標題裡的英文用 Cormorant 顯示，x 字高很小，夾在漢字之間像小了一號。
- 破折號（zh.ts 中有 50 處）與刪節號（10 處）交給西文字體繪製，破折號中間斷開，刪節號貼底。

## 決策

依內容的語言決定字體順序：

| 情境 | 字體順序 |
|---|---|
| `:lang(zh)` | 中文字體優先，英文改用思源字體內建的西文字形 |
| 其他 | 西文字體優先，中文逐字回退 |

```css
:root {
  --font-display: "Cormorant Garamond", "Noto Serif TC", Georgia, serif;
  --font-body: "Source Serif 4", "Noto Serif TC", Georgia, serif;
  --font-ui: "Inter", "Noto Sans TC", system-ui, sans-serif;
}
:lang(zh) {
  --font-display: "Noto Serif TC", "Songti TC", serif;
  --font-body: "Noto Serif TC", "Songti TC", serif;
  --font-ui: "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif;
}
```

等寬字體不受影響，程式碼一律用 IBM Plex Mono。

## 規則

英文頁面中的中文內容（文章標題、引文、人名）必須標上 `lang="zh-Hant"`。官網的雙語資料模型已經知道每段文字的語言（`title`／`title_alt`），標記可以自動產生。

## 影響

- 中文語境裡的英文字不再是 Cormorant，品牌西文字體只出現在英文語境。這是為了中英混排的協調而做的取捨。
- 標點在思源字體下的實際渲染，要在 specimens 驗收情境 2 中確認。
