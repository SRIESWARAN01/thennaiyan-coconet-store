import Link from "next/link";
import { Plus, Ticket } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteCoupon, toggleCouponActive } from "@/app/actions/coupons";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";

export const metadata = { title: "Coupons - Thennaiyan Admin" };

export default async function AdminCouponsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  const coupons = (data ?? []) as Array<{
    id: string;
    code: string;
    discount_type: string;
    discount_value: number | string;
    min_order_inr: number | string;
    max_uses: number | null;
    used_count: number;
    is_active: boolean;
    valid_until: string | null;
  }>;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Promotions</span>
          <h1
            className="mt-2 font-display text-display-md text-leaf-deep"
            style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 40" }}
          >
            Coupons
          </h1>
          <p className="mt-2 font-body text-sm text-shell">
            Discount codes customers can enter at checkout.
          </p>
        </div>
        <Link href="/admin/coupons/new" className="btn-primary">
          <Plus size={16} /> New coupon
        </Link>
      </header>

      {coupons.length === 0 ? (
        <p className="font-body text-sm text-shell bg-kernel border hairline p-8 text-center">
          <Ticket size={20} className="mx-auto mb-2 text-shell-husk" />
          No coupons yet. Create your first discount code.
        </p>
      ) : (
        <div className="bg-kernel border hairline overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b hairline text-left font-mono text-[10px] uppercase tracking-wider text-shell-husk">
                <th className="px-4 py-3 font-normal">Code</th>
                <th className="px-4 py-3 font-normal">Discount</th>
                <th className="px-4 py-3 font-normal">Min order</th>
                <th className="px-4 py-3 font-normal">Used</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b hairline last:border-0">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-ink uppercase">
                    {c.code}
                  </td>
                  <td className="px-4 py-3 font-body text-shell">
                    {c.discount_type === "percent"
                      ? `${Number(c.discount_value)}% off`
                      : `₹${Number(c.discount_value)} off`}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-shell">
                    ₹{Number(c.min_order_inr) || 0}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-shell">
                    {c.used_count}
                    {c.max_uses ? ` / ${c.max_uses}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    {c.is_active ? (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-leaf">
                        ● Active
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-shell-husk">
                        ○ Off
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <form action={toggleCouponActive} className="inline">
                        <input type="hidden" name="id" value={c.id} />
                        <input
                          type="hidden"
                          name="next_active"
                          value={(!c.is_active).toString()}
                        />
                        <button
                          type="submit"
                          className="px-2.5 py-1.5 border border-shell/30 text-shell hover:border-leaf hover:text-leaf transition-colors rounded-sm text-xs font-medium"
                        >
                          {c.is_active ? "Turn off" : "Turn on"}
                        </button>
                      </form>
                      <form action={deleteCoupon} className="inline">
                        <input type="hidden" name="id" value={c.id} />
                        <ConfirmSubmit
                          message={`Delete coupon "${c.code}"?`}
                          className="px-2.5 py-1.5 border border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition-colors rounded-sm text-xs font-medium"
                        >
                          Delete
                        </ConfirmSubmit>
                      </form>
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
