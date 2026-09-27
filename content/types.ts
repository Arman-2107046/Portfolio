/**
 * The content contract. Every word on the site is typed, and lives in a module
 * under content/ rather than inside JSX — so copy can be edited without reading
 * a component, and a missing field is a typecheck failure rather than a blank
 * space that ships.
 */

/** The four lanes the work is filed under. Drives the /work filter. */
export type Lane = "commerce" | "platform" | "corporate" | "nonprofit";

/** Which capability a technology belongs to. */
export type CapabilityLane =
  "product-engineering" | "data-infrastructure" | "commerce" | "measurement";

export type ProjectImage = {
  src: string;
  /**
   * Meaningful alt, or the empty string when the image is decorative and the
   * surrounding prose already says what it shows. Never a filename.
   */
  alt: string;
  width: number;
  height: number;
};
/*
 * Blur placeholders are deliberately not a field here. They are base64 blobs
 * derived from the files themselves, so hand-maintaining them in content would
 * guarantee they drift the first time an image is replaced. They are generated
 * into content/blur.generated.ts and looked up by `src`.
 */

/**
 * One architecture decision, written as a trade-off rather than a feature.
 * `chose` and `over` are separate fields on purpose: it is the rejected option
 * that makes the decision worth reading.
 */
export type ArchitectureNote = {
  title: string;
  chose: string;
  over: string;
  because: string;
};

export type Outcome = {
  /** A short statement of what changed. Qualitative when no metric is known. */
  label: string;
  /**
   * A figure, when one is confirmed. Left undefined rather than invented — see
   * OPEN-QUESTIONS.md, which lists every gap.
   */
  metric?: string;
};

export type Project = {
  slug: string;
  name: string;
  /** What kind of organisation this was for, in plain words. */
  client: string;
  year: string;
  lane: Lane;
  /** The lane as a human phrase, for the work index row. */
  category: string;
  /** One line, outcome-first. This is the sentence in the work index. */
  summary: string;
  /** The case-study title: what this project was actually about. */
  headline: string;
  context: string;
  problem: string;
  approach: string;
  architectureNotes: ArchitectureNote[];
  outcomes: Outcome[];
  stack: string[];
  /** The three shown as chips in the index. A subset of `stack`. */
  featuredStack: string[];
  role: string;
  duration: string;
  cover: ProjectImage;
  gallery: ProjectImage[];
  liveUrl?: string;
};

export type Capability = {
  lane: CapabilityLane;
  /** The outcome the client gets, in language that names no technology. */
  title: string;
  description: string;
  items: string[];
};

export type StackItem = {
  name: string;
  lane: CapabilityLane;
  /** First person, one line: how Arman actually uses it. Shown on hover/focus. */
  note: string;
};

export type ProcessStep = {
  title: string;
  /** What Arman does. */
  does: string;
  /** What the client receives at the end of it. */
  deliverable: string;
};

export type Availability = {
  open: boolean;
  /** Short enough for the hero pill. */
  label: string;
  /** The longer sentence, for the footer. */
  detail: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type Site = {
  name: string;
  shortName: string;
  role: string;
  /** The hero headline, already split into the lines it reveals as. */
  headline: { text: string; accentWord?: string }[];
  tagline: string;
  /** The credibility line under the hero rule. */
  credibility: { label: string; value: string }[];
  email: string;
  location: string;
  timeZone: string;
  availability: Availability;
  socials: SocialLink[];
  /**
   * The canonical origin. Everything — metadata, OG images, sitemap, robots,
   * JSON-LD — reads from this one value. See OPEN-QUESTIONS.md item 6.
   */
  baseUrl: string;
  metaDescription: string;
};
