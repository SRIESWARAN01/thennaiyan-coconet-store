import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { JournalForm } from "@/components/admin/journal-form";

export default function NewJournalPage() {
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
          New journal log
        </h1>
      </header>

      <JournalForm />
    </div>
  );
}
