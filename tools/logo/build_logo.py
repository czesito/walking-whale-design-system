#!/usr/bin/env python3
"""Build every Walking Whale logo asset from the two source vectors (DR-010).

The skeleton mark and curled icon are locked: their outlines are copied from the
source files untouched, only translated and scaled. The wordmark text is set in
Cormorant Garamond SemiBold (Latin) or Noto Serif TC SemiBold (CJK) and converted
to outlines, so no asset depends on an installed font.

Usage (see README.md in this folder for where to get the fonts):

  python3 tools/logo/build_logo.py \
    --latin-font CormorantGaramond-SemiBold.ttf \
    --cjk-font NotoSerifTC-SemiBold.otf [--cjk-font more-subsets.woff2 ...] \
    [--png]

Requires: fonttools, brotli, uharfbuzz; resvg-py for --png.
"""
import argparse, json, os, re, sys

from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
import uharfbuzz as hb

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ASSETS = os.path.join(ROOT, "assets")

# ------------------------------------------------------------------ decisions (DR-010)
SPEC = {
    "wordmark_text": "WALKING WHALE",
    "wordmark_zh_text": "走路鯨魚",
    "tracking_em": 0.0902,                 # Latin caps tracking, all lockups
    "stacked": {
        "text_width_to_mark_width": 1.40,  # S4
        "gap_to_cap_height": 35 / 31,      # from the original lockup
        "text_center_offset_to_mark_width": -3 / 388,  # original optical offset
    },
    "horizontal_en": {
        "cap_height_to_mark_height": 0.36, # E3
        "gap_to_cap_height": 1.07,
    },
    "horizontal_zh": {
        "em_to_mark_height": 0.58,         # Z3
        "tracking_em": 0.10,
        "gap_to_em": 0.64,
    },
}

# ------------------------------------------------------------------ geometry helpers
class Shape:
    """A single-path source vector using absolute M / C / Z commands."""

    def __init__(self, svg_path):
        d = re.search(r'\sd="([^"]+)"', open(svg_path, encoding="utf-8").read()).group(1)
        self.tokens = re.findall(r"[MCZ]|-?\d*\.?\d+", d)
        self.bbox = self._bbox()
        self.w = self.bbox[2] - self.bbox[0]
        self.h = self.bbox[3] - self.bbox[1]

    def _segments(self):
        i, cur, start, t = 0, (0.0, 0.0), (0.0, 0.0), self.tokens
        while i < len(t):
            if t[i] == "M":
                cur = start = (float(t[i+1]), float(t[i+2])); yield ("M", [cur]); i += 3
            elif t[i] == "C":
                pts = [(float(t[i+1+2*k]), float(t[i+2+2*k])) for k in range(3)]
                yield ("C", [cur] + pts); cur = pts[2]; i += 7
            elif t[i] == "Z":
                cur = start; yield ("Z", []); i += 1
            else:
                raise ValueError(f"unexpected token {t[i]!r}")

    def _bbox(self):
        xs, ys = [], []
        for cmd, p in self._segments():
            if cmd == "M":
                xs.append(p[0][0]); ys.append(p[0][1])
            elif cmd == "C":
                for s in range(1, 49):
                    u = s / 48; a, b, c, e = (1-u)**3, 3*(1-u)**2*u, 3*(1-u)*u**2, u**3
                    xs.append(a*p[0][0]+b*p[1][0]+c*p[2][0]+e*p[3][0])
                    ys.append(a*p[0][1]+b*p[1][1]+c*p[2][1]+e*p[3][1])
        return min(xs), min(ys), max(xs), max(ys)

    def path(self, k, ox, oy):
        """Outline scaled by k with its bbox origin moved to (ox, oy)."""
        f = lambda x, y: f"{(x - self.bbox[0]) * k + ox:.2f} {(y - self.bbox[1]) * k + oy:.2f}"
        out = []
        for cmd, p in self._segments():
            if cmd == "M": out.append("M " + f(*p[0]))
            elif cmd == "C": out.append("C " + " ".join(f(*q) for q in p[1:]))
            else: out.append("Z")
        return " ".join(out)


