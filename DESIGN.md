# Design plan

Direction: quiet, engineered, editorial. The reference is not another portfolio —
it is a well-set piece of technical documentation. A datasheet, a specification,
an engineering drawing. Confidence comes from typographic scale, hairlines, and
the discipline to leave things out.

The boldness is spent in exactly one place: the hero headline. Every section
after it is set at normal weight, in near-black on white, with rules instead of
boxes.

---

## 1. Palette

Six roles per theme. Named by role, never by colour, so a repaint touches one
file.

### Light (default)

| Token       | Value     | Role                                                                                                                             | Contrast on canvas      |
| ----------- | --------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `canvas`    | `#FFFFFF` | The page. Pure white, not off-white — the ground everything is measured against.                                                  | —                       |
| `raised`    | `#F4F4F2` | The only secondary surface. Marks a region as inset, not floating. A hair warm so it reads as paper next to pure white.           | —                       |
| `ink`       | `#0E0F12` | All primary text, all rules that carry meaning, all filled controls.                                                             | 19.17:1                 |
| `ink-muted` | `#4F535A` | Secondary prose, metadata values, captions.                                                                                      | 7.73:1 (AAA)            |
| `hairline`  | `#E3E3E0` | Decorative structure: section rules, column dividers, the grid. Never the only indicator of anything.                            | 1.29:1 (decorative)     |
| `edge`      | `#858581` | The border of an interactive element at rest — inputs, buttons, chips.                                                            | 3.70:1 (AA non-text)    |
| `accent`    | `#1B36C9` | Marks, rules, link underlines, focus rings, the active-section tick.                                                             | 8.69:1                  |

### Dark

| Token       | Value     | Contrast on canvas   |
| ----------- | --------- | -------------------- |
| `canvas`    | `#0B0C0E` | —                    |
| `raised`    | `#14161A` | —                    |
| `ink`       | `#F0F1F3` | 17.31:1              |
| `ink-muted` | `#A2A8B2` | 8.18:1 (AAA)         |
| `hairline`  | `#262A31` | decorative           |
| `edge`      | `#666C76` | 3.70:1 (AA non-text) |
| `accent`    | `#93A8FF` | 8.65:1               |

**The accent rule.** The accent never fills a surface. It draws: a 1px rule, an
underline, a 2px focus ring, a 6px availability dot, the tick beside the active
nav item. Filled controls are `ink` on `canvas`, inverted. This is what keeps the
site from looking like a product landing page — colour is a pointer, not
decoration. It also means the whole site survives being printed in greyscale,
which is what a datasheet should do.

**Default theme: light.** The audience is founders and operators reading on a
phone, often in daylight, usually in a tab next to three other candidates. A
pure-white canvas is the honest ground for an ink-and-hairline system, and it is
the theme the type scale was drawn against. Dark is fully designed, not a filter,
and persists per visitor.

---

## 2. Type

Three families, each with one job and a hard boundary. The third is allowed
because its total footprint is one word.

| Family               | Role                                                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Instrument Sans**  | Everything structural: display, headings, body, controls. Variable 400–700 with a width axis, slightly narrow, and with enough character that it does not read as the default UI grotesque.          |
| **IBM Plex Mono**    | The metadata layer, and only that: years, roles, stack names, index numerals, field labels, the local clock. Mono is the signal "this is a specified value."                                         |
| **Instrument Serif** | Italic, 400, exactly one word in the hero headline and the case-study pull quote. Nothing else.                                                                                                     |

### Scale

Fluid between 375px and 1440px. Tracking tightens as size grows; leading opens
as size shrinks. No breakpoint jumps — every step is a single `clamp()`.

