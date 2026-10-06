# DR-007 中文強調方式

- 狀態：已採納
- 日期：2026-10-07
- 決策者：Czesio

## 背景

英文以 Cormorant 斜體加 Tidal 色強調。中文沒有斜體，瀏覽器會把字形硬斜切。官網在首頁 hero 改用驚鴻手書處理，但文章引文的 blockquote 仍設定 italic，中文引文因此出現假斜體。

## 決策

| 語言 | 強調方式 |
|---|---|
| 英文 | Cormorant Garamond Italic，Tidal 色 |
| 中文 | 思源宋體 700，Tidal 色，不改字體，不傾斜 |

系統層級加上防護規則：

```css
:lang(zh) em,
:lang(zh) i,
:lang(zh) blockquote,
:lang(zh) .ww-em { font-style: normal; }
:lang(zh) em,
:lang(zh) .ww-em { font-weight: 700; color: var(--color-text-accent); }
```

## 理由

- 不必多載入一套字體，任何媒介都能重現。
- 字形標準和內文一致。
- 行書在小字與介面上辨識度低。

## 不採用的選項

- **霞鶩文楷 TC**：採傳承字形，和思源字體並排時部分字形寫法會不同。
- **驚鴻手書**：僅限官網網域可用，見 DR-005。
