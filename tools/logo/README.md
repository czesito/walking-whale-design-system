# Logo 產生工具

從 `assets/source/` 的兩個原始向量，產生 `assets/mark/`、`assets/icon/`、`assets/wordmark/` 的所有 SVG 與 PNG，以及 `assets/manifest.json`。

比例參數寫在 `build_logo.py` 開頭的 `SPEC`，必須與 [DR-010](../../decisions/DR-010-wordmark-vector.md) 一致。這個工具不在 CI 裡執行，只有在原始向量或比例改變時才需要重新跑。

## 需要的東西

- Python 3.10 以上：`pip install fonttools brotli uharfbuzz resvg-py`
- Cormorant Garamond SemiBold（`CormorantGaramond-SemiBold.ttf`），從 [Google Fonts](https://fonts.google.com/specimen/Cormorant+Garamond) 下載
- 思源宋體 SemiBold（`NotoSerifTC-SemiBold.otf` 或可變字型），從 [Google Fonts](https://fonts.google.com/noto/specimen/Noto+Serif+TC) 下載

兩套字體都是 SIL OFL，可以放心使用，但不要 commit 進 repo。

## 執行

```sh
python3 tools/logo/build_logo.py \
  --latin-font path/to/CormorantGaramond-SemiBold.ttf \
  --cjk-font path/to/NotoSerifTC-SemiBold.otf \
  --png
```

`--cjk-font` 可以重複指定多個檔案；工具會逐一查找每個字在哪個檔案裡，所以也接受 npm `@fontsource/noto-serif-tc` 拆分的子集檔。

## 產生後

1. 用瀏覽器開啟 `specimens/index.html` 的 logo 區塊，確認渲染正確。
2. 比例有變動時，同步更新 DR-010 與 `foundations/logo.md`。
