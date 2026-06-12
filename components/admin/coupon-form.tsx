"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createCoupon, type CouponActionState } from "@/app/actions/coupons";

const INITIAL: CouponActionState = {};

const labelCls =
  "font-mono text-[10px] text-shell-husk uppercase tracking-wider block mb-1.5";
const inputCls =
  "w-full bg-kernel border border-shell/20 focus:border-leaf focus:outline-none transition-colors px-3 py-2 text-sm text-ink font-body rounded-sm";

export function CouponForm() {
  const [state, formAction, pending] = useActionState<CouponActionState, FormData>(
    createCoupon,
    INITIAL,
  );

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Coupon code *</label>
          <input
            name="code"
            required
            placeholder="FIRST10"
            className={`${inputCls} uppercase`}
          />
        </div>
        <div>
          <label className={labelCls}>Discount type *</label>
          <select name="discount_type" defaultValue="percent" className={inputCls}>
            <option value="percent">Percent off (%)</option>
            <option value="flat">Flat amount off (₹)</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Discount value *</label>
          <input
            name="discount_value"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="10"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Minimum order (₹)</label>
          <input
            name="min_order_inr"
            type="number"
            step="0.01"
            min="0"
            defaultValue={0}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Max uses (optional)</label>
          <input
            name="max_uses"
            type="number"
            step="1"
            min="1"
            placeholder="Leave blank for unlimited"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Valid until (optional)</label>
          <input name="valid_until" type="date" className={inputCls} />
        </div>
      </div>

      <label className="flex items-center gap-3 font-body text-sm text-ink">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked
          className="h-4 w-4 accent-leaf"
        />
        Active (customers can use it right away)
      </label>

      {state?.error && (
        <p className="font-body text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-sm">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2 border-t hairline">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Creating…" : "Create coupon"}
        </button>
        <Link href="/admin/coupons" className="btn-secondary mt-6">
          Cancel
        </Link>
      </div>
    </form>
  );
}
