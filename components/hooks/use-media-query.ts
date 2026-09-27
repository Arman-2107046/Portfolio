"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query.
 *
 * A media query is external state, so it is read through
 * useSyncExternalStore rather than mirrored into useState from an effect. The
 * server snapshot is always `false`: the server cannot know anything about the
 * device, and defaulting to "no" means the enhancement is added after hydration
 * rather than the baseline being taken away.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/**
 * Whether the device has a real pointer that can hover.
 *
 * Deliberately not "is this a small screen": a touchscreen laptop and a phone
 * both lack a hover state, and a narrow window on a desktop still has a mouse.
 * The work index branches on this because a cursor-tracked preview is
 * meaningless without a cursor.
 */
export function useHasHover(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
