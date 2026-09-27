# Accessibility

What was tested, how, and what it found. Both audits are scripted and
repeatable, so this document describes a command anyone can re-run rather than a
session someone once had.

```bash
npm run build
npx next start --port 3120

npm run audit:a11y       # axe-core, every route, both themes
npm run audit:keyboard   # focus order, focus trap, landmarks, headings, errors
npm run check:contrast   # every token pair, both themes
```

## 1. Automated rule checking — axe-core

`scripts/audit-a11y.mjs` drives headless Chrome over every route and runs
axe-core against `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` and
axe's `best-practice` rules.

Each route is audited **twice, once per theme**. Contrast is the rule most
likely to differ between light and dark, so auditing only the default would
leave half the site unchecked.

| Routes audited | |
| --- | --- |
| `/` | homepage |
| `/work` | archive, unfiltered |
| `/work?lane=commerce` | archive, filtered |
| `/work?lane=bogus` | the designed empty state |
| `/work/<slug>` | all six case studies |
| `/this-route-does-not-exist` | the designed 404 |

**Result: 22 page audits, zero violations.**

### What it found

One violation, `page-has-heading-one`, on the homepage in the first run only.
It was not a defect in the page — it was a defect in the audit. The hero
headline reveals from behind `overflow: hidden`, so for the ~1.3s the animation
is running the `<h1>` is clipped to zero visible height and axe correctly
reports that no level-one heading is visible. That is a true statement about a
frame nobody reads and a false one about the page.

The fix was in the harness, not the site: the audit now waits 1.6s after
`networkidle0` for the reveal to settle. It is worth recording because the
tempting fix — suppressing the rule — would have hidden a real regression later.

## 2. Behaviour — keyboard, focus, structure

axe checks static properties. It cannot tell you whether Tab actually reaches
things, whether focus is visible when it does, whether a modal gives focus back,
or whether headings make sense read aloud. `scripts/audit-keyboard.mjs` drives
those directly. **All 25 checks pass.**

### Keyboard and focus

- The first Tab reaches **Skip to content**, and it paints a visible focus ring
  (asserted via computed `outline-style` and `outline-width`, so an
  `outline: none` regression fails the check rather than passing quietly).
- The six work rows are reached in document order, **one tab stop each** — the
  reason the index is rows rather than cards, where each project would have been
  three or four stops.
- The theme toggle is reachable and labelled with the action it performs
  (`Switch to the dark theme`), never with its current state.
- All 29 stack notes are buttons with `aria-describedby` resolving to real text,
  so each is reachable by keyboard and announced on focus. `title=` would have
  been neither.

### The mobile navigation overlay

Tested as a behaviour, because a focus trap that does not release is worse than
no trap at all:

- Closed, the panel is `inert` — its links are out of the tab order and out of
  the accessibility tree, without per-link `tabindex` management.
- Opening removes `inert`, sets `aria-modal="true"`, and moves focus inside.
- Body scroll locks, and Lenis is stopped — `overflow: hidden` alone does not
  stop it driving the scroll position under the overlay.
- Tabbing past the last item wraps to the first instead of escaping behind the
  overlay.
- Escape closes it, focus returns to the trigger button, and scroll is restored.

### Structure

- Exactly one `<h1>` on the homepage and on each case study.
- No heading level is skipped on either.
- One `<main>`, one `<header>`, one `<footer>`; every `<nav>` has an
  `aria-label`, so "navigation" is never announced three times with no way to
  tell them apart.
- Every `<img>` declares `alt` — meaningful where the image carries information,
  empty where the surrounding prose already describes it. `scripts/check-content.mts`
  additionally rejects alt text that is really a filename.

### Form errors

- Blurring an empty email sets `aria-invalid="true"` and links the message with
  `aria-describedby`, so it is announced by the control rather than merely
  painted beside it.
- Error copy is asserted **not** to match blaming or jargon language
  (`you must`, `you failed`, `invalid`, `error`). Every message says what
  happened and what to do: *"This address is missing something — it needs the
  form name@example.com."*

## 3. Contrast

`scripts/check-contrast.mjs` parses `app/styles/tokens.css` and checks every
pair the site actually renders, in both themes. It parses the stylesheet rather
than holding a copied list, because a duplicated palette is a palette that will
drift.

All body and secondary text clears **AAA (7:1)**; interactive borders clear the
3:1 required of non-text UI.

| Pair | Light | Dark | Target |
| --- | --- | --- | --- |
| `ink` on `canvas` | 19.17:1 | 17.31:1 | AAA |
| `ink` on `raised` | 17.40:1 | 16.03:1 | AAA |
| `ink-muted` on `canvas` | 7.73:1 | 8.18:1 | AAA |
| `ink-muted` on `raised` | 7.02:1 | 7.57:1 | AA |
| `accent` on `canvas` | 8.69:1 | 8.65:1 | AA |
| `accent` on `raised` | 7.89:1 | 8.01:1 | AA |
| `ink-inverse` on `ink` | 19.17:1 | 17.31:1 | AAA |
| `edge` on `canvas` | 3.70:1 | 3.70:1 | AA non-text |
| `edge` on `raised` | 3.36:1 | 3.43:1 | AA non-text |

### What it found

`--edge` on `--raised` was **2.99:1** in the light theme — one hundredth under
the 3:1 required for a non-text border, and invisible to the eye. `--edge` moved
from `#8E8E8A` to `#858581`, which clears both surfaces. This is the case for
scripting contrast rather than eyeballing it: nobody catches 2.99.

## 4. Motion

`prefers-reduced-motion` is honoured in three independent places, so no single
omission can defeat it:

1. **The variant factory.** `buildMotion(reduced)` in `lib/motion.ts` returns
   opacity-only variants and drops `staggerChildren` to zero. `useMotion()` is
   the only source of variants in the codebase, so a component cannot forget.
2. **The base stylesheet.** `app/globals.css` collapses every animation and
   transition duration under the media query, covering CSS that never passes
   through Framer.
3. **The components that have no reduced form.** Lenis is never constructed,
   the reading progress bar is not rendered at all, and the work index shows
   covers inline rather than tracking a cursor.

## 5. Known gaps

Stated rather than glossed:

- **No manual screen reader pass.** The structure was verified
  programmatically — landmark counts, heading order, `aria-describedby`
  resolution, alt presence — but nothing here replaces listening to the site in
  NVDA or VoiceOver. That is worth an hour before launch.
- **No testing with real assistive input devices** beyond a keyboard: no switch
  access, no voice control.
- **Contrast is checked against tokens, not screenshots.** A pair that only
  arises from an unexpected overlap of elements would not be caught by parsing
  the stylesheet.
