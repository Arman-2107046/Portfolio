import { TooltipDismiss } from "@/components/ui/tooltip-dismiss";
import { Container } from "@/components/layout/container";
import { capabilities, capabilityLaneLabels } from "@/content/capabilities";
import { stackItems } from "@/content/stack";
import type { StackItem } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * The mark.
 *
 * Deliberately a monogram rather than a vendor logo. Redrawing twenty-nine
 * logos from memory as SVG paths produces twenty-nine subtly wrong logos, and
 * the alternative — shipping real brand assets — means either colour, which the
 * art direction forbids, or restyling someone else's trademark. A consistent
 * monogram in the site's own mono face is honest about what it is, and it makes
 * the grid read as a component index rather than a sponsor wall.
 */
function Monogram({ name }: { name: string }) {
  const initials = name
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <span
      aria-hidden="true"
      className="type-mono text-ink-muted border-hairline flex size-8 shrink-0 items-center justify-center border"
    >
      {initials}
    </span>
  );
}

function StackEntry({ item }: { item: StackItem }) {
  // Derived from the name rather than useId: the names are unique, this is a
  // server component, and a stable id keeps the markup diffable between builds.
  const noteId = `stack-note-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    // The group is the row, not the button, so the note stays open while the
    // pointer travels onto it. Anchoring hover to the button instead would hide
    // the note the moment someone moved towards it to read it.
    <li className="group relative">
      <button
        type="button"
        // The note is always in the DOM and always referenced, so a screen
        // reader announces it on focus whether or not it is visually shown.
        // That is the difference between this and title=, which is announced
        // inconsistently and cannot be reached by keyboard at all.
        aria-describedby={noteId}
        className={cn(
          "flex w-full items-center gap-[var(--space-3)] rounded-xs text-left",
          "px-[var(--space-2)] py-[var(--space-2)]",
          "hover:bg-wash transition-colors duration-[var(--duration-fast)]",
        )}
      >
        <Monogram name={item.name} />
        <span className="type-body">{item.name}</span>
      </button>

      {/*
       * Shown on hover and on focus, never on a timer. WCAG asks three things
       * of content that appears this way: that it can be dismissed (Escape,
       * handled below), that the pointer can move onto it without it
       * disappearing (the group), and that it stays until hover or focus
       * actually leaves.
       */}
      <span
        id={noteId}
        role="tooltip"
        className={cn(
          "type-caption bg-ink text-ink-inverse pointer-events-none absolute",
          "bottom-[calc(100%-var(--space-2))] left-0 z-[var(--z-raised)]",
          // Width follows the grid cell rather than the text. As `w-max` the
          // note was as wide as its longest line, so an item in the last
          // column pushed a 22rem panel past the right edge of the viewport
          // and the whole page scrolled sideways at 1024px. Matching the cell
          // means it cannot overflow at any width, at the cost of wrapping to
          // another line or two.
          "w-full px-[var(--space-3)] py-[var(--space-2)]",
          "opacity-0 transition-opacity duration-[var(--duration-fast)]",
          "group-hover:pointer-events-auto group-hover:opacity-100",
          "group-focus-within:pointer-events-auto group-focus-within:opacity-100",
        )}
      >
        {item.note}
      </span>
    </li>
  );
}

/**
 * A server component. Note visibility is entirely CSS — :hover and
 * :focus-within — so the only JavaScript this section needs is the Escape
 * handler, which is isolated in TooltipDismiss rather than making the whole
 * grid client.
 */
export function StackGrid() {
  return (
    <section aria-labelledby="stack-heading" className="py-[var(--rhythm-base)]">
      <TooltipDismiss />
      <Container>
        <div className="border-hairline flex items-baseline justify-between gap-[var(--space-4)] border-b pb-[var(--space-4)]">
          <h2 id="stack-heading" className="type-h1">
            The tools underneath
          </h2>
          <p className="type-mono text-ink-muted shrink-0">{stackItems.length} in use</p>
        </div>

        <p className="measure type-body text-ink-muted mt-[var(--space-6)]">
          Point at any of these, or tab to it, for a line on how I actually use it.
        </p>

        {/* Nothing here animates on its own. Every state change is one the
            reader asked for. */}
        <div className="mt-[var(--space-10)] flex flex-col gap-[var(--space-10)]">
          {capabilities.map((capability) => {
            const items = stackItems.filter((item) => item.lane === capability.lane);

            return (
              <div
                key={capability.lane}
                className="border-hairline grid gap-x-[var(--gutter)] gap-y-[var(--space-4)] border-t pt-[var(--space-6)] lg:grid-cols-[10rem_minmax(0,1fr)]"
              >
                <h3 className="type-mono text-ink-muted lg:pt-[var(--space-2)]">
                  {capabilityLaneLabels[capability.lane]}
                </h3>

                <ul className="grid grid-cols-1 gap-x-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <StackEntry key={item.name} item={item} />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
