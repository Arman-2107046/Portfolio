import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { capabilities, capabilityLaneLabels } from "@/content/capabilities";

/**
 * The four lanes that make the end-to-end claim concrete.
 *
 * Each lane leads with what the client ends up with, in words naming no
 * technology; the tools sit underneath for the reader who wants to check. The
 * separation is the point — a reader who knows none of the names should still
 * finish the section knowing what the four lanes mean.
 *
 * No cards. The structure is the datasheet split from DESIGN.md — a mono lane
 * label in the left rail, the argument in the middle — separated by hairlines.
 * Four identical rounded boxes with identical shadows would have said the four
 * lanes are interchangeable, which is the opposite of the argument.
 */
export function Capabilities() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="py-[var(--rhythm-base)]"
    >
      <Container>
        <div className="border-hairline flex items-baseline justify-between gap-[var(--space-4)] border-b pb-[var(--space-4)]">
          <h2 id="capabilities-heading" className="type-h1">
            What I take responsibility for
          </h2>
          <p className="type-mono text-ink-muted shrink-0">Four lanes</p>
        </div>

        <Reveal>
          <dl>
            {capabilities.map((capability) => (
              <div
                key={capability.lane}
                className="border-hairline grid gap-x-[var(--gutter)] gap-y-[var(--space-4)] border-b py-[var(--space-10)] lg:grid-cols-[10rem_minmax(0,1fr)]"
              >
                <dt className="type-mono text-ink-muted lg:pt-[0.4em]">
                  {capabilityLaneLabels[capability.lane]}
                </dt>

                <dd>
                  <h3 className="type-h2 measure">{capability.title}</h3>

                  <p className="measure type-body text-ink-muted mt-[var(--space-4)]">
                    {capability.description}
                  </p>

                  {/*
                   * The tools, deliberately demoted: mono, muted, and set as a
                   * plain wrapped list rather than as chips with borders. They
                   * are evidence for the sentence above them, not the point.
                   */}
                  <ul className="type-mono text-ink-muted mt-[var(--space-6)] flex flex-wrap gap-x-[var(--space-4)] gap-y-[var(--space-1)]">
                    {capability.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
