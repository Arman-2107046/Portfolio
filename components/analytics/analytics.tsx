"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import Script from "next/script";
import {
  CONSENT_STORAGE_KEY,
  GTM_ID,
  readConsent,
  track,
  writeConsent,
  type ConsentState,
} from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * Consent is stored state that the banner and the loader both read, so it is
 * subscribed to rather than lifted — the same pattern the theme uses. A custom
 * event carries the change, because `storage` only fires in *other* tabs.
 */
const CONSENT_EVENT = "arr:consent";

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * "unknown" is a third state, distinct from "not yet asked".
 *
 * The server genuinely cannot know whether this visitor has answered, and
 * conflating that with "has not answered" would put the banner in the HTML for
 * everyone and then remove it on hydration for the majority who already chose.
 * Returning "unknown" from the server snapshot renders nothing until the real
 * value is readable, which is also why this component needs no mounted flag.
 */
function useConsent(): [ConsentState | null | "unknown", (next: ConsentState) => void] {
  const consent = useSyncExternalStore<ConsentState | null | "unknown">(
    subscribe,
    readConsent,
    () => "unknown",
  );

  const set = useCallback((next: ConsentState) => {
    writeConsent(next);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }, []);

  return [consent, set];
}

/**
 * Loads Google Tag Manager, and only after an explicit grant.
 *
 * Nothing is requested, and no cookie is set, before someone says yes. That is
 * what makes the banner honest — a banner that appears after the tags have
 * already loaded is asking permission for something that has happened.
 *
 * `afterInteractive` rather than `beforeInteractive`: measurement must never
 * compete with the page it is measuring.
 */
function TagManager() {
  if (!GTM_ID) return null;

  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

/**
 * Delegated outbound-link tracking.
 *
 * One listener on the document rather than a handler on every external anchor.
 * Links are written as plain markup all over the site, including inside content
 * prose, so per-link instrumentation would be forgotten the first time someone
 * added a link — and an event schema that depends on remembering is one that
 * quietly develops holes.
 */
function useOutboundTracking(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      if (href.startsWith("mailto:")) return;
      if (!href.startsWith("http")) return;

      const url = new URL(href, window.location.href);
      if (url.host === window.location.host) return;

      track({
        name: "outbound_click",
        params: { link_domain: url.host, link_url: url.href },
      });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [enabled]);
}

function ConsentBanner({ onChoose }: { onChoose: (next: ConsentState) => void }) {
  return (
    <div
      role="region"
      aria-label="Analytics consent"
      className={cn(
        "bg-canvas border-hairline fixed inset-x-0 bottom-0 z-[var(--z-toast)] border-t",
        "px-[max(var(--page-margin),env(safe-area-inset-left))]",
        "pt-[var(--space-4)] pb-[calc(var(--space-4)+env(safe-area-inset-bottom))]",
      )}
    >
      <div className="mx-auto flex max-w-[var(--content-max)] flex-col gap-[var(--space-4)] sm:flex-row sm:items-center sm:justify-between">
        {/*
         * Short, and specific about what it actually does. "We value your
         * privacy" says nothing; naming the tool and the purpose lets someone
         * decide in one read.
         */}
        <p className="measure type-body">
          Analytics cookies would tell me which case studies get read. Nothing loads
          unless you say yes, and the site works the same either way.
        </p>

        <div className="flex shrink-0 gap-[var(--space-2)]">
          <button
            type="button"
            onClick={() => onChoose("denied")}
            className="type-mono tap-target border-edge hover:bg-wash rounded-xs border px-[var(--space-4)] py-[var(--space-2)] transition-colors duration-[var(--duration-fast)]"
          >
            No thanks
          </button>
          <button
            type="button"
            onClick={() => onChoose("granted")}
            className="type-mono tap-target bg-ink text-ink-inverse rounded-xs px-[var(--space-4)] py-[var(--space-2)]"
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}

export function Analytics() {
  const [consent, setConsent] = useConsent();

  useOutboundTracking(consent === "granted");

  // No container id means analytics is not configured. Never show a banner
  // asking permission for something that cannot happen.
  if (!GTM_ID) return null;

  return (
    <>
      {consent === "granted" ? <TagManager /> : null}
      {consent === null ? <ConsentBanner onChoose={setConsent} /> : null}
    </>
  );
}

export { CONSENT_STORAGE_KEY };
