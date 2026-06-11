# Kovai Chekku — Coconut Oil Storefront

A small-batch coconut oil e-commerce site, built on Next.js 15 + Supabase.
Design language inspired by [cocoparadise.in](https://cocoparadise.in) — forest green and warm coconut cream, but reshaped around a traceable, vintage-style batch system.

## What's in v0 (this commit)

- ✅ Full design system: palette, typography, components, signature batch stamp
- ✅ Homepage with hero, product grid, 3-step process, promise band, footer
- ✅ Supabase schema with categories, products, variants, addresses, cart, orders, RLS policies, profile auto-creation trigger
- ✅ Supabase SSR client (browser + server + middleware) wired up
- ✅ Protected routes via middleware (`/account/*`, `/admin/*`)
- ✅ Phase-gated build plan for the rest (see `BUILD_PLAN.md`)

## What's still to build

Everything in `BUILD_PLAN.md` Phases 1–7: shop pages, cart, auth, checkout, account, admin, polish. The plan is structured for handing to Codex / Antigravity one phase at a time.

## Quickstart

```bash
# 1. Install
pnpm install   # or npm install

# 2. Create a Supabase project at supabase.com, then:
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Run the schema
# Open Supabase Studio → SQL Editor → paste contents of supabase/schema.sql → Run

# 4. Dev
pnpm dev
# → http://localhost:3000
```

After your first signup, promote yourself to admin:

```sql
update public.profiles set role='admin' where email='you@example.com';
```

## Design rationale

The reference site (cocoparadise.in) is a coconut restaurant, so I borrowed the *palette and feel* but not the layout vocabulary — restaurants and product brands have different jobs. The choices that aren't templated:

- **Batch stamps** as the recurring identity element (most coconut oil brands hide their press date; we lead with it)
- **Fraunces** instead of the usual wellness serif, with the SOFT and WONK axes dialed deliberately on the hero `<em>`
- **JetBrains Mono** for batch and ml specs — gives the "lab certified" feel without buying a real cert
- **Numbered process steps** kept because the press IS a real 3-day sequence; the numbers carry information, not decoration
- **No rounded-3xl, no big radii** — coconut oil bottles have soft, modest curves; the UI follows suit

## File map

```
app/
  layout.tsx          ← fonts, metadata
  page.tsx            ← homepage
  globals.css         ← tokens + component classes
components/
  site-header.tsx
  batch-stamp.tsx     ← the signature element
  product-card.tsx
lib/
  utils.ts
  supabase/
    client.ts         ← browser
    server.ts         ← RSC / server actions
    middleware.ts     ← session refresh
middleware.ts         ← runs updateSession on every request
supabase/
  schema.sql          ← full DDL + RLS + seeds
BUILD_PLAN.md         ← the rest of the work, phase-gated
```

## Brand-name placeholder

I used **Kovai Chekku** as a placeholder (Kovai = Coimbatore, Chekku = wooden press). Swap it across:
- `app/layout.tsx` (metadata)
- `components/site-header.tsx`
- `app/page.tsx` (footer)
- `supabase/schema.sql` (the `order_no` prefix `KC-YYMM-XXXXX` if you want a different prefix)
