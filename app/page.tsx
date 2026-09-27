import { Grid } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";

export default function HomePage() {
  return (
    <main>
      <Section rhythm="loose">
        <Stack gap={4}>
          <p className="type-mono text-ink-muted">rhythm check</p>
          <h1 className="type-h1">First section</h1>
          <p className="measure type-body text-ink-muted">
            Two stacked sections, both using padding rather than margin, so the gap
            between them is the sum of two tokens and nothing collapses. Press ctrl/cmd +
            G to confirm the content edge sits on the grid.
          </p>
        </Stack>
      </Section>

      <Section rule>
        <Grid columns="split">
          <p className="type-mono text-ink-muted">SECOND</p>
          <p className="measure type-body">
            The datasheet split: a mono label rail, the content column, then right-aligned
            specified values. This skeleton repeats across capabilities, process and every
            case study.
          </p>
          <p className="type-mono text-ink-muted lg:text-right">2026</p>
        </Grid>
      </Section>
    </main>
  );
}
