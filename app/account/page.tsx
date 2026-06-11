import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock3, PackageCheck, Star, UserRound } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

const INR = "\u20B9";

type OrderRow = {
  id: string;
  order_no: string;
  status: string;
  total_inr: number | string;
  created_at: string;
};

export const metadata = {
  title: "Account - Coconet",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account");

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, phone, email")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("orders")
      .select("id, order_no, status, total_inr, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const orderList = (orders ?? []) as OrderRow[];

  return (
    <div className="min-h-screen bg-[#f7f8f6]">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 pb-12 pt-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-body text-xs font-extrabold uppercase tracking-[0.18em] text-[#667085]">
              Customer panel
            </p>
            <h1 className="mt-1 font-body text-2xl font-extrabold text-[#111827]">
              My account
            </h1>
          </div>
          <Link
            href="/shop"
            className="inline-flex h-10 items-center justify-center rounded-[8px] bg-[#356f3b] px-4 font-body text-sm font-extrabold text-white"
          >
            Browse products
          </Link>
        </div>

        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[8px] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#edf6ee] text-[#356f3b]">
                <UserRound size={22} />
              </span>
              <div className="min-w-0">
                <h2 className="truncate font-body text-lg font-extrabold text-[#111827]">
                  {profile?.full_name || "Customer"}
                </h2>
                <p className="truncate font-body text-sm font-semibold text-[#667085]">
                  {profile?.phone || user.phone || profile?.email || user.email}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              <QuickStat label="Orders" value={orderList.length.toString()} />
              <QuickStat
                label="Current status"
                value={orderList[0]?.status ?? "No active order"}
              />
              <QuickStat label="Reviews" value="Ready after delivery" />
            </div>
          </div>

          <div className="rounded-[8px] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-body text-lg font-extrabold text-[#111827]">
                  Order tracking
                </h2>
                <p className="font-body text-sm text-[#667085]">
                  Admin updates will appear here in real time when connected.
                </p>
              </div>
              <PackageCheck className="text-[#356f3b]" size={24} />
            </div>

            <div className="mt-5 grid gap-3">
              {orderList.length === 0 ? (
                <div className="rounded-[8px] border border-dashed border-[#d0d5dd] p-5 text-center">
                  <Clock3 className="mx-auto text-[#98a2b3]" size={24} />
                  <p className="mt-3 font-body text-sm font-extrabold text-[#111827]">
                    No orders yet
                  </p>
                  <p className="mt-1 font-body text-xs text-[#667085]">
                    Add products to cart and send your WhatsApp order.
                  </p>
                </div>
              ) : (
                orderList.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-3 rounded-[8px] bg-[#f7f8f6] p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-body text-sm font-extrabold text-[#111827]">
                        {order.order_no}
                      </p>
                      <p className="font-body text-xs font-semibold capitalize text-[#667085]">
                        {order.status}
                      </p>
                    </div>
                    <span className="font-body text-sm font-extrabold text-[#05833f]">
                      {INR}
                      {Number(order.total_inr).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[8px] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#fff7df] text-[#a8762a]">
                <Star size={18} />
              </span>
              <div>
                <h2 className="font-body text-base font-extrabold text-[#111827]">
                  Rating & review
                </h2>
                <p className="font-body text-sm text-[#667085]">
                  After delivery, rate products from your order detail page.
                </p>
              </div>
            </div>
            <Link
              href="/shop"
              className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#356f3b] px-4 font-body text-xs font-extrabold text-[#356f3b]"
            >
              View products
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[8px] bg-[#f7f8f6] px-3 py-2">
      <span className="font-body text-xs font-semibold text-[#667085]">
        {label}
      </span>
      <span className="max-w-[55%] truncate text-right font-body text-xs font-extrabold capitalize text-[#111827]">
        {value}
      </span>
    </div>
  );
}
