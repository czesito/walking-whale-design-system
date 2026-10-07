// Component contracts (DR-017): brand and accessibility rules checked on the parsed page.
// Used by validate-output.mjs. Zero dependencies: a small HTML tree builder is included.

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const RAW = new Set(["script", "style"]);

/** Parse HTML into a light tree: { tag, attrs: Map, children, parent, line, text? }. */
export function parse(html) {
  const root = { tag: "#root", attrs: new Map(), children: [], parent: null, line: 1 };
  let cur = root;
  let i = 0;
  let line = 1;
  const advance = (to) => { for (; i < to; i++) if (html.charCodeAt(i) === 10) line++; };
  const tagRe = /<!--[\s\S]*?-->|<![^>]*>|<\/([a-zA-Z][\w:-]*)\s*>|<([a-zA-Z][\w:-]*)((?:\s+[^\s"'>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>/g;
  let m;
  while ((m = tagRe.exec(html))) {
    if (m.index > i) {
      const text = html.slice(i, m.index);
      cur.children.push({ tag: "#text", text, parent: cur, line });
      advance(m.index);
    }
    const startLine = line;
    advance(m.index + m[0].length);
    if (m[0].startsWith("<!")) continue;
    if (m[1]) {
      const name = m[1].toLowerCase();
      let n = cur;
      while (n && n.tag !== name) n = n.parent;
      if (n && n.parent) cur = n.parent;
      continue;
    }
    const name = m[2].toLowerCase();
    const attrs = new Map();
    for (const a of m[3].matchAll(/([^\s"'>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
      attrs.set(a[1].toLowerCase(), a[2] ?? a[3] ?? a[4] ?? "");
    }
    const node = { tag: name, attrs, children: [], parent: cur, line: startLine };
    cur.children.push(node);
    if (RAW.has(name)) {
      const end = html.toLowerCase().indexOf(`</${name}`, tagRe.lastIndex);
      const stop = end === -1 ? html.length : end;
      node.children.push({ tag: "#text", text: html.slice(tagRe.lastIndex, stop), parent: node, line });
      advance(stop);
      tagRe.lastIndex = stop;
      continue;
    }
    if (!VOID.has(name) && !m[4]) cur = node;
  }
  return root;
}

const cls = (n) => new Set((n.attrs?.get("class") ?? "").split(/\s+/).filter(Boolean));
const has = (n, c) => n.tag && n.tag[0] !== "#" && cls(n).has(c);
function* walk(n) { for (const c of n.children ?? []) { if (c.tag[0] !== "#") { yield c; yield* walk(c); } } }
const find = (n, pred) => [...walk(n)].filter(pred);
const closest = (n, pred) => { for (let p = n.parent; p; p = p.parent) if (p.tag !== "#root" && pred(p)) return p; return null; };
const text = (n) => n.tag === "#text" ? n.text : (n.tag === "script" || n.tag === "style") ? "" : (n.children ?? []).map(text).join("");
const clean = (s) => s.replace(/&nbsp;/g, " ").replace(/&[a-z]+;|&#\d+;/g, "x").replace(/\s+/g, " ").trim();
const labelled = (n) => n.attrs.has("aria-label") || n.attrs.has("aria-labelledby");
const langOf = (n) => { for (let p = n; p; p = p.parent) if (p.attrs?.has("lang")) return p.attrs.get("lang").toLowerCase(); return ""; };

// A "screen" for the one-primary rule: the nearest section-like ancestor.
const SCOPE = (p) => p.tag === "section" || p.tag === "dialog" || p.tag === "form" ||
  ["ww-section", "ww-masthead", "ww-topbar", "ww-footer", "ww-cta"].some((c) => has(p, c));

/** Returns [{ line, rule, msg }]. */
export function contracts(html) {
  const root = parse(html);
  const out = [];
  const add = (n, rule, msg) => out.push({ line: n.line, rule, msg });
  const all = [...walk(root)];

  // ---------- accessibility
  for (const n of all) {
    if (n.tag === "html" && !n.attrs.has("lang")) add(n, "a11y", "<html> needs a lang attribute (DR-006)");
    if (n.tag === "img" && !n.attrs.has("alt")) add(n, "a11y", "<img> needs alt; use alt=\"\" for decoration");
    if (has(n, "ww-btn--icon") && !labelled(n)) add(n, "a11y", "icon-only button needs aria-label");
    if (n.tag === "svg" && has(n, "ww-icon") && n.attrs.get("aria-hidden") !== "true" && !labelled(n)) add(n, "a11y", "decorative ww-icon needs aria-hidden=\"true\"");
    if (["ww-input", "ww-textarea", "ww-select"].some((c) => has(n, c))) {
      const id = n.attrs.get("id");
      const byFor = id && all.some((l) => l.tag === "label" && l.attrs.get("for") === id);
      if (!byFor && !labelled(n) && !closest(n, (p) => p.tag === "label")) add(n, "a11y", "form control needs a visible <label for> (or aria-label)");
    }
    if (n.tag === "table" && has(n, "ww-table") && !n.children.some((c) => c.tag === "caption")) add(n, "a11y", "ww-table needs a <caption>");
    if (n.tag === "svg" && has(n, "ww-annot")) {
      if (n.attrs.get("role") !== "img") add(n, "a11y", "annotated SVG needs role=\"img\"");
      if (!n.children.some((c) => c.tag === "title")) add(n, "a11y", "annotated SVG needs a <title>");
    }
  }

  // ---------- growth layers (DR-014)
  for (const n of all.filter((x) => has(x, "ww-layers"))) {
    if (n.attrs.get("aria-hidden") !== "true") add(n, "layers", "ww-layers needs aria-hidden=\"true\"; the text carries the state");
    const idx = closest(n, (p) => has(p, "ww-index"));
    const counted = idx && find(idx, (c) => has(c, "ww-index__count")).some((c) => clean(text(c)));
    if (!counted && !n.attrs.has("data-ww-progress-label")) add(n, "layers", "ww-layers must sit in a ww-index with a ww-index__count that states the same thing in text");
    if (closest(n, (p) => has(p, "ww-masthead"))) add(n, "layers", "no growth layers in the hero; they only appear where they carry information");
    const units = n.children.filter((c) => c.tag[0] !== "#").length;
    if (units > 24) add(n, "layers", `${units} layers; above 24 use a text page number instead`);
    if (n.children.filter((c) => has(c, "is-current")).length > 1) add(n, "layers", "only one layer can be is-current");
  }

  // ---------- buttons
  const scopes = new Map();
  for (const n of all.filter((x) => has(x, "ww-btn--primary") || has(x, "ww-btn--signal"))) {
    if (has(n, "ww-btn--primary") && closest(n, (p) => has(p, "ww-topbar"))) add(n, "button", "topbar actions use ww-btn--secondary; the hero owns the primary");
    const scope = closest(n, SCOPE) ?? root;
    const key = has(n, "ww-btn--primary") ? "primary" : "signal";
    const s = scopes.get(scope) ?? { primary: [], signal: [] };
    s[key].push(n); scopes.set(scope, s);
  }
  for (const s of scopes.values()) {
    if (s.primary.length > 1) add(s.primary[1], "button", `${s.primary.length} ww-btn--primary in one section; keep one`);
    if (s.signal.length > 1) add(s.signal[1], "button", `${s.signal.length} ww-btn--signal in one section; keep one`);
  }

  // ---------- content honesty and brand
  for (const n of all) {
    if (has(n, "ww-stat") && !find(n, (c) => has(c, "ww-stat__note")).some((c) => clean(text(c)))) add(n, "content", "ww-stat needs a ww-stat__note with its source or condition");
    if (has(n, "ww-pullquote") && !find(n, (c) => has(c, "ww-pullquote__cite")).some((c) => clean(text(c)))) add(n, "content", "ww-pullquote needs a ww-pullquote__cite naming the source");
    if (has(n, "ww-kicker__no") && !/^(No\. \d{2,}|Fig\. \d{2,})$/.test(clean(text(n)))) add(n, "brand", `kicker number "${clean(text(n))}" must read like "No. 01"`);
    if (n.tag === "img" && has(n, "ww-logo")) {
      const src = n.attrs.get("src") ?? "";
      if (/walking-whale-(wordmark|mark|icon)[\w-]*\.svg$/.test(src) && !/-(abyss|pearl|bone)\.svg$/.test(src)) add(n, "brand", "the currentColor logo renders black inside <img>; use the -abyss or -pearl file");
    }
    if (has(n, "ww-figure--annotated")) {
      const items = find(n, (c) => has(c, "ww-annot__item")).length;
      if (items > 5) add(n, "brand", `${items} annotations in one figure; split above 5 (DR-015)`);
    }
    if ((/^h[1-3]$/.test(n.tag) || has(n, "ww-hero")) && !has(n, "ww-slide__title") && !has(n, "ww-slide__display")) {
      const t = clean(text(n));
      const han = (t.match(/[㐀-鿿豈-﫿]/g) ?? []).length;
      if (langOf(n).startsWith("zh") && han && [...t.replace(/\s/g, "")].length > 20) add(n, "brand", `Chinese heading is ${[...t.replace(/\s/g, "")].length} characters; keep it within 20`);
    }
  }
  // ---------- motion: errors, warnings, toasts and alerts never animate in
  const STILL = (p) => ["ww-error", "ww-callout--warn", "ww-callout--danger", "ww-toast"].some((c) => has(p, c)) || p.attrs?.get("role") === "alert";
  for (const n of all.filter((x) => ["ww-rise", "ww-reveal", "ww-stagger"].some((c) => has(x, c)) || x.attrs.has("data-ww-step"))) {
    if (STILL(n) || closest(n, STILL)) add(n, "motion", "errors, warnings, toasts and alerts appear without motion");
  }

  deckContracts(all, add);

  const heroes = new Map();
  for (const n of all.filter((x) => has(x, "ww-hero"))) {
    const scope = closest(n, (p) => p.attrs.has("lang")) ?? root;
    heroes.set(scope, (heroes.get(scope) ?? 0) + 1);
    if (heroes.get(scope) === 2) add(n, "brand", "more than one ww-hero on the page");
  }
  return out;
}

// ---------------------------------------------------------------- decks (DR-019)
// Text budget per slide, by what the deck is for: "talk" is presented by a speaker, "send" is read alone.
export const BUDGET = { talk: { zh: 120, en: 60 }, send: { zh: 240, en: 120 } };
const HAN_G = /[㐀-䶿一-鿿豈-﫿]/g;
const WORD_G = /[A-Za-z0-9]+(?:['’.-][A-Za-z0-9]+)*/g;
// Not counted: the claim itself, labels and numbering, sources and assumptions, notes, the text inside
// a recreated product screen (it is a picture), chart ticks, and the legend that repeats an annotated figure.
const UNCOUNTED = ["ww-slide__notes", "ww-slide__title", "ww-slide__display", "ww-kicker", "ww-slide__source", "ww-slide__flag",
  "ww-stat__note", "ww-dial__note", "ww-device", "ww-chart__label", "ww-annot__legend", "ww-deck__defs"];
const uncounted = (n) => n.tag === "title" || n.tag === "desc" || n.tag === "script" || n.tag === "style" ||
  [...cls(n)].some((c) => UNCOUNTED.includes(c) || /__no$/.test(c));

/** Visible reading text of a node: views count their tabs plus the longest panel. */
function readingText(n) {
  if (n.tag === "#text") return n.text;
  if (uncounted(n)) return " ";
  if (has(n, "ww-views") || n.attrs?.has("data-ww-views")) {
    const isViews = (p) => has(p, "ww-views") || p.attrs?.has("data-ww-views");
    const panels = find(n, (c) => c.attrs.get("role") === "tabpanel" && closest(c, isViews) === n);
    const tabs = find(n, (c) => c.attrs.get("role") === "tab").map(readingText).join(" ");
    const longest = panels.map(readingText).sort((a, b) => units(b, "zh") - units(a, "zh"))[0] ?? "";
    return ` ${tabs} ${longest} `;
  }
  return (n.children ?? []).map(readingText).join(n.tag === "text" || /^(p|li|h\d|dd|dt|td|th|div|span)$/.test(n.tag) ? "" : " ") + " ";
}
/** zh: Han characters plus Latin or numeric words. en: words. */
export function units(s, lang) {
  const t = s.replace(/&nbsp;/g, " ").replace(/&[a-z]+;|&#\d+;/g, " ");
  const words = (t.match(WORD_G) ?? []).length;
  return lang === "zh" ? (t.match(HAN_G) ?? []).length + words : words;
}

const findAll = find;
const CALC_FN = new Set(["min", "max", "round", "floor", "ceil", "abs"]);
/** Same grammar as the runtime: numbers, declared variables, + - * / ( ) , and a few functions. */
function calcError(src, names) {
  const re = /\s*(\d+(?:\.\d+)?|\.\d+|[A-Za-z_]\w*|[-+*/(),])/y;
  let at = 0, m, depth = 0;
  while (at < src.length && (m = re.exec(src))) {
    const t = m[1];
    if (/^[A-Za-z_]/.test(t) && !CALC_FN.has(t) && !names.has(t)) return `unknown name "${t}"; declare it with data-ww-var`;
    if (t === "(") depth++;
    if (t === ")" && --depth < 0) return "unbalanced brackets";
    at = re.lastIndex;
  }
  if (src.slice(at).trim()) return `unexpected "${src.slice(at).trim().charAt(0)}"`;
  if (depth) return "unbalanced brackets";
  return "";
}

function deckContracts(all, add) {
  const decks = all.filter((x) => has(x, "ww-deck"));
  if (!decks.length) return;
  for (const d of decks) {
    const use = d.attrs.get("data-ww-use");
    if (!["talk", "send"].includes(use)) add(d, "deck", "ww-deck needs data-ww-use=\"talk\" (presented) or \"send\" (read alone); it sets the text budget");
    for (const c of d.children) {
      if (c.tag[0] === "#") continue;
      if (!has(c, "ww-slide") && !has(c, "ww-deck__defs")) add(c, "deck", `<${c.tag}> directly in ww-deck; everything goes inside a ww-slide`);
    }
    const budget = BUDGET[use] ?? BUDGET.talk;
    for (const s of find(d, (x) => has(x, "ww-slide"))) {
      const lang = langOf(s).startsWith("zh") ? "zh" : "en";
      // Notes are not on the slide: nothing inside them counts toward the slide's rules.
      const onSlide = (c) => !closest(c, (p) => has(p, "ww-slide__notes"));
      const find = (n, pred) => findAll(n, (c) => pred(c) && onSlide(c));
      const id = s.attrs.get("id") ? `#${s.attrs.get("id")}` : "slide";
      if (s.parent !== d) add(s, "deck", `${id} is not a direct child of ww-deck`);
      const heads = find(s, (c) => has(c, "ww-slide__title") || has(c, "ww-slide__display"));
      if (heads.length > 1) add(heads[1], "deck", `${id} has ${heads.length} titles; one slide, one claim`);
      if (!heads.length && !find(s, (c) => has(c, "ww-pullquote")).length) add(s, "deck", `${id} needs a ww-slide__title that states its claim as a sentence (or a ww-slide__display)`);
      for (const h of heads) {
        const t = clean(text(h));
        const len = [...t.replace(/\s/g, "")].length;
        const hl = langOf(h).startsWith("zh") ? "zh" : "en";
        const display = has(h, "ww-slide__display");
        if (hl === "zh" && len > (display ? 30 : 20)) add(h, "deck", `${id} title is ${len} characters; keep it within ${display ? 30 : 20}`);
        if (hl === "en" && units(t, "en") > (display ? 16 : 14)) add(h, "deck", `${id} title is ${units(t, "en")} words; keep it within ${display ? 16 : 14}`);
      }
      const n = units(readingText(s), lang);
      const cap = budget[lang];
      if (n > cap) add(s, "deck", `${id} carries ${n} ${lang === "zh" ? "characters" : "words"} of text; the ${use ?? "talk"} budget is ${cap}. Move detail to the notes or split the slide`);
      for (const l of find(s, (c) => c.tag === "ul" || c.tag === "ol")) {
        const items = l.children.filter((c) => c.tag === "li").length;
        const max = has(l, "ww-agenda") ? 7 : 6;
        if (items > max) add(l, "deck", `${id}: a list of ${items}; keep it to ${max} or split the slide`);
        if (closest(l, (p) => p.tag === "li" && closest(p, (q) => q === s))) add(l, "deck", `${id}: nested list; a slide is not an outline`);
      }
      for (const g of find(s, (c) => has(c, "ww-grid") || has(c, "ww-flow"))) {
        const items = g.children.filter((c) => c.tag[0] !== "#").length;
        if (items > 6) add(g, "deck", `${id}: ${items} items in one grid or flow; keep it to 6`);
      }
      for (const t of find(s, (c) => c.tag === "table")) {
        const rows = find(t, (c) => c.tag === "tr" && closest(c, (p) => p.tag === "tbody" || p.tag === "table") && !closest(c, (p) => p.tag === "thead"));
        const cols = Math.max(0, ...find(t, (c) => c.tag === "tr").map((r) => r.children.filter((c) => c.tag === "td" || c.tag === "th").length));
        if (rows.length > 6) add(t, "deck", `${id}: ${rows.length} table rows; keep it to 6 on a slide`);
        if (cols > 5) add(t, "deck", `${id}: ${cols} table columns; keep it to 5 on a slide`);
      }
      const vars = find(s, (c) => c.tag === "input" && c.attrs.has("data-ww-var"));
      if (vars.length && !find(s, (c) => has(c, "ww-dial__note")).some((c) => clean(text(c)))) {
        add(s, "deck", `${id}: a dial needs a ww-dial__note stating the assumptions behind the numbers`);
      }
      const names = new Set(vars.map((v) => v.attrs.get("data-ww-var")));
      for (const o of find(s, (c) => c.attrs.has("data-ww-calc"))) {
        const err = calcError(o.attrs.get("data-ww-calc"), names);
        if (err) add(o, "deck", `${id}: data-ww-calc "${o.attrs.get("data-ww-calc")}": ${err}`);
        const r = o.attrs.get("data-ww-round");
        if (r !== undefined && !/^(1?\d|20)$/.test(r)) add(o, "deck", `${id}: data-ww-round must be a whole number from 0 to 20`);
      }
      for (const c of find(s, (x) => x.tag === "svg" && has(x, "ww-chart"))) {
        if (c.attrs.get("role") !== "img" || !c.children.some((k) => k.tag === "title")) add(c, "a11y", `${id}: ww-chart needs role="img" and a <title> that states the data`);
      }
      for (const nt of find(s, (x) => has(x, "ww-slide__notes"))) if (nt.tag !== "aside") add(nt, "deck", `${id}: ww-slide__notes must be an <aside>`);
    }
  }
}
