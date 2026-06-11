import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getJournalById } from "@/lib/queries";
import { JournalForm } from "@/components/admin/journal-form";

export default async function EditJournalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getJournalById(id);

  if (!entry) notFound();

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <Link
          href="/admin/journal"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-shell hover:text-leaf transition-colors"
        >
          <ArrowLeft size={13} /> Journal
        </Link>
        <h1
          className="mt-3 font-display text-display-md text-leaf-deep"
          style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 40" }}
        >
          Edit log
        </h1>
      </header>

      <JournalForm entry={entry} />
    </div>
  );
}
