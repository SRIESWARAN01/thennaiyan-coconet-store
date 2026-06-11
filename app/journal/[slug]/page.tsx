import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getJournalBySlug } from "@/lib/queries";

export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getJournalBySlug(slug);

  if (!entry) notFound();

  return (
    <>
      <SiteHeader />

      <main className="bg-kernel min-h-screen">
        <article className="container py-20 lg:py-28 max-w-3xl">
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-shell hover:text-leaf transition-colors"
          >
            <ArrowLeft size={13} /> The Journal
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-shell-husk uppercase tracking-wider">
            <span>{entry.date_label}</span>
            {entry.batch && (
              <>
                <span>/</span>
                <span className="text-oil font-semibold">{entry.batch}</span>
              </>
            )}
            <span>/</span>
            <span>{entry.read_time}</span>
          </div>

          <h1
            className="mt-4 font-display text-display-md lg:text-display-lg text-leaf-deep"
            style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 64" }}
          >
            {entry.title}
          </h1>

          <p className="mt-8 font-body text-lg text-shell leading-relaxed">
            {entry.excerpt}
          </p>

          {entry.body && (
            <div className="mt-8 space-y-5 font-body text-base text-ink leading-relaxed">
              {entry.body
                .split(/\n{2,}/)
                .map((para) => para.trim())
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))}
            </div>
          )}
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
