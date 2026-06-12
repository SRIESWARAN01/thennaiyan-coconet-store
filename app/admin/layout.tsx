import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata = {
  title: "Admin - Thennaiyan Coconut Company",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  // Signed in, but not an admin.
  if (!profile || profile.role !== "admin") {
    return (
      <main className="min-h-screen bg-kernel flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-kernel border hairline p-10 shadow-sm">
          <h1
            className="font-display text-2xl text-leaf-deep"
            style={{ fontVariationSettings: "'SOFT' 55, 'opsz' 28" }}
          >
            Not authorised
          </h1>
          <p className="mt-3 font-body text-sm text-shell">
            The account{" "}
            <span className="font-mono text-ink">{user.email}</span> is not an
            admin. Ask the owner to promote it, then sign in again.
          </p>
          <form action={signOut} className="mt-6">
            <button type="submit" className="btn-secondary">
              Sign out
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-kernel-deeper/20 lg:grid lg:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="bg-leaf-deep text-kernel lg:min-h-screen flex flex-col">
        <div className="p-5 border-b border-kernel/10 flex items-center justify-between lg:block">
          <div>
            <div
              className="font-display text-xl text-kernel"
              style={{ fontVariationSettings: "'SOFT' 50, 'opsz' 24" }}
            >
              Thennaiyan Admin
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-kernel/50">
              Content manager
            </div>
          </div>
          
          {/* Quick Sign Out on Mobile Header */}
          <form action={signOut} className="lg:hidden">
            <button
              type="submit"
              className="px-3 py-1.5 rounded-sm bg-white/10 hover:bg-white/20 text-xs font-bold font-body transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="p-3 flex-1">
          <AdminNav />
        </div>

        <div className="p-3 border-t border-kernel/10 hidden lg:block">
          <div className="px-3 py-1 font-mono text-[10px] text-kernel/50 truncate">
            Logged in as:
          </div>
          <div className="px-3 pb-1 font-mono text-[10px] text-kernel/70 truncate">
            {profile.full_name || profile.email || user.email}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0">
        <div className="p-6 lg:p-10 max-w-5xl">{children}</div>
      </div>
    </div>
  );
}
