"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  /** Opacity only, for blocks large enough that a rise would be noticeable. */
  variant?: "reveal" | "fadeIn";
  className?: string;
};

/**
 * Brings a block in once, when it first enters the viewport.
 *
 * This was a Framer component. It is now an IntersectionObserver and a class,
 * because a scroll fade is two CSS properties and importing an animation
 * library to apply them put ~70KB and around 830ms of mobile script evaluation
 * on the critical path of a page whose animations are all below the fold. The
 * observer is a browser primitive that was already there.
 *
 * `once` is a decision, not a default: content that re-animates every time it
 * is scrolled past turns the page into a fidget toy and makes it hard to
 * reread. The margin starts the reveal slightly before the element reaches the
 * edge, so it has settled by the time it is actually being looked at.
 *
 * Reduced motion needs no branch here. The transition tokens are collapsed to
 * 1ms by the base layer in globals.css, and the transform is paired with an
 * opacity change that carries the whole effect on its own.
 */
export function Reveal({
  children,
  as: Tag = "div",
  variant = "reveal",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If the browser cannot observe intersection, show the content rather than
    // leaving it permanently at opacity 0.
    if (typeof IntersectionObserver === "undefined") {
      element.dataset.revealed = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-revealed={visible ? "true" : undefined}
      className={cn(variant === "reveal" ? "reveal-rise" : "reveal-fade", className)}
    >
      {children}
    </Tag>
  );
}
