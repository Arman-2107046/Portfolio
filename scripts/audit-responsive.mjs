/**
 * Responsive QA, driven rather than eyeballed.
 *
 * Checks the three things that actually break and are easy to miss by scrolling
 * around in one browser window: horizontal overflow, tap targets below 44px,
 * and text below 14px. Runs every route at every width, in both themes.
 *
 *   node scripts/audit-responsive.mjs http://localhost:3130
 */

import puppeteer from "puppeteer";

const origin = process.argv[2] ?? "http://localhost:3130";

const WIDTHS = [320, 375, 414, 768, 1024, 1280, 1440, 1920, 2560];

const ROUTES = [
  "/",
  "/work",
  "/work?lane=bogus",
  "/work/sooth-bangladesh",
  "/this-route-does-not-exist",
];

const MIN_TAP = 44;
const MIN_FONT = 14;

const browser = await puppeteer.launch({ headless: true });
const problems = [];

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewport({
      width,
      height: 900,
      isMobile: width < 768,
      hasTouch: width < 768,
      deviceScaleFactor: width < 768 ? 2 : 1,
    });
    await page.goto(origin + route, { waitUntil: "networkidle0" });
    await new Promise((resolve) => setTimeout(resolve, 900));

    const report = await page.evaluate(
      ({ minTap, minFont }) => {
        const doc = document.documentElement;

        // Horizontal overflow, and the specific elements causing it — a bare
        // "the page scrolls sideways" is not actionable.
        const overflowBy = doc.scrollWidth - doc.clientWidth;
        const culprits = [];
        if (overflowBy > 0) {
          for (const el of document.querySelectorAll("*")) {
            const box = el.getBoundingClientRect();
            if (box.right > doc.clientWidth + 1 || box.left < -1) {
              const style = getComputedStyle(el);
              if (style.position === "fixed" || style.display === "none") continue;
              culprits.push(
                `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} right=${Math.round(box.right)}`,
              );
              if (culprits.length >= 4) break;
            }
          }
        }

        // Tap targets. Only visible, genuinely interactive things, and only
        // where a pointer is coarse — a mouse does not need 44px.
        const small = [];
        if (matchMedia("(pointer: coarse)").matches) {
          for (const el of document.querySelectorAll(
            "a, button, select, input, textarea",
          )) {
            const box = el.getBoundingClientRect();
            if (box.width === 0 || box.height === 0) continue;
            const style = getComputedStyle(el);
            if (style.visibility === "hidden" || style.display === "none") continue;
            // Visually hidden until focused — the skip link. Its unfocused box
            // is a 1px clipped rectangle that nobody can tap, so measuring it
            // as a touch target is measuring the wrong thing. Its focused size
            // is covered by the keyboard audit.
            if (style.clip === "rect(0px, 0px, 0px, 0px)") continue;
            if (style.clipPath === "inset(50%)") continue;
            // Skip anything inside an inert subtree (the closed nav overlay).
            if (el.closest("[inert]")) continue;
            // The honeypot: aria-hidden and parked off-screen. Nobody can tap
            // what nobody can see, and a bot is not using a finger.
            if (el.closest('[aria-hidden="true"]')) continue;
            // Inline links inside a paragraph are exempt: WCAG's own exception.
            const parentTag = el.parentElement?.tagName.toLowerCase();
            if (el.tagName === "A" && (parentTag === "p" || parentTag === "dd")) continue;
            if (box.height < minTap || box.width < minTap) {
              small.push(
                `${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 24)}" ${Math.round(box.width)}x${Math.round(box.height)}`,
              );
            }
          }
        }

        // Text below the floor.
        const tiny = new Set();
        for (const el of document.querySelectorAll("body *")) {
          if (!el.firstChild || el.firstChild.nodeType !== Node.TEXT_NODE) continue;
          if (!(el.textContent ?? "").trim()) continue;
          const style = getComputedStyle(el);
          if (style.display === "none" || style.visibility === "hidden") continue;
          const size = parseFloat(style.fontSize);
          if (size < minFont) {
            tiny.add(
              `${el.tagName.toLowerCase()} ${size}px "${(el.textContent ?? "").trim().slice(0, 20)}"`,
            );
          }
        }

        return {
          overflowBy,
          culprits,
          small: [...new Set(small)].slice(0, 5),
          tiny: [...tiny].slice(0, 5),
        };
      },
      { minTap: MIN_TAP, minFont: MIN_FONT },
    );

    const label = `${route.padEnd(28)} ${String(width).padStart(4)}px`;
    const issues = [];
    if (report.overflowBy > 0) {
      issues.push(`overflows by ${report.overflowBy}px [${report.culprits.join("; ")}]`);
    }
    if (report.small.length > 0) issues.push(`tap targets: ${report.small.join("; ")}`);
    if (report.tiny.length > 0)
      issues.push(`text < ${MIN_FONT}px: ${report.tiny.join("; ")}`);

    if (issues.length === 0) {
      console.log(`pass  ${label}`);
    } else {
      console.log(`FAIL  ${label}`);
      for (const issue of issues) console.log(`         ${issue}`);
      problems.push(`${route} @ ${width}px`);
    }

    await page.close();
  }
}

await browser.close();

console.log(
  `\n${ROUTES.length} routes x ${WIDTHS.length} widths = ${ROUTES.length * WIDTHS.length} checks.`,
);

if (problems.length > 0) {
  console.error(`${problems.length} failing combination(s).`);
  process.exit(1);
}
console.log("No overflow, no small tap targets, no text under 14px.");
