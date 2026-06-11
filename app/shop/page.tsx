import { Leaf, Search } from "lucide-react";
import { HomeProductBrowser } from "@/components/home-product-browser";
import { SiteHeader } from "@/components/site-header";
import { getCategoryChips, getProducts, getSettings } from "@/lib/queries";

export const metadata = {
  title: "Shop - Thennaiyan Coconut Company",
};

export default async function ShopPage() {
  const [products, categories, settings] = await Promise.all([
    getProducts(),
    getCategoryChips(),
    getSettings(),
  ]);

  return (
    <div className="min-h-screen bg-[#f7f8f6]">
      <SiteHeader />

      <main className="pb-24">
        <section className="mx-auto max-w-6xl px-3 py-5 sm:px-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#edf6ee] text-[#1f6b3b]">
                <Leaf size={18} strokeWidth={2.4} />
              </span>
              <div>
                <h1 className="font-body text-xl font-extrabold text-[#111827]">
                  Product menu
                </h1>
                <p className="font-body text-xs font-semibold text-[#667085]">
                  Choose products and send your order on WhatsApp.
                </p>
              </div>
            </div>

            <div className="hidden h-9 items-center gap-2 rounded-full bg-white px-3 font-body text-xs font-bold text-[#667085] shadow-sm sm:flex">
              <Search size={14} />
              <span>{products.length} products</span>
            </div>
          </div>

          <HomeProductBrowser
            products={products}
            categories={categories}
            whatsappNumber={settings.whatsapp_number}
            brand={settings.brand_short}
          />
        </section>
      </main>
    </div>
  );
}
