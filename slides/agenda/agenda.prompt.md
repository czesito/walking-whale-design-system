# 議程 Agenda

## 何時使用

- 十頁以上的簡報，在開頭列出段落。
- 每段開始前再放一次，在目前段落加 `aria-current="step"`，就是「我們在這裡」。

## 何時不用

- 五頁以內的短簡報。

## Class 與屬性

| Class 或屬性 | 用途 |
|---|---|
| `ww-slide--agenda` | 版型 |
| `ww-agenda` | `<ol>`，最多 7 項 |
| `ww-agenda__item` | 一項；加 `aria-current="step"` 標出目前段落 |
| `ww-agenda__no` `__name` `__meta` | 編號、段落名稱、頁數或時間 |

## 規則

- 段落名稱與各段第一頁的 `data-ww-section` 一致。
- 寫頁數或時間，只寫真的。
