import type { StackItem } from "./types";

/**
 * The technology list, grouped by capability lane. Each note is first person and
 * says how the tool is actually used — a list of names proves nothing, and a
 * note that could be copied from the tool's own homepage proves less.
 *
 * Marks are drawn monochrome from a shared sprite, never as vendor-coloured
 * logos.
 */
export const stackItems: StackItem[] = [
  // Product engineering
  {
    name: "Laravel",
    lane: "product-engineering",
    note: "My default for anything with a database behind it. Queues, scheduling and transactions come as standard rather than as decisions.",
  },
  {
    name: "Filament",
    lane: "product-engineering",
    note: "For admin panels. It means the client gets a usable back office in days instead of me rebuilding tables and forms for a month.",
  },
  {
    name: "Inertia.js",
    lane: "product-engineering",
    note: "When a project wants React components but not the overhead of a separate API and its own auth story.",
  },
  {
    name: "PHP",
    lane: "product-engineering",
    note: "Modern PHP with strict types. Unfashionable and extremely good at the thing most business software actually does.",
  },
  {
    name: "React",
    lane: "product-engineering",
    note: "For the parts of an interface that hold real state — configurators, filters, multi-step flows. Not for pages that could be HTML.",
  },
  {
    name: "Next.js",
    lane: "product-engineering",
    note: "When pages need to be indexable and fast on arrival. I keep components on the server unless they need events or state.",
  },
  {
    name: "TypeScript",
    lane: "product-engineering",
    note: "Strict, with no escape hatches. The content on this site is typed, which is why a missing field fails the build instead of rendering blank.",
  },
  {
    name: "Tailwind CSS",
    lane: "product-engineering",
    note: "Against a token layer, never with raw values. Every colour and size on this site resolves to one file.",
  },
  {
    name: "Framer Motion",
    lane: "product-engineering",
    note: "One shared set of variants per project, built so reduced-motion is handled in the factory and not remembered per component.",
  },

  // Data and infrastructure
  {
    name: "MySQL",
    lane: "data-infrastructure",
    note: "The default for Laravel work. I design the schema before the features, because it is the hardest thing to change later.",
  },
  {
    name: "PostgreSQL",
    lane: "data-infrastructure",
    note: "When I want real constraints, JSON that can be queried properly, or full-text search without running a search service.",
  },
  {
    name: "MongoDB",
    lane: "data-infrastructure",
    note: "For genuinely document-shaped data. I do not reach for it to avoid writing a schema.",
  },
  {
    name: "Redis",
    lane: "data-infrastructure",
    note: "Cache and queue, usually both. One service doing two jobs is one less thing to monitor.",
  },
  {
    name: "Ubuntu VPS",
    lane: "data-infrastructure",
    note: "I run and maintain production servers directly, which is why I can tell you what self-hosting actually costs in attention, not just in money.",
  },
  {
    name: "Nginx",
    lane: "data-infrastructure",
    note: "TLS termination, reverse proxy, static assets and caching headers. Configured by hand so the config is readable a year later.",
  },
  {
    name: "Docker",
    lane: "data-infrastructure",
    note: "To make local match production. I am careful about when it earns its complexity on a single-server deployment.",
  },
  {
    name: "GitHub Actions",
    lane: "data-infrastructure",
    note: "Lint, typecheck and build on every push, then deploy over SSH. If it is not in the pipeline it is not really enforced.",
  },
  {
    name: "Zero-downtime deploys",
    lane: "data-infrastructure",
    note: "Build a release, health check it, swap a symlink. Rolling back is the same move in the other direction.",
  },

  // Commerce
  {
    name: "Shopify",
    lane: "commerce",
    note: "When the client should be running a store rather than maintaining one. I work inside its constraints instead of fighting them.",
  },
  {
    name: "Liquid",
    lane: "commerce",
    note: "Theme development from scratch. Sections and blocks defined so the merchant can rearrange a page without a developer.",
  },
  {
    name: "Custom storefronts",
    lane: "commerce",
    note: "When the catalogue or the checkout does something a platform will not allow — configurators, unusual pricing, bespoke fulfilment.",
  },
  {
    name: "Catalogue architecture",
    lane: "commerce",
    note: "Variants, options and compatibility rules. Get this wrong and every feature after it is harder than it should be.",
  },
  {
    name: "Conversion rate optimisation",
    lane: "commerce",
    note: "Mostly removing steps and repairing what was measured wrong, rather than changing button colours.",
  },

  // Measurement
  {
    name: "GA4",
    lane: "measurement",
    note: "Configured through a tag manager against an event schema I write down first, so reports mean the same thing in six months.",
  },
  {
    name: "Google Tag Manager",
    lane: "measurement",
    note: "Loaded after interactive and behind consent. Tags are versioned there rather than scattered through the application.",
  },
  {
    name: "Meta Pixel",
    lane: "measurement",
    note: "Kept alongside server-side events, not replaced by them — it still carries browser context, and a shared event id stops double counting.",
  },
  {
    name: "Meta Conversions API",
    lane: "measurement",
    note: "Purchases sent from the server when the order row commits, so a blocked or abandoned browser no longer costs you a reported sale.",
  },
  {
    name: "Event schema design",
    lane: "measurement",
    note: "Names, triggers and parameters agreed and documented before implementation. The schema for this site is in ANALYTICS.md.",
  },
  {
    name: "Attribution QA",
    lane: "measurement",
    note: "Reconciling what the ad platform reports against what the database recorded, which is the only way to find out you are under-reporting.",
  },
];
