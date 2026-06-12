import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions - Thennaiyan Coconut Company",
  description: "Read the official terms and conditions for using Thennaiyan Coconut Company's platform and services.",
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />

      <main className="bg-kernel min-h-screen pt-20 pb-16 lg:pt-28 lg:pb-24">
        <section className="container max-w-4xl">
          <span className="eyebrow flex items-center gap-1.5 text-leaf">
            <FileText size={14} />
            Legal &amp; Agreements
          </span>
          <h1
            className="mt-6 font-display text-4xl lg:text-5xl text-leaf-deep"
            style={{ fontVariationSettings: "'SOFT' 70, 'opsz' 96" }}
          >
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 font-body text-xs text-gray-500">
            Last Updated: June 12, 2026
          </p>

          <div className="mt-10 space-y-8 font-body text-sm text-shell leading-relaxed">
            <p>
              Welcome to <strong>Thennaiyan Coconut Company</strong> storefront. By accessing this website or using our services, you agree to comply with and be bound by the following terms and conditions of use.
            </p>

            <div className="space-y-3">
              <h2 className="font-display text-xl text-[#1f6b3b] font-bold">1. General Overview</h2>
              <p>
                The terms "Thennaiyan Coconut Company," "we," "us," or "our" refer to the registered proprietorship enterprise operated by Mr. Tamilarasan Sathuragiri, having its principal place of business at Pappinaickanpatti, Peraiyur, Madurai, Tamil Nadu - 625705.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl text-[#1f6b3b] font-bold">2. Order Intent &amp; WhatsApp Fulfilment</h2>
              <p>
                Our store operates on a WhatsApp-first confirmation flow. Adding items to your cart and clicking "Order on WhatsApp" creates an order intent in our database. The final sale, payment terms, and delivery timeline are completed and confirmed during direct correspondence with our team on WhatsApp.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl text-[#1f6b3b] font-bold">3. Pricing &amp; Products</h2>
              <p>
                All prices are listed in Indian Rupees (INR) and are inclusive of standard local taxes where applicable. While we make every effort to display variant sizes, prices, and batch specifications accurately, we reserve the right to modify pricing or refuse/cancel orders in the event of typographical errors or incorrect stock calculations.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl text-[#1f6b3b] font-bold">4. Shipping &amp; Deliveries</h2>
              <p>
                We ship premium wood-pressed and cold-pressed oils from Madurai, Tamil Nadu. Shipping rates and estimated delivery times depend on the destination pincode and shipping partner schedules. All updates regarding dispatched order numbers will be shared via your Customer Panel or direct WhatsApp communication.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl text-[#1f6b3b] font-bold">5. Intellectual Property</h2>
              <p>
                This website contains material, copy, designs, and visual styles that are owned by or licensed to Thennaiyan Coconut Company. Unauthorized reproduction or use of logo assets, trademark names, or lab report certificates is strictly prohibited.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl text-[#1f6b3b] font-bold">6. Governing Law</h2>
              <p>
                Any disputes arising out of the use of this website or the purchase of our products shall be subject to the exclusive jurisdiction of the courts of Madurai District, Tamil Nadu, India.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
