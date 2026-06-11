import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BatchStamp } from "@/components/batch-stamp";
import { User, MapPin, FileText, Calendar, Building, Landmark } from "lucide-react";

export default function StoryPage() {
  return (
    <>
      <SiteHeader />

      <main className="bg-kernel min-h-screen">
        {/* Hero Section */}
        <section className="container pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="max-w-3xl">
            <span className="eyebrow">The Company Story</span>
            <h1
              className="mt-6 font-display text-display-lg lg:text-display-xl text-leaf-deep"
              style={{ fontVariationSettings: "'SOFT' 70, 'opsz' 96" }}
            >
              Empowering a Sustainable Future with Coconet Solutions
            </h1>
            <p className="mt-8 font-body text-lg lg:text-xl text-shell leading-relaxed">
              At Coconet, we&apos;re revolutionizing how natural resources can power innovation.
              Our eco-friendly coconut-based products are crafted to deliver exceptional performance
              while protecting the planet. Whether it&apos;s for agriculture, construction, erosion
              control, or lifestyle needs, our solutions blend nature&apos;s power with cutting-edge sustainability.
            </p>
            <p className="mt-6 font-body text-base text-shell-husk leading-relaxed">
              Join us in building a cleaner, greener world — one coconut at a time.
            </p>
            
            <div className="mt-10">
              <BatchStamp batch="042" pressed="FEB 2026" />
            </div>
          </div>
        </section>

        {/* GST / Registration details */}
        <section className="border-t border-b hairline bg-kernel-deeper/30 py-20 lg:py-24">
          <div className="container">
            <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">
              <div>
                <span className="eyebrow">Official Registration</span>
                <h2
                  className="mt-3 font-display text-display-md text-leaf-deep"
                  style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 40" }}
                >
                  Corporate Profile
                </h2>
                <p className="mt-6 font-body text-sm text-shell leading-relaxed">
                  THENNAIYAN COCONUT COMPANY is a registered business enterprise engaged in coconut-related trading and sustainable business activities. We maintain our principal place of business in Peraiyur, Madurai, operating under regular GST registration.
                </p>
              </div>

              {/* Certificate Details Card */}
              <div className="bg-kernel p-8 lg:p-10 border hairline shadow-sm space-y-8">
                <div className="flex items-center justify-between border-b border-shell/15 pb-6">
                  <div>
                    <span className="font-mono text-eyebrow text-oil uppercase">Registration Details</span>
                    <h3 className="mt-1 font-display text-2xl text-ink" style={{ fontVariationSettings: "'SOFT' 50, 'opsz' 24" }}>
                      Thennaiyan Coconut Company
                    </h3>
                  </div>
                  <Landmark className="text-oil" size={28} strokeWidth={1.5} />
                </div>

                <div className="grid sm:grid-cols-2 gap-6 font-body text-sm text-shell">
                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk flex items-center gap-1.5">
                      <User size={14} className="text-leaf" /> Legal Owner
                    </span>
                    <p className="font-semibold text-ink">Tamilarasan Sathuragiri</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk flex items-center gap-1.5">
                      <FileText size={14} className="text-leaf" /> GST Number (GSTIN)
                    </span>
                    <p className="font-mono font-semibold text-ink">33RRKPS2222A1ZU</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk flex items-center gap-1.5">
                      <Building size={14} className="text-leaf" /> Business Type
                    </span>
                    <p className="font-semibold text-ink">Proprietorship (Single Owner)</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk flex items-center gap-1.5">
                      <Calendar size={14} className="text-leaf" /> GST Registration Date
                    </span>
                    <p className="font-semibold text-ink">22 January 2026</p>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <span className="font-mono text-xs text-shell-husk flex items-center gap-1.5">
                      <MapPin size={14} className="text-leaf" /> Registered Address
                    </span>
                    <p className="font-semibold text-ink leading-relaxed">
                      No. 265/3B, Veppampatti Vilakku, Peraiyur Main Road Near Bus Stop,<br />
                      Pappinaickanpatti, Peraiyur, Madurai District,<br />
                      Tamil Nadu – 625705, India
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk">GST Division / Jurisdiction</span>
                    <p className="font-semibold text-ink">Thirumangalam</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-shell-husk">Branch Locations</span>
                    <p className="font-semibold text-ink">0 (Principal Place Only)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
