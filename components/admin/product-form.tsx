"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveProduct, type ProductActionState } from "@/app/actions/products";

export interface ProductFormProduct {
  id: string;
  slug: string;
  name: string;
  variant_label: string;
  tagline: string;
  description: string | null;
  category_id: string | null;
  batch_no: string;
  pressed_at: string;
  origin: string;
  starting_from_inr: number | string;
  rating: number | string | null;
  benefits: string[] | null;
  hue_a: string;
  hue_b: string;
  is_active: boolean;
  position: number;
}

interface ProductFormProps {
  product?: ProductFormProduct | null;
  categories: { id: string; name: string }[];
}

const INITIAL: ProductActionState = {};

const labelCls =
  "font-mono text-[10px] text-shell-husk uppercase tracking-wider block mb-1.5";
const inputCls =
  "w-full bg-kernel border border-shell/20 focus:border-leaf focus:outline-none transition-colors px-3 py-2 text-sm text-ink font-body rounded-sm";

export function ProductForm({ product, categories }: ProductFormProps) {
  const [state, formAction, pending] = useActionState<ProductActionState, FormData>(
    saveProduct,
    INITIAL,
  );

  const [hueA, setHueA] = useState(product?.hue_a || "#D4A24C");
  const [hueB, setHueB] = useState(product?.hue_b || "#A8762A");

  return (
    <form action={formAction} className="space-y-8">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Product name *</label>
          <input
            name="name"
            required
            defaultValue={product?.name ?? ""}
            placeholder="Chekku Coconut Oil"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Slug (URL id) *</label>
          <input
            name="slug"
            required
            defaultValue={product?.slug ?? ""}
            placeholder="chekku-coconut-oil"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Variant label *</label>
          <input
            name="variant_label"
            required
            defaultValue={product?.variant_label ?? ""}
            placeholder="Wood-pressed"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <select
            name="category_id"
            defaultValue={product?.category_id ?? ""}
            className={inputCls}
          >
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Tagline (shown on the card) *</label>
        <textarea
          name="tagline"
          required
          rows={2}
          defaultValue={product?.tagline ?? ""}
          placeholder="Slow-turned in a traditional wooden press…"
          className={`${inputCls} resize-none`}
        />
      </div>

      <div>
        <label className={labelCls}>Description (shown in the details popup)</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          placeholder="Full description of the product…"
          className={`${inputCls} resize-none`}
        />
      </div>

      <div>
        <label className={labelCls}>Key benefits — one per line</label>
        <textarea
          name="benefits"
          rows={4}
          defaultValue={(product?.benefits ?? []).join("\n")}
          placeholder={"100% Raw & Unrefined\nTraditional Wood Press\nZero Added Preservatives"}
          className={`${inputCls} resize-none`}
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <label className={labelCls}>Batch number *</label>
          <input
            name="batch_no"
            required
            defaultValue={product?.batch_no ?? ""}
            placeholder="042"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Pressed date *</label>
          <input
            name="pressed_at"
            type="date"
            required
            defaultValue={product?.pressed_at ?? ""}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Origin</label>
          <input
            name="origin"
            defaultValue={product?.origin ?? "Madurai"}
            placeholder="Madurai"
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <label className={labelCls}>Starting price (₹) *</label>
          <input
            name="starting_from_inr"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={product?.starting_from_inr ?? ""}
            placeholder="320"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Rating (0–5, optional)</label>
          <input
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            defaultValue={product?.rating ?? ""}
            placeholder="4.9"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Sort position</label>
          <input
            name="position"
            type="number"
            step="1"
            defaultValue={product?.position ?? 0}
            className={inputCls}
          />
        </div>
      </div>

      {/* Colour / bottle hue */}
      <div>
        <label className={labelCls}>Bottle gradient (card image colours)</label>
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2">
            <input
              type="color"
              name="hue_a"
              value={hueA}
              onChange={(e) => setHueA(e.target.value)}
              className="h-9 w-12 border border-shell/20 rounded-sm bg-kernel cursor-pointer"
            />
            <span className="font-mono text-xs text-shell">{hueA}</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              name="hue_b"
              value={hueB}
              onChange={(e) => setHueB(e.target.value)}
              className="h-9 w-12 border border-shell/20 rounded-sm bg-kernel cursor-pointer"
            />
            <span className="font-mono text-xs text-shell">{hueB}</span>
          </div>
          <div
            className="h-12 w-24 border hairline rounded-sm"
            style={{
              background: `linear-gradient(160deg, ${hueA} 0%, ${hueB} 100%)`,
            }}
            aria-hidden
          />
        </div>
      </div>

      <label className="flex items-center gap-3 font-body text-sm text-ink">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={product ? product.is_active : true}
          className="h-4 w-4 accent-leaf"
        />
        Active (visible on the storefront)
      </label>

      {state?.error && (
        <p className="font-body text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-sm">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2 border-t hairline">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Saving…" : product?.id ? "Save changes" : "Create product"}
        </button>
        <Link href="/admin/products" className="btn-secondary mt-6">
          Cancel
        </Link>
      </div>
    </form>
  );
}
