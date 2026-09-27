import { SiteFooter } from "@/components/chrome/site-footer";
import { SiteHeader } from "@/components/chrome/site-header";
import { Hero } from "@/components/sections/hero";
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { navItems } from "@/content/navigation";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="main">
        <Hero />

        {/* Zero-height marker at the end of the hero. See SiteHeader. */}
        <div id="header-sentinel" aria-hidden="true" />

        {navItems.map((item) => (
          <Section key={item.id} id={item.id} rule rhythm="loose">
            <Stack gap={4}>
              <p className="type-mono text-ink-muted">{item.id}</p>
              <h2 className="type-h1">{item.label}</h2>
              <p className="measure type-body text-ink-muted">
                Placeholder section, so the active-section observer and the in-page
                navigation can be exercised before the real content arrives.
              </p>
            </Stack>
          </Section>
        ))}
      </main>

      <SiteFooter />
    </>
  );
}
