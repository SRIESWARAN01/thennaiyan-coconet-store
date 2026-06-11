"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { ProductDetailsModal } from "@/components/product-details-modal";
import { cn } from "@/lib/utils";

// Demo products (sharing static list on frontend)
const PRODUCTS: ProductCardData[] = [
  {
    slug: "chekku-coconut-oil",
    name: "Chekku Coconut Oil",
    variant: "Wood-pressed",
    tagline:
      "Slow-turned in a traditional wooden press. Cloudy, golden, and smells like the kernel it came from.",
    description:
      "Our signature oil is made by extracting oil from sun-dried coconut kernels (copra) in a traditional wooden press (chekku) made of Vagai (East Indian Walnut) wood. Because the press turns at under 15 RPM, no friction heat is generated, keeping the delicate nutrients, sweet aroma, and antioxidant properties completely intact.",
    startingFrom: 320,
    batch: "042",
    pressed: "FEB 2026",
    hueA: "#D4A24C",
    hueB: "#A8762A",
    rating: 4.9,
    category: "chekku",
    benefits: ["100% Raw & Unrefined", "Traditional Wood Press", "Rich in Medium Chain Fatty Acids", "Zero Added Preservatives"]
  },
  {
    slug: "virgin-coconut-oil",
    name: "Virgin Coconut Oil",
    variant: "Cold-pressed",
    tagline:
      "Pressed from fresh kernel within hours of opening. Clear, light, and gentle enough for a baby's skin.",
    description:
      "Extracted from fresh, wet coconut milk using advanced cold-press centrifugal technology. This pristine, water-clear oil retains the maximum possible lauric acid content. It is extremely light, non-greasy, and is the absolute gold standard for hair care, skin hydration, baby massage, and direct consumption.",
    startingFrom: 420,
    batch: "041",
    pressed: "FEB 2026",
    hueA: "#F1EADA",
    hueB: "#C9B98D",
    rating: 4.8,
    category: "virgin",
    benefits: ["Centrifuge Cold-Pressed", "High Lauric Acid (>50%)", "Excellent for Skin & Hair", "Pure & Edible Grade"]
  },
  {
    slug: "hibiscus-hair-oil",
    name: "Hibiscus Hair Oil",
    variant: "Infused",
    tagline:
      "Chekku base steeped with hibiscus, curry leaf, and fenugreek. Bottled the day the leaves are picked.",
    description:
      "A heritage remedy for hair fall and premature graying. We steep fresh, hand-plucked red hibiscus flowers, curry leaves, and fenugreek seeds in our premium wood-pressed coconut oil base. Poured slowly and solar-infused over 7 days, it provides deep nourishment to the scalp and strengthens hair roots.",
    startingFrom: 380,
    batch: "017",
    pressed: "JAN 2026",
    hueA: "#5A2329",
    hueB: "#2E0E12",
    rating: 4.7,
    category: "hair",
    benefits: ["Heritage Botanical Blend", "Sun-Infused Formulation", "Strengthens Hair Roots", "Reduces Premature Graying"]
  },
  {
    slug: "cooking-pack-1l",
    name: "Kitchen Pack",
    variant: "Cooking · 1L",
    tagline:
      "A litre of chekku oil for the everyday kitchen. Same press, same batch, larger format.",
    description:
      "A value-sized 1-litre format of our classic wood-pressed coconut oil, specifically packed in a convenient amber bottle for daily kitchen use. Pours cleanly and protects the delicate oil from light oxidation. Ideal for daily frying, tempering, baking, and traditional South Indian cooking.",
    startingFrom: 580,
    batch: "042",
    pressed: "FEB 2026",
    hueA: "#336633",
    hueB: "#1F4023",
    rating: 4.9,
    category: "cooking",
    benefits: ["Value Kitchen Size", "High Smoke Point", "BPA-Free Amber Pkg", "Ideal for Daily Cooking"]
  },
];

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "chekku", label: "Chekku" },
  { id: "virgin", label: "Virgin" },
  { id: "hair", label: "Hair & Beauty" },
  { id: "cooking", label: "Cooking" },
];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<ProductCardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = activeCategory === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  const openDetails = (product: ProductCardData) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <>
      <SiteHeader />

      <main className="bg-kernel min-h-screen">
        {/* Catalog Banner */}
        <section className="container pt-20 pb-12 lg:pt-28 lg:pb-16">
          <div className="max-w-3xl">
            <span className="eyebrow">The Press Catalog</span>
            <h1
              className="mt-6 font-display text-display-lg lg:text-display-xl text-leaf-deep"
              style={{ fontVariationSettings: "'SOFT' 70, 'opsz' 96" }}
            >
              Traced wood-pressed oil,<br />
              direct from our press.
            </h1>
            <p className="mt-6 font-body text-base lg:text-lg text-shell leading-relaxed">
              We extract our oils slowly in traditional teak-wood presses in Madurai. No blends, no high-heat refining, and no chemicals. Every batch is completely traceable.
            </p>
          </div>
        </section>

        {/* Product List Section */}
        <section className="border-t border-b hairline bg-kernel-deeper/20 py-16">
          <div className="container">
            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-4 py-2 text-xs font-mono tracking-wider uppercase border transition-all duration-200 rounded-sm whitespace-nowrap",
                    activeCategory === cat.id
                      ? "bg-leaf text-kernel border-leaf"
                      : "bg-kernel-deeper/50 text-shell border-shell/15 hover:border-leaf/40"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredProducts.map((p) => (
                <ProductCard key={p.slug} data={p} onViewDetails={openDetails} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </>
  );
}
