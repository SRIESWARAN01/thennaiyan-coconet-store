import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Package } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import { OrderStatusTimeline } from "@/components/order-status-timeline";

export const metadata = { title: "Order Detail - Thennaiyan" };
const INR = "\u20B9";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/account/orders/${id}`);

  const [{ data: order }, { data: events }, { data: items }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).eq("user_id", user.id).maybeSingle(),
    supabase.from("order_status_events").select("status, note, created_at").eq("order_id", id).order("created_at"),
    supabase.from("order_items").select("*").eq("order_id", id),
  ]);

  if (!order) notFound();

  return (
    <div className="min-h-screen bg-[#f7f8f6]">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/account/orders" className="inline-flex items-center gap-1.5 font-body text-sm text-[#667085] hover:text-[#111827] mb-5"><ArrowLeft size={14} /> All orders</Link>

        <div className="mb-6">
          <p className="font-mono text-xs text-[#667085]">{order.order_no}</p>
          <h1 className="font-body text-2xl font-extrabold text-[#111827] mt-1 flex items-center gap-2"><Package size={20} className="text-[#356f3b]" /> Order details</h1>
        </div>

        <div className="space-y-4">
          {/* Status Timeline */}
          <div className="rounded-[8px] bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
            <p className="font-body text-xs font-extrabold uppercase tracking-wider text-[#667085] mb-4">Tracking</p>
            <OrderStatusTimeline currentStatus={order.status} events={events ?? []} />
          </div>

          {/* Items */}
          <div className="rounded-[8px] bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
            <p className="font-body text-xs font-extrabold uppercase tracking-wider text-[#667085] mb-3">Items ordered</p>
            <div className="space-y-2">
              {(items ?? []).map((item: any) => (
                <div key={item.id} className="flex justify-between py-1.5">
                  <div>
                    <p className="font-body text-sm font-bold text-[#111827]">{item.product_name}</p>
                    <p className="font-body text-xs text-[#667085]">{item.size_label} · Batch {item.batch_no} · Qty {item.quantity}</p>
                  </div>
                  <p className="font-body text-sm font-extrabold text-[#111827]">{INR}{Number(item.subtotal_inr).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-[#f0f0f0] pt-3 space-y-1">
              <div className="flex justify-between font-body text-sm text-[#667085]"><span>Subtotal</span><span>{INR}{Number(order.subtotal_inr).toFixed(2)}</span></div>
              {Number(order.discount_inr ?? 0) > 0 && <div className="flex justify-between font-body text-sm text-[#356f3b]"><span>Coupon ({order.coupon_code})</span><span>-{INR}{Number(order.discount_inr).toFixed(2)}</span></div>}
              <div className="flex justify-between font-body text-sm font-extrabold text-[#111827]"><span>Total</span><span>{INR}{Number(order.total_inr).toFixed(2)}</span></div>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-[8px] bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
            <p className="font-body text-xs font-extrabold uppercase tracking-wider text-[#667085] mb-3 flex items-center gap-1.5"><MapPin size={12} /> Delivery address</p>
            <p className="font-body text-sm text-[#111827] font-bold">{order.ship_full_name}</p>
            <p className="font-body text-sm text-[#667085]">{order.ship_phone}</p>
            <p className="font-body text-sm text-[#667085] mt-1">{order.ship_line1}{order.ship_line2 ? ", " + order.ship_line2 : ""}</p>
            <p className="font-body text-sm text-[#667085]">{order.ship_city}, {order.ship_state} - {order.ship_pincode}</p>
          </div>

          {order.status === "delivered" && (
            <Link href={`/account/reviews?order=${order.id}`}
              className="block w-full text-center rounded-[8px] bg-[#edf6ee] border border-[#356f3b]/20 px-4 py-3 font-body text-sm font-extrabold text-[#356f3b] hover:bg-[#d4edda] transition-colors">
              ⭐ Rate & review products from this order
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
