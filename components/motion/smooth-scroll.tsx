"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { DURATION } from "@/lib/motion";

/** Reproduces the site easing as the function Lenis wants. */
function easeOut(t: number): number {
  // cubic-bezier(0.16, 1, 0.3, 1), evaluated closely enough for scroll.
  return 1 - Math.pow(1 - t, 3.2);
}

/**
 * Mounts Lenis for smooth wheel scrolling. Renders nothing — it attaches to the
 * document rather than wrapping the tree, so the DOM shape is unchanged whether
 * smoothing is on or off.
 *
 * Under prefers-reduced-motion, Lenis is not constructed at all. That is
 * stricter than the library's own `respectReducedMotion`, which keeps the
 * instance alive with smoothing neutralised.
 */
export function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    function start() {
      if (lenis) return;
      lenis = new Lenis({
        duration: DURATION.reveal,
        easing: easeOut,
        // Lenis handles in-page anchor clicks itself, so href="#work" keeps
        // working and lands with the same easing as everything else.
        anchors: { offset: -80 },
        smoothWheel: true,
        // Touch scrolling is already smooth and native; hijacking it makes a
        // phone feel worse, not better.
        syncTouch: false,
      });
    }

    function stop() {
      lenis?.destroy();
      lenis = null;
    }

    function sync() {
      if (query.matches) stop();
      else start();
    }

    /**
     * Keyboard focus moves the viewport natively. Lenis owns the scroll
     * position on the next frame, so without this the browser's scroll-into-view
     * is immediately undone and the focused element stays off screen.
     */
    function onFocusIn(event: FocusEvent) {
      if (!lenis) return;
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const box = target.getBoundingClientRect();
      const fullyVisible = box.top >= 0 && box.bottom <= window.innerHeight;
      if (fullyVisible) return;

      lenis.scrollTo(target, { offset: -96, lock: true });
    }

    sync();
    query.addEventListener("change", sync);
    document.addEventListener("focusin", onFocusIn);

    return () => {
      query.removeEventListener("change", sync);
      document.removeEventListener("focusin", onFocusIn);
      stop();
    };
  }, []);

  return null;
}
