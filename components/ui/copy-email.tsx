"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * Click to copy, with a designed confirmation rather than a toast.
 *
 * The label changes in place — "Copy email" becomes "Copied" — so the feedback
 * appears exactly where the attention already is. The button is sized to its
 * widest label so the confirmation cannot reflow the line it sits on.
 */
export function CopyEmail({ location = "contact" }: { location?: "contact" | "footer" }) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      track({ name: "copy_email", params: { location } });
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard access can be refused outright. The address is displayed in
      // full next to this button and is also a mailto link, so there is nothing
      // to recover from and no reason to raise an error about it.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "type-mono tap-target border-edge hover:bg-wash inline-flex items-center justify-center",
        "rounded-xs border px-[var(--space-4)] py-[var(--space-2)]",
        "transition-colors duration-[var(--duration-fast)]",
      )}
    >
      {/* A live region, so the confirmation is announced and not only seen. */}
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}
