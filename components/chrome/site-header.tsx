"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { navItems } from "@/content/navigation";
import { site } from "@/content/site";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/cn";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

/**
 * Tracks which in-page section is currently being read.
 *
 * The observation band is the top third of the viewport: a section counts as
 * active once its content reaches roughly where someone is actually looking,
 * not when its first pixel appears at the bottom of the screen.
 */
function useActiveSection(ids: string[], enabled: boolean): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [ids, enabled]);

  return activeId;
}

const NAV_IDS = navItems.map((item) => item.id);

type SiteHeaderProps = {
  /** In-page section nav and the mobile overlay. Off on case-study routes. */
  inPageNav?: boolean;
  /**
   * Whether this route has a hero for the header to be transparent over.
   * Routes without one get a real bar from the first pixel, decided here
   * rather than by probing the DOM for a sentinel that was never rendered.
   */
  hasHero?: boolean;
};

export function SiteHeader({ inPageNav = true, hasHero = true }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [past, setPast] = useState(!hasHero);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const activeId = useActiveSection(NAV_IDS, inPageNav);

  /**
   * A zero-height sentinel sits at the end of the hero. Watching it is far
   * cheaper than a scroll listener, and it means the threshold is "the hero has
   * gone" rather than an arbitrary pixel count that stops being right the
   * moment the hero changes height.
   */
  useEffect(() => {
    if (!hasHero) return;

    const sentinel = document.getElementById("header-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPast(entry ? !entry.isIntersecting : false),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasHero]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <a
        href="#main"
        className={cn(
          "bg-ink text-ink-inverse sr-only z-[var(--z-skip)] px-[var(--space-4)] py-[var(--space-3)]",
          "focus:not-sr-only focus:fixed focus:top-[var(--space-3)] focus:left-[var(--space-3)]",
        )}
      >
        Skip to content
      </a>

      <header
        className={cn(
          "sticky top-0 z-[var(--z-sticky)]",
          "transition-colors duration-[var(--duration-base)] ease-out",
          // The header is always in the layout, so nothing shifts and nothing
          // slides in. It simply stops being transparent once the hero has
          // scrolled away, which is the moment it needs to be legible against
          // arbitrary content rather than against the hero.
          past ? "bg-canvas border-hairline border-b" : "border-b border-transparent",
        )}
      >
        <Container width="page">
          <div className="flex h-[var(--space-20)] items-center justify-between gap-[var(--space-4)]">
            <Link
              href="/"
              className="type-mono hover:text-ink-muted transition-colors duration-[var(--duration-fast)]"
            >
              {site.name}
            </Link>

            <div className="flex items-center gap-[var(--space-1)]">
              {inPageNav ? (
                <nav aria-label="Sections" className="hidden md:block">
                  <ul className="flex items-center gap-[var(--space-1)]">
                    {navItems.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          aria-current={activeId === item.id ? "true" : undefined}
                          className={cn(
                            "type-mono hover:bg-wash relative block rounded-xs",
                            "px-[var(--space-3)] py-[var(--space-2)]",
                            "transition-colors duration-[var(--duration-fast)]",
                            activeId === item.id ? "text-ink" : "text-ink-muted",
                          )}
                        >
                          {item.label}
                          {/* The accent marks position. It never fills. */}
                          <span
                            aria-hidden="true"
                            className={cn(
                              "bg-accent absolute inset-x-[var(--space-3)] bottom-[var(--space-1)] h-px",
                              "transition-opacity duration-[var(--duration-fast)]",
                              activeId === item.id ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : (
                <Link
                  href="/#work"
                  className="type-mono text-ink-muted hover:text-ink hidden px-[var(--space-3)] py-[var(--space-2)] transition-colors duration-[var(--duration-fast)] md:block"
                >
                  All work
                </Link>
              )}

              <ThemeToggle />

              {inPageNav ? (
                <button
                  ref={triggerRef}
                  type="button"
                  onClick={() => setMenuOpen((current) => !current)}
                  aria-expanded={menuOpen}
                  aria-controls="mobile-navigation"
                  className="type-mono -mr-[var(--space-2)] rounded-xs px-[var(--space-3)] py-[var(--space-2)] md:hidden"
                >
                  {menuOpen ? "Close" : "Menu"}
                </button>
              ) : null}
            </div>
          </div>
        </Container>
      </header>

      {inPageNav ? (
        <MobileNav
          open={menuOpen}
          onClose={closeMenu}
          triggerRef={triggerRef}
          activeId={activeId}
        />
      ) : null}
    </>
  );
}
