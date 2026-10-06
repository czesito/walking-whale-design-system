# DR-016 Claude 輸出驗證器

- 狀態：已採納（預設）
- 日期：2026-10-07
- 決策者：Czesio（未表示偏好，採用 Claude 的預設提案）

## 背景

Claude 是本系統的第一順位讀者（[DR-001](DR-001-scope-readers-owner.md)）。Claude 產出的頁面如果可以自由寫 CSS，就會逐漸偏離系統：自訂顏色、自訂間距、inline style。官網目前就有 510 處 inline style。

## 決策

1. 新增 `scripts/validate-output.mjs`，檢查 Claude 產出的 HTML：
   - 只能使用系統定義的 class（`dist/ww.css` 中出現的 `ww-` class）。
   - 不可以有 `style` 屬性。
   - 不可以有 `<style>` 區塊。
   - 不可以出現 hex 色碼。
2. 所有元件範例（`components/*/*.html`）都必須通過驗證，作為 CI 的一部分。
3. 系統缺少某個需要的樣式時，正確做法是回到本 repo 新增元件或變體，而不是在輸出中自己寫 CSS。

## 理由

- 規則簡單到可以機械檢查，Claude 每次產出後都能自我驗證。
- 元件範例本身通過驗證，等於證明系統足以獨立組出頁面。

## 影響

- SVG 圖形的位置與形狀用 SVG 屬性（`x`、`y`、`d`、`viewBox`）表達，顏色一律用 class。
- 宣告式頁面（以 JSON 描述頁面，再由程式產生 HTML）排入 v0.2，見 v0.1 規格第 4 節。

## 不採用的選項

- **允許少量自訂 CSS**：界線模糊，無法自動檢查。
- **只靠文件約束**：沒有檢查就會漂移。
