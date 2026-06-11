import Link from "next/link";
import { PhoneAuthForm } from "@/components/customer/phone-auth-form";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Create Account - Thennaiyan Coconut Company",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const target = next && next.startsWith("/") ? next : "/account";

  return (
    <div className="min-h-screen bg-[#f7f8f6]">
      <SiteHeader />

      <main className="mx-auto max-w-xl px-4 py-8 sm:py-12">
        <section className="overflow-hidden rounded-b-[28px] bg-[#1f6b3b] px-6 py-10 text-center text-white shadow-[0_18px_35px_rgba(16,93,52,0.18)]">
          <img
            src="/logo.jpg"
            alt="Thennaiyan"
            className="mx-auto h-12 w-12 rounded-full object-cover"
          />
          <h1 className="mt-5 font-body text-3xl font-extrabold sm:text-5xl">
            Create account
          </h1>
          <p className="mx-auto mt-2 max-w-md font-body text-sm font-semibold text-white/90">
            Use your mobile number to keep cart, WhatsApp leads, orders, and
            tracking in one place.
          </p>
        </section>

        <section className="mt-6 rounded-[8px] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.08)] sm:p-7">
          <PhoneAuthForm next={target} mode="signup" />
          <p className="mt-5 text-center font-body text-sm text-[#667085]">
            Already have an account?{" "}
            <Link
              href={`/login?next=${encodeURIComponent(target)}`}
              className="font-extrabold text-[#1f6b3b]"
            >
              Login
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
