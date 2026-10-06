#!/usr/bin/env node
// Assemble the public site into _site/ (DR-018). Run after `npm run build`.
// The home pages in site/ use paths relative to the site root and {{counts}} filled in here,
// so the numbers on the page always match the repository.

import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const at = (p) => join(ROOT, p);
const OUT = at("_site");
const json = (p) => JSON.parse(readFileSync(at(p), "utf8"));

const counts = {
  components: json("components/index.json").items.length,
  patterns: json("patterns/index.json").items.length,
  pairs: json("tokens/contrast-pairs.json").pairs.reduce((n, p) => n + p.bg.length, 0),
  decisions: readdirSync(at("decisions")).filter((f) => /^DR-\d+/.test(f)).length,
};

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(at("site")).filter((f) => f.endsWith(".html"))) {
  const html = readFileSync(at(`site/${f}`), "utf8").replace(/\{\{(\w+)\}\}/g, (m, k) => (k in counts ? String(counts[k]) : m));
  if (/\{\{\w+\}\}/.test(html)) throw new Error(`site/${f} has an unknown placeholder`);
  writeFileSync(join(OUT, f), html);
}
for (const dir of ["dist", "assets/icon", "assets/mark", "assets/wordmark", "css"]) cpSync(at(dir), join(OUT, dir), { recursive: true });
mkdirSync(join(OUT, "specimens"), { recursive: true });
for (const f of ["index.html", "components.html"]) cpSync(at(`specimens/${f}`), join(OUT, "specimens", f));
writeFileSync(join(OUT, ".nojekyll"), "");
console.log(`site: wrote _site/ (${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(", ")})`);
