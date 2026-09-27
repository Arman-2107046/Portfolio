/**
 * Reads the colour tokens straight out of app/styles/tokens.css and checks every
 * pair the site actually renders, in both themes, against WCAG 2.1.
 *
 * It parses the stylesheet rather than taking a copied list of hex values,
 * because a duplicated palette is a palette that will drift. Run it after any
 * change to the token layer:
 *
 *   node scripts/check-contrast.mjs
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOKENS_PATH = join(root, "app/styles/tokens.css");

/** Pairs that exist on the rendered page, with the standard each must meet. */
const PAIRS = [
  { fg: "ink", bg: "canvas", min: 7, note: "all primary prose" },
  { fg: "ink", bg: "raised", min: 7, note: "prose on the inset surface" },
  { fg: "ink-muted", bg: "canvas", min: 7, note: "secondary prose, the mono rail" },
  { fg: "ink-muted", bg: "raised", min: 4.5, note: "muted prose on the inset surface" },
  { fg: "accent", bg: "canvas", min: 4.5, note: "link underlines, marks" },
  { fg: "accent", bg: "raised", min: 4.5, note: "marks on the inset surface" },
  { fg: "ink-inverse", bg: "ink", min: 7, note: "label on a filled control" },
  { fg: "edge", bg: "canvas", min: 3, note: "interactive border at rest" },
  { fg: "edge", bg: "raised", min: 3, note: "interactive border on inset" },
];

function parseTheme(css, selector) {
  // Grab the declaration block for the given selector and pull out hex tokens.
  const index = css.indexOf(selector);
  if (index === -1) throw new Error(`Selector not found in tokens.css: ${selector}`);
  const open = css.indexOf("{", index);
  const close = css.indexOf("}", open);
  const block = css.slice(open + 1, close);

  const values = {};
  for (const match of block.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    values[match[1]] = match[2];
  }
  return values;
}

function channel(value) {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  let value = hex.replace("#", "");
  if (value.length === 3) {
    value = value
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const light = Math.max(la, lb);
  const dark = Math.min(la, lb);
  return (light + 0.05) / (dark + 0.05);
}

const css = await readFile(TOKENS_PATH, "utf8");
const light = parseTheme(css, ":root,");
const dark = { ...light, ...parseTheme(css, '[data-theme="dark"]') };

let failures = 0;

for (const [themeName, theme] of [
  ["light", light],
  ["dark", dark],
]) {
  console.log(`\n${themeName}`);
  for (const pair of PAIRS) {
    const fg = theme[pair.fg];
    const bg = theme[pair.bg];
    if (!fg || !bg) {
      console.log(`  MISSING  --${pair.fg} on --${pair.bg}`);
      failures += 1;
      continue;
    }
    const value = ratio(fg, bg);
    const ok = value >= pair.min;
    if (!ok) failures += 1;
    console.log(
      `  ${ok ? "pass" : "FAIL"}  ${value.toFixed(2).padStart(6)}:1  ` +
        `(needs ${pair.min})  --${pair.fg} on --${pair.bg}  — ${pair.note}`,
    );
  }
}

/*
 * lib/og.tsx is the one file that legitimately repeats colour values: Satori
 * renders outside the browser and cannot resolve a CSS custom property. Since
 * it cannot reference the token layer, it is checked against it instead, so the
 * link preview cannot quietly drift away from the site it represents.
 */
const OG_PATH = join(root, "lib/og.tsx");
const ogSource = await readFile(OG_PATH, "utf8");

const OG_CONSTANTS = [
  ["INK", "ink"],
  ["INK_MUTED", "ink-muted"],
  ["CANVAS", "canvas"],
  ["HAIRLINE", "hairline"],
];

console.log("\nlib/og.tsx against the light theme");
for (const [constant, token] of OG_CONSTANTS) {
  const match = ogSource.match(new RegExp(`const ${constant} = "(#[0-9a-fA-F]{3,8})"`));
  const expected = light[token];
  if (!match) {
    console.log(`  FAIL  ${constant} not found`);
    failures += 1;
    continue;
  }
  const actual = match[1].toLowerCase();
  const ok = actual === expected?.toLowerCase();
  if (!ok) failures += 1;
  console.log(
    `  ${ok ? "pass" : "FAIL"}  ${constant} = ${actual}  (--${token} is ${expected})`,
  );
}

if (failures > 0) {
  console.error(`\n${failures} contrast check(s) failed.`);
  process.exit(1);
}

console.log("\nAll token pairs pass in both themes.");
