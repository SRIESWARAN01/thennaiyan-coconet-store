import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import { getProducts } from "@/lib/queries";
import { AccountDashboard } from "@/components/customer/account-dashboard";

export const metadata = { title: "My Account - Thennaiyan Coconut Company" };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  // Fetch all necessary data parallelly
  const [
    { data: profile },
    { data: orders },
    { data: enquiries },
    { data: addresses },
    allProducts
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("whatsapp_leads").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("addresses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    getProducts()
  ]);

  return (
    <div className="min-h-screen bg-[#f7f8f6] flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8">
        <div className="mb-6">
          <p className="font-body text-xs font-extrabold uppercase tracking-[0.18em] text-[#667085]">
            Customer Panel
          </p>
          <h1 className="mt-1 font-body text-3xl font-extrabold text-[#111827]">
            My Account
          </h1>
        </div>

        <AccountDashboard
          profile={profile}
          user={user}
          orders={orders || []}
          enquiries={enquiries || []}
          addresses={addresses || []}
          allProducts={allProducts || []}
        />
      </main>
    </div>
  );
}
