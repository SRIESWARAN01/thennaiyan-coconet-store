"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type CheckoutState = {
  error?: string;
  orderId?: string;
  orderNo?: string;
  whatsappUrl?: string;
};

export async function placeOrder(
  _prev: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to place an order." };

  const shipFullName = String(formData.get("ship_full_name") ?? "").trim();
  const shipPhone = String(formData.get("ship_phone") ?? "").trim();
  const shipLine1 = String(formData.get("ship_line1") ?? "").trim();
  const shipLine2 = String(formData.get("ship_line2") ?? "").trim();
  const shipCity = String(formData.get("ship_city") ?? "").trim();
  const shipState = String(formData.get("ship_state") ?? "").trim();
  const shipPincode = String(formData.get("ship_pincode") ?? "").trim();
  const couponCode = String(formData.get("coupon_code") ?? "").trim().toUpperCase();

  if (!shipFullName || !shipPhone || !shipLine1 || !shipCity || !shipState || !shipPincode) {
    return { error: "Please fill all required delivery fields." };
  }

  // Get cart items
  const { data: cartRows } = await supabase
    .from("cart_items")
    .select(`quantity, variant_id, product_variants!inner(size_label, price_inr, products!inner(id, name, variant_label, batch_no))`)
    .eq("user_id", user.id);

  if (!cartRows?.length) return { error: "Your cart is empty." };

  const cartItems = cartRows.map((r: any) => ({
    variantId: r.variant_id,
    quantity: r.quantity,
    sizeLabel: r.product_variants.size_label,
    priceInr: Number(r.product_variants.price_inr),
    productId: r.product_variants.products.id,
    productName: r.product_variants.products.name,
    variantLabel: r.product_variants.products.variant_label,
    batchNo: r.product_variants.products.batch_no,
  }));

  const subtotal = cartItems.reduce((s: number, i: any) => s + i.priceInr * i.quantity, 0);

  // Validate coupon
  let discountInr = 0;
  let couponId: string | null = null;
  if (couponCode) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("id, discount_type, discount_value, min_order_inr, max_uses, used_count, valid_until")
      .eq("code", couponCode)
      .eq("is_active", true)
      .maybeSingle();

    if (coupon) {
      if (!coupon.valid_until || new Date(coupon.valid_until) >= new Date()) {
        if (!coupon.max_uses || coupon.used_count < coupon.max_uses) {
          if (subtotal >= coupon.min_order_inr) {
            couponId = coupon.id;
            discountInr = coupon.discount_type === "percent"
              ? Math.round(subtotal * (coupon.discount_value / 100) * 100) / 100
              : Math.min(coupon.discount_value, subtotal);
          }
        }
      }
    }
  }

  const totalInr = subtotal - discountInr;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      payment_status: "pending",
      payment_method: "cod",
      ship_full_name: shipFullName,
      ship_phone: shipPhone,
      ship_line1: shipLine1,
      ship_line2: shipLine2 || null,
      ship_city: shipCity,
      ship_state: shipState,
      ship_pincode: shipPincode,
      ship_country: "India",
      subtotal_inr: subtotal,
      shipping_inr: 0,
      total_inr: totalInr,
      coupon_id: couponId,
      coupon_code: couponCode || null,
      discount_inr: discountInr,
    })
    .select("id, order_no")
    .single();

  if (orderError || !order) return { error: orderError?.message ?? "Order creation failed." };

  // Insert order items
  await supabase.from("order_items").insert(
    cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      product_name: item.productName,
      variant_label: item.variantLabel,
      size_label: item.sizeLabel,
      batch_no: item.batchNo,
      unit_price_inr: item.priceInr,
      quantity: item.quantity,
      subtotal_inr: item.priceInr * item.quantity,
    }))
  );

  // Update coupon usage
  if (couponId) {
    await supabase.from("coupon_uses").insert({ coupon_id: couponId, order_id: order.id, user_id: user.id, discount_inr: discountInr });
  }

  // Log analytics
  await supabase.from("analytics_events").insert({ event_type: "order_created", order_id: order.id, user_id: user.id, metadata: {} });

  // Clear cart
  await supabase.from("cart_items").delete().eq("user_id", user.id);

  // Build WhatsApp URL
  const { data: settings } = await supabase.from("site_settings").select("whatsapp_number").maybeSingle();
  const waNumber = settings?.whatsapp_number ?? "918124165047";

  const itemLines = cartItems.map((i: any) => `• ${i.productName} (${i.sizeLabel}) x${i.quantity} = ₹${(i.priceInr * i.quantity).toFixed(2)}`).join("\n");
  let msg = `🥥 *Thennaiyan Coconut Company*\n*Order No: ${order.order_no}*\n\n`;
  msg += `*Items:*\n${itemLines}\n\n`;
  msg += `*Subtotal:* ₹${subtotal.toFixed(2)}\n`;
  if (discountInr > 0) msg += `*Discount (${couponCode}):* -₹${discountInr.toFixed(2)}\n`;
  msg += `*Total:* ₹${totalInr.toFixed(2)}\n\n`;
  msg += `*Delivery Address:*\n${shipFullName}, ${shipPhone}\n${shipLine1}${shipLine2 ? ", " + shipLine2 : ""}\n${shipCity}, ${shipState} - ${shipPincode}\n\nPlease confirm and process my order. Thank you!`;

  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;

  // Log WhatsApp lead
  await supabase.from("whatsapp_leads").insert({
    user_id: user.id,
    order_id: order.id,
    customer_name: shipFullName,
    phone: shipPhone,
    message: msg,
    status: "new",
  });

  revalidatePath("/account/orders");
  return { orderId: order.id, orderNo: order.order_no, whatsappUrl };
}
