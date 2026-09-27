import { notFound } from "next/navigation";
import { ThemeToggle } from "@/components/chrome/theme-toggle";
import type { ReactNode } from "react";

export const metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const TYPE_STEPS = [
  {
    utility: "type-display-xl",
    size: "44→120px",
    tracking: "-0.04em",
    leading: "0.94",
    sample: "I build the whole system",
  },
  {
    utility: "type-display-l",
    size: "32→60px",
    tracking: "-0.03em",
    leading: "1.02",
    sample: "Recovering the conversions the browser stopped reporting",
  },
  {
    utility: "type-h1",
    size: "28→40px",
    tracking: "-0.02em",
    leading: "1.10",
    sample: "Selected work",
  },
  {
    utility: "type-h2",
    size: "22→28px",
    tracking: "-0.015em",
    leading: "1.18",
    sample: "Hockerty Premium Suit Designer",
  },
  {
    utility: "type-h3",
    size: "18→20px",
    tracking: "-0.01em",
    leading: "1.30",
    sample: "Data and infrastructure",
  },
  {
    utility: "type-body-l",
    size: "17→20px",
    tracking: "0",
    leading: "1.60",
    sample:
      "Schema, application, server, and the analytics that prove it worked. One person, end to end.",
  },
  {
    utility: "type-body",
    size: "16→17px",
    tracking: "0",
    leading: "1.65",
    sample:
      "The engineering problem was image delivery and state, not the interface on top of it.",
  },
  {
    utility: "type-caption",
    size: "14px",
    tracking: "+0.01em",
    leading: "1.45",
    sample: "Format: +880, or an international number with the country code.",
  },
  {
    utility: "type-mono",
    size: "14px",
    tracking: "+0.02em",
    leading: "1.40",
    sample: "AVAILABLE — 2026 · ASIA/DHAKA · GMT+6 · 0123456789",
  },
] as const;

const COLOUR_TOKENS = [
  { name: "canvas", role: "The page itself" },
  { name: "raised", role: "The only secondary surface" },
  { name: "ink", role: "Primary text, meaningful rules, filled controls" },
  { name: "ink-muted", role: "Secondary prose and metadata values" },
  { name: "ink-inverse", role: "Text on an ink-filled control" },
  { name: "hairline", role: "Decorative structure — never the sole indicator" },
  { name: "edge", role: "Border of an interactive element at rest" },
  { name: "accent", role: "Marks, underlines, focus rings, active position" },
] as const;

const CONTRAST = [
  { pair: "ink on canvas", light: "19.17:1", dark: "17.31:1", need: "AAA" },
  { pair: "ink-muted on canvas", light: "7.73:1", dark: "8.18:1", need: "AAA" },
  { pair: "accent on canvas", light: "8.69:1", dark: "8.65:1", need: "AAA" },
  { pair: "ink-muted on raised", light: "7.02:1", dark: "6.89:1", need: "AA" },
  { pair: "edge on canvas", light: "3.70:1", dark: "3.70:1", need: "AA non-text" },
  { pair: "edge on raised", light: "3.36:1", dark: "3.43:1", need: "AA non-text" },
] as const;

const SPACING = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "8",
  "10",
  "12",
  "16",
  "20",
  "24",
  "32",
  "40",
] as const;

const RADIUS = ["none", "xs", "sm", "md", "full"] as const;

const Z_INDEX = [
  { name: "under", use: "The sheen, behind everything" },
  { name: "base", use: "Normal flow" },
  { name: "raised", use: "Hover previews, tooltips" },
  { name: "sticky", use: "The header once it sticks" },
  { name: "overlay", use: "Mobile navigation" },
  { name: "toast", use: "Copy confirmation" },
  { name: "skip", use: "Skip-to-content, above all" },
] as const;

const DURATIONS = ["fast", "base", "slow", "reveal"] as const;

function Label({ children }: { children: ReactNode }) {
  return <span className="type-mono text-ink-muted">{children}</span>;
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-hairline border-t pt-[var(--space-6)]">
      <h2 className="type-mono mb-[var(--space-6)] uppercase">{title}</h2>
      {children}
    </section>
  );
}

