"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CouponActionState = { error?: string };

export async function createCoupon(
  _prev: CouponActionState,
  formData: FormData,
): Promise<CouponActionState> {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const discountType = String(formData.get("discount_type") ?? "percent").trim();
  const discountValue = Number(formData.get("discount_value") ?? 0) || 0;
  const minOrder = Number(formData.get("min_order_inr") ?? 0) || 0;
  const maxUsesRaw = String(formData.get("max_uses") ?? "").trim();
  const validUntilRaw = String(formData.get("valid_until") ?? "").trim();
  const isActive =
    formData.get("is_active") === "on" || formData.get("is_active") === "true";

  if (!code) return { error: "Coupon code is required." };
  if (discountType !== "percent" && discountType !== "flat") {
    return { error: "Discount type must be percent or flat." };
  }
  if (discountValue <= 0) {
    return { error: "Discount value must be greater than 0." };
  }
  if (discountType === "percent" && discountValue > 100) {
    return { error: "A percent discount cannot be more than 100." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("coupons").insert({
    code,
    discount_type: discountType,
    discount_value: discountValue,
    min_order_inr: minOrder,
    max_uses: maxUsesRaw ? Number(maxUsesRaw) : null,
    valid_until: validUntilRaw ? new Date(validUntilRaw).toISOString() : null,
    is_active: isActive,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: `A coupon with code "${code}" already exists.` };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function deleteCoupon(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("coupons").delete().eq("id", id);
  revalidatePath("/admin/coupons");
}

export async function toggleCouponActive(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  const next = String(formData.get("next_active") ?? "") === "true";
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("coupons").update({ is_active: next }).eq("id", id);
  revalidatePath("/admin/coupons");
}
