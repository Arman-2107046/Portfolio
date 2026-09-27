"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/content/site";

function readClock(): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: site.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

/**
 * The clock is an external source of truth, not React state, so it is
 * subscribed to rather than copied into a useState inside an effect.
 *
 * The snapshot is a formatted "HH:MM" string, which only changes once a minute,
 * so polling it more often than that costs a string comparison and never a
 * re-render. Fifteen seconds keeps the displayed minute close enough to true
 * without waking the main thread every second for a value that rarely moves.
 */
function subscribe(onChange: () => void): () => void {
  const interval = setInterval(onChange, 15_000);
  return () => clearInterval(interval);
}

/** Empty on the server: see the component comment. */
function getServerSnapshot(): string {
  return "";
}

/**
 * The current time where Arman is, so an international client can judge the
 * overlap with their own working day without doing timezone arithmetic.
 *
 * It renders nothing on the server. That is deliberate — the time is the one
 * value on this site that cannot be prerendered honestly, and a server-rendered
 * clock would be wrong by however long the page sat in a CDN cache. With
 * JavaScript disabled the reading is simply absent, and the zone label beside it
 * still tells the reader what they need.
 */
export function LocalTime() {
  const time = useSyncExternalStore(subscribe, readClock, getServerSnapshot);

  if (!time) return null;

  return (
    <>
      <time dateTime={time}>{time}</time> local
    </>
  );
}
