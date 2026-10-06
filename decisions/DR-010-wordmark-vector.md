# DR-010 Wordmark 向量重建

- 狀態：已採納，2026-10-07 簽核比例與字體
- 日期：2026-10-07
- 決策者：Czesio

## 背景

完整 wordmark（骨架標誌加上 WALKING WHALE 字樣）原本只有一張 489 × 252 的 PNG，沒有向量檔，也沒有反白版。深色背景只能用不含字樣的反白骨架標誌。

量測原圖的結果：

- **骨架標誌**：使用者提供的原始 SVG（`assets/source/walking_whale_icon.svg`）與原圖疊合後幾乎完全重合。
- **原字體無法辨識**：原圖只有 489 像素寬，邊緣有壓縮雜訊。
  - 筆畫粗細最接近 Cormorant Garamond SemiBold：I 的豎筆原圖 4.6px，SemiBold 為 4.61px。
  - 字母比例最接近 Cinzel Medium：逐字重疊率 0.69，Cormorant 為 0.62。
- **原圖字距不一致**：例如 WALKING 的 A–L 間距 9px，WHALE 的只有 7px。

## 決策

1. **字樣字體**：Cormorant Garamond SemiBold，全大寫，字距 0.0902em，使用字體本身的字距微調。理由：
   - 和系統的標題字體同一家族
   - 筆畫粗細與 W 的交叉結構都和原圖相同
2. **直式比例（S4）**：

   | 項目 | 數值 |
   |---|---|
   | 字樣寬度 | 標誌寬度 × 1.40（原圖為 1.19） |
   | 字高 | 標誌高度 × 0.255 |
   | 字樣與標誌間距 | 1.13 個字高，沿用原圖 |
   | 水平位置 | 字樣中心比標誌中心偏左 0.8% 標誌寬，沿用原圖的視覺修正 |

3. **新增橫式版本**，中英各一：

   | 版本 | 字體 | 大小 | 字距 | 間距 |
   |---|---|---|---|---|
   | 英文（E3） | 同直式字樣 | 字高 = 標誌高度 × 0.36 | 同直式 | 1.07 個字高 |
   | 中文（Z3） | 思源宋體 SemiBold，走路鯨魚 | 字身 = 標誌高度 × 0.58 | 0.10em | 0.64 個字身 |

   兩者的字樣都垂直置中於標誌。
4. **色版**：每個版本有 currentColor、Abyss、Pearl、Bone 四個 SVG；wordmark 另有 PNG 匯出。
5. **最小尺寸**：

   | 版本 | 最小 |
   |---|---|
   | 直式 | 寬 160px |
   | 橫式 | 標誌高 28px |
   | Icon | 寬 32px；更小時用 favicon PNG |

6. **留白**：四周至少 0.5 倍標誌高度。
7. **舊 PNG 退役**：`walking-whale-logo-primary.png` 不再使用。

## 規則

- 骨架標誌與 curled icon 的形狀不得重畫，只能縮放與換色。
- 所有 logo 檔案由 `tools/logo/build_logo.py` 產生。比例只能透過修改這份決策與工具的 `SPEC` 調整，不手改 SVG。
- 不用即時排版的文字拼出 lockup。

## 不採用的選項

- **Cinzel Medium**：字母比例最接近原圖，但 W 沒有交叉，而且 logo 會多出一套系統外的字體。
- **沿用原圖比例 S3（1.19 倍）**：字樣比標誌寬約兩成。Czesio 選擇讓字樣更有份量的 S4。
- **橫式英文首字大寫**：雖然和官網現況一致，但和直式的全大寫不一致。

## 參考

- 比較頁：claude.ai artifact「WW Wordmark 重建」「WW Wordmark 比例」
- 規格：[foundations/logo.md](../foundations/logo.md)
