# Arman Rahman Rafi — Portfolio

Personal site and case-study archive for Arman Rahman Rafi, a full-stack web
developer based in Khulna, Bangladesh.

The site exists to do one thing: let a founder or agency owner decide, in under
a minute, whether to trust one person with a whole build — schema, application,
server, and measurement — and then verify that decision against six real case
studies.

## Stack

| Concern    | Choice                                        |
| ---------- | --------------------------------------------- |
| Framework  | Next.js 16 (App Router), React 19             |
| Language   | TypeScript, `strict` + `noUncheckedIndexedAccess` |
| Styling    | Tailwind CSS v4, tokens declared in `@theme`  |
| Motion     | Framer Motion, one shared variant vocabulary  |
| Scroll     | Lenis, disabled under `prefers-reduced-motion` |
| Fonts      | `next/font`, self-hosted and subset           |
| Content    | Typed modules under `content/` — no CMS       |
| Mail       | Server action + Resend                        |

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

Node version is pinned in `.nvmrc`.

### Before every commit

```bash
npm run gate         # lint && typecheck && build
```

`npm run format` applies Prettier, including Tailwind class ordering.

## Repository map

```
app/                  routes, layouts, and route-level states
  styleguide/         dev-only token and type specimen
components/           UI, grouped by role
content/              typed content modules — the only place copy lives
lib/                  motion vocabulary, utilities, server actions
public/work/<slug>/   per-project imagery
```

## Adding a project

1. Drop imagery in `public/work/<slug>/` — a `cover.*` plus gallery frames.
2. Append a `Project` object to `content/projects.ts`. The type in
   `content/types.ts` is the contract; every field is required unless its name
   ends in `?`, so `npm run typecheck` will tell you what is missing.
3. Order matters. The array order is the display order on the homepage index,
   strongest work first.
4. Write the case study as prose, not bullets-in-disguise. `architectureNotes`
   is the section that earns the work: each entry names a real trade-off and
   which side was chosen.
5. Run the gate. The route is generated statically from the array, so no route
   file needs to be touched.

## Documentation

| File                 | What it holds                                    |
| -------------------- | ------------------------------------------------ |
| `DESIGN.md`          | Palette, type scale, grid, layout concept        |
| `ACCESSIBILITY.md`   | What was tested, how, and what was fixed        |
| `PERFORMANCE.md`     | Lighthouse results and the budget               |
| `ANALYTICS.md`       | Event schema — doubles as a work sample         |
| `DEPLOY.md`          | Vercel path plus the self-hosted Ubuntu path    |
| `OPEN-QUESTIONS.md`  | Everything still waiting on Arman's input       |
