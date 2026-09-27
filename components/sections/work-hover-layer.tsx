"use client";

import { useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useHasHover } from "@/components/hooks/use-media-query";
import { getProject } from "@/content/projects";

/**
 * Loaded on demand, and only in the browser. Framer is the site's one heavy
 * dependency and the damped preview is its only remaining use.
 */
const WorkPreview = dynamic(
  () => import("./work-preview").then((mod) => mod.WorkPreview),
  { ssr: false },
);

/**
 * A client island around a server-rendered list.
 *
 * The rows are passed in as `children`, so they arrive already rendered and
 * never become client components — six project rows, their copy, their chips
 * and their covers stay out of the hydration payload entirely. All that
 * hydrates is this wrapper, which tracks which row the pointer is over.
 *
 * Which row is hovered is read from the DOM via a data attribute rather than
 * from props, because the rows are server output and there is nothing to pass.
 */
export function WorkHoverLayer({ children }: { children: ReactNode }) {
  const listRef = useRef<HTMLDivElement>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const hasHover = useHasHover();

  /**
   * Delegated from the wrapper rather than bound per row, so the rows can stay
   * server-rendered. pointermove rather than pointerover: the latter depends on
   * the pointer crossing an element boundary, which is not guaranteed when the
   * cursor is already inside the list as it renders, or when it moves between
   * two rows in a single event.
   */
  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!hasHover) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const next = target.closest<HTMLElement>("[data-project-slug]")?.dataset.projectSlug;
    setSlug((current) => (current === (next ?? null) ? current : (next ?? null)));
  }

  return (
    <div
      ref={listRef}
      className="relative"
      onPointerMove={onPointerMove}
      onPointerLeave={() => setSlug(null)}
    >
      {children}

      {/*
       * Absolutely positioned and pointer-events-none, so summoning it cannot
       * move a single pixel of the list underneath.
       */}
      {hasHover ? (
        <WorkPreview
          project={slug ? (getProject(slug) ?? null) : null}
          containerRef={listRef}
        />
      ) : null}
    </div>
  );
}
