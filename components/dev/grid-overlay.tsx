"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/cn";

/**
 * Development-only alignment aid. Ctrl+G (or Cmd+G) paints the 12-column grid,
 * the content bound and the outer bound over the page so alignment can be
 * verified by eye instead of asserted.
 *
 * Never rendered in production — app/layout.tsx mounts it behind a NODE_ENV
 * check, so it is tree-shaken out of the production bundle entirely.
 */
export function GridOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // Cmd+G is Safari's "find again"; Ctrl+G is Chrome's. Both are worth
      // overriding here because this only ever runs on a developer's machine.
      if (event.key.toLowerCase() !== "g") return;
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      setVisible((current) => !current);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[var(--z-toast)]"
    >
      {/* Outer bound, 1440px. */}
      <div className="mx-auto h-full max-w-[var(--page-max)] border-x border-dashed border-[color-mix(in_srgb,var(--accent)_45%,transparent)]" />

      {/* The 12 columns, inside the content bound and the real gutter. */}
      <Container className="absolute inset-0">
        <div className="grid h-full grid-cols-4 gap-x-[var(--gutter)] md:grid-cols-8 lg:grid-cols-12">
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              // Columns 1–4 exist at every width, 5–8 appear at md, 9–12 at lg,
              // matching the real grid rather than wrapping into extra rows.
              className={cn(
                "h-full bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]",
                index >= 4 && index < 8 && "hidden md:block",
                index >= 8 && "hidden lg:block",
              )}
            />
          ))}
        </div>
      </Container>

      <p className="type-mono bg-ink text-ink-inverse fixed bottom-[var(--space-4)] left-[var(--space-4)] px-[var(--space-3)] py-[var(--space-1)]">
        grid — ctrl/cmd + g
      </p>
    </div>
  );
}
