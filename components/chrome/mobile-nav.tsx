"use client";

import { useEffect, useRef } from "react";
import { navItems } from "@/content/navigation";
import { getLenis } from "@/components/motion/lenis-instance";
import { cn } from "@/lib/cn";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  /** Focus returns here on close. */
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  activeId: string | null;
};

/**
 * Full-screen navigation for small viewports.
 *
 * The overlay is always in the DOM but `inert` while closed, which is what
 * keeps its links out of the tab order without needing to remember to hide
 * each one. Everything else here exists because a dialog that traps focus has
 * to give it back: Escape closes, Tab wraps inside, and focus returns to the
 * button that opened it.
 */
export function MobileNav({ open, onClose, triggerRef, activeId }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    // Captured now, because by the time cleanup runs the ref may already point
    // somewhere else — and this is the node focus has to return to.
    const trigger = triggerRef.current;

    // Lenis owns the scroll position, so overflow:hidden alone would not stop
    // the page drifting under the overlay.
    const lenis = getLenis();
    lenis?.stop();

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    // Move focus into the panel so a screen reader lands inside the dialog
    // rather than continuing from the trigger in the page behind it.
    const first = panel.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = panel ? [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)] : [];
      if (focusable.length === 0) return;

      const firstItem = focusable[0]!;
      const lastItem = focusable[focusable.length - 1]!;
      const current = document.activeElement;

      // Wrap at both ends. Without this the next Tab leaves the overlay and
      // lands somewhere invisible behind it.
      if (event.shiftKey && current === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && current === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousOverflow;
      getLenis()?.start();
      // Restoring focus is the half people forget; without it the next Tab
      // starts from the top of the document.
      trigger?.focus();
    };
  }, [open, onClose, triggerRef]);

  return (
    <div
      ref={panelRef}
      id="mobile-navigation"
      // `inert` removes the whole subtree from focus and from the a11y tree
      // while closed, so no child needs its own tabindex management.
      inert={!open}
      // A dialog, because it covers the page and holds focus while it is open.
      // aria-modal is honest here: `inert` really does make the rest of the
      // document unreachable, rather than merely claiming so.
      role="dialog"
      aria-modal={open}
      aria-label="Site navigation"
      className={cn(
        "bg-canvas fixed inset-0 z-[var(--z-overlay)] md:hidden",
        "flex flex-col px-[max(var(--page-margin),env(safe-area-inset-left))]",
        // Clears the notch at the top and the home indicator at the bottom.
        "pt-[calc(var(--space-24)+env(safe-area-inset-top))]",
        "pb-[calc(var(--space-10)+env(safe-area-inset-bottom))]",
        "transition-opacity duration-[var(--duration-base)] ease-out",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <nav aria-label="Sections">
        <ul className="flex flex-col">
          {navItems.map((item) => (
            <li key={item.id} className="border-hairline border-b">
              <a
                href={`#${item.id}`}
                onClick={onClose}
                aria-current={activeId === item.id ? "true" : undefined}
                className="type-h1 flex items-baseline justify-between py-[var(--space-4)]"
              >
                {item.label}
                {activeId === item.id ? (
                  <span
                    aria-hidden="true"
                    className="bg-accent size-[6px] self-center rounded-full"
                  />
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
