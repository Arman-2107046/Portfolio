import type Lenis from "lenis";

/**
 * A module-level handle on the running Lenis instance.
 *
 * The mobile navigation has to stop smooth scrolling while it is open —
 * setting `overflow: hidden` is not enough on its own, because Lenis drives
 * the scroll position itself and would keep moving the page underneath the
 * overlay. A one-value registry is a smaller thing to maintain than a context
 * provider for a value that exactly one component needs.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null): void {
  instance = next;
}

export function getLenis(): Lenis | null {
  return instance;
}
