import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "My Orders - Thennaiyan" };
const INR = "\u20B9";

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  packed: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/orders");

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_no, status, total_inr, discount_inr, created_at, order_items(product_name, quantity)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#f7f8f6]">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/account" className="inline-flex items-center gap-1.5 font-body text-sm text-[#667085] hover:text-[#111827] mb-5"><ArrowLeft size={14} /> Back to account</Link>
        <h1 className="font-body text-2xl font-extrabold text-[#111827] mb-6 flex items-center gap-2"><Package size={22} className="text-[#356f3b]" /> My orders</h1>

        {!orders?.length ? (
          <div className="rounded-[8px] bg-white p-10 text-center shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
            <p className="font-body text-sm text-[#667085]">No orders yet. <Link href="/shop" className="text-[#356f3b] font-bold">Browse products →</Link></p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order: any) => (
              <Link key={order.id} href={`/account/orders/${order.id}`}
                className="block rounded-[8px] bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,0.06)] hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-body text-base font-extrabold text-[#111827]">{order.order_no}</p>
                    <p className="font-body text-xs text-[#667085] mt-0.5">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    <p className="font-body text-xs text-[#667085] mt-1">{(order.order_items ?? []).map((i: any) => `${i.product_name} x${i.quantity}`).join(", ")}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`inline-block rounded-full px-2.5 py-1 font-body text-[10px] font-bold capitalize ${STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-600"}`}>{order.status}</span>
                    <p className="mt-2 font-body text-sm font-extrabold text-[#111827]">{INR}{Number(order.total_inr).toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
