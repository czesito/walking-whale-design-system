# 簡報引擎 Deck engine

固定 1500 × 1000（3:2）的舞台，`ww-deck.js` 依視窗縮放。頁面永遠不捲動：放不下就是錯，執行時會在該頁畫出紅色虛線框並在 console 警告（DR-019）。

## 何時使用

- 每一份簡報。載入 `dist/ww-deck.css` 與 `dist/ww-deck.js`；在 artifact 裡從 `dist/deck-zh.html` 或 `dist/deck-en.html` 複製，只換 `slides:start` 與 `slides:end` 之間的頁面。

## 何時不用

- 要捲動閱讀的長文件、報告。請用網站元件或文件。

## 結構

```html
<main class="ww-deck" data-ww-use="talk">
  <svg class="ww-deck__defs" aria-hidden="true">…wordmark 與 mark 的 symbol…</svg>
  <section class="ww-slide" id="why" data-ww-section="現況">
    <div class="ww-slide__head">
      <p class="ww-kicker">現況</p>
      <h2 class="ww-slide__title">一句完整的主張，最多兩行</h2>
    </div>
    <div class="ww-slide__body">…一個證據…</div>
    <div class="ww-slide__foot"><p class="ww-slide__takeaway">結論句，可省略</p></div>
    <aside class="ww-slide__notes"><p>講稿與細節。</p></aside>
  </section>
</main>
```

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `data-ww-use="talk"` | 現場講的簡報，每頁內文預算中文 120 字、英文 60 words |
| `data-ww-use="send"` | 寄出去讀的簡報，預算加倍：中文 240 字、英文 120 words |
| `ww-slide` | 一頁，`<section>`，直接放在 `ww-deck` 裡 |
| `ww-slide__head` `__title` `__lede` | kicker、主張（`<h2>`）、選用的導言 |
| `ww-slide__display` | 封面、一句話頁、結尾的大字 |
| `ww-slide__body` | 證據區，拿到 head 與 foot 剩下的所有高度；`--top`、`--fill` 改對齊 |
| `ww-slide__foot` `__takeaway` `__source` | 結論句、來源（等寬小字，不算預算） |
| `ww-slide__flag` | 虛線框的「範例」「規劃中」標籤 |
| `ww-slide__notes` | `<aside>` 講稿：舞台上不顯示，閱讀模式（R）顯示在每頁旁邊 |
| `ww-on-dark` `ww-slide--warm` `--wash` `--card` | 底色：Abyss、Sediment、Mist、White |
| `data-ww-section="名稱"` | 新段落的第一頁；頁碼旁顯示段落名稱，總覽依段落分列 |
| `data-ww-chrome="off"` | 這頁不加 wordmark 與頁碼（封面、結尾、滿版圖片） |
| `data-ww-step` | 逐步揭示：按一下出現；同一個數字一起出現，沒寫數字依頁面順序 |
| `ww-build--focus` | 加在逐步揭示的容器上：新的一項出現時，前面的退成次要色 |

## 文字預算

驗證器數每頁的內文：中文算漢字加英數字詞，英文算 words。不算：標題、kicker、來源、`ww-slide__flag`、數據來源、可調數字的假設、講稿、重建畫面（`ww-device`）裡的字、圖表刻度。情境切換只算最長的一個分頁。目標是預算的一半。

## 頁碼

執行時在每頁加上左下 wordmark 與右下頁碼：耳塞年層每頁一層（超過 24 頁改成每段一層），旁邊寫「07 / 18」與段落名稱（DR-014）。不要自己寫頁碼。

## 模式與按鍵

→ 空白鍵下一步；← 上一步；O 總覽；R 閱讀模式（每頁加講稿，手機直式自動進入）；F 全螢幕；B 黑畫面；? 按鍵說明。網址加 `#頁面 id` 直接開那一頁。

## 列印

一頁一張 1500 × 1000，所有逐步揭示都顯示，情境切換印第一個分頁。在閱讀模式列印，每頁是縮小的投影片加上講稿，就是附講稿的 PDF；講稿欄大約容得下 400 字，超過的部分會被裁掉。

## 規則

- 一頁一個主張，標題寫成完整的句子：中文不超過 20 字，英文不超過 14 words。只讀標題，故事也要通。
- 每頁一個證據。放不下就拆頁，細節移到講稿。
- 不捲動、不縮小字：舞台上最小 18px。
