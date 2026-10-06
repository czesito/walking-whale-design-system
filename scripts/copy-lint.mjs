#!/usr/bin/env node
// Copy lint for Walking Whale text (DR-008, DR-009, content/zh-tw.md, content/en.md).
//
//   node scripts/copy-lint.mjs [--docs] file ...
//
// Two strictness levels:
//   copy (default)  public-facing copy: every rule, including the brand rows of
//                   content/glossary.csv (avoided wording, 您 over 你, 台 over 臺)
//   docs (--docs)   internal documentation: typography rules and Taiwan usage only,
//                   because docs discuss the avoided words on purpose
//
// Skipped everywhere: code blocks, inline code, URLs, <script>, <style>, <pre>, <code>,
// and anything between <!-- lint-ignore-start --> and <!-- lint-ignore-end -->.

import { readFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CJK = "\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff";
const HAN = new RegExp(`[${CJK}]`);

// ---------------------------------------------------------------- glossary
function parseCsv(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/).filter(Boolean)) {
    const cells = []; let cur = ""; let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (quoted) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') quoted = false;
        else cur += ch;
      } else if (ch === '"') quoted = true;
      else if (ch === ",") { cells.push(cur); cur = ""; }
      else cur += ch;
    }
    cells.push(cur); rows.push(cells);
  }
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}
const glossary = parseCsv(readFileSync(join(ROOT, "content/glossary.csv"), "utf8"));
const avoidTerms = glossary.flatMap((g) =>
  g.avoid.split("|").filter(Boolean).map((term) => ({ term, lang: g.lang, category: g.category, preferred: g.preferred })));

// ---------------------------------------------------------------- text extraction
function stripIgnored(text) {
  return text.replace(/<!--\s*lint-ignore-start\s*-->[\s\S]*?<!--\s*lint-ignore-end\s*-->/g, (m) => m.replace(/[^\n]/g, " "));
}

/** Returns [{ line, text, heading }] with code and markup removed but line numbers kept. */
function segments(file, raw) {
  let text = stripIgnored(raw);
  const blank = (m) => m.replace(/[^\n]/g, " ");
  if (extname(file) === ".md") {
    text = text.replace(/```[\s\S]*?```/g, blank)
      .replace(/`[^`\n]*`/g, (m) => " ".repeat(m.length))
      .replace(/\]\([^)\n]*\)/g, (m) => "]" + " ".repeat(m.length - 1))
      .replace(/https?:\/\/\S+/g, (m) => " ".repeat(m.length))
      .replace(/<!--[\s\S]*?-->/g, blank);
    return text.split("\n").map((t, i) => ({ line: i + 1, text: t, heading: /^\s*#{1,6}\s/.test(t) }));
  }
  // HTML
  text = text.replace(/<(script|style|pre|code)\b[\s\S]*?<\/\1>/gi, blank)
    .replace(/<!--[\s\S]*?-->/g, blank);
  const headingSpans = [];
  for (const m of text.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>|<(\w+)\b[^>]*class="[^"]*\bww-(?:hero|kicker)\b[^"]*"[^>]*>([\s\S]*?)<\/\3>/gi)) {
    headingSpans.push([m.index, m.index + m[0].length]);
  }
  const out = [];
  let offset = 0;
  for (const [i, rawLine] of text.split("\n").entries()) {
    const start = offset; offset += rawLine.length + 1;
    const heading = headingSpans.some(([a, b]) => a <= start + rawLine.length && b >= start);
    const t = rawLine.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&[a-z]+;|&#\d+;/g, " ");
    out.push({ line: i + 1, text: t, heading });
  }
  return out;
}

// ---------------------------------------------------------------- rules
const RULES = [
  { id: "cjk-space", msg: "中文與英文或數字之間要加半形空格",
    re: new RegExp(`[${CJK}][A-Za-z0-9%]|[A-Za-z0-9%][${CJK}]`, "g") },
  { id: "halfwidth-punct", msg: "中文旁邊要用全形標點",
    re: new RegExp(`[${CJK}][,;:?!()]|[,;:?(][${CJK}]|[${CJK}]\\.(?![A-Za-z0-9.])`, "g") },
  { id: "single-ellipsis", msg: "刪節號是兩個 …（……）", re: /(?<!…)…(?!…)/g, onlyWithHan: true },
  { id: "dot-ellipsis", msg: "中文刪節號用 ……，不用 ...",
    re: new RegExp(`[${CJK}]\\.{3}|\\.{3}[${CJK}]`, "g") },
  { id: "single-dash", msg: "中文破折號是兩個 —（——）",
    re: new RegExp(`[${CJK}]—(?!—)|(?<!—)—[${CJK}]`, "g") },
  { id: "en-quotes", msg: "中文用「」與『』，不用 “ ”", re: /[“”]/g, onlyWithHan: true },
  { id: "exclamation", msg: "不使用驚嘆號", re: /[!！]/g },
  { id: "emoji", msg: "不使用 emoji", re: /\p{Extended_Pictographic}/gu },
];

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

export function lintText(file, raw, { docs = false } = {}) {
  const issues = [];
  const add = (line, rule, msg, excerpt) => issues.push({ file, line, rule, msg, excerpt: Array.from(excerpt.trim()).slice(0, 40).join("") });
  for (const seg of segments(file, raw)) {
    const t = seg.text;
    if (!t.trim()) continue;
    const hasHan = HAN.test(t);
    for (const r of RULES) {
      if (r.onlyWithHan && !hasHan) continue;
      for (const m of t.matchAll(r.re)) add(seg.line, r.id, r.msg, t.slice(Math.max(0, m.index - 12), m.index + 14));
    }
    if (seg.heading && hasHan && /。\s*$/.test(t.replace(/<[^>]*>/g, "").trimEnd())) add(seg.line, "heading-period", "中文標題不加句號", t);
    for (const a of avoidTerms) {
      if (docs && a.category === "brand") continue;
      const re = a.lang === "en" ? new RegExp(`\\b${escapeRe(a.term)}\\b`, "gi") : new RegExp(escapeRe(a.term), "g");
      for (const m of t.matchAll(re)) {
        add(seg.line, `avoid:${a.lang}`, `避免「${a.term}」，改用「${a.preferred}」`, t.slice(Math.max(0, m.index - 12), m.index + a.term.length + 12));
      }
    }
  }
  return issues;
}

export function lintFile(path, opts) {
  return lintText(path, readFileSync(path, "utf8"), opts);
}

// ---------------------------------------------------------------- CLI
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const docs = args.includes("--docs");
  const files = args.filter((a) => !a.startsWith("--"));
  if (!files.length) { console.error("usage: node scripts/copy-lint.mjs [--docs] file ..."); process.exit(2); }
  const issues = files.flatMap((f) => lintFile(f, { docs }));
  for (const i of issues) console.log(`${i.file}:${i.line}  ${i.msg}  [${i.rule}]  …${i.excerpt}…`);
  console.log(issues.length ? `${issues.length} issue(s)` : "copy-lint: no issues");
  process.exit(issues.length ? 1 : 0);
}
