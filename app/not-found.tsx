import Link from "next/link";
import { SiteFooter } from "@/components/chrome/site-footer";
import { SiteHeader } from "@/components/chrome/site-header";
import { Container } from "@/components/layout/container";
import { projects } from "@/content/projects";

export const metadata = {
  title: "Page not found",
};

/**
 * The 404 points somewhere useful rather than apologising.
 *
 * Someone who lands here was following a link, so the three most likely things
 * they wanted are listed directly — and since a mistyped case-study URL is the
 * most probable way to arrive, the work index is the first thing offered.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader inPageNav={false} hasHero={false} />

      <main id="main">
        <Container>
          <div className="pt-[var(--space-16)] pb-[var(--rhythm-loose)]">
            <p className="type-mono text-ink-muted">404</p>

            <h1 className="type-display-l measure-lead mt-[var(--space-4)]">
              That page is not here.
            </h1>

            <p className="measure type-body text-ink-muted mt-[var(--space-6)]">
              Either the address has a typo in it, or something moved and the old link was
              not redirected — which, given one of the case studies below is about exactly
              that mistake, is a little embarrassing.
            </p>

            <div className="border-hairline mt-[var(--space-12)] border-t">
              <ul>
                <li className="border-hairline border-b">
                  <Link
                    href="/work"
                    className="hover:bg-wash -mx-[var(--space-4)] block px-[var(--space-4)] py-[var(--space-5)] transition-colors duration-[var(--duration-fast)]"
                  >
                    <span className="type-h3 block">All work</span>
                    <span className="type-body text-ink-muted mt-[var(--space-1)] block">
                      Six projects, filterable by the kind of problem
                    </span>
                  </Link>
                </li>

                {projects.slice(0, 2).map((project) => (
                  <li key={project.slug} className="border-hairline border-b">
                    <Link
                      href={`/work/${project.slug}`}
                      className="hover:bg-wash -mx-[var(--space-4)] block px-[var(--space-4)] py-[var(--space-5)] transition-colors duration-[var(--duration-fast)]"
                    >
                      <span className="type-h3 block">{project.name}</span>
                      <span className="type-body text-ink-muted mt-[var(--space-1)] block">
                        {project.summary}
                      </span>
                    </Link>
                  </li>
                ))}

                <li className="border-hairline border-b">
                  <Link
                    href="/#contact"
                    className="hover:bg-wash -mx-[var(--space-4)] block px-[var(--space-4)] py-[var(--space-5)] transition-colors duration-[var(--duration-fast)]"
                  >
                    <span className="type-h3 block">Start a conversation</span>
                    <span className="type-body text-ink-muted mt-[var(--space-1)] block">
                      If you were looking for a way to get in touch
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
