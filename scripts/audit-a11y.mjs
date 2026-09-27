/**
 * Runs axe-core over every route, in both themes.
 *
 * Both themes matter: colour-contrast is the rule most likely to differ between
 * them, and auditing only the default would leave half the site unchecked.
 *
 * Expects a server already running. Start one with `npm run build && npx next
 * start --port 3120`, then:
 *
 *   node scripts/audit-a11y.mjs http://localhost:3120
 */

import puppeteer from "puppeteer";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const axeSource = await require("node:fs/promises").readFile(axePath, "utf8");

const origin = process.argv[2] ?? "http://localhost:3120";

const ROUTES = [
  "/",
  "/work",
  "/work?lane=commerce",
  "/work?lane=bogus",
  "/work/amidx-technologies",
  "/work/sooth-bangladesh",
  "/work/hockerty-suit-designer",
  "/work/digital-products-store",
  "/work/hr-group",
  "/work/bees-bangladesh",
  "/this-route-does-not-exist",
];

const THEMES = ["light", "dark"];

const browser = await puppeteer.launch({ headless: true });
let total = 0;
const findings = [];

for (const route of ROUTES) {
  for (const theme of THEMES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // Set the theme before the document runs, the same way a returning visitor
    // would arrive with it already stored.
    await page.evaluateOnNewDocument((value) => {
      localStorage.setItem("arr-theme", value);
    }, theme);

    await page.goto(origin + route, { waitUntil: "networkidle0" });

    // Let the hero's mask reveal finish before auditing. Mid-animation the
    // headline is clipped to zero height by its own overflow:hidden, and axe
    // correctly reports a page with no visible h1 — a true statement about a
    // frame nobody reads, and a false one about the page. The reveal is 0.9s
    // plus a 70ms stagger across four lines.
    await new Promise((resolve) => setTimeout(resolve, 1600));

    await page.evaluate(axeSource);

    const results = await page.evaluate(async () => {
      // @ts-expect-error injected above
      return await window.axe.run(document, {
        runOnly: {
          type: "tag",
          values: [
            "wcag2a",
            "wcag2aa",
            "wcag21a",
            "wcag21aa",
            "wcag22aa",
            "best-practice",
          ],
        },
      });
    });

    const violations = results.violations;
    total += violations.length;

    const label = `${route}  [${theme}]`;
    if (violations.length === 0) {
      console.log(`pass  ${label}`);
    } else {
      console.log(`FAIL  ${label}  — ${violations.length} violation(s)`);
      for (const violation of violations) {
        console.log(`        ${violation.id} (${violation.impact}): ${violation.help}`);
        for (const node of violation.nodes.slice(0, 3)) {
          console.log(`          ${node.target.join(" ")}`);
        }
        findings.push({ route, theme, id: violation.id, help: violation.help });
      }
    }

    await page.close();
  }
}

await browser.close();

console.log(
  `\n${ROUTES.length} routes x ${THEMES.length} themes = ${ROUTES.length * THEMES.length} page audits.`,
);

if (total > 0) {
  console.error(`${total} violation(s) found.`);
  process.exit(1);
}

console.log("Zero axe violations.");
