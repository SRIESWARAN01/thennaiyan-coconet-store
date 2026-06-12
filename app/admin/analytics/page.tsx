import Link from "next/link";
import {
  Eye,
  MousePointerClick,
  MessageCircle,
  ShoppingBag,
  Truck,
  IndianRupee,
  Star,
  Globe,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Analytics - Thennaiyan Admin" };

async function countEvents(
  supabase: Awaited<ReturnType<typeof createClient>>,
  eventType: string,
): Promise<number> {
  const { count } = await supabase
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .eq("event_type", eventType);
  return count ?? 0;
}

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const [
    visits,
    productViews,
    cartClicks,
    leadEvents,
    ordersRes,
    reviewsRes,
    newLeadsRes,
  ] = await Promise.all([
    countEvents(supabase, "website_visit"),
    countEvents(supabase, "product_view"),
    countEvents(supabase, "cart_click"),
    countEvents(supabase, "whatsapp_lead"),
    supabase.from("orders").select("status, total_inr, order_no, ship_full_name, created_at"),
    supabase.from("product_reviews").select("rating"),
    supabase
      .from("whatsapp_leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
  ]);

  const orders = (ordersRes.data ?? []) as Array<{
    status: string;
    total_inr: number | string;
    order_no: string;
    ship_full_name: string;
    created_at: string;
  }>;

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const pendingOrders = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled",
  ).length;
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (Number(o.total_inr) || 0), 0);

  const reviews = (reviewsRes.data ?? []) as Array<{ rating: number }>;
  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviewCount
      : 0;

  const newLeads = newLeadsRes.count ?? 0;

  const recentOrders = [...orders]
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 6);

  const cards = [
    { label: "Website visits", value: visits, icon: Globe, hint: "All time" },
    { label: "Product views", value: productViews, icon: Eye, hint: "All time" },
    { label: "Cart clicks", value: cartClicks, icon: MousePointerClick, hint: "Add-to-cart taps" },
    { label: "WhatsApp leads", value: leadEvents, icon: MessageCircle, hint: `${newLeads} new` },
    { label: "Total orders", value: totalOrders, icon: ShoppingBag, hint: `${pendingOrders} in progress` },
    { label: "Delivered", value: deliveredOrders, icon: Truck, hint: "Completed orders" },
    { label: "Revenue", value: `₹${revenue.toLocaleString("en-IN")}`, icon: IndianRupee, hint: "Excludes cancelled" },
    { label: "Avg rating", value: reviewCount ? avgRating.toFixed(1) : "—", icon: Star, hint: `${reviewCount} reviews` },
  ];

  return (
    <div className="space-y-10">
      <header>
        <span className="eyebrow">Insights</span>
        <h1
          className="mt-2 font-display text-display-md text-leaf-deep"
          style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 40" }}
        >
          Analytics
        </h1>
        <p className="mt-2 font-body text-sm text-shell">
          Live counters from your store activity. Numbers update as customers
          browse, add to cart, and order.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-kernel border hairline p-5">
              <Icon size={20} strokeWidth={1.5} className="text-oil" />
              <div
                className="mt-3 font-display text-3xl text-leaf-deep"
                style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 32" }}
              >
                {c.value}
              </div>
              <div className="mt-1 font-body text-sm text-ink">{c.label}</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-shell-husk mt-0.5">
                {c.hint}
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className="eyebrow">Latest orders</span>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 font-body text-xs text-leaf hover:underline"
          >
            Manage all <ArrowRight size={12} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="mt-4 font-body text-sm text-shell bg-kernel border hairline p-6 text-center">
            No orders yet.
          </p>
        ) : (
          <div className="mt-4 bg-kernel border hairline overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b hairline text-left font-mono text-[10px] uppercase tracking-wider text-shell-husk">
                  <th className="px-4 py-3 font-normal">Order</th>
                  <th className="px-4 py-3 font-normal">Customer</th>
                  <th className="px-4 py-3 font-normal">Total</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.order_no} className="border-b hairline last:border-0">
                    <td className="px-4 py-3 font-mono text-xs text-shell">{o.order_no}</td>
                    <td className="px-4 py-3 font-body text-ink">{o.ship_full_name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-shell">
                      ₹{(Number(o.total_inr) || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-shell">
                      {o.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
