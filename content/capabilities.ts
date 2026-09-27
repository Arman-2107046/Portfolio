import type { Capability, ProcessStep } from "./types";

/**
 * Four lanes. Each title states what the client ends up with, in words that
 * name no technology — the tools are listed underneath, where someone who cares
 * about them can check. A reader who knows none of the names should still be
 * able to tell what each lane means.
 */
export const capabilities: Capability[] = [
  {
    lane: "product-engineering",
    title: "The thing itself, built to be changed later",
    description:
      "The application your customers use and your staff work in. I write it so the next change is cheap: the rules live in one place, the admin is usable by the people who actually have to use it, and the parts that will need editing are editable without a deploy.",
    items: [
      "Laravel",
      "Filament",
      "Inertia.js",
      "PHP",
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
  },
  {
    lane: "data-infrastructure",
    title: "Somewhere for it to run that you can still afford in a year",
    description:
      "The database schema, the server it all runs on, and the pipeline that gets new code there without downtime. I will tell you when a managed service is worth its price and when one server you understand is the better deal, and the runbook is written down either way.",
    items: [
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Ubuntu VPS",
      "Nginx",
      "Docker",
      "GitHub Actions",
      "CI/CD",
      "Zero-downtime deploys",
    ],
  },
  {
    lane: "commerce",
    title: "A checkout that takes money without losing people",
    description:
      "Storefronts, catalogues and checkout flows, on a platform or custom-built. The work is usually not the payment step — it is the catalogue structure behind it and the friction in front of it, which is where the abandoned orders actually come from.",
    items: [
      "Shopify",
      "Liquid theme development",
      "Custom storefronts",
      "Catalogue architecture",
      "Checkout flows",
      "Conversion rate optimisation",
    ],
  },
  {
    lane: "measurement",
    title: "Numbers you can make a spending decision from",
    description:
      "Tracking that reports what happened rather than what the browser managed to send. If your ad platform is under-reporting sales you already made, you are cutting budget on campaigns that work — so I put the important events on the server, define the event schema before implementing it, and check attribution against the database.",
    items: [
      "GA4",
      "Google Tag Manager",
      "Meta Pixel",
      "Meta Conversions API",
      "Server-side event schema design",
      "Attribution QA",
    ],
  },
];

/**
 * A real sequence, so it is numbered. Nothing else on the site is.
 * Each step says what Arman does and what the client is handed at the end of it.
 */
export const processSteps: ProcessStep[] = [
  {
    title: "Discover",
    does: "I ask what the thing is for and who loses if it does not work, then write down what we are not building. Most scope problems are decided in this conversation, not later.",
    deliverable:
      "A written scope, the constraints, and an honest list of what I would leave out of a first release.",
  },
  {
    title: "Architect",
    does: "I design the schema and the deployment shape before writing feature code, because those two decisions are the expensive ones to reverse and everything else is negotiable.",
    deliverable:
      "The data model, the hosting plan with its monthly cost, and the measurement events defined up front rather than bolted on.",
  },
  {
    title: "Build",
    does: "I build it in working slices and put each one somewhere you can click it. You see progress in the actual application, not in a status update.",
    deliverable:
      "A deployed staging environment from the first week, updated continuously, and code you own in a repository you control.",
  },
  {
    title: "Operate",
    does: "I stay after launch. This is the part that usually gets dropped: backups tested rather than configured, TLS renewal verified, deploys repeatable by someone who is not me.",
    deliverable:
      "A runbook, monitoring that tells you before your customers do, and a handover that works whether or not I am still available.",
  },
];
