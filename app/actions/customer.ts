"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CustomerActionState = { error?: string; success?: boolean };

export async function updateProfile(
  _prev: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!fullName || !phone) {
    return { error: "Name and Mobile number are required." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phone,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/account");
  return { success: true };
}

export async function saveAddress(
  _prev: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const id = formData.get("id") ? String(formData.get("id")) : undefined;
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const line1 = String(formData.get("line1") ?? "").trim();
  const line2 = String(formData.get("line2") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const pincode = String(formData.get("pincode") ?? "").trim();

  if (!fullName || !phone || !line1 || !city || !state || !pincode) {
    return { error: "All address fields except Line 2 are required." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized." };
  }

  const addressData = {
    user_id: user.id,
    full_name: fullName,
    phone: phone,
    line1,
    line2: line2 || null,
    city,
    state,
    pincode,
    country: "India",
    is_default: true,
  };

  let error;
  if (id) {
    const { error: err } = await supabase
      .from("addresses")
      .update(addressData)
      .eq("id", id)
      .eq("user_id", user.id);
    error = err;
  } else {
    // If inserting, we might want to make other addresses not default first, but default true is fine
    const { error: err } = await supabase
      .from("addresses")
      .insert([addressData]);
    error = err;
  }

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/account");
  return { success: true };
}

export async function deleteAddress(addressId: string): Promise<CustomerActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized." };
  }

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/account");
  return { success: true };
}
