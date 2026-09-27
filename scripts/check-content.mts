/**
 * Content completeness check.
 *
 * TypeScript guarantees the shape of the content; it cannot guarantee that a
 * required string is not `""`, that `featuredStack` is actually a subset of
 * `stack`, that prose is long enough to be prose, or that every lane the filter
 * offers has at least one project in it. This checks the things the type system
 * cannot see.
 *
 *   npx tsx scripts/check-content.mts
 */

import { capabilities, processSteps } from "../content/capabilities";
import { projects } from "../content/projects";
import { site } from "../content/site";
import { stackItems } from "../content/stack";
import type { Lane } from "../content/types";

const ALL_LANES: Lane[] = ["commerce", "platform", "corporate", "nonprofit"];
const problems: string[] = [];

function fail(message: string) {
  problems.push(message);
}

/** A non-empty string with no leftover placeholder language. */
function requireProse(where: string, value: string, minLength: number) {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    fail(`${where} is empty`);
    return;
  }
  if (trimmed.length < minLength) {
    fail(`${where} is ${trimmed.length} chars, expected at least ${minLength}`);
  }
  const banned = ["lorem", "ipsum", "todo", "tbd", "placeholder", "coming soon", "xxx"];
  const lower = trimmed.toLowerCase();
  for (const word of banned) {
    if (lower.includes(word)) fail(`${where} contains placeholder language: "${word}"`);
  }
}

if (projects.length !== 6) fail(`expected 6 projects, found ${projects.length}`);

const slugs = new Set<string>();

for (const project of projects) {
  const where = `projects[${project.slug}]`;

  if (slugs.has(project.slug)) fail(`${where} duplicate slug`);
  slugs.add(project.slug);

  if (!/^[a-z0-9-]+$/.test(project.slug)) fail(`${where} slug is not url-safe`);

  requireProse(`${where}.name`, project.name, 2);
  requireProse(`${where}.client`, project.client, 4);
  requireProse(`${where}.category`, project.category, 4);
  requireProse(`${where}.headline`, project.headline, 20);
  requireProse(`${where}.summary`, project.summary, 60);
  requireProse(`${where}.role`, project.role, 4);
  requireProse(`${where}.duration`, project.duration, 4);
  requireProse(`${where}.context`, project.context, 300);
  requireProse(`${where}.problem`, project.problem, 300);
  requireProse(`${where}.approach`, project.approach, 300);

  if (!/^\d{4}$/.test(project.year)) fail(`${where}.year is not a four-digit year`);

  // The build plan asks for three to five architecture decisions, each naming a
  // real trade-off. An empty `over` means no trade-off was actually stated.
  if (project.architectureNotes.length < 3 || project.architectureNotes.length > 5) {
    fail(
      `${where} has ${project.architectureNotes.length} architecture notes, expected 3-5`,
    );
  }
  project.architectureNotes.forEach((note, index) => {
    const noteWhere = `${where}.architectureNotes[${index}]`;
    requireProse(`${noteWhere}.title`, note.title, 10);
    requireProse(`${noteWhere}.chose`, note.chose, 15);
    requireProse(`${noteWhere}.over`, note.over, 15);
    requireProse(`${noteWhere}.because`, note.because, 80);
  });

  if (project.outcomes.length < 3) {
    fail(`${where} has ${project.outcomes.length} outcomes, expected at least 3`);
  }
  project.outcomes.forEach((outcome, index) => {
    requireProse(`${where}.outcomes[${index}].label`, outcome.label, 40);
  });

  if (project.stack.length < 3) fail(`${where}.stack is too short`);
  if (project.featuredStack.length !== 3) {
    fail(
      `${where}.featuredStack must be exactly 3, found ${project.featuredStack.length}`,
    );
  }

  // The chips in the work index must not name a technology the case study does
  // not claim. Abbreviations are allowed if they prefix a real entry.
  for (const featured of project.featuredStack) {
    const matches = project.stack.some(
      (entry) =>
        entry === featured ||
        entry.toLowerCase().startsWith(featured.toLowerCase()) ||
        entry.toLowerCase().includes(featured.toLowerCase()),
    );
    if (!matches) fail(`${where}.featuredStack "${featured}" is not in stack`);
  }

  // Images: real dimensions, and alt text that is a sentence rather than a file.
  const images = [project.cover, ...project.gallery];
  for (const image of images) {
    const imageWhere = `${where} image ${image.src}`;
    if (!image.src.startsWith(`/work/${project.slug}/`)) {
      fail(`${imageWhere} is not under /work/${project.slug}/`);
    }
    if (image.width < 800 || image.height < 400)
      fail(`${imageWhere} dimensions too small`);
    requireProse(`${imageWhere} alt`, image.alt, 25);
    if (/\.(png|jpe?g|webp|avif)$/i.test(image.alt)) {
      fail(`${imageWhere} alt looks like a filename`);
    }
  }
  if (project.gallery.length < 1) fail(`${where} has no gallery images`);
}

// Every lane the /work filter offers must return at least one project.
for (const lane of ALL_LANES) {
  const count = projects.filter((project) => project.lane === lane).length;
  if (count === 0) fail(`lane "${lane}" has no projects, so its filter is always empty`);
}

if (capabilities.length !== 4)
  fail(`expected 4 capabilities, found ${capabilities.length}`);
for (const capability of capabilities) {
  requireProse(`capabilities[${capability.lane}].title`, capability.title, 20);
  requireProse(
    `capabilities[${capability.lane}].description`,
    capability.description,
    150,
  );
  if (capability.items.length < 3)
    fail(`capabilities[${capability.lane}] has too few items`);
}

if (processSteps.length !== 4)
  fail(`expected 4 process steps, found ${processSteps.length}`);
for (const step of processSteps) {
  requireProse(`processSteps[${step.title}].does`, step.does, 80);
  requireProse(`processSteps[${step.title}].deliverable`, step.deliverable, 60);
}

// Every capability lane's item list should be represented in the stack grid.
for (const capability of capabilities) {
  const count = stackItems.filter((item) => item.lane === capability.lane).length;
  if (count === 0) fail(`stack has no items in lane "${capability.lane}"`);
}
for (const item of stackItems) {
  requireProse(`stack[${item.name}].note`, item.note, 40);
}

requireProse("site.tagline", site.tagline, 40);
requireProse("site.metaDescription", site.metaDescription, 100);
requireProse("site.availability.detail", site.availability.detail, 40);
if (site.headline.length < 2) fail("site.headline needs at least two lines");
if (!site.email.includes("@")) fail("site.email is not an address");
if (!site.baseUrl.startsWith("https://")) fail("site.baseUrl must be https");

if (problems.length > 0) {
  console.error(`Content check failed with ${problems.length} problem(s):\n`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(
  `Content check passed: ${projects.length} projects, ` +
    `${projects.reduce((sum, p) => sum + p.architectureNotes.length, 0)} architecture ` +
    `decisions, ${capabilities.length} capability lanes, ${stackItems.length} stack items.`,
);
