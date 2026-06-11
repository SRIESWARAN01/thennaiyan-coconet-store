# Thennaiyan Coconut Company - WhatsApp-first Ordering Build Plan

> Phase-gated execution plan for Codex agents.
> Finish one phase, run checks, confirm acceptance, then move to the next.

---

## Stack Of Record

- Framework: Next.js 15 App Router, React Server Components first, TypeScript
- Backend: Supabase Postgres, Auth, Storage, Realtime, and Row-Level Security
- Styling: Tailwind CSS with custom brand tokens: leaf green, kernel cream, oil gold
- Payments: Razorpay for UPI/cards in the later payment phase
- State: Zustand only for transient UI state such as cart drawer open/close
- Data rule: product/cart/order/review data lives in Supabase, not client state

Reads happen in Server Components. Writes happen through Server Actions. Client components stay thin.

---

## Product Objective

The primary business flow is WhatsApp ordering:

1. Customer logs in with mobile number.
2. Customer browses products.
3. Customer selects product or adds items to cart.
4. Customer confirms order intent.
5. App creates a WhatsApp lead and opens a prefilled WhatsApp message.
6. Admin receives and manages the order.
7. Admin updates status: processing, shipped, delivered.
8. Customer sees real-time order tracking in their panel.
9. Customer can rate and review products.

The admin goal is a complete operations dashboard: analytics, products, orders, customers, WhatsApp leads, reviews, and reports.

---

## Current Foundation

Already built:

- Homepage design system and product cards
- Supabase SSR clients and middleware session refresh
- Protected route pattern for `/account/*` and `/admin/*`
- Core schema: profiles, categories, products, variants, product images, addresses, cart, orders, order items
- Extended schema for this WhatsApp-first flow:
  - `analytics_events`
  - `whatsapp_leads`
  - `product_reviews`
  - `order_status_events`
  - `processing` order status
  - phone copied into `profiles`
  - order status trigger for customer tracking

---

## Data Model Notes

Core commerce:

- `profiles`: extends `auth.users`, includes role and phone
- `categories -> products -> product_variants -> product_images`
- `cart_items`: server-backed cart per user
- `orders + order_items`: order history snapshots product name, variant, price, and batch number
- `order_status_events`: status timeline for customer tracking and Supabase Realtime subscriptions

WhatsApp and analytics:

- `whatsapp_leads`: one row when customer taps the WhatsApp order flow
- `analytics_events`: website visits, product views, cart clicks, WhatsApp leads, orders, delivered orders
- `product_reviews`: customer ratings and reviews, admin moderated

Security:

- Customers can read and write only their own cart, orders, leads, and reviews.
- Approved reviews are public.
- Admins can manage catalog, orders, leads, reviews, and analytics.
- Analytics insert is public/append-only so anonymous website visits can be counted.

---

## Phase 1 - Phone Auth And Customer Shell

Goal: Customers can log in with mobile number and land in a customer panel.

Files:

- `app/login/page.tsx`
- `app/auth/callback/route.ts`
- `app/account/layout.tsx`
- `app/account/page.tsx`
- `components/auth/phone-login-form.tsx`

Acceptance:

- Customer logs in using Supabase phone OTP.
- Profile row stores phone number.
- Logged-in customer sees account overview.
- Unauthenticated `/account/*` access redirects to login.
- Admin routes remain separate from customer routes.

---

## Phase 2 - Product Browse And Product Detail

Goal: Customer can see all active products and inspect a product before ordering.

Files:

- `app/shop/page.tsx`
- `app/shop/[slug]/page.tsx`
- `components/variant-selector.tsx`
- `components/product-gallery.tsx`
- `app/actions/analytics.ts`

Acceptance:

- `/shop` reads active products from Supabase in a Server Component.
- Product detail shows variants, stock, batch stamp, origin, pressed date, images, and reviews.
- Out-of-stock variants are disabled but visible.
- Product views write `analytics_events.product_view`.
- Admin-inactive products are not visible to customers.

---

## Phase 3 - Cart And WhatsApp Lead Flow

Goal: Customer can add to cart and create a WhatsApp order lead.

Files:

- `app/actions/cart.ts`
- `app/actions/whatsapp.ts`
- `app/cart/page.tsx`
- `components/cart-drawer.tsx`
- `components/cart-line.tsx`
- `components/whatsapp-order-button.tsx`
- `lib/cart-store.ts`

Acceptance:

