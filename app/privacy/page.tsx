import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - Thennaiyan Coconut Company",
  description: "Learn how Thennaiyan Coconut Company collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />

      <main className="bg-kernel min-h-screen pt-20 pb-16 lg:pt-28 lg:pb-24">
        <section className="container max-w-4xl">
          <span className="eyebrow flex items-center gap-1.5 text-leaf">
            <ShieldCheck size={14} />
            Legal &amp; Trust
          </span>
          <h1
            className="mt-6 font-display text-4xl lg:text-5xl text-leaf-deep"
            style={{ fontVariationSettings: "'SOFT' 70, 'opsz' 96" }}
          >
            Privacy Policy
          </h1>
          <p className="mt-4 font-body text-xs text-gray-500">
            Last Updated: June 12, 2026
          </p>

          <div className="mt-10 space-y-8 font-body text-sm text-shell leading-relaxed">
            <p>
              At <strong>Thennaiyan Coconut Company</strong>, we prioritize the privacy and security of our customer and visitor information. This Privacy Policy details how we handle, collect, and protect your data when you interact with our e-commerce storefront, place orders, or connect with us on WhatsApp.
            </p>

            <div className="space-y-3">
              <h2 className="font-display text-xl text-leaf-deep font-bold">1. Information We Collect</h2>
              <p>
                We collect information necessary to process your enquiries, manage your customer account, and facilitate WhatsApp-based orders. This includes:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Personal Identifiers:</strong> Name, Email Address, and Phone/Mobile number.</li>
                <li><strong>Delivery details:</strong> Shipping address, billing address, and contact information.</li>
                <li><strong>Transaction details:</strong> Pre-filled WhatsApp message data, cart history, and order selections.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl text-leaf-deep font-bold">2. How We Use Your Information</h2>
              <p>
                Your personal details are used solely to improve our trading and order fulfilment processes:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>To compile prefilled WhatsApp messages for your checkout intent.</li>
                <li>To maintain your secure Customer Account containing order histories, active cart statuses, and saved shipping addresses.</li>
                <li>To coordinate dispatch, shipping, and delivery of wood-pressed oils and coconut byproducts.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl text-leaf-deep font-bold">3. Data Sharing &amp; Security</h2>
              <p>
                We do not sell, rent, or trade your personal data. We utilize industry-standard security practices, including data encryption via Supabase and Row-Level Security (RLS) policies, to restrict unauthorized database access.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl text-leaf-deep font-bold">4. WhatsApp Redirection</h2>
              <p>
                When you initiate an enquiry or place an order, our system compiles the transaction details and opens a secure WhatsApp thread. Communication on WhatsApp is subject to Meta's default privacy policies.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl text-leaf-deep font-bold">5. Contact Information</h2>
              <p>
                If you have any questions regarding this Privacy Policy or your data, you can reach our data compliance team at <a href="mailto:support@thennaiyan.in" className="text-[#1f6b3b] font-semibold underline">support@thennaiyan.in</a>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
