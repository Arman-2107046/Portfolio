import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { GridOverlay } from "@/components/dev/grid-overlay";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { JsonLd } from "@/components/seo/json-ld";
import { site } from "@/content/site";
import { baseUrl, personSchema, websiteSchema } from "@/lib/metadata";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

/*
 * Three families, each with one job. See DESIGN.md section 2.
 *
 * Instrument Sans and Instrument Serif are preloaded: both appear in the hero,
 * and the headline is the LCP element. IBM Plex Mono is not preloaded — it
 * carries 14px metadata only, so a swap costs nothing visible above the fold
 * and keeps a third font file off the critical path.
 */
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-sans",
  preload: true,
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
  variable: "--font-instrument-serif",
  preload: true,
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
  preload: false,
});

/**
 * viewport-fit=cover is what gives env(safe-area-inset-*) a non-zero value on
 * a notched device. Without it the insets below are always 0 and the safe-area
 * padding is dead code.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  // Every relative URL in metadata — canonical, OG, Twitter — resolves against
  // this, so the domain is stated once for the whole site.
  metadataBase: new URL(baseUrl),
  title: {
    default: `${site.name} — ${site.role}`,
    // Case studies and the archive supply their own name; this appends the
    // owner so a shared tab is attributable on its own.
    template: `%s — ${site.name}`,
  },
  description: site.metaDescription,
  authors: [{ name: site.name, url: baseUrl }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en",
    url: baseUrl,
    title: `${site.name} — ${site.role}`,
    description: site.metaDescription,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The blocking script below rewrites data-theme before paint, so the
      // server markup and the first client render disagree by design.
      suppressHydrationWarning
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${plexMono.variable}`}
    >
      <head>
        {/*
         * Must run blocking, in <head>, ahead of the first paint. next/script
         * with beforeInteractive is not early enough: it still lands after the
         * document has painted once, which is the white flash this prevents.
         */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />

        {/* Person and WebSite describe the site itself, so they belong on
            every route rather than being repeated per page. */}
        <JsonLd schema={personSchema()} />
        <JsonLd schema={websiteSchema()} />
      </head>
      <body>
        <SmoothScroll />
        {children}
        {process.env.NODE_ENV === "development" ? <GridOverlay /> : null}
      </body>
    </html>
  );
}
