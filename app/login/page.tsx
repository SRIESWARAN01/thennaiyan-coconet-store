import Link from "next/link";
import { redirect } from "next/navigation";
import { EmailAuthForm } from "@/components/customer/email-auth-form";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Login - Thennaiyan Coconut Company",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const target = next && next.startsWith("/") ? next : "/account";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role === "admin") {
      redirect("/admin");
    } else {
      redirect(target);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8f6] flex flex-col">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-[16px] shadow-[0_12px_36px_rgba(31,107,59,0.08)] overflow-hidden">
          <section className="bg-[#1f6b3b] px-6 py-8 text-center text-white">
            <img
              src="/logo.jpg"
              alt="Thennaiyan"
              className="mx-auto h-16 w-16 rounded-full object-cover border-2 border-white/20"
            />
            <h1 className="mt-4 font-body text-3xl font-extrabold">
              Account Access
            </h1>
            <p className="mt-2 text-sm text-white/85">
              Enter your credentials below to access your account.
            </p>
          </section>

          <section className="p-6 sm:p-8">
            <EmailAuthForm next={target} mode="login" />
            <p className="mt-6 text-center font-body text-sm text-[#667085]">
              New to Thennaiyan?{" "}
              <Link
                href={`/signup?next=${encodeURIComponent(target)}`}
                className="font-extrabold text-[#1f6b3b] hover:underline"
              >
                Create an account
              </Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
