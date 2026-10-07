"""Build the files of the claude.ai Design System artifact from this repository (DR-003: the artifact is a channel).

    python3 tools/claude-artifact/build.py <out-dir>

Writes <out-dir>/project/… in the layout the Design System artifact type expects. Logos must already be
uploaded to the artifact; their asset ids are listed in BLOBS. Publish the folder with the Artifact tool
(root = <out-dir>, file_path = <out-dir>/project/design-system.json, files = every other path).
"""
import json, os, re, datetime, shutil, sys
HERE = os.path.dirname(os.path.abspath(__file__))
R = os.path.normpath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(sys.argv[1], "project")
GH = "https://github.com/czesito/walking-whale-design-system/blob/main/"
SHA = os.popen(f"git -C {R} rev-parse --short HEAD").read().strip()
VERSION = json.load(open(os.path.join(R, "package.json"), encoding="utf-8"))["version"]
NOW = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap"

BLOBS = {
 "wordmark/walking-whale-wordmark-horizontal-zh-abyss.svg": ("ebf877238ce0915a09b0a306407e0c12", 73841),
 "wordmark/walking-whale-wordmark-horizontal-zh-pearl.svg": ("c2ae1024441ea5139564790e2fe4645a", 73841),
 "wordmark/walking-whale-wordmark-horizontal-en-abyss.svg": ("96cc3c532200eb3257a33a5c1295832b", 80034),
 "wordmark/walking-whale-wordmark-horizontal-en-pearl.svg": ("8a742f03563d0dbc9eba9c0388826d2f", 80034),
 "wordmark/walking-whale-wordmark-stacked-abyss.svg": ("1939542447b972bd1d1484d553ba517a", 80718),
 "wordmark/walking-whale-wordmark-stacked-pearl.svg": ("721ff644b9f8326a28fd9957d5376bc8", 80718),
 "mark/walking-whale-mark-abyss.svg": ("87f347dbd633ee03ee5750e2250c40b7", 64176),
 "mark/walking-whale-mark-pearl.svg": ("d332aad6fcec56d2131740987146b95a", 64176),
 "mark/walking-whale-mark-bone.svg": ("7c4a5bd9fe3f752b67844d39b33a4247", 64176),
 "icon/walking-whale-icon-abyss.svg": ("104d6aa0f0aa0119981ddd5f19301964", 26437),
 "icon/walking-whale-icon-pearl.svg": ("d64b8e8659edfb58d04289e687fc322e", 26437),
}

if os.path.isdir(OUT): shutil.rmtree(OUT)
os.makedirs(OUT)
def w(path, text):
    p = os.path.join(OUT, path); os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "w", encoding="utf-8").write(text)

# ---------------- tokens.json
T = json.load(open(f"{R}/tokens/tokens.json", encoding="utf-8"))
ZH = json.load(open(f"{R}/tokens/lang-zh.json", encoding="utf-8"))
def leaves(o, path=()):
    for k, v in o.items():
        if k.startswith("$"): continue
        if isinstance(v, dict) and "$value" in v: yield path + (k,), v
        elif isinstance(v, dict): yield from leaves(v, path + (k,))
name = lambda p: "ww-" + "-".join(p)
USAGE_FALLBACK = {
 "color.status.success": "Success text and icons on light grounds and on ww-color-status-success-wash.",
 "color.status.warning": "Warning text on light grounds and on ww-color-status-warning-wash.",
 "color.status.danger": "Danger and error text on light grounds and on ww-color-status-danger-wash.",
 "color.status.info": "Info text on light grounds and on ww-color-status-info-wash.",
 "color.status.success-wash": "Background of success badges and callouts.",
 "color.status.warning-wash": "Background of warning badges and callouts.",
 "color.status.danger-wash": "Background of danger badges and callouts.",
 "color.status.info-wash": "Background of info badges and callouts.",
 "color.chart.1": "First chart series.", "color.chart.2": "Second chart series.", "color.chart.3": "Third chart series.", "color.chart.4": "Fourth chart series.",
 "color.background.page": "Page ground (Pearl).", "color.background.card": "Cards, tables and inputs (White).",
 "color.background.wash": "Alternate section wash (ww-section--wash) and code blocks.", "color.background.warm": "Editorial panels, footer and plates (ww-section--warm).",
 "color.background.deep": "Abyss sections (ww-on-dark) and toasts.", "color.background.deep-raised": "Raised surfaces and hover states on Abyss.",
 "color.chart.other": "Remaining chart series grouped as other.", "color.chart.grid": "Chart gridlines.", "color.chart.label": "Chart labels and axis text.",
}
def alias(v):
    m = re.fullmatch(r"\{([^}]+)\}", v)
    return "{" + name(tuple(m.group(1).split("."))) + "}" if m else v.lower()
