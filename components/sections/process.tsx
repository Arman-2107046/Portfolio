import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { processSteps } from "@/content/capabilities";

/**
 * Discover, Architect, Build, Operate.
 *
 * This is the one place on the site where numbering is allowed, because this
 * is the one place where the order is a real sequence rather than a ranking.
 * Each step says what Arman does and, separately, what the client is actually
 * handed at the end of it — the second column is the argument, since "I stay
 * after launch" is a claim and "here is the runbook" is evidence.
 */
export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="py-[var(--rhythm-base)]"
    >
      <Container>
        <div className="border-hairline flex items-baseline justify-between gap-[var(--space-4)] border-b pb-[var(--space-4)]">
          <h2 id="process-heading" className="type-h1">
            How a project runs
          </h2>
          <p className="type-mono text-ink-muted shrink-0">Four stages</p>
        </div>

        <Reveal>
          <ol>
            {processSteps.map((step, index) => (
              <li
                key={step.title}
                className="border-hairline grid gap-x-[var(--gutter)] gap-y-[var(--space-4)] border-b py-[var(--space-10)] lg:grid-cols-[10rem_minmax(0,1fr)]"
              >
                <p className="type-mono text-ink-muted lg:pt-[0.4em]">
                  {/* Padded so the numerals form a single vertical edge. */}
                  {String(index + 1).padStart(2, "0")}
                </p>

                <div>
                  <h3 className="type-h2">{step.title}</h3>

                  <p className="measure type-body mt-[var(--space-4)]">{step.does}</p>

                  <div className="border-hairline mt-[var(--space-6)] grid gap-[var(--space-2)] border-l pl-[var(--space-4)] lg:grid-cols-[8rem_minmax(0,1fr)] lg:gap-x-[var(--space-6)]">
                    <p className="type-mono text-ink-muted">You receive</p>
                    <p className="measure type-body text-ink-muted">{step.deliverable}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}
