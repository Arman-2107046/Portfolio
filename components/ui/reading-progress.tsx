"use client";

import { motion, useScroll } from "framer-motion";
import { useMotion } from "@/components/motion/use-motion";

/**
 * A hairline at the top of a case study showing how much is left.
 *
 * Hidden entirely under reduced motion. A bar that tracks scroll is continuous
 * motion in the corner of the eye by definition — there is no reduced version
 * of it that is still the same feature, so it is removed rather than slowed
 * down. Nothing depends on it: it is orientation, not navigation.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const motionVocabulary = useMotion();

  if (motionVocabulary.reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: scrollYProgress }}
      className="bg-accent fixed inset-x-0 top-0 z-[var(--z-sticky)] h-[2px] origin-left"
    />
  );
}
