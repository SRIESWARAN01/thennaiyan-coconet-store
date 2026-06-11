"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ProductActionState = { error?: string };

function parseProduct(formData: FormData) {
  const benefits = String(formData.get("benefits") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const ratingRaw = String(formData.get("rating") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const isActiveRaw = formData.get("is_active");

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    variant_label: String(formData.get("variant_label") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    category_id: categoryId || null,
    batch_no: String(formData.get("batch_no") ?? "").trim(),
    pressed_at: String(formData.get("pressed_at") ?? "").trim(),
    origin: String(formData.get("origin") ?? "").trim() || "Madurai",
    starting_from_inr: Number(formData.get("starting_from_inr") ?? 0) || 0,
    rating: ratingRaw ? Number(ratingRaw) : null,
    benefits,
    hue_a: String(formData.get("hue_a") ?? "").trim() || "#D4A24C",
    hue_b: String(formData.get("hue_b") ?? "").trim() || "#A8762A",
    is_active: isActiveRaw === "on" || isActiveRaw === "true",
    position: Number(formData.get("position") ?? 0) || 0,
  };
}

function revalidateStorefront() {
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function saveProduct(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const v = parseProduct(formData);

  if (
    !v.slug ||
    !v.name ||
    !v.variant_label ||
    !v.tagline ||
    !v.batch_no ||
    !v.pressed_at
  ) {
    return {
      error:
        "Please fill all required fields: name, slug, variant, tagline, batch number, and pressed date.",
    };
  }

  const supabase = await createClient();

  if (id) {
    const { error } = await supabase.from("products").update(v).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("products").insert(v);
    if (error) return { error: error.message };
  }

  revalidateStorefront();
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);
  revalidateStorefront();
  redirect("/admin/products");
}

export async function toggleProductActive(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  const next = String(formData.get("next_active") ?? "") === "true";
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("products").update({ is_active: next }).eq("id", id);
  revalidateStorefront();
}
