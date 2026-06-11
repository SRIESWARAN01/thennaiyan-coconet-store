import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { getSettings } from "@/lib/queries";

export const metadata = {
  title: "Contact - Thennaiyan Coconut Company",
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <SiteHeader />

      <main className="bg-kernel min-h-screen">
        {/* Contact Hero */}
        <section className="container pt-20 pb-12 lg:pt-28 lg:pb-16">
          <div className="max-w-3xl">
            <span className="eyebrow">Contact Us</span>
            <h1
              className="mt-6 font-display text-display-lg lg:text-display-xl text-leaf-deep"
              style={{ fontVariationSettings: "'SOFT' 70, 'opsz' 96" }}
            >
              Connect with the press.
            </h1>
            <p className="mt-6 font-body text-base lg:text-lg text-shell leading-relaxed">
              Have questions about our wooden-press process, custom packaging,
              bulk orders, or shipping timelines? Contact us directly.
            </p>
          </div>
        </section>

        {/* Contact details and form split */}
        <section className="border-t border-b hairline bg-kernel-deeper/20 py-20">
          <div className="container">
            <div className="grid lg:grid-cols-[1fr_1.3fr] gap-16 lg:gap-24 items-start">
              {/* Info Column */}
              <div className="space-y-10">
                <div className="space-y-4">
                  <span className="eyebrow text-oil">Direct Contacts</span>
                  <h2
                    className="font-display text-3xl text-leaf-deep"
                    style={{ fontVariationSettings: "'SOFT' 50, 'opsz' 28" }}
                  >
                    Get in touch
                  </h2>
                </div>

                <div className="space-y-6 font-body text-sm text-shell">
                  <div className="flex gap-4">
                    <Phone
                      className="text-leaf mt-0.5 flex-shrink-0"
                      size={18}
                      strokeWidth={1.5}
                    />
                    <div className="space-y-1">
                      <span className="font-mono text-xs text-shell-husk uppercase tracking-wider block">
                        Phone &amp; WhatsApp
                      </span>
                      <a
                        href={`https://wa.me/${settings.whatsapp_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-ink hover:text-leaf transition-colors text-base"
                      >
                        {settings.contact_phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Mail
                      className="text-leaf mt-0.5 flex-shrink-0"
                      size={18}
                      strokeWidth={1.5}
                    />
                    <div className="space-y-1">
                      <span className="font-mono text-xs text-shell-husk uppercase tracking-wider block">
                        Email Support
                      </span>
                      <a
                        href={`mailto:${settings.contact_email}`}
                        className="font-semibold text-ink hover:text-leaf transition-colors"
                      >
                        {settings.contact_email}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Clock
                      className="text-leaf mt-0.5 flex-shrink-0"
                      size={18}
                      strokeWidth={1.5}
                    />
                    <div className="space-y-1">
                      <span className="font-mono text-xs text-shell-husk uppercase tracking-wider block">
                        Office Hours
                      </span>
                      <p className="font-semibold text-ink">
                        {settings.business_hours}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 border-t border-shell/10 pt-6">
                    <MapPin
                      className="text-leaf mt-0.5 flex-shrink-0"
                      size={18}
                      strokeWidth={1.5}
                    />
                    <div className="space-y-1">
                      <span className="font-mono text-xs text-shell-husk uppercase tracking-wider block">
                        Registered Address
                      </span>
                      <p className="font-semibold text-ink leading-relaxed">
                        {settings.business_name}
                        <br />
                        {settings.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Column */}
              <div className="bg-kernel p-8 lg:p-10 border hairline shadow-sm">
                <h3
                  className="font-display text-2xl text-ink mb-8"
                  style={{ fontVariationSettings: "'SOFT' 50, 'opsz' 24" }}
                >
                  Send a message
                </h3>

                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
