"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { buildMotion, type MotionVocabulary } from "@/lib/motion";

/**
 * The only way to get animation variants in this codebase.
 *
 * Framer's `useReducedMotion` returns `null` before it has read the media
 * query, which happens on the server and on the first client render. Treating
 * that as "reduce" would flash content hidden for anyone who has the setting
 * on, so `null` is treated as "no preference" and the variants swap on the
 * first commit — before any of them has had a chance to run.
 */
export function useMotion(): MotionVocabulary {
  const prefersReduced = useReducedMotion();
  return useMemo(() => buildMotion(prefersReduced === true), [prefersReduced]);
}
