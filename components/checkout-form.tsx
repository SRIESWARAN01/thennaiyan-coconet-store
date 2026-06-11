"use client";

import { useActionState, useState } from "react";
import { Loader2, CheckCircle2, MessageCircle } from "lucide-react";
import { placeOrder, type CheckoutState } from "@/app/actions/checkout";

type Props = { items: { name: string; size: string; qty: number; price: number }[]; defaultName: string; defaultPhone: string; };
const INR = "\u20B9";
const INITIAL: CheckoutState = {};

export function CheckoutForm({ items, defaultName, defaultPhone }: Props) {
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(placeOrder, INITIAL);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  if (state.whatsappUrl && state.orderNo) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle2 size={52} className="text-[#356f3b] mb-4" />
        <h2 className="font-body text-2xl font-extrabold text-[#111827]">Order {state.orderNo} placed!</h2>
        <p className="mt-2 font-body text-sm text-[#667085] max-w-sm">Now send your order on WhatsApp to confirm and get delivery updates.</p>
        <a
          href={state.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center gap-2 rounded-[8px] bg-[#25d366] px-8 py-4 font-body text-base font-extrabold text-white hover:bg-[#20bd5a] transition-colors"
        >
          <MessageCircle size={20} /> Open WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        <div className="rounded-[8px] bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
          <p className="font-body text-xs font-extrabold uppercase tracking-wider text-[#667085] mb-4">Delivery details</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[{label:"Full name",name:"ship_full_name",type:"text",placeholder:"Ravi Kumar",defaultValue:defaultName},
              {label:"Phone",name:"ship_phone",type:"tel",placeholder:"+91 98765 43210",defaultValue:defaultPhone},
              {label:"Address line 1",name:"ship_line1",type:"text",placeholder:"No. 12, Main Street",defaultValue:""},
              {label:"Address line 2 (optional)",name:"ship_line2",type:"text",placeholder:"Apartment, landmark",defaultValue:""},
              {label:"City",name:"ship_city",type:"text",placeholder:"Madurai",defaultValue:""},
              {label:"State",name:"ship_state",type:"text",placeholder:"Tamil Nadu",defaultValue:""},
              {label:"Pincode",name:"ship_pincode",type:"text",placeholder:"625001",defaultValue:""},
            ].map((f) => (
              <div key={f.name} className={f.name === "ship_line1" || f.name === "ship_line2" ? "sm:col-span-2" : ""}>
                <label htmlFor={f.name} className="block font-mono text-[10px] uppercase tracking-wider text-[#667085] mb-1">{f.label}</label>
                <input id={f.name} name={f.name} type={f.type} placeholder={f.placeholder} defaultValue={f.defaultValue}
                  required={!f.label.includes("optional")}
                  className="w-full border border-[#d0d5dd] rounded-[6px] px-3 py-2 font-body text-sm outline-none focus:border-[#356f3b] transition-colors" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[8px] bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
          <p className="font-body text-xs font-extrabold uppercase tracking-wider text-[#667085] mb-3">Coupon code</p>
          <input name="coupon_code" placeholder="Optional coupon code" className="w-full border border-[#d0d5dd] rounded-[6px] px-3 py-2 font-mono text-sm uppercase outline-none focus:border-[#356f3b]" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[8px] bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
          <p className="font-body text-xs font-extrabold uppercase tracking-wider text-[#667085] mb-3">Order summary</p>
          {items.map((i) => (
            <div key={i.name+i.size} className="flex justify-between py-1.5 font-body text-sm text-[#111827]">
              <span className="truncate mr-2">{i.name} ({i.size}) x{i.qty}</span>
              <span className="flex-shrink-0">{INR}{(i.price*i.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-[#f0f0f0] mt-2 pt-2 flex justify-between font-body text-base font-extrabold text-[#111827]">
            <span>Total</span><span>{INR}{subtotal.toFixed(2)}</span>
          </div>
          <p className="mt-1 font-body text-xs text-[#356f3b] font-semibold">Delivery: Free</p>
        </div>

        {state.error && <p className="rounded-[6px] border border-red-200 bg-red-50 px-3 py-2 font-body text-sm text-red-700">{state.error}</p>}

        <button type="submit" disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#25d366] px-4 py-4 font-body text-sm font-extrabold text-white hover:bg-[#20bd5a] transition-colors disabled:opacity-60">
          {pending ? <Loader2 size={16} className="animate-spin" /> : <MessageCircle size={16} />}
          {pending ? "Placing order…" : "Place order & open WhatsApp"}
        </button>
      </div>
    </form>
  );
}
