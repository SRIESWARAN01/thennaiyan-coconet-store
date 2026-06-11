import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/story", label: "The Press" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="border-b hairline">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center bg-ink px-4 py-1.5 rounded-sm hover:opacity-95 transition-opacity">
          <img
            src="/logo.jpg"
            alt="Thennaiyan Coconut Company"
            className="h-9 w-auto object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-body text-sm text-shell hover:text-leaf transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href="/account"
            aria-label="Account"
            className="text-shell hover:text-leaf transition-colors"
          >
            <User size={18} strokeWidth={1.5} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative text-shell hover:text-leaf transition-colors"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </header>
  );
}
