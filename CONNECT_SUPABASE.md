# Connect Supabase & Go Live — Step by Step

This guide takes your site from "demo mode" to a **real, working store** backed by Supabase.
Follow the steps in order. Each one takes a few minutes.

---

## What was wrong (and what I fixed in the code)

Your site looked like it worked, but it was running in **demo / mock mode**. In that mode the
login was fake and nothing was actually saved to a database. That is the "Supabase connect pending"
problem.

I made these code fixes for you:

1. **Demo mode is now a switch.** A new setting `NEXT_PUBLIC_ENABLE_MOCK_AUTH` controls it.
   When it is `false` (the new default), every login and order uses your **real Supabase database**.
   The fake `admin@gmail.com / adminpassword` login and the fake OTP `123456` no longer work in
   production — which is what you want for a real store.
2. **Fixed a checkout-breaking bug.** The checkout code saves a coupon/discount on each order, but
   the database was missing those columns and the `coupons` tables. With the old schema, **every order
   would have failed.** I added the missing `coupons` and `coupon_uses` tables and the
   `coupon_id`, `coupon_code`, `discount_inr` columns to `orders`.
3. **Documented the new setting** in `.env.local` and `.env.local.example`.

You still need to do the steps below, because they happen **inside your Supabase account** (I can't
log in there for you).

---

## Step 1 — Put your REAL Supabase keys in `.env.local`  ⚠️ most important

> ⚠️ **The values currently in `.env.local` look like placeholders, not real keys.**
> A real Supabase URL looks like `https://abcdefghijklmnopqrst.supabase.co` (about 20 **lowercase**
> letters/numbers). Yours is `https://EgBVW76vl3OHxTon35hBjA.supabase.co`, which has capital letters —
> that is unusual for a real project. **If the keys are wrong, nothing will ever connect, no matter
> what else you do.** So please double-check them first.

1. Go to **https://supabase.com/dashboard** and open your project.
2. Click the gear icon → **Project Settings** → **API**.
3. Copy these two values exactly:
   - **Project URL** → paste into `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public** key (or **publishable** key) → paste into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Your `.env.local` should look like this (no quotes, no spaces around `=`):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-REAL-REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-REAL-ANON-OR-PUBLISHABLE-KEY
   SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY
   NEXT_PUBLIC_ENABLE_MOCK_AUTH=false
   ```

Notes:
- The **service role key** is *not used by this app*, so it is optional. If you keep it, never share
  it publicly. (`.env.local` is already ignored by git, so it won't be uploaded.)
- The **Razorpay** lines can stay empty — checkout currently uses Cash-on-Delivery + WhatsApp, and
  Razorpay is a future add-on.

---

## Step 2 — Create the database tables (run the schema)

1. In the Supabase dashboard, open **SQL Editor** (left sidebar).
2. Click **New query**.
3. Open the file `supabase/schema.sql` from this project, **copy ALL of it**, paste into the editor.
4. Click **Run**.

This creates every table (products, orders, customers, reviews, journal, settings, coupons, etc.),
sets the security rules, and adds the starting sample products. It is safe to run again later if
needed — it won't duplicate data.

You should see "Success. No rows returned." If you see an error, copy the red message and send it to me.

---

## Step 3 — Create the image storage bucket

The admin product page lets you upload product photos. Those go into a Supabase **Storage bucket**.

1. In the dashboard, open **Storage** → **Create a new bucket**.
2. Name it exactly: **`product-images`**
3. Turn **Public bucket** ON (so the photos show on your website).
4. Click **Create bucket**.

(If you skip this, image upload still "works" but saves the picture inside the database as text, which
is slower — so it's best to create the bucket.)

---

## Step 4 — Create your admin login

The fake admin login is now off, so you need a **real** admin account.

1. In the dashboard, open **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter an **email** and a **password** you'll remember. Tick "Auto Confirm User" if shown.
3. Click **Create user**.
4. Now make that user an admin. Open **SQL Editor**, paste this (change the email to the one you just
   used), and **Run**:

   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```

   This should report `UPDATE 1`. If it says `UPDATE 0`, the profile row hasn't been created yet —
   wait a few seconds and run it again, or sign in once first (the profile is created on first sign-in).

You will use this email + password at the **Admin** login box on the `/login` page.

---

## Step 5 — Customer login (phone OTP) — choose one

Your customer login sends a one-time code (OTP) by SMS. **SMS only works after you connect an SMS
provider in Supabase.** You have two choices:

**Option A — Turn on real SMS (for going fully live):**
1. Dashboard → **Authentication** → **Providers** → enable **Phone**.
2. Connect an SMS provider (e.g. Twilio, MessageBird, Vonage) and fill in their keys.
3. Now customers get a real code on their phone.

**Option B — Test without SMS for now:**
- Set `NEXT_PUBLIC_ENABLE_MOCK_AUTH=true` in `.env.local` *temporarily*. Then the demo OTP `123456`
  logs in a test customer so you can click through orders. **Switch it back to `false` before real
  customers use the site**, or their logins will be fake and their orders won't be saved.

> Tip: if you don't want to deal with SMS at all, tell me and I can switch customer login to
> email + password (same as admin), which needs no SMS provider.

---

## Step 6 — Restart and test locally

1. Stop the dev server if it's running.
2. If you ever saw the build error about `next-font-manifest.json`, delete the `.next` folder first
   (it's just a cache). Then:

   ```bash
   npm install
   npm run dev
   ```

3. Open **http://127.0.0.1:3001** and test this checklist:
   - [ ] Home page shows the products from Step 2.
   - [ ] Go to `/login`, use your **admin** email/password → you land on `/admin`.
   - [ ] In `/admin/products`, edit a product and save → the change shows on the home page.
   - [ ] (If SMS or demo mode on) log in as a customer, add to cart, checkout → an order appears in
         Supabase → **Table Editor** → `orders`, and WhatsApp opens with the order message.

If any step fails, copy the on-screen error (or the red error in the browser console) and send it to me.

---

## Step 7 — Make it live on Vercel

Your project is already linked to Vercel (there's a `.vercel` folder). The important part people forget:
**environment variables must be added in Vercel too** — `.env.local` only works on your computer.

1. Go to **https://vercel.com** → your project → **Settings** → **Environment Variables**.
2. Add the same four values from Step 1:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (optional)
   - `NEXT_PUBLIC_ENABLE_MOCK_AUTH` = `false`
3. Redeploy (push to git, or click **Redeploy**).

---

## Quick reference: the demo switch

| `NEXT_PUBLIC_ENABLE_MOCK_AUTH` | Behaviour |
| --- | --- |
| `false` (or not set) | **Live mode.** Real Supabase login + real database. Use this for customers. |
| `true` | **Demo mode.** Fake admin `admin@gmail.com / adminpassword` and OTP `123456` work, but nothing is saved to the database. For local testing only. |

---

## Optional improvements (not required to go live)

- **Longer-lasting logins.** The middleware checks for a login cookie but doesn't refresh the Supabase
  session, so a logged-in user may be asked to log in again after about an hour. I can upgrade the
  middleware to refresh sessions automatically if you'd like.
- **Rotate the service-role key.** If that secret was ever shared or pasted somewhere public, create a
  new one in Project Settings → API.

---

### Need a hand?
If you hit any error during these steps, copy the exact message and send it to me — I'll tell you the
fix. The most common cause of "still not connecting" is a wrong value in Step 1, so check that first.