| Step         | Size                                       | Tracking   | Leading | Use                                       |
| ------------ | ------------------------------------------ | ---------- | ------- | ----------------------------------------- |
| `display-xl` | `clamp(2.75rem, 9.2vw, 7.5rem)` 44→120px   | `-0.04em`  | `0.94`  | Hero headline only                        |
| `display-l`  | `clamp(2rem, 5vw, 3.75rem)` 32→60px        | `-0.03em`  | `1.02`  | Case-study title, contact CTA             |
| `h1`         | `clamp(1.75rem, 3.2vw, 2.5rem)` 28→40px    | `-0.02em`  | `1.10`  | Section openers                           |
| `h2`         | `clamp(1.375rem, 2.2vw, 1.75rem)` 22→28px  | `-0.015em` | `1.18`  | Sub-sections, project names in the index  |
| `h3`         | `clamp(1.125rem, 1.4vw, 1.25rem)` 18→20px  | `-0.01em`  | `1.30`  | Lane titles, field groups                 |
| `body-l`     | `clamp(1.0625rem, 1.1vw, 1.25rem)` 17→20px | `0`        | `1.60`  | Hero sub, section lead paragraphs         |
| `body`       | `1rem` → `1.0625rem`                       | `0`        | `1.65`  | All running prose                         |
| `caption`    | `0.875rem` 14px                            | `+0.01em`  | `1.45`  | Notes, helper text                        |
| `mono-meta`  | `0.875rem` 14px                            | `+0.02em`  | `1.40`  | The entire metadata layer                 |

14px is the floor. Nothing on the site is set smaller, including the mono rail,
which is where the temptation to drop to 12px normally lives.

**Measure.** Running prose is capped at `68ch` — roughly 66–72 characters at body
size, comfortably under 75. Lead paragraphs cap at `56ch` so they read as a deck,
not a block.

---

## 3. Grid

```
Desktop ≥1024px      12 columns · 24px gutter · content max 1200px · outer max 1440px
Tablet 768–1023px     8 columns · 24px gutter
Mobile <768px         4 columns · 20px gutter · 20px page margin
```

The signature structure is a **two-part split** used by almost every section:

```
cols 1–2        cols 4–9             cols 11–12
mono label      the actual content   metadata values (right-aligned)
```

Left rail is a mono field name. Middle is prose or a list. Right rail is
specified values, right-aligned against the outer margin so all numbers on the
page form a single vertical edge. This is the datasheet read, and it repeats in
Capabilities, Process, and every case study — the same skeleton, different
content, so the site feels like one document rather than a stack of sections.

**Where content may break the grid.** Three places, and only these:

1. The hero headline spans all 12 columns and is optically overhung to the left
   so the cap-stem, not the glyph box, aligns to the margin.
2. Case-study covers and the work-index hover preview are full-bleed.
3. Section rules span the full outer width, past the content column, so the page
   reads as horizontal bands.

---

## 4. Layout concept

### Hero

```
┌────────────────────────────────────────────────────────────────┐
│ ARMAN RAHMAN RAFI                     work  capabilities   ☾  │  ← nav, not sticky yet
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ● available for work — feb 2026        ← mono, accent dot     │
│                                                                │
│  I build the                          ← line 1  ┐              │
│  whole system,                        ← line 2  │ mask reveal  │
│  not the /screens/ only.              ← line 3  ┘ 70ms stagger │
│     └ one word, serif italic                                   │
│                                                                │
│  ────────────────────────────────────────────────────────────  │
│  Schema, application, server, and the analytics       CSE·KUET │
│  that prove it worked. One person, end to end.     6 platforms │
│      ↑ body-l, 56ch                            ↑ mono, right   │
└────────────────────────────────────────────────────────────────┘
```

No illustration, no gradient, no canvas. The LCP element is the headline text.

### Work index

```
  selected work                                        six projects
  ──────────────────────────────────────────────────────────────────
  01  AmidX Technologies                                       2025
      Corporate platform — a CMS that cannot break the design
      REACT   LARAVEL   TAILWIND
  ──────────────────────────────────────────────────────────────────
  02  Sooth Bangladesh          ┌──────────────────┐         2025
      E-commerce — attribution  │                  │
      LARAVEL  REACT  CAPI      │  cover, follows  │
  ──────────────────────────────│  cursor, damped  │──────────────
  03  Hockerty Suit Designer    └──────────────────┘         2024
```

Rows, not cards. The whole row is one link. Imagery is absent until the visitor
points at a row — the list stays readable, and the image becomes a reward for
attention rather than six competing thumbnails. On touch, the cover sits inline
at a fixed ratio instead, because there is no cursor to follow.

### Case study

