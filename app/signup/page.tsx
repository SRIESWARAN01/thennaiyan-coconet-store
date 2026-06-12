import Link from "next/link";
import { EmailAuthForm } from "@/components/customer/email-auth-form";
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
              Create Account
            </h1>
            <p className="mt-2 text-sm text-white/85">
              Join us to track orders and save your wishlist.
            </p>
          </section>

          <section className="p-6 sm:p-8">
            <EmailAuthForm next={target} mode="signup" />
            <p className="mt-6 text-center font-body text-sm text-[#667085]">
              Already have an account?{" "}
              <Link
                href={`/login?next=${encodeURIComponent(target)}`}
                className="font-extrabold text-[#1f6b3b] hover:underline"
              >
                Login
              </Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
