"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/order-status";

// Updating orders.status fires the DB trigger that writes an
// order_status_events row, which drives the customer's live tracking.
export async function updateOrderStatus(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const paymentStatus = String(formData.get("payment_status") ?? "").trim();

  if (!id || !status) return;
  if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) return;

  const patch: Record<string, unknown> = { status };
  if (
    paymentStatus &&
    PAYMENT_STATUSES.includes(paymentStatus as (typeof PAYMENT_STATUSES)[number])
  ) {
    patch.payment_status = paymentStatus;
  }

  const supabase = await createClient();
  await supabase.from("orders").update(patch).eq("id", id);

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/account/orders");
  revalidatePath(`/account/orders/${id}`);
}
