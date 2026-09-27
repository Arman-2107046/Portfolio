"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useHasHover } from "@/components/hooks/use-media-query";
import { Container } from "@/components/layout/container";
import { useMotion } from "@/components/motion/use-motion";
import { ProjectImage } from "@/components/ui/project-image";
import { projects } from "@/content/projects";
import { cn } from "@/lib/cn";

const PREVIEW_WIDTH = 360;
const PREVIEW_HEIGHT = 225;

export function SelectedWork() {
  const motionVocabulary = useMotion();
  const hasHover = useHasHover();
  const listRef = useRef<HTMLOListElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  // Raw pointer position, then the damped version that is actually rendered.
  // The spring is the whole effect: without it the preview is welded to the
  // cursor, which reads as a bug rather than as motion.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 260, damping: 32, mass: 0.6 });
  const y = useSpring(pointerY, { stiffness: 260, damping: 32, mass: 0.6 });

  const previewEnabled = hasHover && !motionVocabulary.reduced;

  function onPointerMove(event: React.PointerEvent<HTMLOListElement>) {
    if (!previewEnabled) return;
    const bounds = listRef.current?.getBoundingClientRect();
    if (!bounds) return;

    // Offset so the preview trails below and right of the cursor rather than
    // sitting under it, where it would cover the row being read.
    pointerX.set(event.clientX - bounds.left + 24);
    pointerY.set(event.clientY - bounds.top - PREVIEW_HEIGHT / 2);
  }

  const activeProject = hovered === null ? null : projects[hovered];

  return (
    <section id="work" aria-labelledby="work-heading" className="py-[var(--rhythm-base)]">
      <Container>
        <div className="border-hairline flex items-baseline justify-between gap-[var(--space-4)] border-b pb-[var(--space-4)]">
          <h2 id="work-heading" className="type-h1">
            Selected work
          </h2>
          <p className="type-mono text-ink-muted">Six projects</p>
        </div>

        {/*
         * One reveal for the whole list, not one per row. Six rows each doing
         * the same fade-and-rise is a texture, and it delays the only thing on
         * this section anyone came to read.
         */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={motionVocabulary.fadeIn}
        >
          <ol
            ref={listRef}
            onPointerMove={onPointerMove}
            onPointerLeave={() => setHovered(null)}
            className="relative"
          >
            {projects.map((project, index) => (
              <li key={project.slug} className="border-hairline border-b">
                <Link
                  href={`/work/${project.slug}`}
                  // The whole row is the hit area and one tab stop. A card with
                  // separate image, title and tag links would be four.
                  className={cn(
                    "group block py-[var(--space-6)]",
                    "transition-colors duration-[var(--duration-base)] ease-out",
                    "hover:bg-wash focus-visible:bg-wash",
                    "-mx-[var(--space-4)] px-[var(--space-4)]",
                  )}
                  // Pointer only. Driving this from focus too would summon the
                  // preview at wherever the mouse happens to be sitting, which
                  // is unrelated to the row the keyboard is actually on.
                  onPointerEnter={() => setHovered(index)}
                >
                  <div className="flex items-baseline justify-between gap-[var(--space-6)]">
                    <h3 className="type-h2">{project.name}</h3>
                    <span className="type-mono text-ink-muted shrink-0">
                      {project.year}
                    </span>
                  </div>

                  <p className="measure type-body text-ink-muted mt-[var(--space-2)]">
                    <span className="text-ink">{project.category}</span> —{" "}
                    {project.summary}
                  </p>

                  <ul className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
                    {project.featuredStack.map((item) => (
                      <li
                        key={item}
                        className="type-mono text-ink-muted border-hairline border px-[var(--space-2)] py-[2px]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/*
                   * Without a cursor there is nothing to track, so the cover
                   * sits in the row instead of waiting to be hovered. The same
                   * applies under reduced motion, where the tracked preview is
                   * switched off entirely.
                   *
                   * This branch is CSS, not JavaScript, on purpose. Deciding it
                   * from a hydrated media-query hook would mean the server
                   * always guessed one way, so every desktop visitor would see
                   * six covers appear and then vanish on hydration.
                   */}
                  <div
                    className={cn(
                      "border-hairline mt-[var(--space-5)] hidden border",
                      "[@media(hover:none)]:block",
                      "[@media(prefers-reduced-motion:reduce)]:block",
                    )}
                  >
                    <ProjectImage
                      image={project.cover}
                      sizes="(max-width: 767px) 100vw, 50vw"
                    />
                  </div>
                </Link>
              </li>
            ))}

            {/*
             * Absolutely positioned and pointer-events-none, so summoning it
             * cannot move a single pixel of the list underneath.
             */}
            {previewEnabled ? (
              <motion.div
                aria-hidden="true"
                style={{ x, y, width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
                className="pointer-events-none absolute top-0 left-0 z-[var(--z-raised)] hidden lg:block"
              >
                <AnimatePresence>
                  {activeProject ? (
                    <motion.div
                      key={activeProject.slug}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={motionVocabulary.transition}
                      className="border-edge bg-canvas h-full w-full overflow-hidden border"
                    >
                      <ProjectImage
                        image={activeProject.cover}
                        sizes="384px"
                        className="h-full object-cover"
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            ) : null}
          </ol>
        </motion.div>
      </Container>
    </section>
  );
}
