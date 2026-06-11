import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock3, PackageCheck, Star, UserRound, ShoppingBag, Truck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

const INR = "\u20B9";

export const metadata = { title: "My Account - Thennaiyan Coconut Company" };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from("profiles").select("full_name, phone, email").eq("id", user.id).maybeSingle(),
    supabase.from("orders").select("id, order_no, status, total_inr, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
  ]);

  const orderList = orders ?? [];
  const totalOrders = orderList.length;
  const deliveredOrders = orderList.filter((o: any) => o.status === "delivered").length;
  const activeOrder = orderList.find((o: any) => !['delivered','cancelled','refunded'].includes(o.status));

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    packed: "bg-indigo-100 text-indigo-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="min-h-screen bg-[#f7f8f6]">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 pb-12 pt-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-body text-xs font-extrabold uppercase tracking-[0.18em] text-[#667085]">Customer panel</p>
            <h1 className="mt-1 font-body text-2xl font-extrabold text-[#111827]">My account</h1>
          </div>
          <Link href="/shop" className="inline-flex h-10 items-center justify-center rounded-[8px] bg-[#356f3b] px-4 font-body text-sm font-extrabold text-white">Browse products</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-5">
          {[
            { icon: ShoppingBag, label: "Total orders", value: totalOrders, color: "bg-[#edf6ee] text-[#356f3b]" },
            { icon: Truck, label: "Active order", value: activeOrder ? activeOrder.order_no : "None", color: "bg-blue-50 text-blue-600" },
            { icon: PackageCheck, label: "Delivered", value: deliveredOrders, color: "bg-purple-50 text-purple-600" },
            { icon: Star, label: "Reviews", value: deliveredOrders > 0 ? "Eligible" : "None yet", color: "bg-yellow-50 text-yellow-600" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-[8px] bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
              <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${color} mb-2`}><Icon size={16} /></span>
              <p className="font-body text-lg font-extrabold text-[#111827] truncate">{value}</p>
              <p className="font-body text-xs text-[#667085]">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Profile */}
          <div className="rounded-[8px] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#edf6ee] text-[#356f3b]"><UserRound size={22} /></span>
              <div className="min-w-0">
                <h2 className="truncate font-body text-lg font-extrabold text-[#111827]">{profile?.full_name || "Customer"}</h2>
                <p className="truncate font-body text-sm font-semibold text-[#667085]">{profile?.email || user.email}</p>
              </div>
            </div>
            {profile?.phone && <p className="mt-3 font-body text-sm text-[#667085]">📱 {profile.phone}</p>}
            <div className="mt-5 flex flex-col gap-2">
              <Link href="/account/orders" className="inline-flex items-center justify-center h-9 rounded-[8px] border border-[#356f3b] px-4 font-body text-xs font-extrabold text-[#356f3b]">View all orders</Link>
              <Link href="/account/reviews" className="inline-flex items-center justify-center h-9 rounded-[8px] border border-[#d0d5dd] px-4 font-body text-xs font-extrabold text-[#667085]">My reviews</Link>
            </div>
          </div>

          {/* Recent orders */}
          <div className="rounded-[8px] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="font-body text-lg font-extrabold text-[#111827]">Recent orders</h2>
              <PackageCheck className="text-[#356f3b]" size={20} />
            </div>
            {orderList.length === 0 ? (
              <div className="rounded-[8px] border border-dashed border-[#d0d5dd] p-5 text-center">
                <Clock3 className="mx-auto text-[#98a2b3]" size={24} />
                <p className="mt-3 font-body text-sm font-extrabold text-[#111827]">No orders yet</p>
                <p className="mt-1 font-body text-xs text-[#667085]">Add products to cart and send your WhatsApp order.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {orderList.map((order: any) => (
                  <Link key={order.id} href={`/account/orders/${order.id}`}
                    className="flex items-center justify-between gap-3 rounded-[8px] bg-[#f7f8f6] p-3 hover:bg-[#edf6ee] transition-colors">
                    <div className="min-w-0">
                      <p className="truncate font-body text-sm font-extrabold text-[#111827]">{order.order_no}</p>
                      <span className={`inline-block mt-0.5 rounded-full px-2 py-0.5 font-body text-[10px] font-bold capitalize ${statusColors[order.status] ?? "bg-gray-100 text-gray-700"}`}>{order.status}</span>
                    </div>
                    <span className="font-body text-sm font-extrabold text-[#05833f]">{INR}{Number(order.total_inr).toFixed(2)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
