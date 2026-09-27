import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

const GAPS = {
  1: "gap-[var(--space-1)]",
  2: "gap-[var(--space-2)]",
  3: "gap-[var(--space-3)]",
  4: "gap-[var(--space-4)]",
  6: "gap-[var(--space-6)]",
  8: "gap-[var(--space-8)]",
  10: "gap-[var(--space-10)]",
  12: "gap-[var(--space-12)]",
  16: "gap-[var(--space-16)]",
} as const;

type StackProps = {
  children: ReactNode;
  as?: ElementType;
  /** Gap, named by its step on the 4px scale. */
  gap?: keyof typeof GAPS;
  direction?: "column" | "row";
  align?: "start" | "center" | "end" | "baseline";
  justify?: "start" | "between" | "end";
  wrap?: boolean;
  className?: string;
};

const ALIGN = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
} as const;

const JUSTIFY = {
  start: "justify-start",
  between: "justify-between",
  end: "justify-end",
} as const;

/**
 * Spacing between siblings, expressed once on the parent. Exists so that
 * children never carry their own margins, which is what keeps every gap on the
 * page traceable to a token rather than to whichever component was written last.
 */
export function Stack({
  children,
  as: Tag = "div",
  gap = 4,
  direction = "column",
  align,
  justify,
  wrap = false,
  className,
}: StackProps) {
  return (
    <Tag
      className={cn(
        "flex",
        direction === "column" ? "flex-col" : "flex-row",
        GAPS[gap],
        align && ALIGN[align],
        justify && JUSTIFY[justify],
        wrap && "flex-wrap",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
