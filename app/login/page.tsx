import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { PhoneAuthForm } from "@/components/customer/phone-auth-form";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Login - Thennaiyan Coconut Company",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; admin?: string }>;
}) {
  const { next, admin } = await searchParams;
  const target = next && next.startsWith("/") ? next : "/account";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && target !== "/admin") {
    redirect(target);
  }

  return (
    <div className="min-h-screen bg-[#f7f8f6]">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <section className="overflow-hidden rounded-b-[28px] bg-[#1f6b3b] px-6 py-10 text-center text-white shadow-[0_18px_35px_rgba(16,93,52,0.18)]">
          <img
            src="/logo.jpg"
            alt="Thennaiyan"
            className="mx-auto h-12 w-12 rounded-full object-cover"
          />
          <h1 className="mt-5 font-body text-3xl font-extrabold sm:text-5xl">
            Account access
          </h1>
          <p className="mx-auto mt-2 max-w-md font-body text-sm font-semibold text-white/90">
            Login with mobile number for customer orders, or use admin login for
            store management.
          </p>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[8px] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.08)] sm:p-7">
            <PhoneAuthForm next={target} mode="login" />
            <p className="mt-5 text-center font-body text-sm text-[#667085]">
              New customer?{" "}
              <Link
                href={`/signup?next=${encodeURIComponent(target)}`}
                className="font-extrabold text-[#1f6b3b]"
              >
                Create account
              </Link>
            </p>
          </div>

          <div className="rounded-[8px] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.08)] sm:p-7">
            <div className="mb-5">
              <p className="font-body text-xs font-extrabold uppercase tracking-[0.18em] text-[#667085]">
                Admin
              </p>
              <h2 className="mt-2 font-body text-2xl font-extrabold text-[#111827]">
                Store manager login
              </h2>
              <p className="mt-1 font-body text-sm text-[#667085]">
                Use your separate admin email and password.
              </p>
            </div>
            <LoginForm next={admin === "1" ? "/admin" : "/admin"} />
          </div>
        </section>
      </main>
    </div>
  );
}
