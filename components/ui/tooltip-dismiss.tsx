"use client";

import { useEffect } from "react";

/**
 * Escape dismisses an open stack note.
 *
 * This exists as its own two-line client component so the stack grid itself can
 * stay a server component. Making the whole grid client for one key listener
 * would have shipped twenty-nine items of markup and their notes to the browser
 * as a component payload, when all the interactivity it has is :hover,
 * :focus-within and this.
 */
export function TooltipDismiss() {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const active = document.activeElement;
      if (active instanceof HTMLElement && active.hasAttribute("aria-describedby")) {
        active.blur();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}
