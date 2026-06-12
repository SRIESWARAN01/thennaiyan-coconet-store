"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { ProductDetailsModal } from "@/components/product-details-modal";
import { useLanguage } from "@/lib/language-context";

type Category = {
  id: string;
  label: string;
};

type HomeProductBrowserProps = {
  products: ProductCardData[];
  categories: Category[];
  whatsappNumber?: string;
  brand?: string;
};

export function HomeProductBrowser({
  products,
  categories,
  whatsappNumber,
  brand,
}: HomeProductBrowserProps) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<ProductCardData | null>(
    null,
  );

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by Category
    if (activeCategory !== "all") {
      result = result.filter((product) => product.category === activeCategory);
    }

    return result;
  }, [activeCategory, products]);

  return (
    <>
      {/* Category Pills Row */}
      <div className="scrollbar-none mb-6 flex items-center gap-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => {
              setActiveCategory(category.id);
            }}
            className={cn(
              "whitespace-nowrap px-5 py-2 font-body text-xs font-bold uppercase tracking-wider transition-all duration-200 rounded-full border",
              activeCategory === category.id
                ? "border-leaf bg-leaf text-white"
                : "border-gray-200 bg-gray-100 text-gray-700 hover:border-leaf/40"
            )}
          >
            {t(category.id === "all" ? "all-items" : category.id)}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center text-gray-400 font-body text-sm bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          {t("noItemsFound")}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.slug}
              data={product}
              onViewDetails={setSelectedProduct}
              whatsappNumber={whatsappNumber}
              brand={brand}
            />
          ))}
        </div>
      )}

      {/* Details Popup Modal */}
      <ProductDetailsModal
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        whatsappNumber={whatsappNumber}
        brand={brand}
      />
    </>
  );
}