/** Renders the full token set. Mounted twice — once per theme. */
function Swatches({ theme }: { theme: "light" | "dark" }) {
  return (
    <div
      data-theme={theme}
      className="bg-canvas text-ink border-hairline border p-[var(--space-6)]"
    >
      <p className="mb-[var(--space-6)]">
        <Label>theme: {theme}</Label>
      </p>

      <ul className="flex flex-col gap-[var(--space-3)]">
        {COLOUR_TOKENS.map((token) => (
          <li key={token.name} className="flex items-center gap-[var(--space-4)]">
            <span
              aria-hidden="true"
              className="border-edge h-10 w-16 shrink-0 border"
              style={{ backgroundColor: `var(--${token.name})` }}
            />
            <span className="min-w-0">
              <span className="type-mono block">--{token.name}</span>
              <span className="type-caption text-ink-muted block">{token.role}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-[var(--space-8)] flex flex-wrap items-center gap-[var(--space-3)]">
        <span className="bg-ink text-ink-inverse px-[var(--space-4)] py-[var(--space-2)]">
          Filled control
        </span>
        <span className="border-edge border px-[var(--space-4)] py-[var(--space-2)]">
          Bare control
        </span>
        <span className="bg-raised px-[var(--space-4)] py-[var(--space-2)]">
          Raised surface
        </span>
        <span className="bg-wash px-[var(--space-4)] py-[var(--space-2)]">Wash</span>
        <a
          href="#top"
          className="decoration-accent underline decoration-[1px] underline-offset-4"
        >
          A link, underlined in accent
        </a>
      </div>
    </div>
  );
}

export default function StyleguidePage() {
  // Dev-only surface: it documents the system and is not part of the site.
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main
      id="top"
      className="mx-auto flex max-w-[var(--content-max)] flex-col gap-[var(--space-16)] px-[var(--page-margin)] py-[var(--space-16)]"
    >
      <header>
        <div className="flex items-start justify-between gap-[var(--space-4)]">
          <h1 className="type-h1">Token styleguide</h1>
          <ThemeToggle className="-mr-[var(--space-3)] shrink-0" />
        </div>
        <p className="measure type-body text-ink-muted mt-[var(--space-4)]">
          Every colour, space, radius, border, layer, duration and type step the site is
          allowed to use. If a value is not on this page, it does not exist in the
          codebase. Raw hex lives only in{" "}
          <code className="type-mono">app/styles/tokens.css</code>.
        </p>
      </header>

      <Block title="Type specimen">
        <div className="flex flex-col gap-[var(--space-8)]">
          {TYPE_STEPS.map((step) => (
            <div key={step.utility}>
              <p className="mb-[var(--space-2)]">
                <Label>
                  .{step.utility} — {step.size} / {step.tracking} / {step.leading}
                </Label>
              </p>
              <p className={step.utility}>{step.sample}</p>
            </div>
          ))}
        </div>

        <div className="border-hairline mt-[var(--space-12)] border-t pt-[var(--space-6)]">
          <p className="mb-[var(--space-4)]">
            <Label>running prose at real measure — 68ch, target 66–72 characters</Label>
          </p>
          <p className="measure type-body">
            Browser pixels were losing conversion events to ad blockers and to
            Safari&apos;s tracking prevention, so the reported revenue on the platform was
            consistently below what the database recorded. The fix was to stop treating
            the browser as the source of truth: the server now emits the purchase event to
            the Conversions API at the moment the order row is written, with a
            deduplication key shared with the client-side pixel.
          </p>
          <p className="measure type-body mt-[var(--space-4)]">
            A second paragraph, so the interline rhythm can be judged rather than guessed.
            Line length is capped in characters rather than pixels, which is why the
            measure holds whether the visitor has bumped their root font size or not.
          </p>
        </div>

        <div className="border-hairline mt-[var(--space-12)] border-t pt-[var(--space-6)]">
          <p className="mb-[var(--space-4)]">
            <Label>the two permitted serif uses</Label>
          </p>
          <p className="type-display-l">
            not the <span className="type-accentuate">screens</span> only
          </p>
        </div>

        <div className="border-hairline mt-[var(--space-12)] border-t pt-[var(--space-6)]">
          <p className="mb-[var(--space-4)]">
            <Label>the metadata layer, as it appears in the mono rail</Label>
          </p>
          <dl className="type-mono grid grid-cols-[6rem_1fr] gap-x-[var(--space-6)] gap-y-[var(--space-2)]">
            <dt className="text-ink-muted">ROLE</dt>
            <dd>Full-stack, sole engineer</dd>
            <dt className="text-ink-muted">YEAR</dt>
            <dd>2025</dd>
            <dt className="text-ink-muted">STACK</dt>
            <dd>Laravel, React, Meta CAPI, GA4</dd>
          </dl>
        </div>
      </Block>

      <Block title="Colour, both themes">
        <div className="grid gap-[var(--space-6)] md:grid-cols-2">
          <Swatches theme="light" />
          <Swatches theme="dark" />
        </div>
      </Block>

      <Block title="Measured contrast">
        <table className="w-full text-left">
          <thead>
            <tr className="border-hairline border-b">
              <th className="py-[var(--space-2)] font-normal">
                <Label>pair</Label>
              </th>
              <th className="py-[var(--space-2)] font-normal">
                <Label>light</Label>
              </th>
              <th className="py-[var(--space-2)] font-normal">
                <Label>dark</Label>
              </th>
              <th className="py-[var(--space-2)] font-normal">
                <Label>target</Label>
              </th>
            </tr>
          </thead>
          <tbody>
            {CONTRAST.map((row) => (
              <tr key={row.pair} className="border-hairline border-b">
                <td className="py-[var(--space-2)]">{row.pair}</td>
                <td className="type-mono py-[var(--space-2)]">{row.light}</td>
                <td className="type-mono py-[var(--space-2)]">{row.dark}</td>
                <td className="text-ink-muted py-[var(--space-2)]">{row.need}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Block>

      <Block title="Spacing, 4px base">
        <ul className="flex flex-col gap-[var(--space-2)]">
          {SPACING.map((step) => (
            <li key={step} className="flex items-center gap-[var(--space-4)]">
              <span className="w-24 shrink-0">
                <Label>--space-{step}</Label>
              </span>
              <span
                aria-hidden="true"
                className="bg-ink h-3"
                style={{ width: `var(--space-${step})` }}
              />
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Radius">
        <ul className="flex flex-wrap gap-[var(--space-4)]">
          {RADIUS.map((step) => (
            <li key={step} className="flex flex-col gap-[var(--space-2)]">
              <span
                aria-hidden="true"
                className="bg-raised border-edge h-16 w-16 border"
                style={{ borderRadius: `var(--radius-${step})` }}
              />
              <Label>{step}</Label>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Border widths">
        <ul className="flex flex-wrap gap-[var(--space-6)]">
          {(["hair", "ring"] as const).map((step) => (
            <li key={step} className="flex flex-col gap-[var(--space-2)]">
              <span
                aria-hidden="true"
                className="border-ink h-16 w-24"
                style={{ borderWidth: `var(--border-${step})`, borderStyle: "solid" }}
              />
              <Label>--border-{step}</Label>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Layers">
        <ul className="flex flex-col gap-[var(--space-2)]">
          {Z_INDEX.map((layer) => (
            <li key={layer.name} className="flex gap-[var(--space-4)]">
              <span className="w-32 shrink-0">
                <Label>--z-{layer.name}</Label>
              </span>
              <span className="text-ink-muted">{layer.use}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Motion">
        <p className="measure type-body text-ink-muted mb-[var(--space-6)]">
          One easing for everything that moves. No spring, no bounce. Hover a bar to run
          it.
        </p>
        <ul className="flex flex-col gap-[var(--space-3)]">
          {DURATIONS.map((step) => (
            <li key={step} className="group flex items-center gap-[var(--space-4)]">
              <span className="w-32 shrink-0">
                <Label>--duration-{step}</Label>
              </span>
              <span
                aria-hidden="true"
                className="bg-ink h-3 w-8 transition-[width] ease-out group-hover:w-64"
                style={{ transitionDuration: `var(--duration-${step})` }}
              />
            </li>
          ))}
        </ul>
        <dl className="mt-[var(--space-6)] flex flex-col gap-[var(--space-2)]">
          <div className="flex gap-[var(--space-4)]">
            <dt className="w-32 shrink-0">
              <Label>--ease-out</Label>
            </dt>
            <dd className="type-mono text-ink-muted">cubic-bezier(0.16, 1, 0.3, 1)</dd>
          </div>
          <div className="flex gap-[var(--space-4)]">
            <dt className="w-32 shrink-0">
              <Label>--ease-in-out</Label>
            </dt>
            <dd className="type-mono text-ink-muted">cubic-bezier(0.65, 0, 0.35, 1)</dd>
          </div>
          <div className="flex gap-[var(--space-4)]">
            <dt className="w-32 shrink-0">
              <Label>--stagger</Label>
            </dt>
            <dd className="type-mono text-ink-muted">70ms, hero reveal only</dd>
          </div>
        </dl>
      </Block>
    </main>
  );
}
