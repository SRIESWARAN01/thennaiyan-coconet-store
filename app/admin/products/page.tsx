import Link from "next/link";
import { Plus, Pencil, Layers } from "lucide-react";
import { getAllProductsAdmin } from "@/lib/queries";
import { deleteProduct } from "@/app/actions/products";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Catalog</span>
          <h1
            className="mt-2 font-display text-display-md text-leaf-deep"
            style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 40" }}
          >
            Products
          </h1>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus size={16} /> New product
        </Link>
      </header>

      {products.length === 0 ? (
        <p className="font-body text-sm text-shell bg-kernel border hairline p-8 text-center">
          No products yet. Create your first one.
        </p>
      ) : (
        <div className="bg-kernel border hairline overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b hairline text-left font-mono text-[10px] uppercase tracking-wider text-shell-husk">
                <th className="px-4 py-3 font-normal">Product</th>
                <th className="px-4 py-3 font-normal">Batch</th>
                <th className="px-4 py-3 font-normal">Price</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const cat = Array.isArray(p.categories)
                  ? p.categories[0]?.slug
                  : p.categories?.slug;
                return (
                  <tr key={p.id} className="border-b hairline last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-9 w-9 rounded-sm border hairline flex-shrink-0"
                          style={{
                            background: `linear-gradient(160deg, ${p.hue_a} 0%, ${p.hue_b} 100%)`,
                          }}
                          aria-hidden
                        />
                        <div>
                          <div className="font-body text-ink">{p.name}</div>
                          <div className="font-mono text-[10px] uppercase tracking-wider text-shell-husk">
                            {p.variant_label}
                            {cat ? ` · ${cat}` : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-shell">
                      {p.batch_no}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-shell">
                      ₹{Number(p.starting_from_inr) || 0}
                    </td>
                    <td className="px-4 py-3">
                      {p.is_active ? (
                        <span className="font-mono text-[10px] uppercase tracking-wider text-leaf">
                          ● Active
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] uppercase tracking-wider text-shell-husk">
                          ○ Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}/variants`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-shell/30 text-shell hover:border-leaf hover:text-leaf transition-colors rounded-sm text-xs font-medium"
                        >
                          <Layers size={12} /> Sizes
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-leaf text-leaf hover:bg-leaf hover:text-kernel transition-colors rounded-sm text-xs font-medium"
                        >
                          <Pencil size={12} /> Edit
                        </Link>
                        <form action={deleteProduct} className="inline">
                          <input type="hidden" name="id" value={p.id} />
                          <ConfirmSubmit
                            message={`Delete "${p.name}"? This cannot be undone.`}
                            className="px-2.5 py-1.5 border border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition-colors rounded-sm text-xs font-medium"
                          >
                            Delete
                          </ConfirmSubmit>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
