import Link from "next/link";
import { Package, BookText, Settings, Plus, ArrowRight, BarChart3, ShoppingCart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [productRes, activeRes, journalRes] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("journal_entries")
      .select("id", { count: "exact", head: true }),
  ]);

  const productCount = productRes.count ?? 0;
  const activeCount = activeRes.count ?? 0;
  const journalCount = journalRes.count ?? 0;

  const stats = [
    {
      label: "Products",
      value: productCount,
      sub: `${activeCount} active on storefront`,
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "Journal logs",
      value: journalCount,
      sub: "Published & drafts",
      href: "/admin/journal",
      icon: BookText,
    },
  ];

  return (
    <div className="space-y-10">
      <header>
        <span className="eyebrow">Overview</span>
        <h1
          className="mt-2 font-display text-display-md text-leaf-deep"
          style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 40" }}
        >
          Welcome back.
        </h1>
        <p className="mt-2 font-body text-sm text-shell">
          Add or edit products, write journal logs, and update your store
          details. Changes appear on the live site right away.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group bg-kernel border hairline p-6 hover:border-leaf/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <Icon size={22} strokeWidth={1.5} className="text-oil" />
                <ArrowRight
                  size={16}
                  className="text-shell-husk group-hover:translate-x-1 transition-transform"
                />
              </div>
              <div
                className="mt-4 font-display text-4xl text-leaf-deep"
                style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 40" }}
              >
                {s.value}
              </div>
              <div className="mt-1 font-body text-sm text-ink">{s.label}</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-shell-husk mt-0.5">
                {s.sub}
              </div>
            </Link>
          );
        })}
      </div>

      <div>
        <span className="eyebrow">Quick actions</span>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/products/new" className="btn-primary">
            <Plus size={16} /> New product
          </Link>
          <Link href="/admin/analytics" className="btn-secondary">
            <BarChart3 size={16} /> Analytics
          </Link>
          <Link href="/admin/orders" className="btn-secondary">
            <ShoppingCart size={16} /> Orders
          </Link>
          <Link href="/admin/journal/new" className="btn-secondary">
            <Plus size={16} /> New journal log
          </Link>
          <Link href="/admin/settings" className="btn-secondary">
            <Settings size={16} /> Store settings
          </Link>
        </div>
      </div>
    </div>
  );
}
