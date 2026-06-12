import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Orders - Thennaiyan Admin" };

const STATUS_CLASS: Record<string, string> = {
  pending: "text-amber-600",
  processing: "text-blue-600",
  packed: "text-indigo-600",
  shipped: "text-purple-600",
  delivered: "text-leaf",
  cancelled: "text-red-500",
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select(
      "id, order_no, ship_full_name, ship_phone, total_inr, status, payment_status, created_at",
    )
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as Array<{
    id: string;
    order_no: string;
    ship_full_name: string;
    ship_phone: string;
    total_inr: number | string;
    status: string;
    payment_status: string;
    created_at: string;
  }>;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Fulfilment</span>
          <h1
            className="mt-2 font-display text-display-md text-leaf-deep"
            style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 40" }}
          >
            Orders
          </h1>
          <p className="mt-2 font-body text-sm text-shell">
            Update an order&apos;s status to move it along — the customer&apos;s
            live tracking updates automatically.
          </p>
        </div>
      </header>

      {orders.length === 0 ? (
        <p className="font-body text-sm text-shell bg-kernel border hairline p-8 text-center">
          <ShoppingCart size={20} className="mx-auto mb-2 text-shell-husk" />
          No orders yet.
        </p>
      ) : (
        <div className="bg-kernel border hairline overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b hairline text-left font-mono text-[10px] uppercase tracking-wider text-shell-husk">
                <th className="px-4 py-3 font-normal">Order</th>
                <th className="px-4 py-3 font-normal">Customer</th>
                <th className="px-4 py-3 font-normal">Date</th>
                <th className="px-4 py-3 font-normal">Total</th>
                <th className="px-4 py-3 font-normal">Payment</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal text-right">Manage</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b hairline last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-shell">{o.order_no}</td>
                  <td className="px-4 py-3">
                    <div className="font-body text-ink">{o.ship_full_name}</div>
                    <div className="font-mono text-[10px] text-shell-husk">{o.ship_phone}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-shell">
                    {new Date(o.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-shell">
                    ₹{(Number(o.total_inr) || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-shell">
                    {o.payment_status}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wider ${
                        STATUS_CLASS[o.status] ?? "text-shell"
                      }`}
                    >
                      ● {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-leaf text-leaf hover:bg-leaf hover:text-kernel transition-colors rounded-sm text-xs font-medium"
                      >
                        Manage <ArrowRight size={12} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
