import type { CSSProperties } from "react";
import { Container } from "@/components/layout/container";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * The hero. The type treatment is the design — no illustration, no gradient, no
 * canvas — and the LCP element is the headline text itself.
 *
 * A server component, and deliberately so. The reveal was a Framer sequence
 * first, which meant the headline carried an inline opacity:0 from the server
 * and did not become visible until the bundle had downloaded, parsed and
 * hydrated. On a throttled mobile connection that put Largest Contentful Paint
 * at 3.99s on text that had been in the HTML from the first byte.
 *
 * In CSS the same reveal starts at first paint, costs no JavaScript, and needs
 * no noscript fallback because there is nothing to fall back from. It remains
 * the only orchestrated sequence on the site: 70ms apart, one line at a time,
 * and nothing else on the page animates on load.
 */
export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-headline">
      <Container>
        <div className="pt-[var(--space-16)] pb-[var(--rhythm-base)] md:pt-[var(--space-24)]">
          {/*
           * Availability. The accent draws the dot; it fills nothing.
           *
           * The Chanel rule, applied here: this was a bordered, rounded-full
           * pill. It was the only rounded container on a site built entirely
           * from square hairlines, and its shape was doing nothing the accent
           * dot was not already doing — it was there to make the line look
           * like a badge, which is a pattern from the kind of site this one is
           * trying not to be. The border and the pill are gone; the dot and the
           * words remain, and the hero is quieter for it.
           */}
          <p
            className={cn(
              "type-mono text-ink-muted hero-fade",
              "inline-flex items-center gap-[var(--space-2)]",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "size-[6px] shrink-0 rounded-full",
                site.availability.open ? "bg-accent" : "bg-ink-muted",
              )}
            />
            {site.availability.label}
          </p>

          <h1
            id="hero-headline"
            className={cn(
              "type-display-xl mt-[var(--space-8)]",
              // Optical overhang: align the cap stem to the margin rather than
              // the glyph box. See DESIGN.md section 3.
              "-ml-[0.04em]",
            )}
          >
            {site.headline.map((line, index) => (
              /*
               * Two elements per line, both load-bearing. The outer clips; the
               * inner rises. That is what makes a line look uncovered rather
               * than flown in from off screen. Under reduced motion the inner
               * animation becomes a fade and the clip has nothing left to hide.
               */
              <span
                key={line.text || line.accentWord}
                className="block overflow-hidden pb-[0.06em]"
              >
                <span
                  className="hero-rise block"
                  style={{ "--line": index } as CSSProperties}
                >
                  {line.text}
                  {line.text && line.accentWord ? " " : null}
                  {line.accentWord ? (
                    <span className="type-accentuate">{line.accentWord}</span>
                  ) : null}
                </span>
              </span>
            ))}
          </h1>

          {/*
           * Deliberately not animated. Lighthouse identifies this paragraph as
           * the Largest Contentful Paint element, and an LCP element that
           * starts at opacity 0 does not count as painted until its animation
           * has run — so fading it in cost most of a second of LCP for an
           * effect nobody was looking at while reading the headline above it.
           * The reveal stays where it earns its place: the headline.
           */}
          <div className="border-hairline mt-[var(--space-10)] border-t pt-[var(--space-6)]">
            <div className="grid gap-[var(--space-6)] md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-[var(--space-10)]">
              <p className="measure-lead type-body-l">{site.tagline}</p>

              <dl className="type-mono grid grid-cols-[auto_minmax(0,1fr)] gap-x-[var(--space-6)] gap-y-[var(--space-2)] md:text-right">
                {site.credibility.map((fact) => (
                  <div key={fact.label} className="contents">
                    <dt className="text-ink-muted">{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
