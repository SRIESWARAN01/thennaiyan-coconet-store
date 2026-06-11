import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata = { title: "Checkout - Thennaiyan Coconut Company" };

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/checkout");

  const [{ data: profile }, { data: cartRows }] = await Promise.all([
    supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle(),
    supabase.from("cart_items").select(`quantity, product_variants!inner(size_label, price_inr, products!inner(name))`).eq("user_id", user.id),
  ]);

  if (!cartRows?.length) redirect("/cart");

  const items = (cartRows ?? []).map((r: any) => ({
    name: r.product_variants.products.name,
    size: r.product_variants.size_label,
    qty: r.quantity,
    price: Number(r.product_variants.price_inr),
  }));

  return (
    <div className="min-h-screen bg-[#f7f8f6]">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <p className="font-body text-xs font-extrabold uppercase tracking-[0.18em] text-[#667085]">Place order</p>
        <h1 className="mt-1 font-body text-2xl font-extrabold text-[#111827] mb-6">Checkout</h1>
        <CheckoutForm items={items} defaultName={profile?.full_name ?? ""} defaultPhone={profile?.phone ?? ""} />
      </main>
    </div>
  );
}
