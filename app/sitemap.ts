import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { absolute } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: absolute("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: absolute("/work"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projects.map((project) => ({
      url: absolute(`/work/${project.slug}`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
