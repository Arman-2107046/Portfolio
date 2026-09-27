# Measurement

The event schema for this site, written the way client event schemas should be:
defined before implementation, typed so a typo fails the build, and documented
so a report still means the same thing in six months.

It doubles as a work sample. The Measurement capability lane claims that events
are specified up front rather than bolted on afterwards — this is that claim,
applied here.

## Setup

| Piece | Where |
| --- | --- |
| Container | Google Tag Manager, id in `NEXT_PUBLIC_GTM_ID` |
| Destination | GA4, configured inside GTM rather than hardcoded in the app |
| Transport | `window.dataLayer`, pushed through `track()` in `lib/analytics.ts` |
| Loading | `next/script` with `afterInteractive`, and only after consent |

GTM is configured in the container, not in the application, so a tag can be
added or a parameter renamed without a deploy. The application's only
responsibility is to emit correct events.

**Without `NEXT_PUBLIC_GTM_ID` the whole system is inert** — no script, no
banner, no requests. `track()` still runs and pushes to an array that is
discarded with the page, so call sites never need to know whether analytics is
configured.

## The events

Five events. Each has a defined trigger and a fixed parameter set.

### `view_case_study`

| | |
| --- | --- |
| Trigger | A case-study page mounts (`components/analytics/case-study-view.tsx`) |
| Why | The case studies are the site's argument. Which ones get opened is the single most useful thing to know. |

| Parameter | Type | Example |
| --- | --- | --- |
| `project_slug` | string | `sooth-bangladesh` |
| `project_name` | string | `Sooth Bangladesh` |
| `project_lane` | string | `commerce` |

`project_lane` is included so reads can be grouped by kind of work without
joining against a project list in the reporting tool.

### `copy_email`

| | |
| --- | --- |
| Trigger | The copy-to-clipboard button succeeds (`components/ui/copy-email.tsx`) |
| Why | Copying the address is a stronger intent signal than submitting the form, and it is otherwise completely invisible — the visitor leaves for their mail client and the session just ends. |

| Parameter | Type | Values |
| --- | --- | --- |
| `location` | string | `contact`, `footer` |

Fired on success only. A failed clipboard write is not an intent signal, it is a
permissions error.

### `contact_submit`

| | |
| --- | --- |
| Trigger | The server action resolves (`components/sections/contact.tsx`) |
| Why | The conversion. Split by outcome so a broken mail provider is visible as a spike in errors rather than as a mysterious drop in enquiries. |

| Parameter | Type | Values |
| --- | --- | --- |
| `project_type` | string | one of the select options |
| `budget_range` | string | one of the select options |
| `outcome` | string | `success`, `error` |

**Fired from the resolved server state, not from the click.** Firing on submit
would count attempts that never reached the server as conversions, which is the
same class of error the Sooth Bangladesh case study is about — measuring the
browser's intention instead of the server's fact.

No name, email or message content is ever sent. The two select values are
categories, not personal data.

### `outbound_click`

| | |
| --- | --- |
| Trigger | A click on any link to another host (delegated listener) |
| Why | A visitor leaving for GitHub is an engaged visitor, not a bounce. |

| Parameter | Type | Example |
| --- | --- | --- |
| `link_domain` | string | `github.com` |
| `link_url` | string | `https://github.com/Arman-2107046` |

One delegated listener on the document, not a handler per anchor. Links appear
throughout content prose, so per-link instrumentation would be forgotten the
first time someone added one — and a schema that depends on remembering is one
that quietly develops holes.

`mailto:` links are excluded: they are covered by `copy_email` and the intent is
different.

### `cv_download`

| | |
| --- | --- |
| Trigger | A click on the CV link |
| Why | A downloaded CV usually means a different kind of conversation — employment rather than contract work. Worth telling apart. |

| Parameter | Type | Example |
| --- | --- | --- |
| `file_name` | string | `arman-rahman-rafi-cv.pdf` |

**This event is defined but does not yet fire**, because there is no CV on the
site — see OPEN-QUESTIONS.md item 17. The type exists so that adding the link
is a one-line change with the parameter already agreed. It is listed here rather
than omitted, because a schema that silently drops a planned event is how a
reporting gap goes unnoticed.

## Consent

The banner exists because GA4 sets cookies. If it did not, there would be no
banner — a consent notice for tracking that does not happen is theatre.

**Nothing loads before an explicit grant.** Not the GTM script, not a cookie,
not a request. Verified with a headless browser across all three states:

| Visitor state | Banner | External requests | Cookies |
| --- | --- | --- | --- |
| Has not chosen | shown | none | 0 |
| Chose "No thanks" | hidden | none | 0 |
| Chose "Allow" | hidden | googletagmanager.com | set by GTM |

A banner that appears after the tags have already loaded is asking permission
for something that has already happened. This one asks first.

The choice is stored in `localStorage` under `arr-analytics-consent` and read
through `useSyncExternalStore`, with a third `"unknown"` state for server
rendering — distinct from "has not answered", so the banner is never in the HTML
for everyone and then removed on hydration for the majority who already chose.

The copy names the tool and the purpose in two sentences and says the site works
the same either way, which is true: nothing on this site is gated behind
analytics.

## Verifying it

1. Set `NEXT_PUBLIC_GTM_ID` and deploy, or run `npm run build && npx next start`
   with it set.
2. Open GA4 → Admin → DebugView, and load the site with the GTM preview
   connected.
3. Walk the five triggers: open a case study, copy the address, submit the form,
   click through to GitHub, and download the CV once one exists.
4. Confirm each event arrives with exactly the parameters above — no extras, no
   missing values, no `(not set)`.

Step 4 is the part usually skipped, and it is the part that matters. An event
that fires with a missing parameter is worse than one that does not fire: it
looks like data.

## If you change this

- Add the event to the `AnalyticsEvent` union in `lib/analytics.ts` first. It is
  a discriminated union, so an unknown name or a wrong parameter set is a
  typecheck failure rather than an event that silently never arrives.
- Then add it here, with the trigger and the reason. An event without a stated
  reason gets collected forever and read never.