class LatinText:
    def __init__(self, font_path):
        self.path = font_path
        self.tt = TTFont(font_path); self.gs = self.tt.getGlyphSet(); self.order = self.tt.getGlyphOrder()
        face = hb.Face(hb.Blob.from_file_path(font_path)); self.font = hb.Font(face); self.upem = face.upem
        bp = BoundsPen(self.gs); self.gs[self.tt.getBestCmap()[ord("H")]].draw(bp); self.cap = bp.bounds[3]

    def _shape(self, text):
        buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
        hb.shape(self.font, buf, {"kern": True, "liga": False})
        return [(self.order[i.codepoint], p.x_advance) for i, p in zip(buf.glyph_infos, buf.glyph_positions)]

    def outline(self, text, scale, tracking_em, x0, baseline):
        """(svg path d, ink bbox) with the ink's left edge placed at x0."""
        track = tracking_em * self.upem
        glyphs = self._shape(text)
        # first pass: ink bbox at origin
        pen_x, boxes = 0.0, []
        for name, adv in glyphs:
            bp = BoundsPen(self.gs); self.gs[name].draw(bp)
            if bp.bounds:
                b = bp.bounds; boxes.append((pen_x + b[0], b[1], pen_x + b[2], b[3]))
            pen_x += adv + track
        ink_left = min(b[0] for b in boxes) * scale
        shift = x0 - ink_left
        ds, pen_x = [], 0.0
        for name, adv in glyphs:
            sp = SVGPathPen(self.gs, ntos=lambda v: f"{v:.2f}")
            self.gs[name].draw(TransformPen(sp, (scale, 0, 0, -scale, shift + pen_x * scale, baseline)))
            d = sp.getCommands()
            if d: ds.append(d)
            pen_x += adv + track
        bb = (x0, baseline - max(b[3] for b in boxes) * scale,
              shift + max(b[2] for b in boxes) * scale, baseline - min(b[1] for b in boxes) * scale)
        return " ".join(ds), bb

    def ink_width(self, text, scale, tracking_em):
        _, bb = self.outline(text, scale, tracking_em, 0, 0); return bb[2] - bb[0]


class CJKText:
    def __init__(self, font_paths):
        self.fonts = [TTFont(p) for p in font_paths]

    def _find(self, ch):
        for tt in self.fonts:
            g = tt.getBestCmap().get(ord(ch))
            if g: return tt, g
        raise SystemExit(f"No CJK font provided covers {ch!r}")

    def outline(self, text, em, tracking_em, x0, em_top):
        ds, xs1, ys0, ys1, x = [], [], [], [], x0
        for ch in text:
            tt, g = self._find(ch); gs = tt.getGlyphSet(); upem = tt["head"].unitsPerEm; s = em / upem
            asc, desc = tt["hhea"].ascent, -tt["hhea"].descent
            base = em_top + em * asc / (asc + desc)
            sp = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}"); gs[g].draw(TransformPen(sp, (s, 0, 0, -s, x, base)))
            ds.append(sp.getCommands())
            bp = BoundsPen(gs); gs[g].draw(bp); b = bp.bounds
            xs1.append(x + b[2] * s); ys0.append(base - b[3] * s); ys1.append(base - b[1] * s)
            x += tt["hmtx"][g][0] * s + tracking_em * em
        return " ".join(ds), (x0, min(ys0), max(xs1), max(ys1))

# ------------------------------------------------------------------ lockups
def stacked(mark, latin):
    p = SPEC["stacked"]
    width = p["text_width_to_mark_width"] * mark.w
    s = width / latin.ink_width(SPEC["wordmark_text"], 1.0, SPEC["tracking_em"])
    cap = latin.cap * s
    gap = p["gap_to_cap_height"] * cap
    cx = mark.w / 2 + p["text_center_offset_to_mark_width"] * mark.w
    left = min(0.0, cx - width / 2)
    # layout in a frame whose left edge is the leftmost ink
    mark_x = -left
    text_d, tb = latin.outline(SPEC["wordmark_text"], s, SPEC["tracking_em"], cx - width / 2 - left, mark.h + gap + cap)
    box_w = max(mark_x + mark.w, tb[2]); box_h = max(mark.h, tb[3])
    return [mark.path(1.0, mark_x, 0), text_d], (box_w, box_h), {"cap_height_to_mark_height": round(cap / mark.h, 4)}

def horizontal_en(mark, latin):
    p = SPEC["horizontal_en"]
    cap = p["cap_height_to_mark_height"] * mark.h
    s = cap / latin.cap
    gap = p["gap_to_cap_height"] * cap
    base = mark.h / 2 + cap / 2
    text_d, tb = latin.outline(SPEC["wordmark_text"], s, SPEC["tracking_em"], mark.w + gap, base)
    top = min(0.0, tb[1]); h = max(mark.h, tb[3]) - top
    if top < 0:  # keep everything inside a 0-origin box
        return horizontal_shifted(mark, latin, -top)
    return [mark.path(1.0, 0, 0), text_d], (tb[2], h), {}

