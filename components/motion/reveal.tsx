"use client";

import type { ElementType, ReactNode } from "react";
import { motion } from "framer-motion";
import { useMotion } from "./use-motion";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  /** Shift the start of this element's reveal, in seconds. */
  delay?: number;
  /** Opacity only, for anything large enough that a rise would be noticeable. */
  variant?: "reveal" | "fadeIn";
  className?: string;
};

/**
 * Brings a block in once, when it first enters the viewport.
 *
 * `once: true` is not a detail — content that re-animates every time it is
 * scrolled past turns the page into a fidget toy and makes it hard to reread.
 * The margin fires the reveal slightly before the element reaches the edge, so
 * it is already settled by the time it is actually being looked at.
 */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  variant = "reveal",
  className,
}: RevealProps) {
  const motionVocabulary = useMotion();
  const Tag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={motionVocabulary[variant]}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Tag>
  );
}
