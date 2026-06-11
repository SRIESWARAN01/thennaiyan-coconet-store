"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveJournal, type JournalActionState } from "@/app/actions/journal";

export interface JournalFormEntry {
  id?: string;
  slug: string;
  date_label: string;
  batch: string | null;
  title: string;
  excerpt: string;
  body: string | null;
  read_time: string;
  is_published: boolean;
  position: number;
}

const INITIAL: JournalActionState = {};

const labelCls =
  "font-mono text-[10px] text-shell-husk uppercase tracking-wider block mb-1.5";
const inputCls =
  "w-full bg-kernel border border-shell/20 focus:border-leaf focus:outline-none transition-colors px-3 py-2 text-sm text-ink font-body rounded-sm";

export function JournalForm({ entry }: { entry?: JournalFormEntry | null }) {
  const [state, formAction, pending] = useActionState<JournalActionState, FormData>(
    saveJournal,
    INITIAL,
  );

  return (
    <form action={formAction} className="space-y-8">
      {entry?.id && <input type="hidden" name="id" value={entry.id} />}

      <div>
        <label className={labelCls}>Title *</label>
        <input
          name="title"
          required
          defaultValue={entry?.title ?? ""}
          placeholder="Harvesting the summer crop in Pappinaickanpatti"
          className={inputCls}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Slug (URL id) *</label>
          <input
            name="slug"
            required
            defaultValue={entry?.slug ?? ""}
            placeholder="summer-crop-harvest"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Date label *</label>
          <input
            name="date_label"
            required
            defaultValue={entry?.date_label ?? ""}
            placeholder="28 FEB 2026"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Batch tag (optional)</label>
          <input
            name="batch"
            defaultValue={entry?.batch ?? ""}
            placeholder="BATCH 042"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Read time</label>
          <input
            name="read_time"
            defaultValue={entry?.read_time ?? "4 min read"}
            placeholder="4 min read"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Excerpt (shown in the list) *</label>
        <textarea
          name="excerpt"
          required
          rows={3}
          defaultValue={entry?.excerpt ?? ""}
          placeholder="A short summary of the log entry…"
          className={`${inputCls} resize-none`}
        />
      </div>

      <div>
        <label className={labelCls}>Full body (optional)</label>
        <textarea
          name="body"
          rows={8}
          defaultValue={entry?.body ?? ""}
          placeholder="The full article text…"
          className={`${inputCls} resize-y`}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5 items-center">
        <div>
          <label className={labelCls}>Sort position</label>
          <input
            name="position"
            type="number"
            step="1"
            defaultValue={entry?.position ?? 0}
            className={inputCls}
          />
        </div>
        <label className="flex items-center gap-3 font-body text-sm text-ink mt-5">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={entry ? entry.is_published : true}
            className="h-4 w-4 accent-leaf"
          />
          Published (visible on the journal page)
        </label>
      </div>

      {state?.error && (
        <p className="font-body text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-sm">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2 border-t hairline">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Saving…" : entry?.id ? "Save changes" : "Create log"}
        </button>
        <Link href="/admin/journal" className="btn-secondary mt-6">
          Cancel
        </Link>
      </div>
    </form>
  );
}