def horizontal_shifted(mark, latin, dy):
    p = SPEC["horizontal_en"]; cap = p["cap_height_to_mark_height"] * mark.h; s = cap / latin.cap
    text_d, tb = latin.outline(SPEC["wordmark_text"], s, SPEC["tracking_em"], mark.w + p["gap_to_cap_height"] * cap, mark.h / 2 + cap / 2 + dy)
    return [mark.path(1.0, 0, dy), text_d], (tb[2], max(mark.h + dy, tb[3])), {}

def horizontal_zh(mark, cjk):
    p = SPEC["horizontal_zh"]
    em = p["em_to_mark_height"] * mark.h
    text_d, tb = cjk.outline(SPEC["wordmark_zh_text"], em, p["tracking_em"], mark.w + p["gap_to_em"] * em, mark.h / 2 - em / 2)
    dy = max(0.0, -tb[1])
    if dy:
        text_d, tb = cjk.outline(SPEC["wordmark_zh_text"], em, p["tracking_em"], mark.w + p["gap_to_em"] * em, mark.h / 2 - em / 2 + dy)
    return [mark.path(1.0, 0, dy), text_d], (tb[2], max(mark.h + dy, tb[3])), {}

def alone(shape):
    return [shape.path(1.0, 0, 0)], (shape.w, shape.h), {}

# ------------------------------------------------------------------ output
def svg(paths, size, title, fill):
    w, h = size
    body = "".join(f'<path d="{d}"/>' for d in paths)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" role="img" aria-label="{title}">'
            f'<title>{title}</title><g fill="{fill}" fill-rule="evenodd">{body}</g></svg>\n')

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--latin-font", required=True)
    ap.add_argument("--cjk-font", action="append", required=True)
    ap.add_argument("--png", action="store_true", help="also export PNGs (needs resvg-py)")
    a = ap.parse_args()

    tokens = json.load(open(os.path.join(ROOT, "tokens", "tokens.json"), encoding="utf-8"))["color"]
    colors = {"abyss": tokens["abyss"]["$value"], "pearl": tokens["pearl"]["$value"], "bone": tokens["bone"]["$value"]}

    mark = Shape(os.path.join(ASSETS, "source", "walking_whale_icon.svg"))
    icon = Shape(os.path.join(ASSETS, "source", "walking_whale_icon_curled.svg"))
    latin = LatinText(a.latin_font); cjk = CJKText(a.cjk_font)

    builds = {
        ("mark", "walking-whale-mark", "Walking Whale"): alone(mark),
        ("icon", "walking-whale-icon", "Walking Whale"): alone(icon),
        ("wordmark", "walking-whale-wordmark-stacked", "Walking Whale"): stacked(mark, latin),
        ("wordmark", "walking-whale-wordmark-horizontal-en", "Walking Whale"): horizontal_en(mark, latin),
        ("wordmark", "walking-whale-wordmark-horizontal-zh", "走路鯨魚"): horizontal_zh(mark, cjk),
    }
    manifest = {"spec": SPEC, "files": {}}
    for (folder, name, title), (paths, size, extra) in builds.items():
        out_dir = os.path.join(ASSETS, folder); os.makedirs(out_dir, exist_ok=True)
        variants = {"": "currentColor", "-abyss": colors["abyss"], "-pearl": colors["pearl"], "-bone": colors["bone"]}
        for suffix, fill in variants.items():
            fn = f"{name}{suffix}.svg"
            open(os.path.join(out_dir, fn), "w", encoding="utf-8").write(svg(paths, size, title, fill))
        manifest["files"][f"{folder}/{name}"] = {"viewBox": [0, 0, round(size[0], 2), round(size[1], 2)],
                                                  "aspect": round(size[0] / size[1], 4), **extra}
        if a.png and folder == "wordmark":
            import io, resvg_py
            width = 1600 if "stacked" in name else 2400
            for suffix in ("-abyss", "-pearl"):
                data = resvg_py.svg_to_bytes(svg_string=svg(paths, size, title, variants[suffix]), width=width)
                open(os.path.join(out_dir, f"{name}{suffix}@{width}w.png"), "wb").write(bytes(data))
    json.dump(manifest, open(os.path.join(ASSETS, "manifest.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(json.dumps(manifest["files"], ensure_ascii=False, indent=1))

if __name__ == "__main__":
    main()
