"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  BookText,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/journal", label: "Journal", icon: BookText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {LINKS.map((l) => {
        const active = l.exact
          ? pathname === l.href
          : pathname.startsWith(l.href);
        const Icon = l.icon;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-sm font-body text-sm transition-colors",
              active
                ? "bg-oil text-ink font-medium"
                : "text-kernel/70 hover:text-kernel hover:bg-kernel/10",
            )}
          >
            <Icon size={16} strokeWidth={1.75} />
            {l.label}
          </Link>
        );
      })}

      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex items-center gap-3 px-3 py-2 rounded-sm font-body text-sm text-kernel/50 hover:text-kernel hover:bg-kernel/10 transition-colors"
      >
        <ExternalLink size={16} strokeWidth={1.75} />
        View site
      </a>
    </nav>
  );
}
