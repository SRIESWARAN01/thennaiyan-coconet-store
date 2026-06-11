import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { getAllJournalAdmin } from "@/lib/queries";
import { deleteJournal } from "@/app/actions/journal";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";

export default async function AdminJournalPage() {
  const entries = await getAllJournalAdmin();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Editorial</span>
          <h1
            className="mt-2 font-display text-display-md text-leaf-deep"
            style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 40" }}
          >
            Journal logs
          </h1>
        </div>
        <Link href="/admin/journal/new" className="btn-primary">
          <Plus size={16} /> New log
        </Link>
      </header>

      {entries.length === 0 ? (
        <p className="font-body text-sm text-shell bg-kernel border hairline p-8 text-center">
          No journal logs yet. Write your first one.
        </p>
      ) : (
        <div className="bg-kernel border hairline divide-y divide-shell/10">
          {entries.map((e) => (
            <div
              key={e.id ?? e.slug}
              className="p-5 flex flex-wrap items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-shell-husk">
                  <span>{e.date_label}</span>
                  {e.batch && <span className="text-oil">{e.batch}</span>}
                  {e.is_published ? (
                    <span className="text-leaf">● Published</span>
                  ) : (
                    <span className="text-shell-husk">○ Draft</span>
                  )}
                </div>
                <h2 className="mt-1.5 font-display text-lg text-leaf-deep">
                  {e.title}
                </h2>
                <p className="mt-1 font-body text-sm text-shell line-clamp-2 max-w-2xl">
                  {e.excerpt}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/journal/${e.id}/edit`}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-leaf text-leaf hover:bg-leaf hover:text-kernel transition-colors rounded-sm text-xs font-medium"
                >
                  <Pencil size={12} /> Edit
                </Link>
                <form action={deleteJournal} className="inline">
                  <input type="hidden" name="id" value={e.id} />
                  <ConfirmSubmit
                    message={`Delete "${e.title}"? This cannot be undone.`}
                    className="px-2.5 py-1.5 border border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition-colors rounded-sm text-xs font-medium"
                  >
                    Delete
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
