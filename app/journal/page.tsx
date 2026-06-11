import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArrowRight } from "lucide-react";
import { getJournalEntries } from "@/lib/queries";

export const metadata = {
  title: "Journal · Coconet",
};

export default async function JournalPage() {
  const entries = await getJournalEntries();

  return (
    <>
      <SiteHeader />

      <main className="bg-kernel min-h-screen">
        {/* Journal Hero */}
        <section className="container pt-20 pb-12 lg:pt-28 lg:pb-16">
          <div className="max-w-3xl">
            <span className="eyebrow">The Journal</span>
            <h1
              className="mt-6 font-display text-display-lg lg:text-display-xl text-leaf-deep"
              style={{ fontVariationSettings: "'SOFT' 70, 'opsz' 96" }}
            >
              Logs from the press.
            </h1>
            <p className="mt-6 font-body text-base lg:text-lg text-shell leading-relaxed">
              Stories of harvest seasons, the physics of traditional extraction,
              and our commitment to single-origin coconut farming in Tamil Nadu.
            </p>
          </div>
        </section>

        {/* Editorial list */}
        <section className="border-t border-b hairline bg-kernel-deeper/20 py-20">
          <div className="container max-w-4xl">
            {entries.length === 0 ? (
              <p className="font-body text-sm text-shell text-center">
                No journal entries yet. Check back soon.
              </p>
            ) : (
              <div className="space-y-16 lg:space-y-24">
                {entries.map((entry) => (
                  <article
                    key={entry.slug}
                    className="group border-b border-shell/10 pb-12 lg:pb-16 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-shell-husk uppercase tracking-wider">
                      <span>{entry.date_label}</span>
                      {entry.batch && (
                        <>
                          <span>/</span>
                          <span className="text-oil font-semibold">
                            {entry.batch}
                          </span>
                        </>
                      )}
                      <span>/</span>
                      <span>{entry.read_time}</span>
                    </div>

                    <h2
                      className="mt-4 font-display text-2xl lg:text-3xl text-leaf-deep group-hover:text-leaf transition-colors duration-300"
                      style={{ fontVariationSettings: "'SOFT' 55, 'opsz' 28" }}
                    >
                      <a href={`/journal/${entry.slug}`}>{entry.title}</a>
                    </h2>

                    <p className="mt-4 font-body text-sm text-shell leading-relaxed max-w-3xl">
                      {entry.excerpt}
                    </p>

                    <div className="mt-6">
                      <a
                        href={`/journal/${entry.slug}`}
                        className="inline-flex items-center gap-1.5 font-mono text-[11px] text-leaf hover:text-leaf-deep uppercase tracking-wider font-semibold group-hover:translate-x-1 transition-transform duration-300"
                      >
                        Read log
                        <ArrowRight size={12} strokeWidth={2} />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
