"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SettingsActionState = { error?: string; ok?: boolean };

export async function saveSettings(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const whatsapp = String(formData.get("whatsapp_number") ?? "").replace(
    /\D/g,
    "",
  );

  if (!whatsapp) {
    return { error: "A WhatsApp number (digits only, with country code) is required." };
  }

  const row = {
    id: true,
    business_name: String(formData.get("business_name") ?? "").trim(),
    brand_short: String(formData.get("brand_short") ?? "").trim(),
    whatsapp_number: whatsapp,
    contact_phone: String(formData.get("contact_phone") ?? "").trim(),
    contact_email: String(formData.get("contact_email") ?? "").trim(),
    business_hours: String(formData.get("business_hours") ?? "").trim(),
    legal_owner: String(formData.get("legal_owner") ?? "").trim(),
    gst_number: String(formData.get("gst_number") ?? "").trim(),
    business_type: String(formData.get("business_type") ?? "").trim(),
    registration_type: String(formData.get("registration_type") ?? "").trim(),
    gst_reg_date: String(formData.get("gst_reg_date") ?? "").trim(),
    gst_valid_from: String(formData.get("gst_valid_from") ?? "").trim(),
    gst_valid_to: String(formData.get("gst_valid_to") ?? "").trim(),
    jurisdiction: String(formData.get("jurisdiction") ?? "").trim(),
    proprietor_designation: String(
      formData.get("proprietor_designation") ?? "",
    ).trim(),
    proprietor_state: String(formData.get("proprietor_state") ?? "").trim(),
    gst_approving_officer: String(
      formData.get("gst_approving_officer") ?? "",
    ).trim(),
    gst_certificate_issue_date: String(
      formData.get("gst_certificate_issue_date") ?? "",
    ).trim(),
    additional_branches: String(
      formData.get("additional_branches") ?? "",
    ).trim(),
    address: String(formData.get("address") ?? "").trim(),
  };

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert(row, { onConflict: "id" });

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/contact");
  revalidatePath("/story");
  revalidatePath("/admin/settings");

  return { ok: true };
}
