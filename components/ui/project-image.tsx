import Image from "next/image";
import { blurData } from "@/content/blur.generated";
import type { ProjectImage as ProjectImageData } from "@/content/types";
import { cn } from "@/lib/cn";

type ProjectImageProps = {
  image: ProjectImageData;
  /**
   * The `sizes` attribute. Required, not optional with a default: a wrong
   * `sizes` is invisible in development and downloads a 2400px file to a phone
   * in production, so every call site has to state how wide the image renders.
   */
  sizes: string;
  /** Set on the cover of a case study, which is the LCP candidate there. */
  priority?: boolean;
  className?: string;
};

/**
 * The only way project imagery is rendered.
 *
 * Width and height always come from the content record, and the content check
 * verifies those match the file on disk, so the box is reserved before the
 * bytes arrive and layout shift is structurally impossible rather than merely
 * unobserved.
 */
export function ProjectImage({
  image,
  sizes,
  priority = false,
  className,
}: ProjectImageProps) {
  const blur = blurData[image.src];

  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      priority={priority}
      // A blur placeholder is only honest if it was derived from this file.
      // If the generator has not been run for it, show nothing rather than
      // a placeholder belonging to some other image.
      placeholder={blur ? "blur" : "empty"}
      blurDataURL={blur}
      className={cn("h-auto w-full", className)}
    />
  );
}
