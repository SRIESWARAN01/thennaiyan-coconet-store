"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function parseVariant(formData: FormData) {
  return {
    size_label: String(formData.get("size_label") ?? "").trim(),
    size_ml: Number(formData.get("size_ml") ?? 0) || 0,
    price_inr: Number(formData.get("price_inr") ?? 0) || 0,
    stock: Number(formData.get("stock") ?? 0) || 0,
    sku: String(formData.get("sku") ?? "").trim() || null,
    is_active:
      formData.get("is_active") === "on" || formData.get("is_active") === "true",
  };
}

export async function addVariant(formData: FormData): Promise<void> {
  const productId = String(formData.get("product_id") ?? "").trim();
  const v = parseVariant(formData);
  if (!productId || !v.size_label || v.size_ml <= 0) return;

  const supabase = await createClient();
  await supabase.from("product_variants").insert({ product_id: productId, ...v });
  revalidatePath(`/admin/products/${productId}/variants`);
}

export async function updateVariant(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  const productId = String(formData.get("product_id") ?? "").trim();
  const v = parseVariant(formData);
  if (!id || !v.size_label || v.size_ml <= 0) return;

  const supabase = await createClient();
  await supabase.from("product_variants").update(v).eq("id", id);
  if (productId) revalidatePath(`/admin/products/${productId}/variants`);
}

export async function deleteVariant(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  const productId = String(formData.get("product_id") ?? "").trim();
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("product_variants").delete().eq("id", id);
  if (productId) revalidatePath(`/admin/products/${productId}/variants`);
}
