"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Emits view_case_study once per case-study view.
 *
 * A separate island rather than logic inside the page, so the case study stays
 * a server component. It renders nothing.
 */
export function CaseStudyView({
  slug,
  name,
  lane,
}: {
  slug: string;
  name: string;
  lane: string;
}) {
  useEffect(() => {
    track({
      name: "view_case_study",
      params: { project_slug: slug, project_name: name, project_lane: lane },
    });
  }, [slug, name, lane]);

  return null;
}
