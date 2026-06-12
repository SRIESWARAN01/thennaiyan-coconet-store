import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CouponForm } from "@/components/admin/coupon-form";

export const metadata = { title: "New coupon - Thennaiyan Admin" };

export default function NewCouponPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <Link
          href="/admin/coupons"
          className="inline-flex items-center gap-1.5 font-body text-sm text-shell hover:text-ink"
        >
          <ArrowLeft size={14} /> All coupons
        </Link>
        <h1
          className="mt-3 font-display text-display-md text-leaf-deep"
          style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 40" }}
        >
          New coupon
        </h1>
      </div>
      <CouponForm />
    </div>
  );
}
