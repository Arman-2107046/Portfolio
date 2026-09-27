/**
 * Lighthouse, mobile preset, against a production server.
 *
 *   npm run build && npx next start --port 3120
 *   node scripts/audit-lighthouse.mjs http://localhost:3120
 *
 * Runs each route three times and keeps the median. A single Lighthouse run on
 * a developer machine varies by several points between invocations, so one
 * number is not a measurement — reporting it as one is how a budget ends up
 * passing and failing at random in CI.
 */

import { launch } from "puppeteer";
import lighthouse from "lighthouse";
import { writeFile } from "node:fs/promises";

const origin = process.argv[2] ?? "http://localhost:3120";
const RUNS = 3;

const ROUTES = [
  { path: "/", label: "Home" },
  { path: "/work", label: "Work archive" },
  { path: "/work/sooth-bangladesh", label: "Case study" },
];

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const THRESHOLD = 95;

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

const browser = await launch({ headless: true });
const port = Number(new URL(browser.wsEndpoint()).port);
const results = [];

for (const route of ROUTES) {
  const perRun = [];

  for (let run = 0; run < RUNS; run += 1) {
    const result = await lighthouse(
      origin + route.path,
      { port, output: "json", logLevel: "error" },
      undefined,
    );
    if (!result) throw new Error(`Lighthouse returned nothing for ${route.path}`);

    const scores = {};
    for (const category of CATEGORIES) {
      scores[category] = Math.round((result.lhr.categories[category]?.score ?? 0) * 100);
    }
    scores.lcp = result.lhr.audits["largest-contentful-paint"]?.numericValue ?? 0;
    scores.cls = result.lhr.audits["cumulative-layout-shift"]?.numericValue ?? 0;
    scores.tbt = result.lhr.audits["total-blocking-time"]?.numericValue ?? 0;
    perRun.push(scores);
  }

  const summary = { route: route.path, label: route.label };
  for (const key of [...CATEGORIES, "lcp", "cls", "tbt"]) {
    summary[key] = median(perRun.map((r) => r[key]));
  }
  results.push(summary);

  console.log(
    `${route.label.padEnd(14)} ` +
      CATEGORIES.map((c) => `${c.slice(0, 4)} ${String(summary[c]).padStart(3)}`).join(
        "  ",
      ) +
      `  | LCP ${(summary.lcp / 1000).toFixed(2)}s  CLS ${summary.cls.toFixed(3)}` +
      `  TBT ${Math.round(summary.tbt)}ms`,
  );
}

await browser.close();
await writeFile(
  "lighthouse-results.json",
  JSON.stringify({ generated: new Date().toISOString(), runs: RUNS, results }, null, 2),
);

const failures = results.flatMap((r) =>
  CATEGORIES.filter((c) => r[c] < THRESHOLD).map((c) => `${r.route} ${c}=${r[c]}`),
);

if (failures.length > 0) {
  console.error(`\nBelow ${THRESHOLD}: ${failures.join(", ")}`);
  process.exit(1);
}

console.log(`\nAll routes at or above ${THRESHOLD} in all four categories.`);
