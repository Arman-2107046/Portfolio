import { Container } from "@/components/layout/container";
import { LoadingScreen, Skeleton } from "@/components/ui/skeleton";

/**
 * /work is the one route that is server-rendered on demand, because it reads
 * the lane from the query string — so it is the one route where a wait is
 * actually plausible and this skeleton may really be seen.
 *
 * The six cover boxes are reserved at the covers' real 16:10 ratio, so the grid
 * does not resize when the images arrive.
 */
export default function WorkLoading() {
  return (
    <main id="main">
      <Container>
        <LoadingScreen>
          <div className="pt-[var(--space-12)] pb-[var(--rhythm-base)]">
            <Skeleton className="h-[var(--space-10)] w-48" />

            <div className="mt-[var(--space-10)] flex flex-wrap gap-[var(--space-2)]">
              {["everything", "commerce", "platform", "corporate", "nonprofit"].map(
                (lane) => (
                  <Skeleton key={lane} className="h-[var(--space-10)] w-28" />
                ),
              )}
            </div>

            <ul className="mt-[var(--space-8)] grid gap-x-[var(--gutter)] gap-y-[var(--space-12)] md:grid-cols-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <li key={index}>
                  <Skeleton ratio="16 / 10" className="w-full" />
                  <Skeleton className="mt-[var(--space-4)] h-[var(--space-6)] w-2/3" />
                  <Skeleton className="mt-[var(--space-3)] h-[var(--space-4)] w-full" />
                </li>
              ))}
            </ul>
          </div>
        </LoadingScreen>
      </Container>
    </main>
  );
}
