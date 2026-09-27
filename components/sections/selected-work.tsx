import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ProjectImage } from "@/components/ui/project-image";
import { projects } from "@/content/projects";
import { cn } from "@/lib/cn";
import { WorkHoverLayer } from "./work-hover-layer";

/**
 * The centrepiece: six projects as an editorial index rather than a card grid.
 *
 * A server component. The only interactive thing here is the cursor-tracked
 * preview, and that lives in WorkHoverLayer, which takes these rows as
 * children — so they arrive already rendered and never enter the hydration
 * payload. Making the whole section client for one pointer handler shipped six
 * projects' worth of copy, chips and covers to the browser a second time.
 */
export function SelectedWork() {
  return (
    <Section id="work" ariaLabelledBy="work-heading">
      <div className="border-hairline flex items-baseline justify-between gap-[var(--space-4)] border-b pb-[var(--space-4)]">
        <h2 id="work-heading" className="type-h1">
          Selected work
        </h2>
        <p className="type-mono text-ink-muted shrink-0">Six projects</p>
      </div>

      {/*
       * One reveal for the whole list, not one per row. Six rows each doing
       * the same fade-and-rise is a texture, and it delays the only thing on
       * this section anyone came to read.
       */}
      <Reveal variant="fadeIn">
        <WorkHoverLayer>
          <ol>
            {projects.map((project) => (
              <li key={project.slug} className="border-hairline border-b">
                <Link
                  href={`/work/${project.slug}`}
                  // Read by WorkHoverLayer to decide which cover to show.
                  data-project-slug={project.slug}
                  // The whole row is the hit area and one tab stop. A card
                  // with separate image, title and tag links would be four.
                  className={cn(
                    "group block py-[var(--space-6)]",
                    "transition-colors duration-[var(--duration-base)] ease-out",
                    "hover:bg-wash focus-visible:bg-wash",
                    "-mx-[var(--space-4)] px-[var(--space-4)]",
                  )}
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
                   * sits in the row instead of waiting to be hovered. The
                   * same applies under reduced motion, where the tracked
                   * preview is switched off.
                   *
                   * This branch is CSS, not JavaScript, on purpose. Deciding
                   * it from a hydrated media query would mean the server
                   * always guessed one way, so every desktop visitor would
                   * see six covers appear and then vanish on hydration.
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
          </ol>
        </WorkHoverLayer>
      </Reveal>
    </Section>
  );
}
