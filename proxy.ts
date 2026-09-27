import { NextResponse, type NextRequest } from "next/server";

/**
 * Keeps the token styleguide out of production.
 *
 * The obvious approach — calling notFound() inside the page behind a NODE_ENV
 * check — renders the right screen but answers with 200, whether the route is
 * prerendered or dynamic. A page that says "not found" while telling crawlers
 * and monitors that it was found is a state that only looks designed.
 *
 * Rewriting to a path that does not exist hands the request to the same
 * app/not-found.tsx and lets the router set the status, so the answer is a real
 * 404 with the real 404 page. Verified against `next start`.
 *
 * (Middleware was renamed Proxy in Next.js 16; the mechanism is unchanged.)
 */
export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.rewrite(new URL("/not-available", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/styleguide",
};
