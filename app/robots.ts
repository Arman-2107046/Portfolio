import type { MetadataRoute } from "next";
import { absolute } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The styleguide is already a 404 in production; this keeps a crawler
      // from spending a request finding that out.
      disallow: ["/styleguide"],
    },
    sitemap: absolute("/sitemap.xml"),
    host: absolute("/"),
  };
}