```
┌────────────────────────────────────────────────────────────────┐
│ ▏reading progress                                              │
├────────────────────────────────────────────────────────────────┤
│  ← selected work                                               │
│                                                                │
│  Sooth Bangladesh                                              │
│  Recovering the conversions the browser stopped reporting      │
│                                                                │
│  ROLE       Full-stack, sole engineer                          │
│  YEAR       2025                                               │
│  STACK      Laravel, React, Meta CAPI, GA4                     │
│  LIVE       soothbd.com                                        │
│     ↑ the mono rail, as a real definition list                 │
├────────────────────────────────────────────────────────────────┤
│ ████████████████ full-bleed cover ████████████████████████████ │
├────────────────────────────────────────────────────────────────┤
│  CONTEXT    │ prose, 68ch                                      │
│  ───────────┼──────────────────────────────────────────────────│
│  PROBLEM    │ prose                                            │
│  ───────────┼──────────────────────────────────────────────────│
│  BUILT      │ prose                                            │
│  ───────────┼──────────────────────────────────────────────────│
│  DECISIONS  │ ─ Chose X over Y because …          ← the section │
│             │ ─ Chose A over B because …            that sells  │
│  ───────────┼──────────────────────────────────────────────────│
│  OUTCOME    │ prose                                            │
└────────────────────────────────────────────────────────────────┘
  next: Hockerty Premium Suit Designer
```

---

## 5. Principles

1. Metadata lives in a fixed mono rail on every section, so the site reads as one
   specification document rather than a sequence of marketing blocks.
2. The accent colour never fills a surface — it only draws rules, underlines,
   marks, and focus rings, which keeps colour meaningful and keeps the page
   black-on-white.
3. The work is a typographic index, not a card grid; imagery appears only when
   the visitor points at a row, so attention is rewarded instead of assumed.
4. Vertical rhythm belongs to one `Section` primitive and nothing else is
   permitted to set its own top or bottom padding, which is why the page has a
   single cadence from top to bottom.
5. Exactly one orchestrated animation exists on the site — the hero's
   line-by-line mask reveal — and everything below it only ever fades, so motion
   stays a statement rather than a texture.

---

## Revisions

Each decision below was reviewed against one question: _would I have produced
this for any other developer portfolio?_ Where the answer was yes, it changed.

**R1 — Typeface: Inter → Instrument Sans, plus a mono metadata layer.** The first
pass used Inter for everything. Inter is the default UI grotesque of the last five
years; it is the typographic equivalent of not choosing. Worse, a single family
meant metadata and prose looked identical, so a year, a stack name, and a sentence
all carried the same weight on the page. Instrument Sans is narrower and has more
character in its terminals, and moving every specified value into IBM Plex Mono
created the datasheet read that the whole layout now depends on. The mono rail is
the site's structural idea, and it came out of rejecting Inter.

**R2 — Work presentation: a three-up card grid → a typographic index with
pointer-summoned imagery.** The first pass was a responsive grid of six cards,
each with a cover, a title, and three tags. This is the single most common layout
on the internet and it has a real cost beyond looking generic: six thumbnails
compete with each other, so none of them is read, and the project _names_ — which
is what a founder actually scans for — shrink to fit the card. Rows give each
project a full-width line of type, put the outcome sentence where it can be read,
and let the cover appear only on intent. It also fixed an accessibility problem
the grid had: a card with an image link plus a title link plus tag links is four
tab stops per project, where a row is one.

**R3 — Primary button: accent fill → ink fill; accent demoted to line work.** The
first pass had a blue filled button, blue links, and blue section labels. Three
uses of one colour for three unrelated purposes is not a system, and a blue pill
button is the tell of a generated page. Restricting the accent to 1px-scale marks
— rules, underlines, the focus ring, the availability dot — made it mean one
thing: _this is a control, or this is the current position._ Filled controls
became `ink`-on-`canvas` inverted, which is both higher contrast (19.17:1) and
quieter.

**R4 — Caption size: 13px → 14px.** The mono rail looked more precise at 13px,
which is exactly the trap. 14px is the floor for the whole site, the rail
included, because the rail carries the information an international client most
needs to read on a phone: availability, time zone, year, stack.

---

## Forbidden-pattern check

Every item in section 3 of `process.txt`, confirmed absent from this plan: no
decorative gradient, no glassmorphism or blurred panel, no emoji as iconography,
no waving-hand hero, no proficiency bars or ratings, no coloured vendor logos
(all stack marks are monochrome), no stock photography, nothing centred as a
page-level default, no repeated identical soft-shadow cards, no tracked-out caps
eyebrow above every heading, no middle-dot meta strings as a pattern, no arrow
glued to every label, no decorative 01/02/03 on non-sequential content (the work
index is an ordered list and Process is an actual sequence — numbering appears
only there), no cream-and-terracotta, no near-black-and-acid-green.
