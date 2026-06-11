"use client";

import { useActionState } from "react";
import { saveSettings, type SettingsActionState } from "@/app/actions/settings";

export interface SettingsValues {
  business_name: string;
  brand_short: string;
  whatsapp_number: string;
  contact_phone: string;
  contact_email: string;
  business_hours: string;
  legal_owner: string;
  gst_number: string;
  business_type: string;
  registration_type: string;
  gst_reg_date: string;
  gst_valid_from: string;
  gst_valid_to: string;
  jurisdiction: string;
  proprietor_designation: string;
  proprietor_state: string;
  gst_approving_officer: string;
  gst_certificate_issue_date: string;
  additional_branches: string;
  address: string;
}

const INITIAL: SettingsActionState = {};

const labelCls =
  "font-mono text-[10px] text-shell-husk uppercase tracking-wider block mb-1.5";
const inputCls =
  "w-full bg-kernel border border-shell/20 focus:border-leaf focus:outline-none transition-colors px-3 py-2 text-sm text-ink font-body rounded-sm";

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={inputCls}
      />
      {hint && (
        <p className="mt-1 font-body text-[11px] text-shell-husk">{hint}</p>
      )}
    </div>
  );
}

export function SettingsForm({ settings }: { settings: SettingsValues }) {
  const [state, formAction, pending] = useActionState<SettingsActionState, FormData>(
    saveSettings,
    INITIAL,
  );

  return (
    <form action={formAction} className="space-y-10">
      <section className="space-y-5">
        <span className="eyebrow">Brand & ordering</span>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            label="Business name"
            name="business_name"
            defaultValue={settings.business_name}
          />
          <Field
            label="Short brand name"
            name="brand_short"
            defaultValue={settings.brand_short}
            hint="Used in the WhatsApp order message."
          />
          <Field
            label="WhatsApp number *"
            name="whatsapp_number"
            defaultValue={settings.whatsapp_number}
            placeholder="918124165047"
            hint="Digits only, with country code (no + or spaces). Powers every Order button."
          />
          <Field
            label="Display phone"
            name="contact_phone"
            defaultValue={settings.contact_phone}
            placeholder="+91 81241 65047"
          />
          <Field
            label="Support email"
            name="contact_email"
            type="email"
            defaultValue={settings.contact_email}
          />
          <Field
            label="Business hours"
            name="business_hours"
            defaultValue={settings.business_hours}
          />
        </div>
      </section>

      <section className="space-y-5">
        <span className="eyebrow">Registration & story</span>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            label="Legal owner"
            name="legal_owner"
            defaultValue={settings.legal_owner}
          />
          <Field
            label="GST number"
            name="gst_number"
            defaultValue={settings.gst_number}
          />
          <Field
            label="Business type"
            name="business_type"
            defaultValue={settings.business_type}
          />
          <Field
            label="Registration type"
            name="registration_type"
            defaultValue={settings.registration_type}
          />
          <Field
            label="GST registration date"
            name="gst_reg_date"
            defaultValue={settings.gst_reg_date}
          />
          <Field
            label="GST valid from"
            name="gst_valid_from"
            defaultValue={settings.gst_valid_from}
          />
          <Field
            label="GST valid to"
            name="gst_valid_to"
            defaultValue={settings.gst_valid_to}
          />
          <Field
            label="GST jurisdiction"
            name="jurisdiction"
            defaultValue={settings.jurisdiction}
          />
          <Field
            label="Proprietor designation"
            name="proprietor_designation"
            defaultValue={settings.proprietor_designation}
          />
          <Field
            label="Proprietor state"
            name="proprietor_state"
            defaultValue={settings.proprietor_state}
          />
          <Field
            label="Approving officer"
            name="gst_approving_officer"
            defaultValue={settings.gst_approving_officer}
          />
          <Field
            label="Certificate issue date"
            name="gst_certificate_issue_date"
            defaultValue={settings.gst_certificate_issue_date}
          />
          <Field
            label="Additional branches"
            name="additional_branches"
            defaultValue={settings.additional_branches}
          />
        </div>
        <div>
          <label className={labelCls}>Registered address</label>
          <textarea
            name="address"
            rows={3}
            defaultValue={settings.address}
            className={`${inputCls} resize-none`}
          />
        </div>
      </section>

      {state?.error && (
        <p className="font-body text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-sm">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="font-body text-sm text-leaf-deep bg-leaf/10 border border-leaf/30 px-3 py-2 rounded-sm">
          Settings saved.
        </p>
      )}

      <div className="pt-2 border-t hairline">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
