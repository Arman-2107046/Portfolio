/**
 * The event layer.
 *
 * Every event the site can emit is declared here as a type, so a typo is a
 * build failure rather than a parameter that silently never arrives in GA4.
 * This is the same discipline described in the Measurement capability lane and
 * documented in ANALYTICS.md — the schema exists before the implementation, not
 * after it.
 */

export const CONSENT_STORAGE_KEY = "arr-analytics-consent";

export type ConsentState = "granted" | "denied";

/** The complete set. Nothing pushes an event that is not on this list. */
export type AnalyticsEvent =
  | {
      name: "view_case_study";
      params: { project_slug: string; project_name: string; project_lane: string };
    }
  | { name: "copy_email"; params: { location: "contact" | "footer" } }
  | {
      name: "contact_submit";
      params: {
        project_type: string;
        budget_range: string;
        outcome: "success" | "error";
      };
    }
  | { name: "outbound_click"; params: { link_domain: string; link_url: string } }
  | { name: "cv_download"; params: { file_name: string } };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Pushes an event to the data layer.
 *
 * Safe to call before consent, before GTM has loaded, and during server
 * rendering: if the tag manager is never loaded the array simply accumulates
 * and is discarded with the page. That means call sites never have to know
 * whether tracking is on, which is what keeps the consent check in one place
 * instead of in every component.
 */
export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: event.name, ...event.params });
}

/** Reads the stored choice. `null` means the visitor has not been asked yet. */
export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    // Storage blocked. Treated as "not asked", and since nothing loads without
    // an explicit grant, the effect is that analytics stays off.
    return null;
  }
}

export function writeConsent(state: ConsentState): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, state);
  } catch {
    // The choice applies for this visit; it simply will not be remembered.
  }
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
