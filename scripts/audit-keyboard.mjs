/**
 * The things axe cannot tell you.
 *
 * axe checks the static properties of a page. It cannot tell you whether Tab
 * actually reaches everything, whether focus is visible when it gets there,
 * whether a modal gives focus back, or whether the heading order makes sense
 * read aloud. Those are behaviours, so they are driven here.
 *
 *   node scripts/audit-keyboard.mjs http://localhost:3120
 */

import puppeteer from "puppeteer";

const origin = process.argv[2] ?? "http://localhost:3120";
const browser = await puppeteer.launch({ headless: true });
const problems = [];

function check(condition, description, detail = "") {
  if (condition) {
    console.log(`pass  ${description}`);
  } else {
    console.log(`FAIL  ${description}${detail ? ` — ${detail}` : ""}`);
    problems.push(description);
  }
}

async function activeElement(page) {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.textContent ?? "").trim().slice(0, 48),
      label: el.getAttribute("aria-label"),
      href: el.getAttribute("href"),
      id: el.id,
    };
  });
}

/** Whether the focused element paints a focus ring rather than suppressing it. */
async function focusRingVisible(page) {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return false;
    const style = getComputedStyle(el);
    const width = parseFloat(style.outlineWidth || "0");
    return style.outlineStyle !== "none" && width > 0;
  });
}

