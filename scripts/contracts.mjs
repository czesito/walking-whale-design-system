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
    if (/^h[1-3]$/.test(n.tag) || has(n, "ww-hero")) {
      const t = clean(text(n));
      const han = (t.match(/[㐀-鿿豈-﫿]/g) ?? []).length;
      if (langOf(n).startsWith("zh") && han && [...t.replace(/\s/g, "")].length > 20) add(n, "brand", `Chinese heading is ${[...t.replace(/\s/g, "")].length} characters; keep it within 20`);
    }
  }
  const heroes = new Map();
  for (const n of all.filter((x) => has(x, "ww-hero"))) {
    const scope = closest(n, (p) => p.attrs.has("lang")) ?? root;
    heroes.set(scope, (heroes.get(scope) ?? 0) + 1);
    if (heroes.get(scope) === 2) add(n, "brand", "more than one ww-hero on the page");
  }
  return out;
}
