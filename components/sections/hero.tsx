"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { useMotion } from "@/components/motion/use-motion";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * The hero. The type treatment is the design — there is no illustration, no
 * gradient, no canvas, and the LCP element is the headline text itself.
 *
 * This is also the only orchestrated sequence on the site: the headline reveals
 * line by line from behind a clip, 70ms apart. Nothing else on the page
 * animates on load, which is what keeps it a statement rather than a texture.
 */
export function Hero() {
  const motionVocabulary = useMotion();

  return (
    <section id="hero" aria-labelledby="hero-headline">
      {/*
       * Framer writes the `hidden` variant as inline styles during server
       * rendering, so without JavaScript the headline would sit at
       * opacity:0 and translateY(110%) forever — a blank hero, on the one
       * screen that has to work. This restores it for that case only. It is
       * the single place on the site where load-time animation is applied,
       * which is why the fallback can be this targeted.
       */}
      <noscript>
        <style>{`#hero *{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <Container>
        <div className="pt-[var(--space-16)] pb-[var(--rhythm-base)] md:pt-[var(--space-24)]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={motionVocabulary.stagger}
          >
            {/* Availability. The accent draws the dot; it fills nothing. */}
            <motion.p
              variants={motionVocabulary.fadeIn}
              className="type-mono text-ink-muted border-edge inline-flex items-center gap-[var(--space-2)] rounded-full border px-[var(--space-3)] py-[var(--space-1)]"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-[6px] shrink-0 rounded-full",
                  site.availability.open ? "bg-accent" : "bg-ink-muted",
                )}
              />
              {site.availability.label}
            </motion.p>

            {/*
             * The headline runs its own stagger rather than inheriting the
             * outer one. Stagger is applied by a parent to the children that
             * register with it, so the lines have to be the direct variant
             * children of the element holding `stagger` — otherwise all four
             * start together and the line-by-line reveal silently becomes a
             * single fade.
             */}
            <motion.h1
              id="hero-headline"
              variants={motionVocabulary.stagger}
              className={cn(
                "type-display-xl mt-[var(--space-8)]",
                // Optical overhang: align the cap stem to the margin rather
                // than the glyph box. See DESIGN.md section 3.
                "-ml-[0.04em]",
              )}
            >
              {site.headline.map((line) => (
                /*
                 * Two elements per line, both load-bearing. The outer clips and
                 * carries the stagger slot; the inner moves. That is what makes
                 * a line look uncovered rather than flown in from off screen.
                 * Under reduced motion the inner variant collapses to a fade and
                 * the clip simply has nothing to hide.
                 */
                <motion.span
                  key={line.text || line.accentWord}
                  variants={motionVocabulary.maskLine}
                  className="block overflow-hidden pb-[0.06em]"
                >
                  <motion.span variants={motionVocabulary.maskInner} className="block">
                    {line.text}
                    {line.text && line.accentWord ? " " : null}
                    {line.accentWord ? (
                      <span className="type-accentuate">{line.accentWord}</span>
                    ) : null}
                  </motion.span>
                </motion.span>
              ))}
            </motion.h1>

            <motion.div
              variants={motionVocabulary.fadeIn}
              className="border-hairline mt-[var(--space-10)] border-t pt-[var(--space-6)]"
            >
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
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
