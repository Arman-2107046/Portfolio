import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container, type ContainerWidth } from "./container";

const RHYTHM = {
  flush: "py-0",
  tight: "py-[var(--rhythm-tight)]",
  base: "py-[var(--rhythm-base)]",
  loose: "py-[var(--rhythm-loose)]",
} as const;

type SectionProps = {
  children: ReactNode;
  /** Anchor target for in-page navigation and the IntersectionObserver. */
  id?: string;
  rhythm?: keyof typeof RHYTHM;
  width?: ContainerWidth;
  /**
   * Draws the band rule at the top of the section. It spans the full viewport
   * width, past the content column, which is what makes the page read as
   * horizontal bands rather than stacked blocks.
   */
  rule?: boolean;
  surface?: "canvas" | "raised";
  /** Skip the inner Container when the section manages its own bounds. */
  bare?: boolean;
  className?: string;
  /** Accessible name for the section landmark, when the heading is visual. */
  ariaLabelledBy?: string;
};

/**
 * The single owner of vertical rhythm on this site.
 *
 * Padding, not margin, so two stacked sections cannot collapse into each other
 * and the cadence is what the token says it is. No other component in the
 * codebase is permitted to set its own top or bottom spacing — that rule is
 * the reason the page has one cadence from the hero to the footer, and it is
 * where specificity fights would otherwise start.
 */
export function Section({
  children,
  id,
  rhythm = "base",
  width = "content",
  rule = false,
  surface = "canvas",
  bare = false,
  className,
  ariaLabelledBy,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        RHYTHM[rhythm],
        rule && "border-hairline border-t",
        surface === "raised" && "bg-raised",
        className,
      )}
    >
      {bare ? children : <Container width={width}>{children}</Container>}
    </section>
  );
}
