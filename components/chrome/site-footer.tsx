import { Container } from "@/components/layout/container";
import { site } from "@/content/site";
import { LocalTime } from "./local-time";

/**
 * The footer closes the argument rather than dumping links.
 *
 * There is no sitemap wall and no newsletter box. What a reader wants at the
 * bottom of this page is the same thing they wanted at the top — whether he is
 * available, how to reach him, and whether the working day overlaps with theirs
 * — so that is all that is here.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-hairline border-t">
      <Container>
        <div className="py-[var(--rhythm-tight)]">
          <div className="grid gap-[var(--space-10)] lg:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <p className="type-mono text-ink-muted flex items-center gap-[var(--space-2)]">
                <span
                  aria-hidden="true"
                  className={
                    site.availability.open
                      ? "bg-accent size-[6px] rounded-full"
                      : "bg-ink-muted size-[6px] rounded-full"
                  }
                />
                {site.availability.label}
              </p>

              <a
                href={`mailto:${site.email}`}
                className="type-h2 decoration-accent mt-[var(--space-4)] inline-block underline decoration-[1px] underline-offset-[6px]"
              >
                {site.email}
              </a>

              <p className="measure-lead type-body text-ink-muted mt-[var(--space-4)]">
                {site.availability.detail}
              </p>
            </div>

            <dl className="type-mono grid grid-cols-[auto_minmax(0,1fr)] content-start gap-x-[var(--space-6)] gap-y-[var(--space-3)] lg:text-right">
              <dt className="text-ink-muted">Based in</dt>
              <dd>{site.location}</dd>

              <dt className="text-ink-muted">Time</dt>
              <dd>
                {/* Client-rendered; absent without JavaScript, which is why the
                    zone name is printed here rather than inside the clock. */}
                <LocalTime /> {site.timeZone}
              </dd>

              {site.socials.map((social) => (
                <div key={social.label} className="contents">
                  <dt className="text-ink-muted">{social.label}</dt>
                  <dd>
                    <a
                      href={social.href}
                      className="decoration-hairline hover:decoration-accent underline decoration-[1px] underline-offset-4 transition-colors duration-[var(--duration-fast)]"
                      {...(social.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                    >
                      {social.href.replace(/^https?:\/\/|^mailto:/, "")}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="type-mono text-ink-muted border-hairline mt-[var(--space-12)] border-t pt-[var(--space-6)]">
            {year} {site.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
