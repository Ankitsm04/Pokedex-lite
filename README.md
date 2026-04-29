# Pokédex Lite

> A modern Pokémon explorer built with Next.js, TypeScript & Tailwind CSS

---

## Live Demo

[Live Site](https://pokedex-lite-gray.vercel.app/) • [GitHub Repo](https://github.com/Ankitsm04/Pokedex-lite)

---

## Features

- **Browse Pokémon** — paginated grid with name, number, image, and type badges
- **Search** — instant name search, resets pagination automatically
- **Filter by Type** — all 18 Pokémon types; fetches type-specific lists from the API
- **Favorites** — star any Pokémon; persisted to `localStorage` across sessions
- **Detail Modal** — stats, abilities, height, weight, type-colored glow; close with Escape
- **Pagination** — numbered page controls, 20 Pokémon per page
- **Dark Theme** — deep dark background with soft contrast text and blue accent
- **Fully Responsive** — 2 cols on mobile → 5 cols on desktop
- **Animations** — card fade-up on load, hover lift + glow, modal scale-in

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSR support, file-based routing, React 19 |
| Language | TypeScript | Type safety, better DX, fewer runtime bugs |
| Styling | Tailwind CSS v4 | CSS-first config, no tailwind.config.ts needed |
| Fonts | Syne + DM Mono | Distinctive, non-generic typography |
| Data | PokéAPI | Free public REST API, no auth needed |
| Persistence | localStorage | Lightweight favorites storage across sessions |
| Deployment | Vercel | Native Next.js support, instant deploys |

---

## Project Structure

```
src/
  app/
    layout.tsx          — Root layout: fonts, metadata
    globals.css         — Tailwind v4 import, @theme tokens, keyframes
    page.tsx            — Entry point; renders <Pokedex />
  components/
    Pokedex.tsx         — Main component: state, fetching, layout
    PokemonCard.tsx     — Card with type-colored glow hover effect
    PokemonModal.tsx    — Detail modal: stats, abilities, favorites
    TypeBadge.tsx       — Reusable type pill with per-type color
  lib/
    typeColors.ts       — Type → Tailwind bg/text/glow color mapping
postcss.config.mjs      — @tailwindcss/postcss plugin (v4 setup)
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm / yarn / pnpm

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/Ankitsm04/pokedex-lite.git
cd pokedex-lite

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open in browser
http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## Tailwind v4 Setup

This project uses **Tailwind CSS v4** which is CSS-first — no `tailwind.config.ts` required.

All design tokens are defined in `globals.css` using `@theme`:

```css
@import "tailwindcss";

@theme {
  --color-accent-blue: #60a5fa;
  --color-surface-card: #111827;
  /* ... */
}
```

Custom tokens are used in components via the `(--token)` syntax:

```tsx
className="bg-(--color-surface-card) text-(--color-text-primary)"
```

---

## Deployment

Deployed on **Vercel** — zero config for Next.js:

1. Push code to a public GitHub repository
2. Go to [vercel.com](https://vercel.com) → Import your repo
3. Vercel auto-detects Next.js → click **Deploy**
4. Live URL ready in ~60 seconds

> No environment variables required — only the public PokéAPI is used.

---

## API Reference

All data from [PokéAPI](https://pokeapi.co) — free, public, no auth.

| Endpoint | Used For |
|---|---|
| `GET /api/v2/pokemon?limit=1000` | Full name list for search + pagination |
| `GET /api/v2/pokemon/{id}` | Card details: image, types, stats, abilities |
| `GET /api/v2/type` | Type list for filter dropdown |
| `GET /api/v2/type/{type}` | Pokémon names belonging to a type |

---

## Challenges & Solutions

### 1. Fetching 1000+ Pokémon without freezing the UI

**Problem:** The list endpoint returns only names and URLs — no images or types. Fetching all 1000 details at once would flood the network.

**Solution:** Fetch the full name list once (for search/filter), but only request details for the current page of 20. An in-memory JS object caches results by URL so revisited pages load instantly.

---

### 2. Type filtering + pagination together

**Problem:** Filtering by type changes the total item count, which breaks page numbers.

**Solution:** When a type is selected, fetch the type endpoint to get the filtered name list, store it in `filtered` state, then slice it for the current page. Page resets to 1 on every filter or search change.

---

### 3. Favorites surviving page refresh

**Problem:** React state resets on every reload.

**Solution:** On mount, favorites are read from `localStorage`. Every toggle writes back immediately. Card and modal both reflect the same `favorites[]` array from a single source of truth in the parent.

---

### 4. Dynamic type glow colors without Tailwind JIT issues

**Problem:** Each Pokémon type needs a different glow color on hover. Tailwind can't generate dynamic class names at runtime.

**Solution:** Glow hex values are stored in `typeColors.ts`. The shadow is applied via inline `style={{ boxShadow }}` in JS on `mouseenter`/`mouseleave`, while badge colors use pre-defined static Tailwind classes.

---

### 5. Tailwind v4 migration

**Problem:** Most tutorials use Tailwind v3 config syntax which doesn't work in v4.

**Solution:** Moved all design tokens into `globals.css` under `@theme {}`. Custom token classes use the `(--token-name)` syntax (e.g. `bg-(--color-surface-card)`).

---

## Bonus Features Implemented

- [x] **Animations** — `fadeUp`, `modalIn`, `spin` keyframes; hover scale on card image
- [x] **SSR-ready** — built on Next.js App Router with server component structure
- [ ] OAuth login — not implemented (time constraint)

---

## Author

Built for the **Deepsolv Frontend Engineer** selection process.

---

*Made with Next.js • PokéAPI • Tailwind CSS v4*
