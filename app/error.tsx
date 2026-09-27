"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/container";
import { site } from "@/content/site";

/**
 * The route-level error boundary.
 *
 * It cannot use SiteHeader or SiteFooter: whatever threw may have been inside
 * them, and a boundary that re-renders the thing that failed is a boundary that
 * fails too. So this page carries its own minimal chrome and depends on almost
 * nothing.
 *
 * The copy does not say "something went wrong" — that is what the reader can
 * already see. It says what they can do next, and offers the one route that
 * definitely still works.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is what ties this screen to a specific server-side stack
    // trace in the logs. Without it a report of "I saw an error page" is not
    // actionable.
    console.error("Route error", error.digest ?? error.message);
  }, [error]);

  return (
    <main id="main">
      <Container>
        <div className="pt-[var(--space-16)] pb-[var(--rhythm-loose)]">
          <p className="type-mono text-ink-muted">Error</p>

          <h1 className="type-display-l measure-lead mt-[var(--space-4)]">
            This page did not finish loading.
          </h1>

          <p className="measure type-body text-ink-muted mt-[var(--space-6)]">
            Trying again usually resolves it. If it does not, the fault is at my end and
            worth telling me about — especially with the reference below, which points at
            the exact failure in the logs.
          </p>

          <div className="mt-[var(--space-8)] flex flex-wrap items-center gap-[var(--space-3)]">
            <button
              type="button"
              onClick={reset}
              className="type-body bg-ink text-ink-inverse rounded-xs px-[var(--space-6)] py-[var(--space-3)]"
            >
              Try again
            </button>

            {/*
              A plain anchor, deliberately. This is an error boundary: the
              client router is one of the things that may have just failed, so
              a full document load is the escape hatch that does not depend on
              the machinery that broke. next/link would be a client-side
              navigation through exactly that machinery.
            */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="type-body border-edge hover:bg-wash rounded-xs border px-[var(--space-6)] py-[var(--space-3)] transition-colors duration-[var(--duration-fast)]"
            >
              Go to the homepage
            </a>
          </div>

          {error.digest ? (
            <p className="type-mono text-ink-muted mt-[var(--space-8)]">
              Reference {error.digest}
            </p>
          ) : null}

          <p className="type-mono text-ink-muted mt-[var(--space-3)]">
            <a
              href={`mailto:${site.email}?subject=Error%20on%20the%20site`}
              className="decoration-accent underline decoration-[1px] underline-offset-4"
            >
              {site.email}
            </a>
          </p>
        </div>
      </Container>
    </main>
  );
}
