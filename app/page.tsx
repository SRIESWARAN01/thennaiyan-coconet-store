import { HomeProductBrowser } from "@/components/home-product-browser";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HeroBanner } from "@/components/hero-banner";
import { ConsumptionCalculator } from "@/components/consumption-calculator";
import { StickyFooterActions } from "@/components/sticky-footer-actions";
import { getProducts, getCategoryChips, getSettings } from "@/lib/queries";

export default async function HomePage() {
  const [products, categories, settings] = await Promise.all([
    getProducts(),
    getCategoryChips(),
    getSettings(),
  ]);

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-white pb-24">
        {/* Localized Hero Banner */}
        <HeroBanner businessName={settings.business_name} />

        {/* Dynamic Savings Calculator */}
        <section className="container py-8 border-b border-gray-50 bg-[#fbfbfa]">
          <ConsumptionCalculator />
        </section>

        {/* Menu/Products Section */}
        <section id="products" className="container py-8">
          <HomeProductBrowser
            products={products}
            categories={categories}
            whatsappNumber={settings.whatsapp_number}
            brand={settings.brand_short}
          />
        </section>
      </main>

      {/* Localized Sticky Bottom Actions Footer */}
      <StickyFooterActions
        whatsappNumber={settings.whatsapp_number}
        businessName={settings.business_name}
      />

      <SiteFooter />
    </>
  );
}
