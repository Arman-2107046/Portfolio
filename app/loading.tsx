import { Container } from "@/components/layout/container";
import { LoadingScreen, Skeleton } from "@/components/ui/skeleton";

/**
 * The root loading state.
 *
 * Nearly every route here is prerendered, so this will usually never become
 * visible — which is the intent. LoadingScreen holds it at opacity 0 for 400ms,
 * so an instant navigation shows nothing and only a genuinely slow one gets a
 * skeleton. The shape mirrors a page heading and the first block of prose so
 * that what appears is recognisably the page arriving, not a generic spinner.
 */
export default function Loading() {
  return (
    <main id="main">
      <Container>
        <LoadingScreen>
          <div className="flex flex-col gap-[var(--space-4)] pt-[var(--space-24)] pb-[var(--rhythm-base)]">
            <Skeleton className="h-[var(--space-4)] w-24" />
            <Skeleton className="h-[var(--space-12)] w-full max-w-[32rem]" />
            <Skeleton className="mt-[var(--space-4)] h-[var(--space-4)] w-full max-w-[28rem]" />
            <Skeleton className="h-[var(--space-4)] w-full max-w-[24rem]" />
          </div>
        </LoadingScreen>
      </Container>
    </main>
  );
}