colors = []
for p, t in leaves(T["color"]):
    key = "color." + ".".join(p)
    colors.append({"name": name(("color",) + p), "value": alias(t["$value"]), "usage": t.get("$description") or USAGE_FALLBACK.get(key, "")})
SPACE_USE = {"1": "Between an icon and its text; the tightest padding.", "2": "Between a label and its field; between list items.", "3": "Between a kicker and its heading; small groups.", "4": "Minimum side gutter on phones; paragraphs inside cards.", "5": "Card padding and grid gaps.", "6": "Large blocks inside a section.", "7": "Between a section opener and its content.", "8": "Maximum side gutter on desktop; between two columns.", "9": "Between large blocks.", "10": "Above the hero."}
spacing = [{"name": name(("space", k)), "value": t["$value"], "usage": SPACE_USE[k]} for (k,), t in leaves(T["space"])]
radius = [{"name": name(("radius",) + p), "value": t["$value"], "usage": t.get("$description", "")} for p, t in leaves(T["radius"])]
def shadow(v): return f'{v["offsetX"]} {v["offsetY"]} {v["blur"]} {v["spread"]} {v["color"].lower()}'
SH_USE = {"sm": "Reserved; unused in v0.1. Cards never cast shadows (DR-013).", "md": "Toast.", "lg": "Drawer."}
shadows = [{"name": name(("shadow", k)), "value": shadow(t["$value"]), "usage": SH_USE[k]} for (k,), t in leaves(T["shadow"])]
LAYOUT_USE = {"measure-body": "Maximum line length of running text; 34em under Chinese (about 34 characters).", "container": "Maximum width of a page (ww-container).", "container-narrow": "Articles and forms (ww-container--narrow).", "section-gap": "Vertical padding of a section (ww-section)."}
layout = [{"name": name(("layout", k)), "value": t["$value"], "usage": LAYOUT_USE.get(k, t.get("$description", ""))} for (k,), t in leaves(T["layout"])]
durations = [{"name": name(("motion", "duration", k)), "value": t["$value"], "usage": {"instant": "Hover and press.", "base": "State changes, drawer, toast.", "reveal": "Left-to-right reveal of growth layers and lines.", "rise": "Fade and rise of sections and staggered cards."}[k]} for p_, t in leaves(T["motion"]) if len(p_) == 2 and p_[0] == "duration" for k in [p_[1]]]
easing = [{"name": "ww-motion-ease", "value": "cubic-bezier(0.4, 0, 0.2, 1)", "usage": "The one curve every motion uses."},
          {"name": "ww-motion-distance-rise", "value": "14px", "usage": "How far a section rises as it fades in."}]
def stack(v): return ", ".join(f'"{f}"' if " " in f else f for f in v)
fam = {k: stack(t["$value"]) for (k,), t in leaves(T["font"]["family"]) if isinstance(t["$value"], list)}
zfam = {k: stack(t["$value"]) for (k,), t in leaves(ZH["font"]["family"]) if isinstance(t.get("$value"), list)}
families = {"display": fam["display"], "body": fam["body"], "ui": fam["ui"], "mono": fam["mono"],
            "display-zh": zfam.get("display", fam["display"]), "body-zh": zfam.get("body", fam["body"]), "ui-zh": zfam.get("ui", fam["ui"])}
