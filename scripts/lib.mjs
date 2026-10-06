// Token loading, alias resolution, CSS serialization and contrast math.
// Zero dependencies on purpose: the whole pipeline is readable in one sitting.

import { readFileSync } from "node:fs";

const ALIAS = /^\{([^}]+)\}$/;
const GENERIC_FAMILIES = new Set([
  "serif", "sans-serif", "monospace", "cursive", "fantasy",
  "system-ui", "ui-serif", "ui-sans-serif", "ui-monospace", "ui-rounded",
  "-apple-system", "emoji", "math",
]);

export const readJSON = (path) => JSON.parse(readFileSync(path, "utf8"));

/** Flatten a DTCG tree into Map<"a.b.c", { value, type, description }>. */
export function flatten(tree, path = [], inheritedType, out = new Map()) {
  const type = tree.$type ?? inheritedType;
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith("$") || node === null || typeof node !== "object") continue;
    const p = [...path, key];
    if ("$value" in node) {
      out.set(p.join("."), { value: node.$value, type: node.$type ?? type, description: node.$description });
    } else {
      flatten(node, p, type, out);
    }
  }
  return out;
}

export const aliasTarget = (value) =>
  typeof value === "string" && ALIAS.test(value) ? value.match(ALIAS)[1] : null;

/** Follow an alias chain to the final raw value. */
export function resolve(path, map, seen = new Set()) {
  if (seen.has(path)) throw new Error(`Alias cycle at ${[...seen, path].join(" → ")}`);
  const token = map.get(path);
  if (!token) throw new Error(`Unknown token "${path}"`);
  const target = aliasTarget(token.value);
  if (!target) return token;
  seen.add(path);
  const resolved = resolve(target, map, seen);
  return { ...token, value: resolved.value, type: token.type ?? resolved.type };
}

/** Paths in `map` whose alias chain passes through any path in `changed`. */
export function dependents(map, changed) {
  const hit = new Set();
  for (const path of map.keys()) {
    let cur = path;
    const seen = new Set();
    while (cur && !seen.has(cur)) {
      seen.add(cur);
      if (changed.has(cur) && cur !== path) { hit.add(path); break; }
      cur = aliasTarget(map.get(cur)?.value);
    }
  }
  return hit;
}

export const varName = (path) => `--ww-${path.replace(/\./g, "-")}`;

export function hexToRgba(hex) {
  const h = hex.replace("#", "");
  const n = (i) => parseInt(h.slice(i, i + 2), 16);
  if (h.length === 6) return { r: n(0), g: n(2), b: n(4), a: 1 };
  if (h.length === 8) return { r: n(0), g: n(2), b: n(4), a: +(n(6) / 255).toFixed(3) };
  throw new Error(`Unsupported color "${hex}"`);
}

function colorToCss(hex) {
  const { r, g, b, a } = hexToRgba(hex);
  return a === 1 ? hex.toUpperCase() : `rgba(${r}, ${g}, ${b}, ${a})`;
}

function familyToCss(list) {
  return list.map((f) => (GENERIC_FAMILIES.has(f) ? f : `"${f}"`)).join(", ");
}

/** Serialize one token value for CSS. Aliases stay as var() references. */
export function toCss(token) {
  const target = aliasTarget(token.value);
  if (target) return `var(${varName(target)})`;
  const { value, type } = token;
  switch (type) {
    case "color": return colorToCss(value);
    case "fontFamily": return Array.isArray(value) ? familyToCss(value) : value;
    case "cubicBezier": return `cubic-bezier(${value.join(", ")})`;
    case "shadow": {
      const s = value;
      return `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${colorToCss(s.color)}`;
    }
    default: return String(value);
  }
}

/** Resolved, CSS-ready value (aliases followed). Used for TS output. */
export function toResolvedCss(path, map) {
  const t = resolve(path, map);
  return toCss({ ...t, value: t.value });
}

// ---------- contrast (WCAG 2.x relative luminance) ----------

const channel = (c) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = ({ r, g, b }) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

/** Composite a possibly-translucent color over an opaque one. */
export function over(fg, bg) {
  const a = fg.a ?? 1;
  return {
    r: Math.round(fg.r * a + bg.r * (1 - a)),
    g: Math.round(fg.g * a + bg.g * (1 - a)),
    b: Math.round(fg.b * a + bg.b * (1 - a)),
    a: 1,
  };
}

export function contrast(fg, bg) {
  const l1 = luminance(fg), l2 = luminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export const THRESHOLDS = { text: 4.5, large: 3, ui: 3 };
