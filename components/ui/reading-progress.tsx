/**
 * A hairline at the top of a case study showing how much is left.
 *
 * A server component with no JavaScript at all: the animation is driven by a
 * CSS scroll timeline, so it cannot drift out of sync with the scroll position
 * — it is the scroll position. See the reading-progress utility in globals.css
 * for the @supports gate and the reduced-motion removal.
 */
export function ReadingProgress() {
  return (
    <div
      aria-hidden="true"
      className="reading-progress bg-accent fixed inset-x-0 top-0 z-[var(--z-sticky)] h-[2px]"
    />
  );
}
