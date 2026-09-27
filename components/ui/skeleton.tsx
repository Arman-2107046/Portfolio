import { cn } from "@/lib/cn";

/**
 * A single placeholder block.
 *
 * No shimmer. A sweeping gradient across a loading screen is decoration that
 * implies progress it cannot know about, and it is precisely the effect the art
 * direction rules out elsewhere. A flat inset block says the same thing without
 * pretending.
 */
export function Skeleton({
  className,
  ratio,
}: {
  className?: string;
  /** e.g. "16 / 10" — reserves the box so nothing shifts when content lands. */
  ratio?: string;
}) {
  return (
    <div
      aria-hidden="true"
      style={ratio ? { aspectRatio: ratio } : undefined}
      className={cn("skeleton-block", className)}
    />
  );
}

/**
 * Wraps a loading screen so it stays invisible unless the wait is real. See the
 * appear-delayed comment in globals.css.
 */
export function LoadingScreen({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" aria-live="polite" className="appear-delayed">
      <span className="sr-only">Loading</span>
      {children}
    </div>
  );
}
