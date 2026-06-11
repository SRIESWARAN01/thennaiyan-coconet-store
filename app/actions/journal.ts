"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type JournalActionState = { error?: string };

function parseJournal(formData: FormData) {
  const isPub = formData.get("is_published");
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    date_label: String(formData.get("date_label") ?? "").trim(),
    batch: String(formData.get("batch") ?? "").trim() || null,
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim() || null,
    read_time: String(formData.get("read_time") ?? "").trim() || "4 min read",
    is_published: isPub === "on" || isPub === "true",
    position: Number(formData.get("position") ?? 0) || 0,
  };
}

function revalidateJournal() {
  revalidatePath("/admin/journal");
  revalidatePath("/journal");
}

export async function saveJournal(
  _prev: JournalActionState,
  formData: FormData,
): Promise<JournalActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const v = parseJournal(formData);

  if (!v.slug || !v.date_label || !v.title || !v.excerpt) {
    return {
      error: "Please fill all required fields: title, slug, date label, and excerpt.",
    };
  }

  const supabase = await createClient();

  if (id) {
    const { error } = await supabase
      .from("journal_entries")
      .update(v)
      .eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("journal_entries").insert(v);
    if (error) return { error: error.message };
  }

  revalidateJournal();
  redirect("/admin/journal");
}

export async function deleteJournal(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("journal_entries").delete().eq("id", id);
  revalidateJournal();
  redirect("/admin/journal");
}
