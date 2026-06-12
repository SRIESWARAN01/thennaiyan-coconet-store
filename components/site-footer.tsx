import { getSettings } from "@/lib/queries";

export async function SiteFooter() {
  const settings = await getSettings();

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <img
                src="/logo.jpg"
                alt={settings.brand_short}
                className="h-8 w-8 rounded-full border border-leaf/20 object-cover"
              />
              <span>{settings.brand_short}</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed">
              Registered proprietorship business engaged in coconut-related
              trading and business activities from Peraiyur, Madurai District.
            </p>
          </div>

          <div>
            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-leaf">
              Contact
            </div>
            <p className="text-sm leading-relaxed">
              {settings.business_name}
              <br />
              {settings.address}
              <span className="mt-2 block font-semibold text-white">
                Phone: {settings.contact_phone}
              </span>
              <span className="block text-xs">Email: {settings.contact_email}</span>
            </p>
          </div>

          <div>
            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-leaf">
              Company
            </div>
            <ul className="space-y-2 text-sm">
              {[
                ["Products", "/#products"],
                ["Story", "/story"],
                ["Journal", "/journal"],
                ["Contact", "/contact"],
                ["Privacy Policy", "/privacy"],
                ["Terms & Conditions", "/terms"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="transition-colors hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-gray-900 pt-6 text-xs text-gray-600">
          <p>
            &copy; 2026 {settings.business_name.toUpperCase()} &middot; ALL
            RIGHTS RESERVED
          </p>
          <p>Built with care by PixlNova</p>
        </div>
      </div>
    </footer>
  );
}
