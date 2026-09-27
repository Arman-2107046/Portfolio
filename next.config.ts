import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray pnpm-lock.yaml in the home directory makes Turbopack guess the
  // wrong workspace root. Pin it to this repository.
  turbopack: {
    root: import.meta.dirname,
  },

  images: {
    // AVIF first, WebP as the fallback for browsers that lack it.
    formats: ["image/avif", "image/webp"],

    // Trimmed to the widths this layout actually renders at. The content column
    // caps at 1200px, so the 3840px entry in the default list would only ever
    // produce variants nothing requests — each one costing build time and cache
    // space. 2400 covers a 1200px image on a 2x display.
    deviceSizes: [640, 828, 1080, 1200, 1600, 1920, 2400],

    // Used for the work-index hover preview and the gallery thumbnails.
    imageSizes: [256, 384, 512],

    // Project imagery is static and versioned by filename, so it can be cached
    // for a long time. Replacing an image means a new file, not a new variant
    // of the same URL.
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
};

export default nextConfig;
