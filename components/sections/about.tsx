import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ProjectImage } from "@/components/ui/project-image";
import { site } from "@/content/site";

/**
 * Three paragraphs, first person, no hobby list.
 *
 * The portrait is treated the same way every other image on the site is — a
 * hairline border, a fixed ratio, no rounding and no vignette — so it reads as
 * one more plate in the document rather than as a headshot pasted into it.
 */
export function About() {
  return (
    <Section id="about" ariaLabelledBy="about-heading">
      <div className="border-hairline flex items-baseline justify-between gap-[var(--space-4)] border-b pb-[var(--space-4)]">
        <h2 id="about-heading" className="type-h1">
          Who you would be working with
        </h2>
        <p className="type-mono text-ink-muted shrink-0">{site.location}</p>
      </div>

      <Reveal>
        <div className="mt-[var(--space-10)] grid gap-[var(--space-10)] lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-[var(--space-16)]">
          <div className="flex flex-col gap-[var(--space-6)]">
            {site.about.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="measure type-body-l">
                {paragraph}
              </p>
            ))}
          </div>

          <figure className="lg:order-first">
            <div className="border-hairline border">
              <ProjectImage
                image={site.portrait}
                sizes="(max-width: 1023px) 100vw, 320px"
              />
            </div>
            <figcaption className="type-mono text-ink-muted mt-[var(--space-3)]">
              {site.name} — {site.role}
            </figcaption>
          </figure>
        </div>
      </Reveal>
    </Section>
  );
}
