# Open questions

Everything here needs Arman's input before the site is finished. Nothing blocks
the build — each item has a defensible placeholder — but every one is a place
where the site currently says something conservative instead of something true.

Ordered by what unblocks the most.

## Blocking a real launch

| #   | Question                                                                                                                                                       | What the site does now                                                                                          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1   | **The domain.** `content/site.ts` → `baseUrl`. Every canonical URL, OG image, sitemap entry and JSON-LD url resolves from that one value.                        | Placeholder: `https://armanrahmanrafi.com`                                                                       |
| 2   | **Client permission** to name each of the six clients publicly and show screenshots. Hockerty in particular may be agency or white-label — confirm the credit.   | All six are named.                                                                                               |
| 3   | **Is "sole engineer" accurate per project?** Some may have been team builds where the role should be narrowed.                                                   | Every case study says "sole engineer".                                                                           |
| 4   | `RESEND_API_KEY` and `CONTACT_FROM_EMAIL`.                                                                                                                      | The server action fails closed and shows the email fallback, so no enquiry is silently lost.                     |
| 5   | `NEXT_PUBLIC_GTM_ID`.                                                                                                                                           | Analytics is completely inert — no script, no banner, no requests, no consent prompt.                            |

## Facts

| #   | Question                                                                               | What the site says now                                                                                     |
| --- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 6   | Is the availability line accurate?                                                      | Open for new work. Change the `availability` object in `content/site.ts`, never the components.               |
| 7   | Is `armanr.rafi@gmail.com` the right address, or should a domain address be used?       | The address on the GitHub account.                                                                            |
| 8   | LinkedIn and WhatsApp.                                                                  | Omitted rather than guessed. The footer renders whatever is in `site.socials`, so adding one is a single line. |
| 9   | Graduation year at KUET.                                                                | "Studying CSE at KUET", no year.                                                                              |

## Metrics

No number was invented anywhere on this site. Each case study states a
qualitative outcome where the figure is unknown. These are the numbers that
would make the strongest sentences on the site, if they exist.

| #   | Project                | Metric that would land                                                                                       |
| --- | ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| 10  | Sooth Bangladesh       | Recovered-event percentage after the Conversions API cutover, and the change in reported ROAS.                |
| 11  | Sooth Bangladesh       | Catalogue size in the feed, and whether dynamic product ads outperformed static.                              |
| 12  | Hockerty               | Number of asset combinations in the library, and configurator load time before and after the image pipeline.  |
| 13  | Digital Products Store | Organic sessions or indexed pages after launch, and monthly hosting cost versus the managed equivalent.       |
| 14  | AmidX                  | How many non-technical staff now edit the site, and whether design regressions went to zero.                  |
| 15  | BEES                   | Page count before and after the new IA, and any change in task completion or bounce.                          |
| 16  | H&R Group              | Any change in inbound enquiries from international buyers after launch.                                       |

## Assets

| #   | Need                                  | Current state                                                                                                                                                                                                                                                             |
| --- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 17  | Real screenshots for all six projects | Schematic placeholders at the correct dimensions in `public/work/<slug>/`, drawn so they cannot be mistaken for screenshots. Replace the files keeping the same names and sizes, then run `npm run media`. The script fails if a file disagrees with the declared dimensions. |
| 18  | Portrait photograph                   | `public/portrait.png`, 1000×1250 (4:5). Same process.                                                                                                                                                                                                                      |
| 19  | Live URLs                             | Omitted rather than guessed. Adding `liveUrl` to a project makes the link appear in its spec rail automatically.                                                                                                                                                            |
| 20  | CV / résumé PDF                       | No file yet. The `cv_download` event is defined and typed so adding the link is a one-line change — see ANALYTICS.md. Drop it at `public/arman-rahman-rafi-cv.pdf`.                                                                                                          |

## To verify once it is live

These need a public URL and could not be done from the build machine.

| #   | Check                                                                                                                                                                                                                                                                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 21  | **Lighthouse against the deployed site.** Local medians: performance 86/88/89, and 100 for accessibility, best practices and SEO, with CLS at ~0. The remaining cost is the React/Next framework chunk under a 4× CPU throttle, measured on a laptop also running the server and the headless browser. Behind a CDN with compression it should be higher. See PERFORMANCE.md. |
| 22  | **Rich Results Test** for the Person and CreativeWork schema. Verified locally against `next start` — correct block counts, `alumniOf` KUET, unique canonicals — but not through Google's own validator.                                                                                                                                                      |
| 23  | **A link-preview debugger** for the OG cards. Both render correctly as PNGs locally.                                                                                                                                                                                                                                                                         |
| 24  | **CI green.** Every command in the workflow was run locally in exactly the form CI runs it, and all pass. The workflow itself has not been watched running.                                                                                                                                                                                                   |
| 25  | **Safari on a real iPhone.** The hazards the build plan names — `100vh`, `backdrop-filter`, `clip-path` — are absent from the codebase, so nothing is known to be at risk. Safe-area insets are wired with `viewport-fit=cover` but cannot be observed without a notched device.                                                                               |
| 26  | **A manual screen reader pass** in NVDA or VoiceOver. Structure was verified programmatically — landmark counts, heading order, `aria-describedby` resolution, alt presence — but nothing replaces listening to it. Worth an hour.                                                                                                                             |
| 27  | **A test enquiry** through the form, end to end, once Resend is configured.                                                                                                                                                                                                                                                                                  |
| 28  | **GA4 DebugView** showing all five events with exactly the parameters in ANALYTICS.md — no extras, no `(not set)`.                                                                                                                                                                                                                                            |
| 29  | **CSP switched from report-only to enforcing** after a quiet week. DEPLOY.md has the reasoning and the checklist.                                                                                                                                                                                                                                             |
