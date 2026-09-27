"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";
import { cn } from "@/lib/cn";

/**
 * The active theme is not React state. It is an attribute on <html>, written by
 * the blocking script in <head> before React exists, so React subscribes to it
 * rather than owning it. useSyncExternalStore is the right shape for that: it
 * hydrates against the documented default and re-reads the real value in the
 * same commit, with no setState-in-effect and no cascading render.
 */
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

/**
 * A half-filled disc: the conventional contrast mark, and not a sun or a moon.
 * It rotates to point at the theme the button would switch to, so the control
 * reads as a position on a dial rather than a picture of the weather.
 */
function ContrastMark() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
      className="transition-transform duration-[var(--duration-base)] ease-out"
    >
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 1a7 7 0 0 1 0 14Z" fill="currentColor" />
    </svg>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    // Writing the attribute is what updates the UI; the store above notices.
    root.setAttribute("data-theme", next);
    root.style.colorScheme = next;

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be blocked. The theme still applies for this visit, it
      // simply will not be remembered, which is not worth an error state.
    }
  }

  // Labelled with the action, never the current state — a button that reads
  // "Dark" leaves a screen reader user guessing whether that is a description
  // of the button or of its destination.
  const label =
    theme === "dark" ? "Switch to the light theme" : "Switch to the dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className={cn(
        "text-ink hover:bg-wash inline-flex size-11 items-center justify-center",
        "rounded-xs transition-colors duration-[var(--duration-fast)]",
        theme === "dark" && "[&_svg]:rotate-180",
        className,
      )}
    >
      <ContrastMark />
    </button>
  );
}
