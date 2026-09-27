import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { GridOverlay } from "@/components/dev/grid-overlay";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
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

export const metadata: Metadata = {
  title: "Arman Rahman Rafi — Full-Stack Web Developer",
  description:
    "Full-stack web developer in Khulna, Bangladesh. One person owns the system from database to conversion event.",
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
      </head>
      <body>
        <SmoothScroll />
        {children}
        {process.env.NODE_ENV === "development" ? <GridOverlay /> : null}
      </body>
    </html>
  );
}