// ---------------------------------------------------------------- home page
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${origin}/`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1600));

  await page.keyboard.press("Tab");
  const first = await activeElement(page);
  check(
    first?.text === "Skip to content",
    "first Tab reaches the skip link",
    `got ${JSON.stringify(first)}`,
  );
  check(await focusRingVisible(page), "skip link shows a visible focus ring");

  // Walk a generous number of stops and record what is reached.
  const reached = [];
  for (let i = 0; i < 60; i += 1) {
    const current = await activeElement(page);
    if (current) reached.push(current);
    await page.keyboard.press("Tab");
  }

  const workLinks = reached.filter((el) => el.href?.startsWith("/work/"));
  const slugOrder = workLinks.map((el) => el.href);
  const expected = [
    "/work/amidx-technologies",
    "/work/sooth-bangladesh",
    "/work/hockerty-suit-designer",
    "/work/digital-products-store",
    "/work/hr-group",
    "/work/bees-bangladesh",
  ];
  check(
    expected.every((slug, index) => slugOrder[index] === slug),
    "work rows are tabbed in document order, one stop each",
    slugOrder.join(" -> "),
  );

  const themeToggle = reached.find((el) => el.label?.startsWith("Switch to the"));
  check(Boolean(themeToggle), "theme toggle is reachable and labelled by action");

  // Heading order, read as a screen reader would.
  const headings = await page.evaluate(() =>
    [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
      level: Number(h.tagName[1]),
      text: (h.textContent ?? "").trim().slice(0, 44),
    })),
  );
  check(
    headings.filter((h) => h.level === 1).length === 1,
    "exactly one h1 on the homepage",
    `${headings.filter((h) => h.level === 1).length}`,
  );
  let ordered = true;
  for (let i = 1; i < headings.length; i += 1) {
    if (headings[i].level - headings[i - 1].level > 1) ordered = false;
  }
  check(ordered, "no heading level is skipped on the homepage");

  // Stack notes must be reachable and described.
  const described = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll("button[aria-describedby]")];
    return {
      count: buttons.length,
      allResolve: buttons.every((b) => {
        const id = b.getAttribute("aria-describedby");
        const target = id ? document.getElementById(id) : null;
        return Boolean(target && (target.textContent ?? "").trim().length > 20);
      }),
    };
  });
  check(
    described.count === 29 && described.allResolve,
    "all 29 stack notes resolve to real described text",
    `${described.count} buttons`,
  );

  await page.close();
}

// ------------------------------------------------ mobile navigation overlay
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(`${origin}/`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1600));

  const inertClosed = await page.evaluate(
    () => document.getElementById("mobile-navigation")?.hasAttribute("inert") ?? false,
  );
  check(inertClosed, "closed overlay is inert, so its links are out of the tab order");

  await page.evaluate(() => {
    const trigger = [...document.querySelectorAll("button")].find(
      (b) => b.getAttribute("aria-controls") === "mobile-navigation",
    );
    trigger?.focus();
    trigger?.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  const openState = await page.evaluate(() => {
    const panel = document.getElementById("mobile-navigation");
    return {
      inert: panel?.hasAttribute("inert") ?? true,
      modal: panel?.getAttribute("aria-modal"),
      focusInside: panel?.contains(document.activeElement) ?? false,
      scrollLocked: document.documentElement.style.overflow === "hidden",
    };
  });
  check(!openState.inert, "open overlay is no longer inert");
  check(openState.modal === "true", "open overlay declares aria-modal");
  check(openState.focusInside, "focus moves into the overlay on open");
  check(openState.scrollLocked, "body scroll is locked while the overlay is open");

  // Tab past the end and confirm focus wraps rather than escaping.
  for (let i = 0; i < 8; i += 1) await page.keyboard.press("Tab");
  const stillInside = await page.evaluate(
    () =>
      document.getElementById("mobile-navigation")?.contains(document.activeElement) ??
      false,
  );
  check(stillInside, "Tab wraps inside the overlay instead of escaping behind it");

  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 400));

  const afterEscape = await page.evaluate(() => ({
    inert: document.getElementById("mobile-navigation")?.hasAttribute("inert") ?? false,
    focusedControls: document.activeElement?.getAttribute("aria-controls"),
    scrollLocked: document.documentElement.style.overflow === "hidden",
  }));
  check(afterEscape.inert, "Escape closes the overlay");
  check(
    afterEscape.focusedControls === "mobile-navigation",
    "focus returns to the trigger after close",
    `focused element controls ${afterEscape.focusedControls}`,
  );
  check(!afterEscape.scrollLocked, "body scroll is restored after close");

  await page.close();
}

// ------------------------------------------------------------- case study
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${origin}/work/sooth-bangladesh`, { waitUntil: "networkidle0" });

  const headings = await page.evaluate(() =>
    [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => Number(h.tagName[1])),
  );
  check(
    headings.filter((level) => level === 1).length === 1,
    "exactly one h1 on a case study",
  );
  let ordered = true;
  for (let i = 1; i < headings.length; i += 1) {
    if (headings[i] - headings[i - 1] > 1) ordered = false;
  }
  check(ordered, "no heading level is skipped on a case study");

  const landmarks = await page.evaluate(() => ({
    main: document.querySelectorAll("main").length,
    header: document.querySelectorAll("header").length,
    footer: document.querySelectorAll("footer").length,
    nav: [...document.querySelectorAll("nav")].map((n) => n.getAttribute("aria-label")),
  }));
  check(landmarks.main === 1, "exactly one main landmark");
  check(landmarks.header === 1 && landmarks.footer === 1, "one header and one footer");
  check(
    landmarks.nav.every((label) => typeof label === "string" && label.length > 0),
    "every nav landmark is named",
    JSON.stringify(landmarks.nav),
  );

  const images = await page.evaluate(() =>
    [...document.querySelectorAll("img")].map((img) => ({
      alt: img.getAttribute("alt"),
      src: img.getAttribute("src")?.slice(0, 40),
    })),
  );
  check(
    images.every((img) => img.alt !== null),
    "every image declares alt, meaningful or empty",
    JSON.stringify(images.filter((i) => i.alt === null)),
  );

  await page.close();
}

// ------------------------------------------------------- contact form errors
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${origin}/#contact`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1600));

  // Blur an empty required field and confirm the error is announced by the
  // control, not merely painted next to it.
  const result = await page.evaluate(async () => {
    const input = document.querySelector('input[name="email"]');
    if (!(input instanceof HTMLInputElement)) return null;
    input.focus();
    input.blur();
    await new Promise((r) => setTimeout(r, 120));
    const describedBy = input.getAttribute("aria-describedby");
    const message = describedBy
      ? document.getElementById(describedBy)?.textContent
      : null;
    return {
      invalid: input.getAttribute("aria-invalid"),
      message,
      blames: /you (did|failed|must|forgot)|invalid|error/i.test(message ?? ""),
    };
  });

  check(result?.invalid === "true", "blurring an empty email marks the field invalid");
  check(
    Boolean(result?.message && result.message.length > 10),
    "the error is linked to the field by aria-describedby",
    result?.message ?? "none",
  );
  check(
    !result?.blames,
    "the error copy does not blame the sender",
    result?.message ?? "",
  );

  await page.close();
}

await browser.close();

if (problems.length > 0) {
  console.error(`\n${problems.length} keyboard/structure problem(s).`);
  process.exit(1);
}
console.log("\nKeyboard, focus, landmark and heading checks all pass.");
