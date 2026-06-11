-- ============================================================================
-- Thennaiyan Coconut Company (Coconet) — Coconut Oil Storefront Schema
-- For Supabase Postgres. Run in order. Idempotent where possible.
-- ============================================================================

-- ── EXTENSIONS ──────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ── ENUMS ───────────────────────────────────────────────────────────────────
do $$ begin
  create type user_role as enum ('customer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum (
    'pending',      -- created, awaiting payment
    'paid',         -- payment confirmed
    'packed',       -- packed for dispatch
    'shipped',      -- handed to courier
    'delivered',    -- delivered to customer
    'cancelled',    -- cancelled before dispatch
    'refunded'      -- money returned
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');
exception when duplicate_object then null; end $$;

-- ── PROFILES (extends auth.users) ───────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique,
  full_name   text,
  phone       text,
  role        user_role not null default 'customer',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── CATEGORIES ──────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);

-- ── PRODUCTS ────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  variant_label text not null,            -- "Wood-pressed", "Cold-pressed", etc
  tagline       text not null,
  description   text,
  category_id   uuid references public.categories(id) on delete set null,
  batch_no      text not null,             -- e.g. "042"
  pressed_at    date not null,             -- batch press date
  origin        text not null default 'Madurai',
  hero_image    text,                      -- supabase storage URL
  is_active     boolean not null default true,
  position      int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_active_idx on public.products(is_active);

-- ── PRODUCT VARIANTS (250ml / 500ml / 1L) ──────────────────────────────────
create table if not exists public.product_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  size_label  text not null,               -- "250ml", "500ml", "1L"
  size_ml     int not null,                -- numeric for sorting
  price_inr   numeric(10,2) not null check (price_inr >= 0),
  stock       int not null default 0 check (stock >= 0),
  sku         text unique,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (product_id, size_label)
);

create index if not exists variants_product_idx on public.product_variants(product_id);

-- ── PRODUCT IMAGES (gallery) ────────────────────────────────────────────────
create table if not exists public.product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  url         text not null,
  alt         text,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists product_images_product_idx on public.product_images(product_id);

-- ── ADDRESSES ───────────────────────────────────────────────────────────────
create table if not exists public.addresses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  full_name   text not null,
  phone       text not null,
  line1       text not null,
  line2       text,
  city        text not null,
  state       text not null,
  pincode     text not null,
  country     text not null default 'India',
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists addresses_user_idx on public.addresses(user_id);

-- ── CART ITEMS (server-backed; survives session) ────────────────────────────
create table if not exists public.cart_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  variant_id  uuid not null references public.product_variants(id) on delete cascade,
  quantity    int not null check (quantity > 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, variant_id)
);

create index if not exists cart_user_idx on public.cart_items(user_id);

-- ── ORDERS ──────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),
  order_no            text unique not null default ('TCC-' || to_char(now(),'YYMM') || '-' || lpad((floor(random()*100000))::text, 5, '0')),
  user_id             uuid not null references auth.users(id) on delete restrict,
  status              order_status not null default 'pending',
  payment_status      payment_status not null default 'pending',
  payment_method      text,                       -- 'razorpay', 'cod', etc.
  payment_ref         text,                       -- razorpay_payment_id

  -- snapshotted at order time so address edits don't change history
  ship_full_name      text not null,
  ship_phone          text not null,
  ship_line1          text not null,
  ship_line2          text,
  ship_city           text not null,
  ship_state          text not null,
  ship_pincode        text not null,
  ship_country        text not null default 'India',

  subtotal_inr        numeric(10,2) not null check (subtotal_inr >= 0),
  shipping_inr        numeric(10,2) not null default 0 check (shipping_inr >= 0),
  total_inr           numeric(10,2) not null check (total_inr >= 0),

  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);

-- ── ORDER ITEMS (snapshotted product info) ──────────────────────────────────
create table if not exists public.order_items (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references public.orders(id) on delete cascade,
  product_id      uuid references public.products(id) on delete set null,
  variant_id      uuid references public.product_variants(id) on delete set null,
  product_name    text not null,
  variant_label   text not null,
  size_label      text not null,
  batch_no        text not null,
  unit_price_inr  numeric(10,2) not null check (unit_price_inr >= 0),
  quantity        int not null check (quantity > 0),
  subtotal_inr    numeric(10,2) not null check (subtotal_inr >= 0)
);

create index if not exists order_items_order_idx on public.order_items(order_id);

-- ── HELPER FUNCTION: is_admin() ─────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════════════════════

-- PROFILES ──────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

drop policy if exists "profiles_self_read" on public.profiles;
create policy "profiles_self_read" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- CATEGORIES ────────────────────────────────────────────────────────────────
alter table public.categories enable row level security;

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- PRODUCTS ──────────────────────────────────────────────────────────────────
alter table public.products enable row level security;

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (is_active = true or public.is_admin());

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- PRODUCT VARIANTS ──────────────────────────────────────────────────────────
alter table public.product_variants enable row level security;

drop policy if exists "variants_public_read" on public.product_variants;
create policy "variants_public_read" on public.product_variants
  for select using (is_active = true or public.is_admin());

drop policy if exists "variants_admin_write" on public.product_variants;
create policy "variants_admin_write" on public.product_variants
  for all using (public.is_admin()) with check (public.is_admin());

-- PRODUCT IMAGES ────────────────────────────────────────────────────────────
alter table public.product_images enable row level security;

drop policy if exists "images_public_read" on public.product_images;
create policy "images_public_read" on public.product_images
  for select using (true);

drop policy if exists "images_admin_write" on public.product_images;
create policy "images_admin_write" on public.product_images
  for all using (public.is_admin()) with check (public.is_admin());

-- ADDRESSES ─────────────────────────────────────────────────────────────────
alter table public.addresses enable row level security;

drop policy if exists "addresses_own" on public.addresses;
create policy "addresses_own" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- CART ──────────────────────────────────────────────────────────────────────
alter table public.cart_items enable row level security;

drop policy if exists "cart_own" on public.cart_items;
create policy "cart_own" on public.cart_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ORDERS ────────────────────────────────────────────────────────────────────
alter table public.orders enable row level security;

drop policy if exists "orders_own_read" on public.orders;
create policy "orders_own_read" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "orders_own_insert" on public.orders;
create policy "orders_own_insert" on public.orders
  for insert with check (auth.uid() = user_id);

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

-- ORDER ITEMS ───────────────────────────────────────────────────────────────
alter table public.order_items enable row level security;

drop policy if exists "order_items_own_read" on public.order_items;
create policy "order_items_own_read" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "order_items_own_insert" on public.order_items;
create policy "order_items_own_insert" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

-- ── SEED DATA (matches the homepage demo cards) ─────────────────────────────
insert into public.categories (slug, name, description, position) values
  ('chekku',  'Chekku',      'Wood-pressed coconut oil',          1),
  ('virgin',  'Virgin',      'Cold-pressed virgin coconut oil',   2),
  ('hair',    'Hair & Beauty', 'Infused hair and beauty oils',    3),
  ('cooking', 'Cooking',     'Larger packs for the everyday kitchen', 4)
on conflict (slug) do nothing;
