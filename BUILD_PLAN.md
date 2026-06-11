# Kovai Chekku — Build Plan

> Phase-gated execution plan for Antigravity / Codex agents.
> **Rule:** finish one phase, run it, confirm acceptance criteria with the human, then move on. No skipping ahead.

---

## Stack of record

- **Framework:** Next.js 15 (App Router, RSC-first, TypeScript)
- **Styling:** Tailwind CSS 3.4 with custom design tokens (see `tailwind.config.ts`)
- **Backend:** Supabase (Postgres + Auth + Storage + RLS)
- **Payments:** Razorpay (UPI/cards) — wired in Phase 4
- **State:** Server components for reads; Server Actions for mutations; Zustand only for transient client state (cart drawer open/close, etc.)
- **No shadcn for now** — components are hand-rolled to keep the artisanal feel. Add shadcn primitives later only if friction shows up.

---

## Design system (already locked)

**Palette** (from `tailwind.config.ts`):
- `leaf` `#336633` — coconut palm, primary brand
- `leaf-deep` `#1F4023` — footer, dark surfaces
- `kernel` `#FAF6EC` — page background
- `oil` `#D4A24C` — primary CTA, accent
- `shell` `#3D2817` — secondary text, secondary accent
- `ink` `#1F2A1F` — body text

**Type:**
- Display: Fraunces (variable, use SOFT / opsz / WONK axes intentionally)
- Body: Manrope
- Mono: JetBrains Mono — reserved for batch numbers, ml specs, eyebrows

**Signature element:** the `<BatchStamp />` component. It MUST appear on:
- Hero (current batch)
- Every product card
- Every product detail page (the batch the customer is about to buy)
- Order confirmation
- Footer

Do not invent new decorative motifs. Spend the boldness on the batch stamp.

**Spacing:** sections at `py-20 lg:py-24` minimum. Hero gets `py-28 lg:py-32`.

**Borders:** use the `.hairline` utility (`border-shell/15`). No rounded-3xl, no big radii.

---

## Phase 0 — Foundation ✅ DONE

Already in repo:
- `app/layout.tsx`, `app/globals.css`, `app/page.tsx` (homepage)
- `components/site-header.tsx`, `components/batch-stamp.tsx`, `components/product-card.tsx`
- `lib/supabase/{client,server,middleware}.ts`, `middleware.ts`
- `tailwind.config.ts`, `postcss.config.mjs`, `next.config.ts`, `tsconfig.json`
- `supabase/schema.sql` (full DDL + RLS + seed categories)

**Before Phase 1, the human must:**
1. `pnpm install` (or `npm install`)
2. Create a Supabase project, copy URL + anon key into `.env.local`
3. Run `supabase/schema.sql` in the Supabase SQL editor
4. Manually mark one user as `admin` after first signup:
   ```sql
   update public.profiles set role='admin' where email='you@example.com';
   ```
5. Confirm `pnpm dev` renders the homepage on `localhost:3000`

---

## Phase 1 — Shop pages

**Goal:** Customers can browse all products and view product detail with variant selection.

**Files to create:**
- `app/shop/page.tsx` — product index (server component, fetches from Supabase)
- `app/shop/[slug]/page.tsx` — product detail (server component)
- `components/variant-selector.tsx` — client component, holds selected variant + qty
- `components/add-to-cart-button.tsx` — client component, calls server action
- `app/actions/cart.ts` — server actions: `addToCart`, `updateQty`, `removeFromCart`

**Acceptance:**
- `/shop` lists all `is_active=true` products grouped by category, each with `<ProductCard>` and `<BatchStamp>`.
- `/shop/[slug]` shows hero image, name, batch stamp, description, variant selector (250ml / 500ml / 1L radio chips), qty stepper, "Add to bag" CTA.
- Out-of-stock variants are visually disabled, not hidden.
- Page meta: `<title>` is `${product.name} · Kovai Chekku`, OG image uses `hero_image`.
- Mobile: variant chips wrap, sticky bottom CTA bar.

**Don't:**
- Don't add a "related products" carousel yet. One thing at a time.
- Don't introduce framer-motion. Hover transitions only via Tailwind's `transition-colors`.

---

## Phase 2 — Cart

**Goal:** Server-backed cart that survives sessions for logged-in users.

**Files:**
- `app/cart/page.tsx` — full cart page (server component reads `cart_items` joined with `product_variants` and `products`)
- `components/cart-line.tsx` — single line item with qty stepper + remove
- `components/cart-summary.tsx` — subtotal, shipping placeholder, total
- `components/cart-drawer.tsx` — slide-over from header (client, controlled by zustand)
- `lib/cart-store.ts` — zustand store (open state ONLY — data lives on server)
- Update `components/site-header.tsx` to show item count badge

**Acceptance:**
- Add to cart from product page inserts to `cart_items` and shows a toast + opens drawer.
- Cart page lets user adjust qty (with optimistic UI) and remove items.
- If a variant becomes inactive or out of stock, show an inline warning on the line.
- Unauthenticated users are redirected to `/login?next=/cart` when trying to add — DO NOT build guest cart yet.

