import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { getProducts, getSettings } from "@/lib/queries";

const INR = "\u20B9";

function price(amount: number) {
  return `${INR}${amount.toFixed(2)}`;
}

export const metadata = {
  title: "Cart - Thennaiyan Coconut Company",
};

export default async function CartPage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  const demoItem = products[0];
  const quantity = demoItem ? 1 : 0;
  const subtotal = demoItem ? demoItem.startingFrom * quantity : 0;
  const handling = subtotal > 0 ? 25 : 0;
  const total = subtotal + handling;

  const whatsappMessage = demoItem
    ? `Hi ${settings.brand_short}, I want to order:\n\n${demoItem.name} (${demoItem.variant}) x ${quantity}\nBatch: ${demoItem.batch}\nTotal: ${price(total)}\n\nPlease confirm availability.`
    : `Hi ${settings.brand_short}, I want to place an order.`;
  const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    whatsappMessage,
  )}`;

  return (
    <div className="min-h-screen bg-[#f7f8f6]">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-5 pb-12 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="font-body text-xl font-extrabold text-[#111827]">
            Cart
          </h1>
          {demoItem && (
            <Link
              href="/shop"
              className="font-body text-xs font-bold text-red-600 hover:text-red-700"
            >
              Clear cart
            </Link>
          )}
        </div>

        <section className="mt-6 rounded-[8px] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
          <p className="mb-2 font-body text-xs font-semibold text-[#344054]">
            Order type
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button className="h-10 rounded-[8px] bg-[#f0f2f0] font-body text-sm font-bold text-[#111827] shadow-inner">
              WhatsApp order
            </button>
            <button className="h-10 rounded-[8px] bg-[#fafafa] font-body text-sm font-bold text-[#667085] hover:bg-[#f0f2f0]">
              Call back
            </button>
          </div>
        </section>

        {!demoItem ? (
          <section className="mt-4 rounded-[8px] bg-white p-8 text-center shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#edf6ee] text-[#356f3b]">
              <ShoppingCart size={22} />
            </div>
            <h2 className="mt-4 font-body text-lg font-extrabold text-[#111827]">
              Your cart is empty
            </h2>
            <p className="mt-1 font-body text-sm text-[#667085]">
              Add products from the menu to get started.
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-[8px] bg-[#356f3b] px-5 font-body text-sm font-extrabold text-white"
            >
              Browse products
            </Link>
          </section>
        ) : (
          <>
            <section className="mt-4 rounded-[8px] bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
              <div className="flex gap-3">
                <div
                  className="h-16 w-16 shrink-0 rounded-[8px]"
                  style={{
                    background: `linear-gradient(150deg, ${demoItem.hueA}, ${demoItem.hueB})`,
                  }}
                />

                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-body text-sm font-extrabold text-[#111827]">
                    {demoItem.name}
                  </h2>
                  <p className="mt-1 font-body text-xs text-[#667085]">
                    {price(demoItem.startingFrom)} x {quantity}
                  </p>
                  <p className="font-body text-xs font-extrabold text-[#111827]">
                    {price(subtotal)}
                  </p>
                  <p className="mt-1 font-body text-[11px] font-semibold text-[#667085]">
                    Batch {demoItem.batch} - {demoItem.pressed}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <button
                    aria-label="Decrease quantity"
                    className="grid h-8 w-8 place-items-center rounded-[8px] bg-[#f3f4f4] text-[#667085]"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-5 text-center font-body text-sm font-extrabold">
                    {quantity}
                  </span>
                  <button
                    aria-label="Increase quantity"
                    className="grid h-8 w-8 place-items-center rounded-[8px] bg-[#f3f4f4] text-[#111827]"
                  >
                    <Plus size={14} />
                  </button>
                  <Link
                    href="/shop"
                    aria-label="Remove item"
                    className="grid h-8 w-8 place-items-center rounded-[8px] text-red-600"
                  >
                    <Trash2 size={15} />
                  </Link>
                </div>
              </div>
            </section>

            <section className="mt-5 rounded-[8px] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
              <PriceRow label="Subtotal" value={subtotal} />
              <PriceRow label="Packing / handling" value={handling} />
              <div className="mt-2 border-t border-[#111827] pt-2">
                <PriceRow label="Grand total" value={total} strong />
              </div>
            </section>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-[8px] bg-[#356f3b] font-body text-sm font-extrabold text-white shadow-sm transition hover:bg-[#285f31]"
            >
              Place order - {price(total)}
            </a>
          </>
        )}
      </main>
    </div>
  );
}

function PriceRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-1 font-body text-sm ${
        strong ? "font-extrabold text-[#111827]" : "text-[#344054]"
      }`}
    >
      <span>{label}</span>
      <span>{price(value)}</span>
    </div>
  );
}
