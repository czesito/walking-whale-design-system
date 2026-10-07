走路鯨魚所有數位輸出的設計系統：網站、產品、簡報與文件。中文與英文同等重要。

規格的唯一源頭是 GitHub repo [czesito/walking-whale-design-system](https://github.com/czesito/walking-whale-design-system)（DR-003）。要改規格就改 repo，不要在這一頁直接改 token：元件預覽讀的是 repo 產生的 `components/bundle.css`，這裡的修改不會反映到預覽，下次同步也會被覆蓋。

## 組頁面的方式

- 載入 `components/bundle.css`（即 repo 的 `dist/ww.css`）與下方的 Google Fonts，在 `<html>` 設定 `lang`。中文語境的字體、行高與字距會自動切換。
- 只用系統的 `ww-` class 組頁面。不寫 CSS、不加 `style` 屬性、不用 hex 色（DR-016）。在 artifact 裡，把 bundle.css 原封不動放進 `<style data-ww-system>`。
- 先選頁面模式（Patterns 群組），再放元件，最後用 `ww-container`、`ww-section`、`ww-stack`、`ww-grid`、`ww-split`、`ww-cluster` 排列。
- 產出後用 repo 的 `scripts/validate-output.mjs` 與 `scripts/copy-lint.mjs` 檢查。驗證器也檢查元件契約（DR-017）：圖片要有 `alt`、圖示按鈕要有 `aria-label`、每個區塊最多一個 `ww-btn--primary`、`ww-stat` 要有來源、中文標題不超過 20 字、錯誤與警示不加入場動態。

## 內容基本原則

- 工作原則是「精準為先，溫度隨後」。先把事實說清楚，再讓語氣溫和。
- 品牌語句一字不改：主張「先與人同行，再著手系統」、定位「走路鯨魚是慎選合作對象的系統夥伴」、業務說明「為想走得長遠的團隊，打造客製化 AI 與軟體系統」、tagline「理性為骨，人性為聲，生命為動」。英文各自是英文裡最好的說法，不逐字對譯（見「品牌核心」）。
- 中文稱讀者為「您」，用「台」不用「臺」，中英文與數字之間加半形空格，用全形標點與「」，標題不加句號。
- 英文依 Chicago 加上例外：spaced em dash、10 以上用數字、標題句首大寫、美式拼字、serial comma。
- 不用驚嘆號、不用 emoji、不誇大、不製造急迫感。寫能力，不寫形容詞。
- 不捏造：數字要有來源，案例要已公開，示意內容標成「範例」。服務只從「服務」一節的能力清單挑。聯絡信箱只用 agiblida@gmail.com。

改寫範例（中文用中文重寫，不照英文翻）：

| 照英文翻譯 | 用中文重寫 |
|---|---|
| 品牌形象。營運深度。 | 對外的門面，對內的系統 |
| 精小團隊。深不見底。 | 團隊不大，功夫很深 |

## 視覺基礎

### 色彩

- 預設組合是 `ww-color-text-primary`（Abyss）在 `ww-color-background-page`（Pearl）或 `ww-color-background-card`（White）上。溫暖的編輯感用 `ww-color-background-warm`（Sediment）。
- 次要文字用 `ww-color-text-secondary`（Tidal），說明與中繼資料用 `ww-color-text-muted`（Slate），內文連結用 `ww-color-text-accent`（Biolum ink）。
- `ww-color-bone` 只用於裝飾線與標題短線，`ww-color-surface` 只用於資訊填色，兩者都不能當淺色底上的文字。
- `ww-color-biolum` 是稀少的訊號色：Abyss 底上的強調，或 `ww-color-background-signal` 按鈕的底色（上面的字用 `ww-color-text-on-signal`）。一頁最多一個 signal 按鈕。
- Abyss 底（`ww-on-dark`）上：文字 `ww-color-text-on-dark`，次要文字 `ww-color-text-on-dark-secondary`，kicker `ww-color-text-on-dark-label`。
- 只用「色彩對比表」一節列出的組合，全部通過 WCAG 2.2 AA。

### 字體

- Display：Cormorant Garamond 500（中文語境換成思源宋體），用於 `ww-hero` 與 h1 到 h4。
- 內文：Source Serif 4（思源宋體）。介面：Inter（思源黑體）。等寬：IBM Plex Mono，用於編號、日期、中繼資料。
- 中文強調用字重加 `ww-color-text-emphasis`，絕不用斜體（DR-007）。中文字級不小於 13px。
- 英文 kicker 是等寬大寫加字距；中文 kicker 改用介面字體、不轉大小寫。

### 元件語言：B1 標本卡

- 卡片：`ww-color-background-card`、1px `ww-color-border-decorative`、`ww-radius-xs`（2px）圓角、2px Abyss 頂邊。卡片不用陰影（DR-013）。
- 編號寫成 `No. 01`、`Fig. 01`，用等寬字與 `ww-color-text-muted`；編號必須代表真正的順序。
- 膠囊形（`ww-radius-pill`）只給 Chip 與 Status badge。
- 陰影只給浮層：`ww-shadow-md` 給 Toast，`ww-shadow-lg` 給 Drawer。

### 間距與版面

- 間距只用 `ww-space-1` 到 `ww-space-10`。卡片內距與格線欄距是 `ww-space-5`，區塊上下是 `ww-layout-section-gap`。
- 頁面最寬 `ww-layout-container`，文章 `ww-layout-container-narrow`，內文行長 `ww-layout-measure-body`。
- 斷點固定三個：640px、860px、960px。

### 招牌元素：耳塞年層

- 鯨魚的耳塞每年長一層。`ww-layers` 的每一層代表一個單位：讀者正在進行的步驟（最多 7 步）、頁碼、閱讀進度、時間軸。
- 只在承載資訊時出現，不當裝飾、分隔線或 Hero 點綴。旁邊一定要有 `ww-index__count` 寫出同一件事，年層本身 `aria-hidden="true"`（DR-014）。
- 顏色：已完成 `ww-color-index-done`，目前 `ww-color-index-current`，未到 `ww-color-index-todo`；Abyss 底換成 `on-dark` 三色。
- 介紹固定流程（例如合作的三個階段）不算進度，用 Steps 模式。

### 標題短線與引線標註

- 標題下方用 38×4 的 Bone 短線 `ww-rule`。
- 指出圖的局部時用引線標註：斜線接水平托線，標題在上、說明在下，線條 1px Abyss。圖寬小於 640px 時自動改成編號加圖說，一張圖最多 5 個標註（DR-015）。

### 動態

- 一條曲線 `ww-motion-ease`。浮現上升 `ww-rise`（`ww-motion-duration-rise`、位移 `ww-motion-distance-rise`），水平展開 `ww-reveal`（`ww-motion-duration-reveal`），依序浮現 `ww-stagger`，hover 與按壓 `ww-motion-duration-instant`。
- 入場動態只播一次。錯誤、警示、通知不動。尊重減少動態設定。

## 圖示

- 介面圖示用 Lucide，直接寫成 inline SVG：`viewBox="0 0 24 24"`、`class="ww-icon"`、`aria-hidden="true"`，不加 fill 與 stroke 屬性，顏色跟著 currentColor，線寬 1.75。
- 不用 emoji 當圖示。標誌檔案見 Logos 資產群組。

## 簡報

- 簡報是固定 1500 × 1000（3:2）的舞台，頁面不捲動，一頁一個主張、一個證據（DR-019）。樣式在 repo 的 `dist/ww-deck.css`，不在 `components/bundle.css` 裡。
- 從 repo 的 `dist/deck-zh.html` 或 `dist/deck-en.html` 複製，只換 `slides:start` 與 `slides:end` 之間的頁面。用途、文字預算、版型與互動見「簡報」一節。

## 未同步的內容

- 字體沒有上傳檔案：全部使用 Google Fonts 託管的版本，在 `type.families` 中列出。
- 元件是 CSS class 加 HTML，沒有 React 元件，所以沒有 `bundle.js`，預覽是靜態的；需要互動（Drawer、篩選、閱讀進度、入場動態）時，載入 repo 的 `dist/ww.js`。
- `:lang(zh)` 的字體、行高、字距覆寫只存在於 bundle.css；tokens 中的 Chinese 群組是對照用。
- 流體字級（clamp）在 tokens 中以最大值記錄，實際數值寫在各樣式的說明裡。
- 同步自 repo 的 main@{{SHA}}。