EN_HERO = "We work with people before we work on systems"
ZH_HERO = "先與人同行，再著手系統"
groups = [
 {"name": "Display", "family": "display", "styles": [
   {"name": "hero", "fontSize": "4.6rem", "lineHeight": 1.0, "letterSpacing": "-0.03em", "fontWeight": 500, "sample": EN_HERO, "usage": "ww-hero. Fluid: clamp(2.6rem, 7vw, 4.6rem). Once per page."},
   {"name": "h1", "fontSize": "3rem", "lineHeight": 1.15, "letterSpacing": "-0.01em", "fontWeight": 500, "sample": "Why we talk about process first", "usage": "Page titles. Fluid: clamp(2rem, 5vw, 3rem)."},
   {"name": "h2", "fontSize": "2.2rem", "lineHeight": 1.15, "letterSpacing": "-0.01em", "fontWeight": 500, "sample": "The face you show", "usage": "Section headings. Fluid: clamp(1.6rem, 4vw, 2.2rem)."},
   {"name": "h3", "fontSize": "1.5rem", "lineHeight": 1.15, "letterSpacing": "-0.01em", "fontWeight": 600, "sample": "Meet, understand, shape", "usage": "Sub-sections."},
   {"name": "h4", "fontSize": "1.25rem", "lineHeight": 1.15, "letterSpacing": "-0.01em", "fontWeight": 600, "sample": "The systems you run on", "usage": "Card titles."}]},
 {"name": "Text", "family": "body", "styles": [
   {"name": "lede", "fontSize": "1.25rem", "lineHeight": 1.35, "fontWeight": 400, "sample": "Walking Whale is a selective systems partner.", "usage": "ww-lede under a headline, in ww-color-text-muted. Fluid: clamp(1.0625rem, 2vw, 1.25rem)."},
   {"name": "body", "fontSize": "1.0625rem", "lineHeight": 1.62, "fontWeight": 400, "sample": "Every large system begins as an early form.", "usage": "Running text (ww-body, ww-prose)."}]},
 {"name": "Interface", "family": "ui", "styles": [
   {"name": "ui", "fontSize": "0.9375rem", "lineHeight": 1.4, "fontWeight": 500, "sample": "Start a conversation", "usage": "Buttons, navigation, controls (ww-ui)."},
   {"name": "sm", "fontSize": "0.8125rem", "lineHeight": 1.4, "fontWeight": 400, "sample": "Captions and helper text", "usage": "Captions and helper text in ww-color-text-muted (ww-sm)."}]},
 {"name": "Mono", "family": "mono", "styles": [
   {"name": "kicker", "fontSize": "0.75rem", "lineHeight": 1.4, "letterSpacing": "0.1em", "fontWeight": 500, "sample": "No. 01 WHAT WE DO", "usage": "ww-kicker in English: uppercase via CSS, written in sentence case."},
   {"name": "mono", "fontSize": "0.8125rem", "lineHeight": 1.4, "fontWeight": 400, "sample": "No. 01 · 2026-10-07 · 03 / 07", "usage": "Numbers, dates, metadata (ww-mono, card meta, figure numbers)."}]},
 {"name": "Chinese", "family": "display-zh", "styles": [
   {"name": "hero-zh", "fontSize": "4.6rem", "lineHeight": 1.25, "letterSpacing": "0.04em", "fontWeight": 500, "sample": ZH_HERO, "usage": "ww-hero under :lang(zh): CJK face first, looser leading and tracking (DR-005, DR-006)."},
   {"name": "h2-zh", "fontSize": "2.2rem", "lineHeight": 1.25, "letterSpacing": "0.04em", "fontWeight": 500, "sample": "對外的門面，對內的系統", "usage": "Section headings under :lang(zh)."},
   {"name": "h3-zh", "family": "display-zh", "fontSize": "1.5rem", "lineHeight": 1.35, "letterSpacing": "0.04em", "fontWeight": 600, "sample": "相識、理解、成形", "usage": "Sub-sections under :lang(zh)."},
   {"name": "body-zh", "family": "body-zh", "fontSize": "1.0625rem", "lineHeight": 1.85, "letterSpacing": "0.02em", "fontWeight": 400, "sample": "所有大型系統都從一個早期的形態開始。", "usage": "Running text under :lang(zh). Measure 34em."},
   {"name": "ui-zh", "family": "ui-zh", "fontSize": "0.9375rem", "lineHeight": 1.6, "letterSpacing": "0.02em", "fontWeight": 500, "sample": "開始對話", "usage": "Interface text under :lang(zh)."},
   {"name": "kicker-zh", "family": "ui-zh", "fontSize": "0.8125rem", "lineHeight": 1.6, "letterSpacing": "0.12em", "fontWeight": 500, "sample": "我們做什麼", "usage": "ww-kicker under :lang(zh): UI face, no case change, 13px minimum."}]},
]
tokens = {"name": "Walking Whale", "version": 1,
  "meta": {"source": "github", "repo": "czesito/walking-whale-design-system", "ref": f"main@{SHA}", "paths": {"tokens": ["tokens/tokens.json", "tokens/lang-zh.json"], "assets": ["assets/"], "docs": ["SKILL.md", "content/", "foundations/", "components/", "patterns/", "slides/"]}, "synced": NOW[:10]},
  "color": {"themes": [{"id": "light", "name": "Light"}], "tokens": colors},
  "type": {"fonts": [], "families": families, "groups": groups},
  "spacing": {"tokens": spacing}, "radius": {"tokens": radius},
  "shadow": {"note": "Only floating surfaces cast shadows (DR-013).", "tokens": shadows},
  "layout": {"tokens": layout}, "duration": {"tokens": durations}, "easing": {"tokens": easing}}
