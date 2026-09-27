import Link from "next/link";
import { SiteFooter } from "@/components/chrome/site-footer";
import { SiteHeader } from "@/components/chrome/site-header";
import { Container } from "@/components/layout/container";
import { ProjectImage } from "@/components/ui/project-image";
import { isLane, laneLabels, lanes, projects } from "@/content/projects";
import { buildMetadata } from "@/lib/metadata";
import { cn } from "@/lib/cn";

/**
 * The archive, distinct from the homepage index.
 *
 * The homepage list is a curated argument — six rows, strongest first, imagery
 * summoned on intent. This is the browsable version: every project shown with
 * its cover, filterable by lane.
 *
 * Filtering is a link and a query parameter rather than client state. That
 * makes a filtered view shareable, survives a reload, populates browser
 * history so Back does the obvious thing, and works with JavaScript disabled —
 * four things that would each have needed separate handling had this been
 * useState.
 */
export const metadata = buildMetadata({
  title: "All work",
  description:
    "Six shipped platforms: e-commerce and server-side attribution, a made-to-measure configurator, a CMS-driven corporate site, a self-hosted SEO-first store, and an NGO information architecture.",
  path: "/work",
});

export default async function WorkIndexPage(props: PageProps<"/work">) {
  const params = await props.searchParams;
  const raw = params.lane;
  const requested = Array.isArray(raw) ? raw[0] : raw;

  const activeLane = isLane(requested) ? requested : undefined;

  // An unrecognised lane in the URL is shown as a filter that matched nothing,
  // not silently ignored. Quietly showing everything would tell the visitor
  // their link worked when it did not.
  const unknownLane = requested !== undefined && !isLane(requested);

  const visible = unknownLane
    ? []
    : activeLane
      ? projects.filter((project) => project.lane === activeLane)
      : projects;

  return (
    <>
      <SiteHeader inPageNav={false} hasHero={false} />

      <main id="main">
        <Container>
          <div className="pt-[var(--space-12)] pb-[var(--rhythm-base)]">
            <h1 className="type-h1">All work</h1>

            <p className="measure type-body text-ink-muted mt-[var(--space-4)]">
              Six builds, from a made-to-measure configurator to an NGO&rsquo;s
              information architecture. Filter by the kind of problem.
            </p>

            <nav
              aria-label="Filter by kind of work"
              className="border-hairline mt-[var(--space-10)] border-y py-[var(--space-4)]"
            >
              <ul className="flex flex-wrap gap-[var(--space-2)]">
                <li>
                  <Link
                    href="/work"
                    aria-current={!activeLane && !unknownLane ? "true" : undefined}
                    className={cn(
                      "type-mono tap-target rounded-xs border px-[var(--space-3)] py-[var(--space-2)]",
                      "transition-colors duration-[var(--duration-fast)]",
                      !activeLane && !unknownLane
                        ? "border-ink bg-ink text-ink-inverse"
                        : "border-edge hover:bg-wash",
                    )}
                  >
                    Everything
                  </Link>
                </li>

                {lanes.map((lane) => (
                  <li key={lane}>
                    <Link
                      href={`/work?lane=${lane}`}
                      aria-current={activeLane === lane ? "true" : undefined}
                      className={cn(
                        "type-mono tap-target rounded-xs border px-[var(--space-3)] py-[var(--space-2)]",
                        "transition-colors duration-[var(--duration-fast)]",
                        activeLane === lane
                          ? "border-ink bg-ink text-ink-inverse"
                          : "border-edge hover:bg-wash",
                      )}
                    >
                      {laneLabels[lane]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/*
             * The result count, announced on change. The element is present on
             * every render in the same position, so navigating between filters
             * updates its text rather than inserting a new region — which is
             * what makes it announce at all.
             */}
            <p
              role="status"
              aria-live="polite"
              className="type-mono text-ink-muted mt-[var(--space-6)]"
            >
              {visible.length === 1 ? "1 project" : `${visible.length} projects`}
              {activeLane ? ` in ${laneLabels[activeLane]}` : ""}
            </p>

            {visible.length === 0 ? (
              <div className="border-hairline mt-[var(--space-10)] border-t pt-[var(--space-10)]">
                <h2 className="type-h2 measure">
                  {unknownLane
                    ? `There is no category called "${requested}".`
                    : "Nothing filed under that yet."}
                </h2>
                <p className="measure type-body text-ink-muted mt-[var(--space-4)]">
                  The link may have been typed by hand, or a category may have been
                  renamed since it was shared. Everything is one click away.
                </p>
                <Link
                  href="/work"
                  className="type-body bg-ink text-ink-inverse mt-[var(--space-6)] inline-block rounded-xs px-[var(--space-6)] py-[var(--space-3)]"
                >
                  Show all six projects
                </Link>
              </div>
            ) : (
              <ul className="mt-[var(--space-8)] grid gap-x-[var(--gutter)] gap-y-[var(--space-12)] md:grid-cols-2">
                {visible.map((project, index) => (
                  <li key={project.slug}>
                    <Link href={`/work/${project.slug}`} className="group block">
                      <div className="border-hairline overflow-hidden border">
                        <ProjectImage
                          image={project.cover}
                          sizes="(max-width: 767px) 100vw, 50vw"
                          // The first cover is the LCP element on this route.
                          // Left lazy it was discovered only after the whole
                          // document had parsed, which is most of the 3.1s.
                          priority={index === 0}
                        />
                      </div>

                      <div className="mt-[var(--space-4)] flex items-baseline justify-between gap-[var(--space-4)]">
                        <h2 className="type-h3 group-hover:text-ink-muted transition-colors duration-[var(--duration-fast)]">
                          {project.name}
                        </h2>
                        <span className="type-mono text-ink-muted shrink-0">
                          {project.year}
                        </span>
                      </div>

                      <p className="type-mono text-ink-muted mt-[var(--space-2)]">
                        {laneLabels[project.lane]}
                      </p>

                      <p className="measure type-body text-ink-muted mt-[var(--space-3)]">
                        {project.summary}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
