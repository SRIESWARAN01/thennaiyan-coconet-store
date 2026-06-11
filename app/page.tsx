import { HomeProductBrowser } from "@/components/home-product-browser";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getProducts, getCategoryChips, getSettings } from "@/lib/queries";
import { ShoppingCart, MessageCircle } from "lucide-react";

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
        {/* Green Hero Banner */}
        <section className="bg-leaf text-white text-center py-12 px-4 md:py-16">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            {/* Coconut Emoji */}
            <span className="text-4xl mb-3 animate-bounce" style={{ animationDuration: "2.5s" }}>
              🥥
            </span>
            
            <h1 className="font-body font-extrabold text-4xl md:text-5xl lg:text-6.5xl tracking-tight text-white mb-3">
              {settings.business_name}
            </h1>
            
            <p className="font-body text-base md:text-lg font-bold text-white/95 mb-1">
              Registered coconut products and trading from Madurai District.
            </p>
            <p className="font-body text-sm text-white/80 mb-6">
              Explore our products and order directly through WhatsApp.
            </p>

            <a
              href="#products"
              className="px-6 py-2.5 bg-white text-leaf font-bold rounded-full text-sm shadow-sm hover:bg-gray-50 transition-colors"
            >
              Browse Products
            </a>
          </div>
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

      {/* Sticky Bottom Actions Footer */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 border-t border-gray-100 p-4 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] backdrop-blur z-30">
        <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
          <a
            href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(`Hi, I'm checking out products at ${settings.business_name}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 bg-leaf hover:bg-leaf-deep text-white font-bold rounded-full text-sm shadow transition-colors"
          >
            <ShoppingCart size={16} />
            <span>View Cart</span>
          </a>
          <a
            href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(`Hi, I'd like to place a business enquiry with ${settings.business_name}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 border border-leaf hover:bg-leaf/5 text-leaf font-bold rounded-full text-sm transition-colors"
          >
            <MessageCircle size={16} />
            <span>Enquire</span>
          </a>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