w("tokens.json", json.dumps(tokens, ensure_ascii=False, indent=2) + "\n")

# ---------------- bundle.css: the system's own stylesheet, verbatim
w("components/bundle.css", open(f"{R}/dist/ww.css", encoding="utf-8").read())

# ---------------- components and patterns
NAMES = {"layout": "Layout", "type": "Type", "logo": "Logo", "kicker": "Kicker", "rule-accent": "RuleAccent", "motion": "Motion", "layers": "Layers",
 "button": "Button", "card": "Card", "chip": "Chip", "status-badge": "StatusBadge", "pull-quote": "PullQuote", "callout": "Callout", "tldr": "Tldr",
 "stat": "Stat", "table": "Table", "code": "Code", "figure": "Figure", "prose": "Prose", "toc": "Toc", "article-list": "ArticleList", "filter": "Filter",
 "form": "Form", "loading": "Loading", "empty": "EmptyState", "error": "ErrorState", "toast": "Toast", "topbar": "Topbar", "drawer": "Drawer", "footer": "Footer",
 "hero": "Hero", "section-opener": "SectionOpener", "services": "Services", "steps": "Steps", "case-list": "CaseList", "team": "Team", "cta": "Cta", "contact": "Contact"}
GROUP = {**{k: "Foundations" for k in ["layout", "type", "motion"]}, **{k: "Brand" for k in ["logo", "kicker", "rule-accent", "layers"]}, "button": "Actions",
 **{k: "Content" for k in ["card", "chip", "status-badge", "pull-quote", "callout", "tldr", "stat", "table", "code", "figure"]},
 **{k: "Article" for k in ["prose", "toc", "article-list", "filter"]}, "form": "Forms", **{k: "Feedback" for k in ["loading", "empty", "error", "toast"]},
 **{k: "Page frame" for k in ["topbar", "drawer", "footer"]}}
HEIGHT = {"layout": 520, "type": 520, "logo": 360, "kicker": 220, "rule-accent": 200, "motion": 420, "layers": 520, "button": 360, "card": 300, "chip": 140,
 "status-badge": 100, "pull-quote": 260, "callout": 360, "tldr": 240, "stat": 220, "table": 320, "code": 260, "figure": 900, "prose": 640, "toc": 260,
 "article-list": 480, "filter": 120, "form": 980, "loading": 220, "empty": 260, "error": 260, "toast": 160, "topbar": 120, "drawer": 560, "footer": 320,
 "hero": 560, "section-opener": 420, "services": 420, "steps": 360, "case-list": 560, "team": 520, "cta": 300, "contact": 560}

