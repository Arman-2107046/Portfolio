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
        // max() rather than a plain addition: the safe-area inset only takes
        // effect where it is larger than the page margin, so nothing changes
        // on a device without a notch. This is what keeps content off the
        // rounded corners in landscape.
        "mx-auto w-full",
        "px-[max(var(--page-margin),env(safe-area-inset-left))]",
        "md:px-[max(var(--gutter),env(safe-area-inset-left))]",
        WIDTHS[width],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
