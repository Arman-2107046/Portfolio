# Open questions

Everything on this list needs Arman's confirmation before the site is truly
finished. Nothing here blocks the build — each item has a defensible placeholder
in place, noted below — but every one of them is a place where the site currently
states something conservative instead of something true.

## Facts to confirm

| # | Question | What the site says now |
| - | -------- | ---------------------- |
| 1 | Is the availability line accurate? | `content/site.ts` sets availability to open for new work with a date. Change the `availability` object, not the components. |
| 2 | Contact email | Placeholder is the address on the GitHub account, `armanr.rafi@gmail.com`. Confirm whether a domain address should be used instead. |
| 3 | Phone / WhatsApp number | Omitted rather than invented. The footer has a WhatsApp slot ready in `content/site.ts`. |
| 4 | Social handles | GitHub is `Arman-2107046`. LinkedIn and X handles are unconfirmed and currently omitted. |
| 5 | Graduation year at KUET | Copy says "studying CSE at KUET" without a year. |
| 6 | Custom domain | Metadata `baseUrl` is a placeholder. Everything canonical, OG, sitemap and robots reads from that one value. |

## Metrics

Per process.txt R6, no number was invented. Each case study currently states a
qualitative outcome where a metric is unknown. These are the numbers that would
make the strongest sentences on the site, if they exist:

| # | Project | Metric that would land |
| - | ------- | ---------------------- |
| 7 | Sooth Bangladesh | Recovered-event percentage after the Conversions API cutover, and the change in reported ROAS. Currently described qualitatively as restored attribution. |
| 8 | Sooth Bangladesh | Catalog size in the product feed, and whether dynamic product ads measurably outperformed static. |
| 9 | Hockerty | Number of garment/fabric asset combinations in the library, and configurator load time before and after the Cloudinary pipeline. |
| 10 | Digital Products Store | Organic sessions or indexed-page count after launch, and monthly hosting cost versus the managed-service equivalent. |
| 11 | AmidX | How many non-technical staff now edit the site, and whether design regressions dropped to zero. |
| 12 | BEES | Page count of the old site versus the new IA, and whether task-completion or bounce improved. |
| 13 | H&R Group | Any inbound-enquiry change from international buyers after launch. |

## Assets

| # | Need | Current state |
| - | ---- | ------------- |
| 14 | Real screenshots for all six projects | Generated placeholder frames at the correct aspect ratio sit in `public/work/<slug>/`. They are clearly schematic, not fake screenshots. Replace the files, keep the names and dimensions, and no code changes. |
| 15 | Portrait photograph | The About section has a portrait slot with a placeholder at the right ratio. |
| 16 | Live URLs | Only those confidently known are linked. Any project without a confirmed public URL omits the live link rather than guessing. |
| 17 | CV / résumé PDF | The `cv_download` analytics event is specified but no file exists yet. Drop it at `public/arman-rahman-rafi-cv.pdf`. |

## Permissions

| # | Question |
| - | -------- |
| 18 | Client permission to name each of the six clients publicly, and to show screenshots. Hockerty in particular may be agency or white-label work — confirm how it should be credited. |
| 19 | Whether "sole engineer" is accurate per project, or whether some were team builds where the role should be narrowed. |

## Configuration needed before deploy

| # | Item |
| - | ---- |
| 20 | `RESEND_API_KEY` and the from/to addresses for the contact form. Until set, the server action fails closed and the UI shows the email fallback. |
| 21 | GTM container ID for `NEXT_PUBLIC_GTM_ID`. Analytics is inert without it. |
| 22 | Vercel project and domain, or the VPS target if self-hosting per `DEPLOY.md`. |
