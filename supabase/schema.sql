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
    'processing',   -- admin accepted / preparing order
    'packed',       -- packed for dispatch
    'shipped',      -- handed to courier
    'delivered',    -- delivered to customer
    'cancelled',    -- cancelled before dispatch
    'refunded'      -- money returned
  );
exception when duplicate_object then null; end $$;

alter type order_status add value if not exists 'processing' after 'paid';

do $$ begin
  create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type analytics_event_type as enum (
    'website_visit',
    'product_view',
    'cart_click',
    'whatsapp_lead',
    'order_created',
    'order_delivered'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type whatsapp_lead_status as enum (
    'new',
    'contacted',
    'converted',
    'closed'
  );
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

create unique index if not exists profiles_phone_unique_idx
  on public.profiles(phone)
  where phone is not null;

-- Auto-create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.phone, new.raw_user_meta_data->>'phone')
  )
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
  order_no            text unique not null default ('KC-' || to_char(now(),'YYMM') || '-' || lpad((floor(random()*100000))::text, 5, '0')),
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

-- ORDER STATUS HISTORY (drives customer tracking + real-time updates)
create table if not exists public.order_status_events (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  status      order_status not null,
  note        text,
  changed_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

create index if not exists order_status_events_order_idx
  on public.order_status_events(order_id, created_at desc);

-- WHATSAPP LEADS (created when customer taps Order / WhatsApp)
create table if not exists public.whatsapp_leads (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete set null,
  order_id       uuid references public.orders(id) on delete set null,
  product_id     uuid references public.products(id) on delete set null,
  customer_name  text,
  phone          text not null,
  message        text not null,
  status         whatsapp_lead_status not null default 'new',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists whatsapp_leads_status_idx
  on public.whatsapp_leads(status, created_at desc);

create index if not exists whatsapp_leads_user_idx
  on public.whatsapp_leads(user_id, created_at desc);

-- PRODUCT REVIEWS (customer rating + admin moderation)
create table if not exists public.product_reviews (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid not null references public.products(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  order_id        uuid references public.orders(id) on delete set null,
  rating          int not null check (rating between 1 and 5),
  title           text,
  body            text,
  is_approved     boolean not null default false,
  admin_response  text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (product_id, user_id, order_id)
);

create index if not exists product_reviews_product_idx
  on public.product_reviews(product_id, is_approved, created_at desc);

-- ANALYTICS EVENTS (admin dashboard counters)
create table if not exists public.analytics_events (
  id          uuid primary key default gen_random_uuid(),
  event_type  analytics_event_type not null,
  user_id     uuid references auth.users(id) on delete set null,
  session_id  text,
  product_id  uuid references public.products(id) on delete set null,
  order_id    uuid references public.orders(id) on delete set null,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists analytics_events_type_created_idx
  on public.analytics_events(event_type, created_at desc);

create index if not exists analytics_events_product_idx
  on public.analytics_events(product_id, created_at desc)
  where product_id is not null;

alter table public.orders replica identity full;
alter table public.order_status_events replica identity full;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'orders'
    ) then
      execute 'alter publication supabase_realtime add table public.orders';
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'order_status_events'
    ) then
      execute 'alter publication supabase_realtime add table public.order_status_events';
    end if;
  end if;
end $$;

-- ── HELPER FUNCTION: is_admin() ─────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.log_order_status_event()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.order_status_events (order_id, status, note, changed_by)
    values (new.id, new.status, 'Order created', auth.uid());
  elsif old.status is distinct from new.status then
    insert into public.order_status_events (order_id, status, note, changed_by)
    values (new.id, new.status, 'Status updated', auth.uid());
  end if;

  return new;
end;
$$;

drop trigger if exists orders_status_event_insert on public.orders;
create trigger orders_status_event_insert
  after insert on public.orders
  for each row execute function public.log_order_status_event();

drop trigger if exists orders_status_event_update on public.orders;
create trigger orders_status_event_update
  after update of status on public.orders
  for each row execute function public.log_order_status_event();

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

-- ORDER STATUS EVENTS
alter table public.order_status_events enable row level security;

drop policy if exists "order_status_events_own_read" on public.order_status_events;
create policy "order_status_events_own_read" on public.order_status_events
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "order_status_events_admin_insert" on public.order_status_events;
create policy "order_status_events_admin_insert" on public.order_status_events
  for insert with check (public.is_admin());

-- WHATSAPP LEADS
alter table public.whatsapp_leads enable row level security;

drop policy if exists "whatsapp_leads_own_read" on public.whatsapp_leads;
create policy "whatsapp_leads_own_read" on public.whatsapp_leads
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "whatsapp_leads_own_insert" on public.whatsapp_leads;
create policy "whatsapp_leads_own_insert" on public.whatsapp_leads
  for insert with check (user_id = auth.uid() and status = 'new');

drop policy if exists "whatsapp_leads_admin_update" on public.whatsapp_leads;
create policy "whatsapp_leads_admin_update" on public.whatsapp_leads
  for update using (public.is_admin()) with check (public.is_admin());

-- PRODUCT REVIEWS
alter table public.product_reviews enable row level security;

drop policy if exists "product_reviews_public_approved_read" on public.product_reviews;
create policy "product_reviews_public_approved_read" on public.product_reviews
  for select using (is_approved = true or user_id = auth.uid() or public.is_admin());

drop policy if exists "product_reviews_customer_insert" on public.product_reviews;
create policy "product_reviews_customer_insert" on public.product_reviews
  for insert with check (
    user_id = auth.uid()
    and is_approved = false
    and admin_response is null
  );

drop policy if exists "product_reviews_admin_manage" on public.product_reviews;
create policy "product_reviews_admin_manage" on public.product_reviews
  for all using (public.is_admin()) with check (public.is_admin());

-- ANALYTICS EVENTS
alter table public.analytics_events enable row level security;

drop policy if exists "analytics_events_public_insert" on public.analytics_events;
create policy "analytics_events_public_insert" on public.analytics_events
  for insert with check (true);

drop policy if exists "analytics_events_admin_read" on public.analytics_events;
create policy "analytics_events_admin_read" on public.analytics_events
  for select using (public.is_admin());

-- ── SEED DATA (matches the homepage demo cards) ─────────────────────────────
insert into public.categories (slug, name, description, position) values
  ('brownies',  'BROWNIES',      'Delicious freshly baked brownies', 1),
  ('birthday-cakes',  'Birthday Cakes',      'Artisan custom cakes', 2),
  ('cold-beverages',  'COLD BEVERAGES',      'Refreshing cold drinks', 3),
  ('special-desserts',  'Coco Paradise Special Desserts',      'Signature specials', 4),
  ('dessert',  'Dessert',      'Gourmet sweet treats', 5),
  ('hot-serves',  'Hot Serves',      'Hot beverages and foods', 6),
  ('main-course',  'Main Course',      'Savory food selections', 7),
  ('make-it-a-meal',  'Make It A Meal',      'Meal packages', 8)
on conflict (slug) do nothing;

-- ════════════════════════════════════════════════════════════════════════════
-- ADMIN CMS ADDITIONS
-- Display fields on products, a journal table, and a singleton site-settings
-- row so the owner can manage all storefront content from /admin.
-- Safe to re-run: every statement is idempotent.
-- ════════════════════════════════════════════════════════════════════════════

-- ── PRODUCTS: extra display columns used by the storefront cards ─────────────
alter table public.products
  add column if not exists starting_from_inr numeric(10,2) not null default 0,
  add column if not exists rating            numeric(2,1),
  add column if not exists benefits          text[] not null default '{}',
  add column if not exists hue_a             text not null default '#D4A24C',
  add column if not exists hue_b             text not null default '#A8762A',
  add column if not exists is_veg            boolean not null default true,
  add column if not exists is_best_seller    boolean not null default false;

-- ── JOURNAL ENTRIES ──────────────────────────────────────────────────────────
create table if not exists public.journal_entries (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  date_label    text not null,                -- "28 FEB 2026"
  batch         text,                         -- "BATCH 042"
  title         text not null,
  excerpt       text not null,
  body          text,
  read_time     text not null default '4 min read',
  is_published  boolean not null default true,
  position      int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists journal_published_idx on public.journal_entries(is_published);

-- ── SITE SETTINGS (singleton row, id = true) ─────────────────────────────────
create table if not exists public.site_settings (
  id              boolean primary key default true,
  business_name   text not null default 'Thennaiyan Coconut Company',
  brand_short     text not null default 'Coconet',
  whatsapp_number text not null default '918124165047',   -- digits only, for wa.me
  contact_phone   text not null default '+91 81241 65047',
  contact_email   text not null default 'support@thennaiyan.in',
  business_hours  text not null default 'Monday – Saturday: 08:00 AM – 06:00 PM IST',
  legal_owner     text not null default 'Tamilarasan Sathuragiri',
  gst_number      text not null default '33RRKPS2222A1ZU',
  business_type   text not null default 'Proprietorship (Single Owner)',
  gst_reg_date    text not null default '22 January 2026',
  jurisdiction    text not null default 'Thirumangalam',
  address         text not null default 'No. 265/3B, Veppampatti Vilakku, Peraiyur Main Road Near Bus Stop, Pappinaickanpatti, Peraiyur, Madurai District, Tamil Nadu – 625705, India',
  updated_at      timestamptz not null default now(),
  constraint site_settings_singleton check (id)
);

-- ── RLS for the new tables ────────────────────────────────────────────────────
alter table public.journal_entries enable row level security;

drop policy if exists "journal_public_read" on public.journal_entries;
create policy "journal_public_read" on public.journal_entries
  for select using (is_published = true or public.is_admin());

drop policy if exists "journal_admin_write" on public.journal_entries;
create policy "journal_admin_write" on public.journal_entries
  for all using (public.is_admin()) with check (public.is_admin());

alter table public.site_settings enable row level security;

drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read" on public.site_settings
  for select using (true);

drop policy if exists "settings_admin_write" on public.site_settings;
create policy "settings_admin_write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- keep updated_at fresh on the new tables
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists journal_touch on public.journal_entries;
create trigger journal_touch before update on public.journal_entries
  for each row execute function public.touch_updated_at();

drop trigger if exists settings_touch on public.site_settings;
create trigger settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

-- Clean existing data
delete from public.products;
delete from public.categories;
delete from public.journal_entries;

-- ── SEED: categories ─────────────────────────────────────────────────────────
insert into public.categories (slug, name, description, position) values
  ('brownies',  'BROWNIES',      'Delicious freshly baked brownies', 1),
  ('birthday-cakes',  'Birthday Cakes',      'Artisan custom cakes', 2),
  ('cold-beverages',  'COLD BEVERAGES',      'Refreshing cold drinks', 3),
  ('special-desserts',  'Coco Paradise Special Desserts',      'Signature specials', 4),
  ('dessert',  'Dessert',      'Gourmet sweet treats', 5),
  ('hot-serves',  'Hot Serves',      'Hot beverages and foods', 6),
  ('main-course',  'Main Course',      'Savory food selections', 7),
  ('make-it-a-meal',  'Make It A Meal',      'Meal packages', 8)
on conflict (slug) do nothing;

-- ── SEED: products (matches the storefront cards) ────────────────────────────
insert into public.products
  (slug, name, variant_label, tagline, description, category_id, batch_no, pressed_at, origin, starting_from_inr, rating, benefits, hue_a, hue_b, position, is_veg, is_best_seller, hero_image)
values
  ('brownie-with-choco', 'Brownie With Choco', 'Warm Fudge',
   'Rich chocolate brownie drizzled with hot chocolate fudge sauce.',
   'Our signature dark chocolate brownie is baked fresh daily and served warm, generously drizzled with premium chocolate fudge sauce.',
   (select id from public.categories where slug = 'brownies'), 'B-01', '2026-06-11', 'Madurai', 90, 4.3,
   array['100% Vegetarian','Baked Fresh Daily','Premium Dark Chocolate','Served Warm'],
   '#4b5563', '#1f2937', 1, true, true, '/images/brownie-choco.png'),

  ('brownie-with-icecream-takeaway', 'Brownie With IceCream(Take...', 'Dessert Pack',
   'Vanilla ice cream on a classic brownie, packaged for takeaway.',
   'A convenient takeaway container holding our classic dark chocolate brownie, topped with a scoop of premium vanilla ice cream, whipped cream, chocolate syrup, and a cherry.',
   (select id from public.categories where slug = 'brownies'), 'B-02', '2026-06-11', 'Madurai', 125, 4.4,
   array['100% Vegetarian','Convenient Takeaway Box','Whipped Cream Included','Topped with Cherry'],
   '#4b5563', '#1f2937', 2, true, true, '/images/brownie-icecream.png'),

  ('brownie-with-icecream', 'Brownie With Icecream', 'Ala Mode',
   'Our signature brownie topped with a scoop of creamy vanilla ice cream.',
   'The classic dine-in favorite. A warm chocolate brownie base supporting a cold scoop of rich vanilla ice cream, finished with whipped cream, chocolate syrup, and a cherry.',
   (select id from public.categories where slug = 'brownies'), 'B-03', '2026-06-11', 'Madurai', 120, 4.5,
   array['100% Vegetarian','Dine-in Favorite','Warm & Cold Contrast','Rich Chocolate Syrup'],
   '#4b5563', '#1f2937', 3, true, true, '/images/brownie-icecream.png'),

  ('brownie-with-choco-takeaway', 'Brownie with Choco(Take...', 'Fudge Pack',
   'Rich chocolate brownie, served with hot chocolate fudge sauce.',
   'Our signature warm chocolate fudge brownie in a convenient takeaway packaging, perfect for sweet cravings on the go.',
   (select id from public.categories where slug = 'brownies'), 'B-04', '2026-06-11', 'Madurai', 95, 4.3,
   array['100% Vegetarian','Freshly Baked','Fudge Sauce Included','Travel Friendly Packaging'],
   '#4b5563', '#1f2937', 4, true, true, '/images/brownie-choco.png'),

  ('chicken-popcorn-takeaway', 'Chicken Popcorn(Take Away)', 'Crispy Bites',
   'Golden, crispy, seasoned bite-sized chicken pieces.',
   'Crispy and tender bite-sized chicken popcorn seasoned with traditional spices, served with a creamy garlic mayonnaise dip.',
   (select id from public.categories where slug = 'main-course'), 'C-01', '2026-06-11', 'Madurai', 155, 4.4,
   array['100% Non-Vegetarian','Crispy & Tender','Spiced Seasoning','Served with Garlic Dip'],
   '#b45309', '#78350f', 5, false, true, '/images/chicken-popcorn.png'),

  ('crunchy-cake-takeaway', 'Cho Cruncy Cake(Take Away)', 'Gateau slice',
   'Decadent chocolate cake with a crunchy texture layer.',
   'A rich slice of chocolate crunchy gateau featuring layers of moist chocolate sponge, hazelnut crunch, and dark chocolate ganache frosting.',
   (select id from public.categories where slug = 'birthday-cakes'), 'G-01', '2026-06-11', 'Madurai', 125, 4.5,
   array['100% Vegetarian','Hazelnut Crunch','Moist Sponge Layers','Ganache Frosting'],
   '#1e3a8a', '#172554', 6, true, true, '/images/crunchy-cake.png')
on conflict (slug) do nothing;

-- ── SEED: journal entries ────────────────────────────────────────────────────
insert into public.journal_entries (slug, date_label, batch, title, excerpt, read_time, position) values
  ('coco-paradise-grand-opening', '11 JUN 2026', 'EVENT',
   'Grand Opening of COCO Paradise in Madurai',
   'We are thrilled to open our doors to the sweet lovers of Madurai! Experience tropical flavors and modern dining today.',
   '3 min read', 1),
  ('crafting-perfect-brownie', '05 JUN 2026', 'KITCHEN',
   'The art of the perfect warm chocolate brownie',
   'What makes a brownie fudgy rather than cakey? Our head chef shares the secrets of balancing dark chocolate blends and precise baking temperatures.',
   '5 min read', 2)
on conflict (slug) do nothing;

-- ── SEED: the singleton settings row ─────────────────────────────────────────
insert into public.site_settings (id, business_name, brand_short, whatsapp_number, contact_phone, contact_email, address) values 
  (true, 'COCO Paradise', 'COCO Paradise', '918124165047', '+91 81241 65047', 'support@cocoparadise.in', 'No. 45, Coconut Grove Street, Madurai, Tamil Nadu – 625001, India')
on conflict (id) do update set
  business_name = excluded.business_name,
  brand_short = excluded.brand_short,
  whatsapp_number = excluded.whatsapp_number,
  contact_phone = excluded.contact_phone,
  contact_email = excluded.contact_email,
  address = excluded.address;
