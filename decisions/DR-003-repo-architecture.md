# DR-003 Repo 架構與發布方式

- 狀態：已採納
- 日期：2026-10-07
- 決策者：Czesio

## 背景

現有材料有四個來源，已經出現漂移。例如 README 說 JSON 是 canonical，但 `colors.css` 多了三個 JSON 裡沒有的顏色；官網也已經自行把 `biolum-ink` 換成 `#2F7A60`，修正沒有回流到設計系統。

## 決策

public GitHub repo [`czesito/walking-whale-design-system`](https://github.com/czesito/walking-whale-design-system) 是唯一源頭，其他都是從它產生或引用的消費者。

```
walking-whale-design-system/
├── README.md       人與 Claude 的入口
├── SKILL.md        repo 本身就是 Claude skill
├── tokens/         tokens.json 為唯一源頭
├── dist/           產生物：tokens.css、tokens.ts（不手改）
├── foundations/    色彩、中英字體、間距、動態、logo、無障礙
├── content/        語氣、zh-TW 與 en 編輯規範、glossary.csv
├── components/     CSS class＋HTML 範例＋.prompt.md
├── patterns/       公開頁面模式
├── assets/         logo SVG 與各尺寸圖示
├── specimens/      中英並排的驗證頁
├── decisions/      DR-001 起的決策紀錄
└── specs/          範圍與功能規格
```

| 消費者 | 使用方式 |
|---|---|
| Claude Code | 把 repo 加進 session，或安裝成 skill |
| claude.ai 的簡報與設計 | 每次發版同步一份 Design System artifact，設為預設 |
| 官網與產品 | `npm i github:czesito/walking-whale-design-system#v0.1.0`，引用 `dist/tokens.css` |
| 簡報與文件 | 後續版本的 templates，由同一個 skill 帶出 |

運作規則：

1. Token 只在 `tokens/tokens.json` 修改，CSS 與 TS 由一支小型 Node 腳本產生，暫不引入 Style Dictionary。
2. CI 執行對比檢查（DR-011）與 dist 同步檢查，未通過不能合併。
3. 版本以 git tag 管理（semver），每次發版更新 `CHANGELOG.md`。
4. 所有 PR 由 Czesio 核准。
5. 現有 walking-whale-html、walking-whale-slides 兩個 skill 改為指向本 repo，不再各自維護規格。

### 公開 repo 的規則

1. **授權分開處理。** 程式碼、tokens 與文件採 MIT（`LICENSE`）。Walking Whale 與走路鯨魚的名稱、logo、wordmark 與 `assets/` 不在 MIT 範圍內，保留所有權利（`TRADEMARKS.md`）。字體沿用各自的 SIL OFL。
2. **客戶材料不得進入本 repo。** 包括客戶提供的規範與文件、客戶專案文件、未在官網公開的案例內容。從官網 repo 萃取規格時，只帶走設計決策。
3. **開啟 secret scanning 與 push protection。**
4. **個人 commit 使用 GitHub noreply email。**
5. **Git 歷史視同公開。** 不得先 commit 再刪除敏感內容。

## 理由

- Git 本身就提供版本、diff 與審核，等於免費拿到治理。
- md 與 JSON 對 Claude 最省 token。現有的 AI-readable HTML 有 201KB，真正的規則 JSON 只有 4.6KB。
- 用 GitHub tag 安裝，不必另外維護私有 npm registry。
- 選 public 的理由：
  - 任何環境的 Claude 都能直接讀取，不必另外授權。
  - Vercel 與 CI 安裝時不需要 token。
  - 公開的設計系統與決策紀錄本身就是對外展示的作品。
  - Logo 與字體原本就公開在官網上，商標權也不靠保密成立。

## 不採用的選項

- **官網當源頭**：官網只是消費者之一，之後還有產品、簡報與文件。
- **和官網放同一個 monorepo**：設計系統會被官網的發版節奏綁住。
- **Design System artifact 當源頭**：沒有 diff 與 PR 審核，適合當發布管道，不適合當源頭。
- **zip、PDF、單一 HTML 當源頭**：無法 diff，Claude 讀取成本高；只作為匯出或搬運格式。
- **private repo**：每個消費端都要另外處理授權，而且公開的展示價值也就沒了。
- **先 private 再轉 public**：轉公開時所有歷史 commit 都會一起曝光，要事後清理歷史，風險比一開始就公開更高。
