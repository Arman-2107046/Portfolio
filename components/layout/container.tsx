import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

const WIDTHS = {
  /** 1200px — the content column almost everything lives in. */
  content: "max-w-[var(--content-max)]",
  /** 1440px — the outer bound. Used by full-width rules and the header. */
  page: "max-w-[var(--page-max)]",
  /** No cap. For full-bleed media that still wants the page gutter. */
  bleed: "max-w-none",
} as const;

export type ContainerWidth = keyof typeof WIDTHS;

type ContainerProps = {
  children: ReactNode;
  as?: ElementType;
  width?: ContainerWidth;
  className?: string;
};

/**
 * Horizontal bounds and the page gutter. Owns the left and right edge of the
 * site and nothing else — no vertical space, ever. That belongs to <Section>.
 */
export function Container({
  children,
  as: Tag = "div",
  width = "content",
  className,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-[var(--page-margin)] md:px-[var(--gutter)]",
        WIDTHS[width],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
