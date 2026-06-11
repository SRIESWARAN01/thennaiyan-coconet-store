import { BatchStamp } from "@/components/batch-stamp";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-kernel/70">
      <div className="container py-16">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12">
          <div>
            <img
              src="/logo.jpg"
              alt="Thennaiyan Coconut Company"
              className="h-12 w-auto object-contain mb-4"
            />
            <p className="mt-4 font-body text-sm leading-relaxed max-w-xs text-kernel/70">
              <strong>Thennaiyan Coconut Company</strong><br />
              No. 265/3B, Veppampatti Vilakku,<br />
              Peraiyur Main Road Near Bus Stop,<br />
              Pappinaickanpatti, Peraiyur,<br />
              Madurai District, Tamil Nadu – 625705
            </p>
            <div className="mt-6">
              <BatchStamp
                batch="042"
                pressed="FEB 2026"
                className="!text-kernel/60 !border-kernel/15 !bg-transparent"
              />
            </div>
          </div>

          {[
            { title: "Shop",   links: ["Chekku", "Virgin", "Hair oil", "Cooking pack"] },
            { title: "Story",  links: ["The press", "The grove", "Journal", "Press"] },
            { title: "Help",   links: ["Shipping", "Returns", "Contact", "FAQ"] },
          ].map((col) => (
            <div key={col.title}>
              <div className="eyebrow text-oil">{col.title}</div>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a className="font-body text-sm hover:text-kernel transition-colors" href="#">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-kernel/10 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-eyebrow text-kernel/40">
            © 2026 THENNAIYAN COCONUT COMPANY · MADURAI 625705
          </p>
          <p className="font-mono text-eyebrow text-kernel/40">
            Built with care by PixlNova
          </p>
        </div>
      </div>
    </footer>
  );
}
