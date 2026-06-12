import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { updateOrderStatus } from "@/app/actions/orders";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/order-status";

export const metadata = { title: "Manage order - Thennaiyan Admin" };
const INR = "₹";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: items }, { data: events }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).maybeSingle(),
    supabase.from("order_items").select("*").eq("order_id", id),
    supabase
      .from("order_status_events")
      .select("status, note, created_at")
      .eq("order_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!order) notFound();

  const orderItems = (items ?? []) as Array<Record<string, any>>;
  const statusEvents = (events ?? []) as Array<{
    status: string;
    note: string | null;
    created_at: string;
  }>;

  return (
    <div className="space-y-8">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 font-body text-sm text-shell hover:text-ink"
      >
        <ArrowLeft size={14} /> All orders
      </Link>

      <header>
        <span className="eyebrow">Order</span>
        <h1
          className="mt-2 font-display text-display-md text-leaf-deep"
          style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 40" }}
        >
          {order.order_no}
        </h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-shell-husk">
          Placed{" "}
          {new Date(order.created_at).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: items + address */}
        <div className="space-y-6">
          <div className="bg-kernel border hairline p-5">
            <p className="eyebrow mb-3">Items</p>
            <div className="space-y-2">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between py-1.5">
                  <div>
                    <p className="font-body text-sm text-ink">{item.product_name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-shell-husk">
                      {item.size_label} · Batch {item.batch_no} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="font-mono text-sm text-shell">
                    {INR}
                    {Number(item.subtotal_inr).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t hairline pt-3 space-y-1">
              <div className="flex justify-between font-body text-sm text-shell">
                <span>Subtotal</span>
                <span>{INR}{Number(order.subtotal_inr).toFixed(2)}</span>
              </div>
              {Number(order.discount_inr ?? 0) > 0 && (
                <div className="flex justify-between font-body text-sm text-leaf">
                  <span>Coupon ({order.coupon_code})</span>
                  <span>-{INR}{Number(order.discount_inr).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-body text-sm font-semibold text-ink">
                <span>Total</span>
                <span>{INR}{Number(order.total_inr).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-kernel border hairline p-5">
            <p className="eyebrow mb-2 flex items-center gap-1.5">
              <MapPin size={12} /> Delivery address
            </p>
            <p className="font-body text-sm text-ink">{order.ship_full_name}</p>
            <p className="font-body text-sm text-shell">{order.ship_phone}</p>
            <p className="font-body text-sm text-shell mt-1">
              {order.ship_line1}
              {order.ship_line2 ? ", " + order.ship_line2 : ""}
            </p>
            <p className="font-body text-sm text-shell">
              {order.ship_city}, {order.ship_state} - {order.ship_pincode}
            </p>
          </div>
        </div>

        {/* Right: status update + history */}
        <div className="space-y-6">
          <div className="bg-kernel border hairline p-5">
            <p className="eyebrow mb-3">Update status</p>
            <form action={updateOrderStatus} className="space-y-4">
              <input type="hidden" name="id" value={order.id} />

              <div>
                <label className="font-mono text-[10px] text-shell-husk uppercase tracking-wider block mb-1.5">
                  Order status
                </label>
                <select
                  name="status"
                  defaultValue={order.status}
                  className="w-full bg-kernel border border-shell/20 focus:border-leaf focus:outline-none px-3 py-2 text-sm text-ink font-body rounded-sm capitalize"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-[10px] text-shell-husk uppercase tracking-wider block mb-1.5">
                  Payment status
                </label>
                <select
                  name="payment_status"
                  defaultValue={order.payment_status}
                  className="w-full bg-kernel border border-shell/20 focus:border-leaf focus:outline-none px-3 py-2 text-sm text-ink font-body rounded-sm capitalize"
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-primary w-full">
                Save status
              </button>
            </form>
          </div>

          <div className="bg-kernel border hairline p-5">
            <p className="eyebrow mb-3">History</p>
            {statusEvents.length === 0 ? (
              <p className="font-body text-sm text-shell">No status changes yet.</p>
            ) : (
              <ol className="space-y-3">
                {statusEvents.map((e, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-leaf flex-shrink-0" />
                    <div>
                      <p className="font-body text-sm text-ink capitalize">{e.status}</p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-shell-husk">
                        {e.note ? `${e.note} · ` : ""}
                        {new Date(e.created_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
