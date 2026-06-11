import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProductById, getCategories } from "@/lib/queries";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-shell hover:text-leaf transition-colors"
        >
          <ArrowLeft size={13} /> Products
        </Link>
        <h1
          className="mt-3 font-display text-display-md text-leaf-deep"
          style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 40" }}
        >
          Edit · {product.name}
        </h1>
      </header>

      <ProductForm
        product={product}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
