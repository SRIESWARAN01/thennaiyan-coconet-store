# Kovai Chekku - WhatsApp-first Coconut Oil Storefront

A mobile-first coconut oil ordering system built with Next.js 15 and Supabase.

The business objective is simple: customers should log in with mobile number, browse products, place order intent through WhatsApp, track order status in their customer panel, and leave reviews. Admins should get a full dashboard for analytics, products, WhatsApp leads, orders, reviews, and reports.

## Stack

- Next.js 15 App Router, React Server Components first, TypeScript
- Supabase for Postgres, Auth, Storage, Realtime, and Row-Level Security
- Tailwind CSS with custom brand tokens
- Razorpay planned later for UPI/cards
- Zustand only for transient UI state such as cart drawer open/close

## Core Flow

1. Customer logs in with mobile number.
2. Customer browses products and variants.
3. Customer adds products to cart or orders directly.
4. App creates a WhatsApp lead in Supabase.
5. App opens WhatsApp with a prefilled order message.
6. Admin receives and manages the order.
7. Admin updates order status.
8. Customer sees real-time tracking.
9. Customer rates and reviews delivered products.

## Customer Panel

Planned customer features:

- Mobile number login
- Product browsing
- Add to cart / order
- WhatsApp order message generation
- Order history
- Current order status
- Real-time status updates
- Product rating and review

## Admin Panel

Planned admin features:

- Separate admin login using Supabase Auth credentials and `profiles.role = 'admin'`
- Analytics dashboard:
  - Total website visitors
  - Total product views
  - Total cart clicks
  - Total WhatsApp leads
  - Total orders
  - Total delivered orders
  - Customer reviews and ratings
- Product add/edit/delete
- Order management
- Customer detail view
- WhatsApp lead management
- Review moderation
- Sales and order reports

## Schema Highlights

Core tables:

- `profiles`
- `categories`
- `products`
- `product_variants`
- `product_images`
- `cart_items`
- `orders`
- `order_items`

WhatsApp/customer/admin additions:

- `whatsapp_leads`
- `analytics_events`
- `order_status_events`
- `product_reviews`

Order status changes are written into `order_status_events`, and the orders tables are prepared for Supabase Realtime so customer tracking can update live.

## Current State

Built:

- Homepage and design system
- Product card/detail modal demo flow
- Supabase client/server/middleware setup
- RLS-backed schema for products, cart, orders, analytics, WhatsApp leads, reviews, and order status events
- Phase-gated implementation plan in `BUILD_PLAN.md`

Still to build:

- Phone auth
- Supabase-backed shop/detail pages
- Server-backed cart actions
- WhatsApp lead creation action
- Customer account/order tracking panel
- Admin analytics/dashboard
- Admin product/order/review management
- Razorpay payment phase

## Quickstart

```bash
npm install
npm run dev
```

Create a Supabase project, add the required `.env.local` values, and run `supabase/schema.sql` in Supabase SQL Editor.

After creating the first admin user, promote it manually:

```sql
update public.profiles
set role = 'admin'
where phone = '+919876543210';
```

Use `BUILD_PLAN.md` as the phase-by-phase implementation guide.