- Add to cart writes `cart_items`.
- Cart survives sessions and devices.
- Cart clicks write `analytics_events.cart_click`.
- Confirm order creates a pending order or order intent, creates `whatsapp_leads`, writes `analytics_events.whatsapp_lead`, and opens a prefilled WhatsApp message.
- WhatsApp message includes customer name/phone, product lines, quantities, order number, total, and delivery details.

---

## Phase 4 - Customer Orders, Tracking, Reviews

Goal: Customer can track orders in real time and review products.

Files:

- `app/account/orders/page.tsx`
- `app/account/orders/[id]/page.tsx`
- `components/order-status-timeline.tsx`
- `components/realtime-order-status.tsx`
- `components/review-form.tsx`
- `app/actions/reviews.ts`

Acceptance:

- Customer sees order history.
- Order detail shows current status and status timeline from `order_status_events`.
- Customer panel updates when admin changes order status.
- Delivered orders allow rating/review.
- Reviews are saved as unapproved until admin approves them.

---

## Phase 5 - Admin Auth And Dashboard Analytics

Goal: Admin has a dedicated dashboard with operational counters.

Files:

- `app/admin/layout.tsx`
- `app/admin/page.tsx`
- `components/admin/metric-card.tsx`
- `components/admin/recent-activity.tsx`
- `lib/admin/analytics.ts`

Acceptance:

- Admin logs in with separate Supabase email/password credentials and `profiles.role = 'admin'`.
- Non-admin users cannot access `/admin/*`.
- Dashboard shows:
  - Total website visitors
  - Total product views
  - Total cart clicks
  - Total WhatsApp leads
  - Total orders
  - Total delivered orders
  - Customer reviews and average rating
- Metrics are read from Supabase in Server Components.

---

## Phase 6 - Admin Product, Order, Lead, Review Management

Goal: Admin can run the business from the panel.

Files:

- `app/admin/products/page.tsx`
- `app/admin/products/new/page.tsx`
- `app/admin/products/[id]/edit/page.tsx`
- `app/admin/orders/page.tsx`
- `app/admin/orders/[id]/page.tsx`
- `app/admin/leads/page.tsx`
- `app/admin/reviews/page.tsx`
- `components/admin/*`
- `app/actions/admin-products.ts`
- `app/actions/admin-orders.ts`
- `app/actions/admin-reviews.ts`

Acceptance:

- Admin can add, edit, soft-delete, and image-manage products.
- Admin can see new orders and customer details.
- Admin can update status to processing, shipped, delivered, cancelled, or refunded.
- Every order status update creates a status timeline event.
- Admin can mark WhatsApp leads contacted, converted, or closed.
- Admin can approve, hide, or respond to customer reviews.
- Low stock variants below 5 are highlighted.

---

## Phase 7 - Sales And Order Reports

Goal: Admin can understand sales and operations over time.

Files:

- `app/admin/reports/page.tsx`
- `components/admin/date-range-filter.tsx`
- `components/admin/report-table.tsx`
- `lib/admin/reports.ts`

Acceptance:

- Admin can filter reports by date range.
- Reports show orders, delivered orders, revenue, products sold, top products, WhatsApp conversion, and review averages.
- Export-ready table structure is present even if CSV export is added later.

---

## Phase 8 - Razorpay Payments

Goal: Add optional online payment after the WhatsApp flow is stable.

Files:

- `app/checkout/page.tsx`
- `app/api/razorpay/verify/route.ts`
- `app/actions/checkout.ts`
- `lib/razorpay.ts`

Acceptance:

- Server creates Razorpay order.
- Server verifies Razorpay signature.
- Paid orders update `payment_status = 'paid'`.
- Failed payment keeps order recoverable.

---

## Phase 9 - Polish

- Real product photography
- Loading skeletons
- Empty states
- Mobile-first customer panel polish
- Admin dense table polish
- Sitemap, robots, product JSON-LD
- Lighthouse pass
- Better WhatsApp copy templates

---

## Implementation Rules

1. Keep reads server-side unless a realtime client subscription is required.
2. Use Server Actions for writes.
3. Use Supabase RLS as the real security boundary.
4. Never trust client-provided role, price, or order total.
5. Money is INR and stored as `numeric(10,2)`.
6. Order history snapshots product details and batch numbers.
7. WhatsApp leads are tracked in the database before opening WhatsApp.
8. Customer status tracking uses `orders` and `order_status_events`.
9. Admin analytics come from `analytics_events` plus order/review tables.
