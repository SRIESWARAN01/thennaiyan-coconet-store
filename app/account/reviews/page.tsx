import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import { ReviewForm } from "@/components/review-form";

export const metadata = { title: "My Reviews - Thennaiyan" };

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order: orderId } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/reviews");

  const { data: deliveredOrders } = await supabase
    .from("orders")
    .select("id, order_no, order_items(product_id, product_name, variant_label, size_label)")
    .eq("user_id", user.id)
    .eq("status", "delivered");

  const { data: existingReviews } = await supabase
    .from("product_reviews")
    .select("product_id, order_id, rating, title, body, is_approved")
    .eq("user_id", user.id);

  const reviewedSet = new Set((existingReviews ?? []).map((r: any) => `${r.product_id}-${r.order_id}`));

  const reviewable: Array<{ orderId: string; orderNo: string; productId: string; productName: string; variantLabel: string }> = [];
  for (const order of deliveredOrders ?? []) {
    for (const item of (order as any).order_items ?? []) {
      if (item.product_id && !reviewedSet.has(`${item.product_id}-${order.id}`)) {
        reviewable.push({ orderId: order.id, orderNo: (order as any).order_no, productId: item.product_id, productName: item.product_name, variantLabel: item.variant_label });
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8f6]">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/account" className="inline-flex items-center gap-1.5 font-body text-sm text-[#667085] hover:text-[#111827] mb-5"><ArrowLeft size={14} /> Back to account</Link>
        <h1 className="font-body text-2xl font-extrabold text-[#111827] mb-6 flex items-center gap-2"><Star size={20} className="text-yellow-500" /> Reviews & ratings</h1>

        {reviewable.length === 0 && (existingReviews ?? []).length === 0 ? (
          <div className="rounded-[8px] bg-white p-8 text-center shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
            <p className="font-body text-sm text-[#667085]">No delivered orders to review yet.</p>
            <Link href="/shop" className="mt-3 inline-block font-body text-sm font-bold text-[#356f3b]">Browse products →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviewable.map((r) => (
              <div key={`${r.productId}-${r.orderId}`} className="rounded-[8px] bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
                <p className="font-body text-xs text-[#667085]">Order {r.orderNo}</p>
                <p className="font-body text-base font-extrabold text-[#111827] mt-0.5">{r.productName}</p>
                <p className="font-body text-xs text-[#667085] mb-4">{r.variantLabel}</p>
                <ReviewForm productId={r.productId} orderId={r.orderId} />
              </div>
            ))}
            {(existingReviews ?? []).map((r: any) => (
              <div key={`${r.product_id}-${r.order_id}`} className="rounded-[8px] bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className={i < r.rating ? "text-yellow-500 fill-yellow-400" : "text-gray-300"} />)}
                  <span className={`ml-2 text-xs font-body ${r.is_approved ? "text-[#356f3b]" : "text-[#667085]"}`}>{r.is_approved ? "Published" : "Pending approval"}</span>
                </div>
                {r.title && <p className="font-body text-sm font-bold text-[#111827]">{r.title}</p>}
                {r.body && <p className="font-body text-sm text-[#667085] mt-1">{r.body}</p>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
