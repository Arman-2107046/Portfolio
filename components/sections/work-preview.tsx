"use client";

import { useEffect, type RefObject } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ProjectImage } from "@/components/ui/project-image";
import type { Project } from "@/content/types";
import { DURATION, EASE_OUT } from "@/lib/motion";

export const PREVIEW_WIDTH = 360;
export const PREVIEW_HEIGHT = 225;

/**
 * The cursor-tracked cover.
 *
 * This is the only thing on the site that genuinely wants an animation
 * library — a damped spring following a pointer is not a CSS transition — so it
 * lives in its own module and is loaded with next/dynamic. Framer is a chunk
 * fetched when a desktop visitor reaches the work index, rather than 70KB on
 * the critical path of every page.
 *
 * The pointer listener lives here rather than in the parent for the same
 * reason. `useMotionValue` is a Framer import, so calling it in SelectedWork
 * would have pulled the whole library back into the page bundle and quietly
 * undone the split. Tracking the pointer from inside the lazy chunk keeps the
 * boundary real.
 */
export function WorkPreview({
  project,
  containerRef,
}: {
  project: Project | null;
  containerRef: RefObject<HTMLElement | null>;
}) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  // The spring is the whole effect. Without it the preview is welded to the
  // cursor, which reads as a bug rather than as motion.
  const x = useSpring(pointerX, { stiffness: 260, damping: 32, mass: 0.6 });
  const y = useSpring(pointerY, { stiffness: 260, damping: 32, mass: 0.6 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function onPointerMove(event: PointerEvent) {
      const bounds = container?.getBoundingClientRect();
      if (!bounds) return;

      // Offset so the preview trails below and right of the cursor rather than
      // sitting under it, where it would cover the row being read.
      pointerX.set(event.clientX - bounds.left + 24);
      pointerY.set(event.clientY - bounds.top - PREVIEW_HEIGHT / 2);
    }

    container.addEventListener("pointermove", onPointerMove);
    return () => container.removeEventListener("pointermove", onPointerMove);
  }, [containerRef, pointerX, pointerY]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y, width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
      className="pointer-events-none absolute top-0 left-0 z-[var(--z-raised)] hidden lg:block"
    >
      <AnimatePresence>
        {project ? (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
            className="border-edge bg-canvas h-full w-full overflow-hidden border"
          >
            <ProjectImage
              image={project.cover}
              sizes="384px"
              className="h-full object-cover"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
