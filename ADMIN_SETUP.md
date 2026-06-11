# Admin / Content Manager — Setup

The site now has a self-service admin at **`/admin`** where you can create and
edit products, write journal logs, and update your store settings. Everything
you change there shows up on the live site immediately (home, shop, journal,
story, contact).

No new npm packages were added — it uses the Supabase client that was already
in the project.

## 1. Run the database changes

Open **Supabase Studio → SQL Editor**, paste the full contents of
`supabase/schema.sql`, and run it. It is safe to re-run: the new section
(`ADMIN CMS ADDITIONS`) only *adds* things. It will:

- add display columns to `products` (`starting_from_inr`, `rating`,
  `benefits`, `hue_a`, `hue_b`),
- create the `journal_entries` table,
- create a single-row `site_settings` table,
- seed the four products, three journal logs, and one settings row,
- apply row-level security so only admins can write.

## 2. Set your environment keys

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

(The admin uses cookie-based login + RLS — no service-role key is required.)

## 3. Create your admin account

1. The admin login lives at **`/login`**. To sign in you first need a Supabase
   auth user. Create one in **Supabase Studio → Authentication → Users → Add
   user** (set an email + password), or sign up through any auth flow you wire
   later.
2. Promote that user to admin by running this once in the SQL Editor:

   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```

3. Go to `/login`, sign in, and you'll land on `/admin`. A signed-in user who
   is **not** an admin sees a "Not authorised" screen instead.

## 4. Using the admin

| Section | What it controls on the site |
| --- | --- |
| **Products** (`/admin/products`) | The cards on the home page and `/shop`. Each product has name, slug, variant label, category, tagline, description, key benefits, batch number, pressed date, starting price, rating, bottle gradient colours, sort order, and an active toggle. |
| **Journal** (`/admin/journal`) | The logs on `/journal` and each `/journal/<slug>` page. Drafts (unpublished) stay hidden from the public. |
| **Settings** (`/admin/settings`) | The **WhatsApp ordering number** (powers every "Order" button), contact phone/email/hours, and the legal/GST details shown on `/story` and `/contact`. |

## How it stays safe

- Routes under `/admin` are gated by the middleware (must be logged in) **and**
  by a role check in the admin layout (must be `role = 'admin'`).
- All writes go through Postgres Row-Level Security: the `*_admin_write`
  policies only allow changes when `is_admin()` is true, so the catalog can't
  be modified even if someone bypassed the UI.

## Notes

- The storefront falls back to built-in demo content if the database isn't
  reachable yet, so the public pages never render blank during setup.
- This admin was authored without a local build run in the editor sandbox —
  after pulling it, run `npm install` (no new deps, but to be safe) then
  `npm run dev` and visit `/login`.
