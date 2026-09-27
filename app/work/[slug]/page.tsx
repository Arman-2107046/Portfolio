import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/chrome/site-footer";
import { SiteHeader } from "@/components/chrome/site-header";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { ProjectImage } from "@/components/ui/project-image";
import { ReadingProgress } from "@/components/ui/reading-progress";
import { JsonLd } from "@/components/seo/json-ld";
import { getAdjacentProjects, getProject, projects } from "@/content/projects";
import { buildMetadata, creativeWorkSchema } from "@/lib/metadata";
import type { Project } from "@/content/types";

/**
 * The six slugs are the complete set, so anything else is a 404 at the routing
 * layer rather than a page that renders and then calls notFound(). It also
 * means no case-study URL is ever server-rendered on demand.
 */
export const dynamicParams = false;

/** All six routes are known at build time, so all six are static. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

/**
 * The spec rail. The same label/value structure as the rest of the site, but
 * here it is a real definition list, because that is exactly what it is.
 */
function SpecRail({ project }: { project: Project }) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Role", value: project.role },
    { label: "Year", value: project.year },
    { label: "Duration", value: project.duration },
    { label: "Client", value: project.client },
    { label: "Stack", value: project.stack.join(", ") },
  ];

  if (project.liveUrl) {
    rows.push({
      label: "Live",
      value: (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="decoration-accent underline decoration-[1px] underline-offset-4"
        >
          {project.liveUrl.replace(/^https?:\/\//, "")}
        </a>
      ),
    });
  }

  return (
    <dl className="type-mono grid grid-cols-[auto_minmax(0,1fr)] gap-x-[var(--space-6)] gap-y-[var(--space-3)]">
      {rows.map((row) => (
        <div key={row.label} className="contents">
          <dt className="text-ink-muted">{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** One prose block on the datasheet split: mono label rail, then the writing. */
function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-hairline grid gap-x-[var(--gutter)] gap-y-[var(--space-4)] border-t py-[var(--space-10)] lg:grid-cols-[10rem_minmax(0,1fr)]">
      <h2 className="type-mono text-ink-muted lg:pt-[0.35em]">{label}</h2>
      <div>{children}</div>
    </div>
  );
}

export async function generateMetadata(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};

  return buildMetadata({
    title: project.name,
    // The headline is the argument of the case study, so it is also the
    // description — a search result and the page make the same claim.
    description: `${project.headline}. ${project.summary}`,
    path: `/work/${project.slug}`,
    ogPath: `/work/${project.slug}/opengraph-image`,
  });
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const { previous, next } = getAdjacentProjects(project.slug);

  return (
    <>
      <JsonLd schema={creativeWorkSchema(project)} />
      <ReadingProgress />
      <SiteHeader inPageNav={false} hasHero={false} />

      <main id="main">
        <article>
          <Container>
            <div className="pt-[var(--space-12)] pb-[var(--space-10)]">
              <Link
                href="/#work"
                className="type-mono text-ink-muted hover:text-ink transition-colors duration-[var(--duration-fast)]"
              >
                Back to selected work
              </Link>

              <p className="type-mono text-ink-muted mt-[var(--space-10)]">
                {project.category}
              </p>

              <h1 className="type-display-l mt-[var(--space-3)]">{project.name}</h1>

              <p className="measure type-body-l mt-[var(--space-5)]">
                {project.headline}
              </p>

              <div className="mt-[var(--space-10)]">
                <SpecRail project={project} />
              </div>
            </div>
          </Container>

          {/* Full-bleed, and the LCP candidate on this route. */}
          <div className="border-hairline border-y">
            <ProjectImage image={project.cover} sizes="100vw" priority />
          </div>

          <Container>
            <div className="pt-[var(--space-12)] pb-[var(--rhythm-base)]">
              <Block label="Context">
                <p className="measure type-body">{project.context}</p>
              </Block>

              <Block label="The problem">
                <p className="measure type-body">{project.problem}</p>
              </Block>

              <Block label="What I built">
                <p className="measure type-body">{project.approach}</p>

                {project.gallery.length > 0 ? (
                  <Reveal className="mt-[var(--space-8)] flex flex-col gap-[var(--space-6)]">
                    {project.gallery.map((image) => (
                      <figure key={image.src}>
                        <div className="border-hairline border">
                          <ProjectImage
                            image={image}
                            sizes="(max-width: 1023px) 100vw, 800px"
                          />
                        </div>
                        <figcaption className="type-caption text-ink-muted mt-[var(--space-3)]">
                          {image.alt}
                        </figcaption>
                      </figure>
                    ))}
                  </Reveal>
                ) : null}
              </Block>

              {/*
               * The section that earns the work. Each decision names what was
               * chosen, what was rejected, and why — the rejected option is
               * what makes it a decision rather than a feature list.
               */}
              <Block label="Decisions">
                <ul className="flex flex-col gap-[var(--space-10)]">
                  {project.architectureNotes.map((note) => (
                    <li key={note.title}>
                      <h3 className="type-h3">{note.title}</h3>

                      <dl className="mt-[var(--space-4)] grid grid-cols-[auto_minmax(0,1fr)] gap-x-[var(--space-4)] gap-y-[var(--space-2)]">
                        <dt className="type-mono text-ink-muted">Chose</dt>
                        <dd className="type-body">{note.chose}</dd>

                        <dt className="type-mono text-ink-muted">Over</dt>
                        <dd className="type-body text-ink-muted">{note.over}</dd>
                      </dl>

                      <p className="measure type-body border-hairline mt-[var(--space-4)] border-l pl-[var(--space-4)]">
                        {note.because}
                      </p>
                    </li>
                  ))}
                </ul>
              </Block>

              <Block label="Outcome">
                <ul className="flex flex-col gap-[var(--space-4)]">
                  {project.outcomes.map((outcome) => (
                    <li key={outcome.label} className="measure">
                      {outcome.metric ? (
                        <span className="type-h3 block">{outcome.metric}</span>
                      ) : null}
                      <span className="type-body">{outcome.label}</span>
                    </li>
                  ))}
                </ul>
              </Block>

              <Block label="Full stack">
                <ul className="type-mono text-ink-muted flex flex-wrap gap-x-[var(--space-4)] gap-y-[var(--space-1)]">
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Block>
            </div>
          </Container>
        </article>

        {/* Wraps at both ends, so the archive has no dead end. */}
        <nav aria-label="Other projects" className="border-hairline border-t">
          <Container>
            <div className="grid gap-[var(--space-6)] py-[var(--space-10)] sm:grid-cols-2">
              <Link href={`/work/${previous.slug}`} className="group">
                <span className="type-mono text-ink-muted">Previous</span>
                <span className="type-h3 group-hover:text-ink-muted mt-[var(--space-2)] block transition-colors duration-[var(--duration-fast)]">
                  {previous.name}
                </span>
              </Link>

              <Link href={`/work/${next.slug}`} className="group sm:text-right">
                <span className="type-mono text-ink-muted">Next</span>
                <span className="type-h3 group-hover:text-ink-muted mt-[var(--space-2)] block transition-colors duration-[var(--duration-fast)]">
                  {next.name}
                </span>
              </Link>
            </div>
          </Container>
        </nav>
      </main>

      <SiteFooter />
    </>
  );
}