def blobify(html):
    def rep(m):
        b = BLOBS.get(m.group(1))
        if not b: raise SystemExit(f"no upload for {m.group(1)}")
        return f"/_blob/{b[0]}"
    return re.sub(r"\.\./\.\./assets/([\w./-]+\.svg)", rep, html)

def zh_part(html):
    a = html.index('<p class="ww-lang-label">zh-Hant</p>') + len('<p class="ww-lang-label">zh-Hant</p>')
    b = html.index('<section class="ww-stack" lang="en">')
    part = html[a:b].rstrip()
    assert part.endswith("</section>")
    return part[: -len("</section>")].strip()

for dir_ in ["components", "patterns"]:
    for item in json.load(open(f"{R}/{dir_}/index.json", encoding="utf-8"))["items"]:
        n = item["name"]; comp = NAMES[n]
        src = open(f"{R}/{dir_}/{n}/{n}.html", encoding="utf-8").read()
        body = blobify(zh_part(src))
        group = "Patterns" if dir_ == "patterns" else GROUP[n]
        preview = (f'<!-- @dsCard group="{group}" height={HEIGHT[n]} subtitle="{item["zh"]}" -->\n'
                   f'<link rel="stylesheet" href="{FONTS}">\n'
                   f'<main class="ww-container ww-section ww-stack ww-stack--lg" lang="zh-Hant">\n{body}\n</main>\n')
        w(f"components/{comp}/preview.html", preview)
        prompt = open(f"{R}/{dir_}/{n}/{n}.prompt.md", encoding="utf-8").read().split("\n", 1)[1].lstrip()
        readme = (f"# {comp}\n\n{item['use']}。\n\n"
                  f"英文範例與完整的中英對照見 repo 的 `{dir_}/{n}/{n}.html`；樣式在 `components/bundle.css`（即 repo 的 `dist/ww.css`）。\n\n{prompt}")
        w(f"components/{comp}/README.md", readme)

# ---------------- brand book sections from the repo docs, links pointed at GitHub
def relink(md, src_path):
    base = os.path.dirname(src_path)
    def rep(m):
        text, href = m.group(1), m.group(2)
        if re.match(r"^(https?:|mailto:|#)", href): return m.group(0)
        path, _, frag = href.partition("#")
        target = os.path.normpath(os.path.join(base, path)) if path else src_path
        return f"[{text}]({GH}{target}{('#' + frag) if frag else ''})"
    return re.sub(r"\[([^\]]*)\]\(([^)\s]+)\)", rep, md)
SECTIONS = [("01-brand.md", "content/brand.md"), ("02-services.md", "content/services.md"), ("03-voice.md", "content/voice.md"),
  ("04-writing-zh-tw.md", "content/zh-tw.md"), ("05-writing-en.md", "content/en.md"), ("06-color.md", "foundations/color.md"),
  ("07-color-contrast.md", "foundations/color-contrast.md"), ("08-typography.md", "foundations/typography.md"), ("09-space.md", "foundations/space.md"),
  ("10-motion.md", "foundations/motion.md"), ("11-accessibility.md", "foundations/accessibility.md"), ("12-logo.md", "foundations/logo.md"),
  ("13-decisions.md", "decisions/README.md")]
for dst, src in SECTIONS:
    md = open(f"{R}/{src}", encoding="utf-8").read()
    md = re.sub(r"^<!--.*?-->\s*", "", md, flags=re.S)
    w(dst, relink(md, src))

