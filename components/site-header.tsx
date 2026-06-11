"use client";

import Link from "next/link";
import { ShoppingCart, QrCode, History } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-40">
      <div className="container flex items-center justify-between h-16">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="h-9 w-9 rounded-full bg-leaf/10 flex items-center justify-center text-leaf border border-leaf/10">
            {/* Coconut Palm Leaf Icon */}
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 2.76 1.12 5.26 2.93 7.07L12 12l7.07 7.07C20.88 17.26 22 14.76 22 12c0-5.52-4.48-10-10-10zm-1 4.05c-.47.1-1.39.46-2.03.96L10 8.01c.42-.31 1-.54 1-.54v-1.37c-.01-.01-.01-.01 0 0zm2 0v1.37s.58.23 1 .54l1.09-1c-.64-.5-1.56-.86-2.03-.96c-.02-.01-.04-.01-.06 0zm-5.4 3.7c-.55.43-1.07 1.05-1.4 1.76l1.37.49c.21-.5.56-.94.56-.94l-.53-1.31zm8.8 0l-.53 1.31s.35.44.56.94l1.37-.49c-.33-.71-.85-1.33-1.4-1.76z" />
            </svg>
          </div>
          <span className="font-body font-bold text-lg text-ink tracking-tight">COCO Paradise</span>
        </Link>

        {/* Header Actions */}
        <div className="flex items-center gap-2 text-gray-700">
          <Link
            href="/cart"
            aria-label="Cart"
            className="p-2 hover:bg-gray-50 rounded-full transition-colors relative"
          >
            <ShoppingCart size={20} strokeWidth={2} />
          </Link>
          <button
            aria-label="Scan Table QR"
            onClick={() => alert("Table scanner initiated...")}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <QrCode size={20} strokeWidth={2} />
          </button>
          <Link
            href="/orders/history"
            aria-label="Order History"
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <History size={20} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </header>
  );
}
