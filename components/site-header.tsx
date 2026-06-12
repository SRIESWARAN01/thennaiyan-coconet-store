"use client";

import Link from "next/link";
import { ShoppingCart, QrCode, History } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { LanguageToggle } from "./language-toggle";

export function SiteHeader() {
  const { t } = useLanguage();

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-40">
      <div className="container flex items-center justify-between h-16">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <img
            src="/logo.jpg"
            alt={t("brand")}
            className="h-9 w-9 rounded-full border border-leaf/10 object-cover"
          />
          <span className="font-body font-bold text-lg text-ink tracking-tight">
            {t("brand")}
          </span>
        </Link>

        {/* Header Actions */}
        <div className="flex items-center gap-2 text-gray-700">
          <LanguageToggle />

          <Link
            href="/cart"
            aria-label={t("cart")}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors relative"
          >
            <ShoppingCart size={20} strokeWidth={2} />
          </Link>
          <button
            aria-label={t("scanQR")}
            onClick={() => alert("Table scanner initiated...")}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <QrCode size={20} strokeWidth={2} />
          </button>
          <Link
            href="/account/orders"
            aria-label={t("orderHistory")}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <History size={20} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </header>
  );
}