# Slides (DR-019): not in bundle.css. The section points at the self-contained sample decks in the repo.
RAW = "https://raw.githubusercontent.com/czesito/walking-whale-design-system/main/"
deck_doc = open(f"{R}/slides/deck/deck.prompt.md", encoding="utf-8").read().split("\n", 1)[1].lstrip()
rows = "\n".join(f"| `{i['name']}` | {i['zh']} {i['en']} | {i['use']} |" for i in json.load(open(f"{R}/slides/index.json", encoding="utf-8"))["items"])
w("14-slides.md", relink(f"""# 簡報

3:2 簡報是另一套版型與執行時（[DR-019]({GH}decisions/DR-019-slides.md)），樣式在 repo 的 `dist/ww-deck.css`，不在 `components/bundle.css` 裡。

做簡報時，從範例簡報複製：[中文]({RAW}dist/deck-zh.html)、[英文]({RAW}dist/deck-en.html)。樣式、程式與標誌都已內嵌，只換 `slides:start` 與 `slides:end` 之間的頁面。

| 名稱 | 版型 | 何時用 |
|---|---|---|
{rows}

## 引擎

{deck_doc}""", "slides/deck/deck.prompt.md"))

# ---------------- assets README
w("assets/Logos/README.md", """# Logos

每個檔案都是單色的 SVG，顏色寫在檔名裡；`<img>` 不會繼承文字顏色，所以要依底色選檔。

| 檔案 | 墨色 | 用在哪裡 |
|---|---|---|
| walking-whale-wordmark-horizontal-zh-abyss.svg | Abyss（ww-color-abyss） | 中文頁的 topbar、頁尾，淺色底 |
| walking-whale-wordmark-horizontal-zh-pearl.svg | Pearl（ww-color-pearl） | 中文頁，Abyss 底 |
| walking-whale-wordmark-horizontal-en-abyss.svg | Abyss | 英文頁的 topbar、頁尾，淺色底 |
| walking-whale-wordmark-horizontal-en-pearl.svg | Pearl | 英文頁，Abyss 底 |
| walking-whale-wordmark-stacked-abyss.svg | Abyss | 封面、名片、提案首頁，淺色底；只有英文 |
| walking-whale-wordmark-stacked-pearl.svg | Pearl | 同上，Abyss 底 |
| walking-whale-mark-abyss.svg | Abyss | 骨架標誌單獨使用、案例圖版 |
| walking-whale-mark-pearl.svg | Pearl | 骨架標誌，Abyss 底 |
| walking-whale-mark-bone.svg | Bone（ww-color-bone） | 引線標註的底圖等低調用途；不可當主要標誌 |
| walking-whale-icon-abyss.svg | Abyss | 方形空間：App 圖示、社群頭像 |
| walking-whale-icon-pearl.svg | Pearl | 同上，Abyss 底 |

- 橫式的最小尺寸是標誌高 28px（`ww-logo--sm`），直式最小寬 160px，icon 最小寬 32px；更小用 favicon PNG（見 repo 的 assets/icon/）。
- 四周留白至少 0.5 倍標誌高度。不重排、不拉伸、不改色、不加效果。
""")

# ---------------- README (brand book)
readme = open(os.path.join(HERE, "readme.template.md"), encoding="utf-8").read()
w("README.md", readme.replace("{{SHA}}", SHA))

# ---------------- cover
w("components/Cover/preview.html", open(os.path.join(HERE, "cover.html"), encoding="utf-8").read())

# ---------------- index (assets recorded)
files = {}
order = []
for rel, (bid, size) in BLOBS.items():
    fn = rel.split("/")[-1]
    files[fn] = {"name": fn, "blob": bid, "size": size, "type": "image/svg+xml"}
    order.append(fn)
index = {"v": 3, "layout": "files", "createdOnFiles": {"v": 1, "at": NOW}, "title": "Walking Whale", "namespace": "WW", "libraries": [],
  "sections": {}, "groups": ["Logos"], "assetGroups": {"Logos": {"name": "Logos", "tile": "l", "order": order, "files": files}},
  "blobs": {}, "docs": {"sections": []},
  "lastChange": {"by": "Czesio", "at": NOW, "via": f"GitHub · czesito/walking-whale-design-system@{SHA}", "note": f"v{VERSION} synced from the repository"}}
w("design-system.json", json.dumps(index, ensure_ascii=False, indent=2) + "\n")
print("ds files:", sum(len(f) for _, _, f in os.walk(OUT)), "sha", SHA)
