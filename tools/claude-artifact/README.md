# claude.ai Design System artifact

把本 repo 同步成 claude.ai 的 Design System artifact。artifact 只是發布管道，源頭仍是本 repo（DR-003）。

```sh
python3 tools/claude-artifact/build.py /path/to/out
```

產生 `out/project/` 下的品牌書（README 與各節）、`tokens.json`、每個元件與頁面模式的 `README.md` 與 `preview.html`、`components/bundle.css`（即 `dist/ww.css`）與封面。然後用 Artifact 工具發布到既有的 artifact。

- 標誌 SVG 要先上傳成 artifact 的資產，ID 寫在 `build.py` 的 `BLOBS`。標誌檔案改變時重新上傳並更新 ID。
- 品牌書的開頭在 `readme.template.md`，封面在 `cover.html`。
- 元件預覽取自各範例的中文區塊。
