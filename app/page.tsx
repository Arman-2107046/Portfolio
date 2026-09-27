import { SiteFooter } from "@/components/chrome/site-footer";
import { SiteHeader } from "@/components/chrome/site-header";
import { About } from "@/components/sections/about";
import { Capabilities } from "@/components/sections/capabilities";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Process } from "@/components/sections/process";
import { SelectedWork } from "@/components/sections/selected-work";
import { StackGrid } from "@/components/sections/stack-grid";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="main">
        <Hero />

        {/* Zero-height marker at the end of the hero. See SiteHeader. */}
        <div id="header-sentinel" aria-hidden="true" />

        <SelectedWork />

        <Capabilities />

        <StackGrid />

        <Process />

        <About />

        <Contact />
      </main>

      <SiteFooter />
    </>
  );
}
