import type { Metadata } from "next";
import { site } from "@/content/site";
import type { Project } from "@/content/types";

/**
 * Everything canonical resolves from one value — site.baseUrl — so pointing the
 * site at a different domain is a one-line change rather than a search for
 * hardcoded URLs across metadata, OG tags, the sitemap, robots and JSON-LD.
 */
export const baseUrl = site.baseUrl;

export function absolute(path: string): string {
  return new URL(path, baseUrl).toString();
}

export function buildMetadata({
  title,
  description,
  path,
  ogPath,
}: {
  title: string;
  description: string;
  path: string;
  ogPath?: string;
}): Metadata {
  const canonical = absolute(path);
  const image = absolute(ogPath ?? "/opengraph-image");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: site.name,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/**
 * JSON-LD. Rendered as a script tag rather than assembled in a component so the
 * shape stays reviewable in one place, and so the same Person block is used by
 * every route instead of being rewritten per page.
 */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    url: baseUrl,
    image: absolute(site.portrait.src),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Khulna",
      addressCountry: "BD",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Khulna University of Engineering & Technology",
      alternateName: "KUET",
    },
    knowsAbout: [
      "Full-stack web development",
      "Laravel",
      "React",
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "Server-side conversion tracking",
      "Meta Conversions API",
      "Google Analytics 4",
      "E-commerce development",
      "Linux server administration",
    ],
    sameAs: site.socials
      .filter((social) => social.href.startsWith("http"))
      .map((social) => social.href),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: baseUrl,
    description: site.metaDescription,
    inLanguage: "en",
    author: { "@type": "Person", name: site.name, url: baseUrl },
  };
}

export function creativeWorkSchema(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    headline: project.headline,
    abstract: project.summary,
    url: absolute(`/work/${project.slug}`),
    image: absolute(project.cover.src),
    dateCreated: project.year,
    inLanguage: "en",
    creator: { "@type": "Person", name: site.name, url: baseUrl },
    about: project.category,
    keywords: project.stack.join(", "),
  };
}
