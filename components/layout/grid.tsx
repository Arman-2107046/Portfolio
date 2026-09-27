import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

const COLUMNS = {
  /** The site grid: 4 → 8 → 12. See DESIGN.md section 3. */
  page: "grid-cols-4 md:grid-cols-8 lg:grid-cols-12",
  /**
   * The datasheet split that most sections use: a mono label rail, the content,
   * then right-aligned specified values. Stacks to one column on a phone.
   */
  split: "grid-cols-1 lg:grid-cols-[8rem_minmax(0,1fr)_10rem]",
  /** Label rail plus content, no value column. */
  pair: "grid-cols-1 lg:grid-cols-[8rem_minmax(0,1fr)]",
} as const;

type GridProps = {
  children: ReactNode;
  as?: ElementType;
  columns?: keyof typeof COLUMNS;
  /** Column gap. Row gap is set separately so the split can breathe vertically. */
  gap?: "none" | "gutter" | "wide";
  className?: string;
};

const GAPS = {
  none: "gap-0",
  gutter: "gap-x-[var(--gutter)] gap-y-[var(--space-8)]",
  wide: "gap-x-[var(--space-10)] gap-y-[var(--space-12)]",
} as const;

/** The 12-column page grid, and the two named sub-grids the layout reuses. */
export function Grid({
  children,
  as: Tag = "div",
  columns = "page",
  gap = "gutter",
  className,
}: GridProps) {
  return (
    <Tag className={cn("grid", COLUMNS[columns], GAPS[gap], className)}>{children}</Tag>
  );
}
