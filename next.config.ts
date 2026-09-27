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

  /**
   * Security headers.
   *
   * CSP is deliberately Report-Only to begin with. Shipping an enforcing policy
   * blind is how a site breaks in a way nobody notices until a visitor reports
   * it, and the report endpoint costs nothing to watch for a week first. Once
   * the reports are quiet, rename the header to `Content-Security-Policy`.
   * DEPLOY.md has the checklist.
   */
  async headers() {
    const csp = [
      "default-src 'self'",
      // 'unsafe-inline' is required by the theme script in <head>, which has to
      // run before paint, and by Next's inlined bootstrap. A nonce would be the
      // stricter answer but forces every route to render dynamically, which
      // would trade the whole static build for it.
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://www.googletagmanager.com",
      "font-src 'self'",
      "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy-Report-Only", value: csp },
          {
            // Two years, with preload. Only valid once HTTPS is enforced and
            // the domain is committed to it — see DEPLOY.md.
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            // This site needs none of these. Denying them means a future
            // dependency cannot quietly start asking.
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      {
        // Images are content-addressed by filename, so a change is a new URL.
        source: "/work/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
