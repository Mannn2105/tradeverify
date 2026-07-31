# On the Books

A landing page for a municipal-style trades registry: local trade businesses
(electricians, plumbers, HVAC, mobile groomers) get free scheduling software in
exchange for real verification, and verified pros get connected with customers.

Design direction: *trust made visible*. Less sleek SaaS, more the boring,
reliable infrastructure that quietly runs your town — municipal ledger meets
modern craft trade.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, static output)
- TypeScript
- Tailwind CSS v4
- `next/font`: Zilla Slab (headlines), Archivo (body), IBM Plex Mono (ledger data)

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Design system

- **Palette** — deep forestry green + rust orange on warm ledger paper, with a
  single mustard accent reserved for CTAs and verification badges.
- **Type** — slab serif headlines read as "official record"; plain, high
  legibility sans for body; monospace for license numbers, timestamps, and
  statistics.
- **Motion** — one orchestrated load: verification badges "stamp" into place
  (scale + fade + rotation settle), plus a live ticking counter of verified
  pros. `prefers-reduced-motion` disables animation.
- **Texture** — blueprint grid-paper and halftone dot layers evoke inspection
  paperwork, implemented as CSS gradients.
- **Layout** — ledger/table-first hero with a horizontally scrolling "just
  verified" trust ticker up top.

## Structure

```
src/
  app/            layout, metadata, landing page assembly
  components/     ticker, header, hero, ledger table, sections, footer
  hooks/          count-up animation hook
  lib/            registry data (verified pros, stats)
```
