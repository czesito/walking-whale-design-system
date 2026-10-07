#!/usr/bin/env node
// Validate HTML produced with the system (DR-016).
//
//   node scripts/validate-output.mjs page.html [more.html ...]
//
// Rules:
//   class      every class must be defined in dist/ww.css (dist/ww-deck.css for a page with a ww-deck)
//   style      no style attributes and no <style> blocks
//   hex        no hex colors in any attribute
//   paint      SVG fill/stroke/color/stop-color only as none, currentColor or transparent; color comes from classes
//
//   contracts  brand and accessibility rules on the parsed page (DR-017): alt text, labels, captions,
//              growth layers with text, one primary per section, sourced stats, cited quotes,
//              logo files, kicker numbers, Chinese headings within 20 characters, one hero,
//              no entrance motion on errors, warnings, toasts and alerts
//
//   deck       for slides (DR-019): data-ww-use, one claim per slide, title length, the text budget,
//              list, grid, table and flow sizes, dial assumptions, chart titles
//
// One exception: a <style data-ww-system> block whose content is exactly dist/ww.css (or, for a deck,
// dist/ww-deck.css), for pages that cannot link the stylesheet (claude.ai artifacts). Any other <style> fails.
//
// Exit code 1 when any rule fails. Use validate() from other scripts.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { contracts } from "./contracts.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/;
const PAINT = new Set(["fill", "stroke", "color", "stop-color", "flood-color", "lighting-color", "bgcolor"]);
const PAINT_OK = new Set(["none", "currentcolor", "transparent", "inherit"]);
const SKIP_HEX = new Set(["href", "src", "srcset", "id", "for", "action", "xlink:href", "content"]);

/** Every class selector defined in a stylesheet. */
export function definedClasses(css) {
  const clean = css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/url\((?:"[^"]*"|'[^']*'|[^)]*)\)/g, "url()")
    .replace(/"[^"]*"|'[^']*'/g, '""');
  const out = new Set();
  for (const m of clean.matchAll(/\.(-?[_a-zA-Z][_a-zA-Z0-9-]*)/g)) out.add(m[1]);
  return out;
}

const lineOf = (text, index) => text.slice(0, index).split("\n").length;

const norm = (css) => css.replace(/\r\n/g, "\n").trim();

/** Returns a list of { line, rule, msg }. Pass systemCss (dist/ww.css) to allow an inlined copy of it. */
export function validate(html, classes, systemCss = null) {
  const issues = [];
  const blank = (c) => c.replace(/[^\n]/g, " ");
  let body = html.replace(/<!--[\s\S]*?-->/g, blank);
  body = body.replace(/<style\b[^>]*\bdata-ww-system\b[^>]*>([\s\S]*?)<\/style>/gi, (m, css, offset) => {
    if (systemCss === null || norm(css) !== norm(systemCss)) {
      issues.push({ line: lineOf(body, offset), rule: "style", msg: "<style data-ww-system> must contain dist/ww.css (dist/ww-deck.css for a deck) exactly, unchanged" });
    }
    return blank(m);
  });
  const scriptless = body.replace(/<script\b[\s\S]*?<\/script>/gi, blank);

  for (const m of scriptless.matchAll(/<style\b/gi)) {
    issues.push({ line: lineOf(scriptless, m.index), rule: "style", msg: "<style> block; use system classes" });
  }
  for (const tag of scriptless.matchAll(/<([a-zA-Z][\w:-]*)\b([^>]*)>/g)) {
    const attrs = tag[2];
    const line = lineOf(scriptless, tag.index);
    for (const a of attrs.matchAll(/([\w:-]+)\s*=\s*("([^"]*)"|'([^']*)')/g)) {
      const name = a[1].toLowerCase();
      const value = a[3] ?? a[4] ?? "";
      if (name === "style") issues.push({ line, rule: "style", msg: `style attribute on <${tag[1]}>` });
      if (name === "class") {
        for (const c of value.split(/\s+/).filter(Boolean)) {
          if (!classes.has(c)) issues.push({ line, rule: "class", msg: `unknown class "${c}" on <${tag[1]}>` });
        }
      }
      if (PAINT.has(name) && !PAINT_OK.has(value.trim().toLowerCase())) {
        issues.push({ line, rule: "paint", msg: `${name}="${value}" on <${tag[1]}>; color SVG with a class` });
      } else if (!SKIP_HEX.has(name) && !name.startsWith("aria-") && !name.startsWith("data-") && HEX.test(value)) {
        issues.push({ line, rule: "hex", msg: `hex color in ${name} on <${tag[1]}>` });
      }
    }
  }
  issues.push(...contracts(html));
  return issues;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error("usage: node scripts/validate-output.mjs file.html [...]");
    process.exit(2);
  }
  const css = readFileSync(join(ROOT, "dist/ww.css"), "utf8");
  const deckCss = readFileSync(join(ROOT, "dist/ww-deck.css"), "utf8");
  const classes = definedClasses(css);
  const deckClasses = definedClasses(deckCss);
  let n = 0;
  for (const f of files) {
    const html = readFileSync(f, "utf8");
    const deck = /class="[^"]*\bww-deck\b/.test(html);
    for (const i of validate(html, deck ? deckClasses : classes, deck ? deckCss : css)) {
      console.log(`${f}:${i.line}  ${i.msg}  [${i.rule}]`);
      n++;
    }
  }
  console.log(n ? `${n} issue(s)` : "validate-output: no issues");
  process.exit(n ? 1 : 0);
}
