import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.role}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
  return renderOgImage({
    eyebrow: site.role,
    // The hero headline, rejoined. The link preview and the first screen say
    // the same sentence, which is the point of keeping it in content.
    title: site.headline
      .map((line) => [line.text, line.accentWord].filter(Boolean).join(" "))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim(),
    meta: [site.name, "Khulna, Bangladesh", "CSE at KUET"],
  });
}