---

## Phase 3 — Auth

**Goal:** Email + password signup/login, password reset.

**Files:**
- `app/login/page.tsx`, `app/signup/page.tsx`, `app/forgot-password/page.tsx`, `app/reset-password/page.tsx`
- `app/auth/callback/route.ts` — Supabase auth code exchange
- `components/auth-form.tsx` — shared form shell

**Acceptance:**
- Signup creates a profile row automatically (trigger already in schema).
- Login redirects to `?next=` param if present, else `/account`.
- Forgot password sends Supabase magic link.
- Auth pages reuse the design system — Fraunces heading, Manrope inputs, oil-coloured submit button.
- Errors surface inline below the field that caused them (Supabase error → human message map).

**Skip for now:** social login (Google etc.). Add after Phase 7 if asked.

---

## Phase 4 — Checkout + Razorpay

**Goal:** Complete an order end-to-end.

**Files:**
- `app/checkout/page.tsx` — address selection + Razorpay button
- `app/checkout/success/page.tsx` — order confirmation
- `components/address-form.tsx`, `components/address-card.tsx`
- `app/actions/checkout.ts` — `createOrder` server action (snapshots cart → orders + order_items, returns `razorpay_order_id`)
- `app/api/razorpay/verify/route.ts` — verifies signature, updates order to `paid`
- `lib/razorpay.ts` — server-side Razorpay SDK wrapper

**Acceptance:**
- User picks a saved address or creates a new one.
- `createOrder` runs in a single transaction: insert order → insert order_items (snapshotting product name, variant, batch, price) → return Razorpay order.
- Successful payment marks order `paid` and clears `cart_items` for that user.
- Confirmation page shows order number `KC-YYMM-XXXXX`, items with batch stamps, ship address, total.
- Failure path: order stays `pending`, customer gets retry option.

**Critical:** signature verification on the server. Never trust the client's payment_id.

---

## Phase 5 — Account

**Goal:** Customer sees their orders and manages addresses.

**Files:**
- `app/account/page.tsx` — overview
- `app/account/orders/page.tsx`, `app/account/orders/[id]/page.tsx`
- `app/account/addresses/page.tsx`
- `app/account/layout.tsx` — sidebar nav

**Acceptance:**
- Orders list shows order_no, date, status pill (colour-coded), total.
- Order detail shows full snapshot — including the batch numbers that shipped, so the customer can verify against the bottle.
- Address CRUD with "set as default" toggle.

---

## Phase 6 — Admin panel

**Goal:** Admin can add products and process orders.

**Files:**
- `app/admin/layout.tsx` — gated by `profile.role = 'admin'`, separate visual treatment (denser, more utility-like — break from the artisanal frontend)
- `app/admin/products/page.tsx`, `app/admin/products/new/page.tsx`, `app/admin/products/[id]/edit/page.tsx`
- `app/admin/orders/page.tsx`, `app/admin/orders/[id]/page.tsx`
- `app/admin/categories/page.tsx`
- `components/admin/*` — tables, forms, status updaters
- Supabase storage bucket `product-images` (public read, admin write)

**Acceptance:**
- Admin can create a product with multiple variants and upload hero + gallery images.
- Admin can advance order status: `pending → paid → packed → shipped → delivered`.
- Admin sees stock and gets a soft warning when a variant drops below 5 units.
- All RLS-enforced — a non-admin hitting `/admin/*` is redirected to `/login` (middleware already does this).

---

## Phase 7 — Polish

- Real product photography (replace gradient placeholders in `<ProductCard>`)
- `/story`, `/journal`, `/contact` pages
- SEO: per-page metadata, sitemap.xml, robots.txt, JSON-LD Product schema
- 404 and error pages in brand voice
- Loading skeletons (use `kernel-deeper` shimmer, not the generic gray)
- Lighthouse pass (target ≥95 perf, ≥100 a11y)
- Newsletter signup → Supabase table or Resend audience

---

## Conventions for the agent

1. **No fake data in commits.** If you add demo content, gate it behind `process.env.NODE_ENV === 'development'`.
2. **Server-first.** Use Server Components and Server Actions by default. Client components only when you need state, effects, or browser APIs.
3. **No client-side Supabase calls** for reads that can run on the server.
4. **Type from the DB.** Run `supabase gen types typescript` and commit `lib/database.types.ts`. Import `Database` everywhere.
5. **Money is always INR, always `numeric(10,2)` server-side, always rendered as `₹{n.toLocaleString('en-IN')}`.**
6. **Batch stamps are sacred.** Never hide them to "clean up" a layout.
7. **One commit per phase.** Conventional commits, scoped by phase: `feat(phase-1): shop pages`.

---

## Open questions to confirm with the human before starting Phase 4

- Razorpay account ready? (If not, ship Phase 1–3 first, then COD-only Phase 4, then add Razorpay.)
- Shipping logic: flat rate, free above ₹X, or zone-based by pincode?
- GST treatment: inclusive or exclusive on listed prices?
- Returns policy: 7-day, sealed-only?
