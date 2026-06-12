import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProductById } from "@/lib/queries";
import { addVariant, updateVariant, deleteVariant } from "@/app/actions/variants";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";

export const metadata = { title: "Sizes & stock - Thennaiyan Admin" };

const labelCls =
  "font-mono text-[10px] text-shell-husk uppercase tracking-wider block mb-1.5";
const inputCls =
  "w-full bg-kernel border border-shell/20 focus:border-leaf focus:outline-none transition-colors px-3 py-2 text-sm text-ink font-body rounded-sm";

export default async function ProductVariantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", id)
    .order("size_ml", { ascending: true });

  const variants = (data ?? []) as Array<{
    id: string;
    size_label: string;
    size_ml: number;
    price_inr: number | string;
    stock: number;
    sku: string | null;
    is_active: boolean;
  }>;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 font-body text-sm text-shell hover:text-ink"
        >
          <ArrowLeft size={14} /> All products
        </Link>
        <h1
          className="mt-3 font-display text-display-md text-leaf-deep"
          style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 40" }}
        >
          Sizes &amp; stock
        </h1>
        <p className="mt-1 font-body text-sm text-shell">
          {product.name} — manage each pack size, its price, and how many are in stock.
        </p>
      </div>

      {/* Existing variants */}
      <div className="space-y-4">
        {variants.length === 0 ? (
          <p className="font-body text-sm text-shell bg-kernel border hairline p-6 text-center">
            No sizes yet. Add the first one below (e.g. 250ml).
          </p>
        ) : (
          variants.map((v) => (
            <div key={v.id} className="bg-kernel border hairline p-4">
              <form action={updateVariant} className="space-y-3">
                <input type="hidden" name="id" value={v.id} />
                <input type="hidden" name="product_id" value={id} />
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className={labelCls}>Label *</label>
                    <input name="size_label" required defaultValue={v.size_label} placeholder="500ml" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Size (ml) *</label>
                    <input name="size_ml" type="number" min="1" required defaultValue={v.size_ml} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Price ₹ *</label>
                    <input name="price_inr" type="number" step="0.01" min="0" required defaultValue={Number(v.price_inr)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Stock</label>
                    <input name="stock" type="number" min="0" defaultValue={v.stock} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>SKU</label>
                    <input name="sku" defaultValue={v.sku ?? ""} placeholder="optional" className={inputCls} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-body text-sm text-ink">
                    <input type="checkbox" name="is_active" defaultChecked={v.is_active} className="h-4 w-4 accent-leaf" />
                    Active
                  </label>
                  <div className="flex items-center gap-2">
                    <button type="submit" className="px-3 py-1.5 border border-leaf text-leaf hover:bg-leaf hover:text-kernel transition-colors rounded-sm text-xs font-medium">
                      Save
                    </button>
                  </div>
                </div>
              </form>
              <form action={deleteVariant} className="mt-2 flex justify-end">
                <input type="hidden" name="id" value={v.id} />
                <input type="hidden" name="product_id" value={id} />
                <ConfirmSubmit
                  message={`Delete the ${v.size_label} size?`}
                  className="px-3 py-1.5 border border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition-colors rounded-sm text-xs font-medium"
                >
                  Delete size
                </ConfirmSubmit>
              </form>
            </div>
          ))
        )}
      </div>

      {/* Add new variant */}
      <div className="bg-kernel border hairline p-5">
        <p className="eyebrow mb-3">Add a size</p>
        <form action={addVariant} className="space-y-3">
          <input type="hidden" name="product_id" value={id} />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className={labelCls}>Label *</label>
              <input name="size_label" required placeholder="250ml" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Size (ml) *</label>
              <input name="size_ml" type="number" min="1" required placeholder="250" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Price ₹ *</label>
              <input name="price_inr" type="number" step="0.01" min="0" required placeholder="150" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Stock</label>
              <input name="stock" type="number" min="0" defaultValue={0} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>SKU</label>
              <input name="sku" placeholder="optional" className={inputCls} />
            </div>
          </div>
          <label className="flex items-center gap-2 font-body text-sm text-ink">
            <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4 accent-leaf" />
            Active
          </label>
          <button type="submit" className="btn-primary">
            <Plus size={16} /> Add size
          </button>
        </form>
      </div>
    </div>
  );
}
