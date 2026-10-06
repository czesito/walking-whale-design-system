#!/usr/bin/env node
// Generates the hand-drawn band masks for components/layers/layers.css (DR-014, Y1).
// Seeded, so the output never changes unless the numbers below change.
//
//   node tools/layers/generate.mjs > /tmp/masks.css   then paste between the markers in layers.css

const WIDTHS = [0.36, 0.22, 0.46, 0.3, 0.25, 0.41, 0.33]; // band width ÷ band height, cycles every 7 layers
const WOBBLE = 3.2; // edge wobble in mask units (band height = 100)

function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r = rng(5);
const jit = (a) => (r() - 0.5) * 2 * a;
const f = (v) => Math.round(v * 10) / 10;

function smooth(p) {
  let d = `M${f(p[0][0])} ${f(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

const out = [];
WIDTHS.forEach((ratio, i) => {
  const w = ratio * 100;
  const L = [], R = [];
  for (let k = 0; k <= 4; k++) {
    const y = k * 25;
    L.push([Math.max(0, WOBBLE + jit(WOBBLE)), y]);
    R.push([Math.min(w, w - WOBBLE + jit(WOBBLE)), y]);
  }
  const d = smooth(L) + "L" + smooth(R.reverse()).slice(1) + "Z";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${f(w)} 100' preserveAspectRatio='none'><path d='${d}'/></svg>`;
  out.push(`.ww-layers > :nth-child(7n + ${i + 1}) { width: calc(var(--_h) * ${ratio}); --_m: url("data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, "%27")}"); }`);
});
console.log(out.join("\n"));
