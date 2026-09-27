import { notFound } from "next/navigation";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getProject } from "@/content/projects";
import { site } from "@/content/site";

export const alt = "Case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// In Next.js 16 the image generator receives params as a promise, in line with
// the async request APIs. See the version-16 upgrade notes.
export default async function CaseStudyOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return renderOgImage({
    eyebrow: project.category,
    title: project.headline,
    meta: [project.name, project.year, site.name],
  });
}
