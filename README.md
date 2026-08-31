# Ray Swan — Portfolio v2

Production-grade portfolio for **Ray Swan — AI/ML System Architect** (Houston, TX).

Rebuilt from the Grok App Builder workspace — fully decoupled from Grok. No preview harness, no PGLite/auth middleware, no `public/__grok`.

## Stack

- **TanStack Start** (React 19 + TanStack Router + Vite 8)
- **Tailwind v4** (`@tailwindcss/vite`)
- **Nitro `vercel` preset** for SSR
- Static data in `src/data/{site,projects}.ts`

## Routes

| Path | What it renders |
|---|---|
| `/` | HomeStage — 120s scrolly stage (Position → Contrast → Arc → Proof) |
| `/work` | Systems grid (6 pins) |
| `/work/$slug` | Case study (Problem → Built → Decisions → Architecture → Surfaces → Standing) |
| `/principles`, `/principles/$cap` | Pillars (Platform / Governance / Generative / Product) |
| `/resume` | ResumeStage |
| `/contact` | ContactStage |

## Catalog

`CATALOG_SLUGS` in `src/data/projects.ts`:

`kitchen-kontrol`, `neuronote`, `tokyo-eye`, `canon-forge`, `ai-ml-ops-factory`, `ai-ml-engineer-academy`

## Develop

```bash
npm install
npm run dev        # http://localhost:8080
npm run typecheck
npm run build      # → .vercel/output
npm run preview
```

## Animations

`src/styles.css` owns the HomeStage timeline:

- `.home-stage.is-loading` → `opacity:0` until first `requestAnimationFrame`
- `.home-stage.is-mounted .initial-rise` → `rise 0.7s cubic-bezier(0.16,1,0.3,1)` staggered `0.06 / 0.16 / 0.28 / 0.42s`
- `.scene-identity` enters at `0.6%` of the `120s` loop (~0.7s) — not `3.3%` — so first paint is immediate.
- `.stage-cta` fades by `1.5%` (~1.8s), not `10%`.
- `prefers-reduced-motion` collapses to static stacked scenes.

## Deploy

Vercel picks up the `vercel` Nitro preset. No `DATABASE_URL` or `VITE_AUTH_ENABLED` needed — this is a static portfolio (auth/data layer removed).
