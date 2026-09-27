/**
 * The shared motion values.
 *
 * These mirror the --ease-* and --duration-* tokens in app/styles/tokens.css.
 * CSS drives almost all of the site's motion now — the hero reveal, the scroll
 * reveals and the reading indicator are all stylesheet animations — so what is
 * left here is the numbers the one JavaScript animation needs, and the scroll
 * easing, expressed the way each consumer wants them.
 *
 * The variant factory that used to live here is gone. It existed so that
 * reduced motion could be enforced in one place for Framer variants, and the
 * base layer in globals.css now does that job for every animation on the site
 * rather than only the scripted ones.
 */

/** cubic-bezier(0.16, 1, 0.3, 1). One easing for everything. No spring. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const DURATION = {
  fast: 0.15,
  base: 0.28,
  slow: 0.52,
  reveal: 0.9,
} as const;
