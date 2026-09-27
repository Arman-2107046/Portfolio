import type { Transition, Variants } from "framer-motion";

/**
 * The site's entire motion vocabulary. Defined once here, consumed through
 * `useMotion()` so that the reduced-motion collapse happens in the factory
 * rather than being remembered in each component.
 *
 * Mirrors the --ease-* and --duration-* tokens in app/styles/tokens.css.
 * Framer needs the numeric values; CSS needs the custom properties. They are
 * the same numbers, and this comment is the only place that has to say so.
 */

/** cubic-bezier(0.16, 1, 0.3, 1). One easing for everything. No spring. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const DURATION = {
  fast: 0.15,
  base: 0.28,
  slow: 0.52,
  reveal: 0.9,
} as const;

/** 70ms. Used by the hero reveal, and deliberately by nothing else. */
export const STAGGER = 0.07;

/**
 * Reduced motion is not "the same animation, faster". Transforms are removed
 * entirely and only opacity is allowed to change, over a duration short enough
 * to read as a state change rather than an animation.
 */
const REDUCED_TRANSITION: Transition = { duration: 0.01, ease: "linear" };

export type MotionVocabulary = {
  /** Whether the vocabulary has been collapsed for reduced motion. */
  reduced: boolean;
  /** The default transition, for one-off `transition` props. */
  transition: Transition;
  /** A block arriving on scroll: a short rise plus a fade. */
  reveal: Variants;
  /** A parent that hands its children a staggered start. */
  stagger: Variants;
  /**
   * The hero's line reveal. `maskLine` goes on the clipping element and
   * `maskInner` on the text inside it; the clip is what makes the line appear
   * to be uncovered rather than to slide in from nowhere.
   */
  maskLine: Variants;
  maskInner: Variants;
  /** Opacity only, no transform. Safe at any size. */
  fadeIn: Variants;
};

/**
 * Builds the vocabulary for the current motion preference.
 *
 * The `reduced` branch is the enforcement point named in the build plan: there
 * is no way for a component to opt out of it, because there is no other source
 * of variants in the codebase.
 */
export function buildMotion(reduced: boolean): MotionVocabulary {
  if (reduced) {
    const fade: Variants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: REDUCED_TRANSITION },
    };

    return {
      reduced: true,
      transition: REDUCED_TRANSITION,
      reveal: fade,
      // No stagger either: a sequence of fades is still a sequence, and the
      // point of the setting is that nothing choreographs itself.
      stagger: {
        hidden: {},
        visible: { transition: { staggerChildren: 0, delayChildren: 0 } },
      },
      maskLine: { hidden: {}, visible: {} },
      maskInner: fade,
      fadeIn: fade,
    };
  }

  return {
    reduced: false,
    transition: { duration: DURATION.base, ease: EASE_OUT },

    reveal: {
      hidden: { opacity: 0, y: 16 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: DURATION.slow, ease: EASE_OUT },
      },
    },

    stagger: {
      hidden: {},
      visible: {
        transition: { staggerChildren: STAGGER, delayChildren: 0.1 },
      },
    },

    maskLine: {
      hidden: {},
      visible: {},
    },

    maskInner: {
      hidden: { y: "110%" },
      visible: {
        y: "0%",
        transition: { duration: DURATION.reveal, ease: EASE_OUT },
      },
    },

    fadeIn: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: DURATION.slow, ease: EASE_OUT },
      },
    },
  };
}
