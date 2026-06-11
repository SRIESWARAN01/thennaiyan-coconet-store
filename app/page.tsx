import { ArrowRight, Droplets, Leaf, ShieldCheck, Sun } from "lucide-react";
import { BatchStamp } from "@/components/batch-stamp";
import { HomeProductBrowser } from "@/components/home-product-browser";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { ProductCardData } from "@/components/product-card";

const PRODUCTS: ProductCardData[] = [
  {
    slug: "chekku-coconut-oil",
    name: "Chekku Coconut Oil",
    variant: "Wood-pressed",
    tagline:
      "Slow-turned in a traditional wooden press. Cloudy, golden, and smells like the kernel it came from.",
    description:
      "Our signature oil is extracted from sun-dried coconut kernels in a traditional wooden press. The press turns slowly, so the oil keeps its delicate aroma, nutrients, and natural antioxidant character.",
    startingFrom: 320,
    batch: "042",
    pressed: "FEB 2026",
    hueA: "#D4A24C",
    hueB: "#A8762A",
    rating: 4.9,
    category: "chekku",
    benefits: [
      "100% raw and unrefined",
      "Traditional wood press",
      "Rich coconut aroma",
      "No added preservatives",
    ],
  },
  {
    slug: "virgin-coconut-oil",
    name: "Virgin Coconut Oil",
    variant: "Cold-pressed",
    tagline:
      "Pressed from fresh kernel within hours of opening. Clear, light, and gentle enough for daily care.",
    description:
      "Extracted from fresh coconut milk using a cold process that preserves lauric acid and a clean coconut fragrance. Useful for cooking, skin care, hair care, and direct consumption.",
    startingFrom: 420,
    batch: "041",
    pressed: "FEB 2026",
    hueA: "#F1EADA",
    hueB: "#C9B98D",
    rating: 4.8,
    category: "virgin",
    benefits: [
      "Fresh-kernel extraction",
      "High lauric acid",
      "Light and non-greasy",
      "Edible grade",
    ],
  },
  {
    slug: "hibiscus-hair-oil",
    name: "Hibiscus Hair Oil",
    variant: "Infused",
    tagline:
      "Chekku base steeped with hibiscus, curry leaf, and fenugreek. Bottled in small batches.",
    description:
      "A heritage hair-oil blend made with a wood-pressed coconut-oil base and botanicals traditionally used for scalp nourishment, hair strength, and shine.",
    startingFrom: 380,
    batch: "017",
    pressed: "JAN 2026",
    hueA: "#5A2329",
    hueB: "#2E0E12",
    rating: 4.7,
    category: "hair",
    benefits: [
      "Botanical infusion",
      "Coconut-oil base",
      "Scalp nourishment",
      "Small-batch bottled",
    ],
  },
  {
    slug: "cooking-pack-1l",
    name: "Kitchen Pack",
    variant: "Cooking - 1L",
    tagline:
      "A litre of chekku oil for the everyday kitchen. Same press, same batch, larger format.",
    description:
      "A value-sized 1-litre bottle of our classic wood-pressed coconut oil for everyday cooking, tempering, baking, and traditional South Indian recipes.",
    startingFrom: 580,
    batch: "042",
    pressed: "FEB 2026",
    hueA: "#336633",
    hueB: "#1F4023",
    rating: 4.9,
    category: "cooking",
    benefits: [
      "Kitchen-size value pack",
      "Suitable for daily cooking",
      "Amber bottle protection",
      "Same traceable batch",
    ],
  },
];

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "chekku", label: "Chekku" },
  { id: "virgin", label: "Virgin" },
  { id: "hair", label: "Hair & Beauty" },
  { id: "cooking", label: "Cooking" },
];

const PROMISES = [
  {
    icon: Leaf,
    label: "Single-origin kernel",
    body: "Coconuts are sourced from groves close to the press.",
  },
  {
    icon: Droplets,
    label: "No heat, no blend",
    body: "Pressed cold or chekku-slow. Never refined, never mixed.",
  },
  {
    icon: Sun,
    label: "Pressed-to-bottle",
    body: "Every bottle leaves the press the same day it is filled.",
  },
  {
    icon: ShieldCheck,
    label: "Batch-traceable",
    body: "Each bottle carries a batch number and press month.",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        <section className="container pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid items-end gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            <div>
              <span className="eyebrow">Chapter 01 - Madurai, 625705</span>

              <h1
                className="mt-6 font-display text-display-xl text-leaf-deep"
                style={{ fontVariationSettings: "'SOFT' 70, 'opsz' 96" }}
              >
                Wood-pressed
                <br />
                coconut oil,
                <br />
                <em
                  className="not-italic text-oil-deep"
                  style={{
                    fontVariationSettings: "'SOFT' 100, 'opsz' 96, 'WONK' 1",
                  }}
                >
                  traced to the day.
                </em>
              </h1>

              <p className="mt-8 max-w-xl font-body text-lg leading-relaxed text-shell">
                Every bottle is from a single small batch, pressed slowly in our
                Madurai chekku and stamped with its press date. No blending, no
                heat, no in-between.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a href="#products" className="btn-primary">
                  Shop the press
                  <ArrowRight size={16} strokeWidth={2} />
                </a>
                <a href="/story" className="btn-secondary">
                  How it is pressed
                </a>
              </div>

              <div className="mt-12">
                <BatchStamp batch="042" pressed="FEB 2026" />
              </div>
            </div>

            <div className="relative hidden aspect-[3/4] lg:block">
              <div
                className="absolute inset-0 shadow-bottle"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 20%, #F5D689 0%, #D4A24C 30%, #A8762A 70%, #5A3D14 100%)",
                }}
              />
              <div className="hairline absolute inset-x-8 top-1/2 -translate-y-1/2 border bg-kernel/95 px-5 py-6 backdrop-blur-sm">
                <div className="eyebrow text-leaf-deep">Kovai Chekku</div>
                <div
                  className="mt-2 font-display text-2xl text-ink"
                  style={{ fontVariationSettings: "'SOFT' 50, 'opsz' 24" }}
                >
                  Wood-pressed
                </div>
                <div className="mt-1 font-mono text-xs text-shell">
                  500ml - batch 042 - FEB 2026
                </div>
                <div className="mt-4 h-px bg-shell/20" />
                <div className="mt-3 font-mono text-[0.625rem] leading-relaxed text-shell-husk">
                  Pressed slow in a teak chekku.
                  <br />
                  Bottled the same evening.
                  <br />
                  No heat. No blend. No filter.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="hairline border-y bg-kernel-deeper/30">
          <div className="container py-20 lg:py-24">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="eyebrow">The current press</span>
                <h2
                  className="mt-3 font-display text-display-lg text-leaf-deep"
                  style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 64" }}
                >
                  Four bottles, one chekku.
                </h2>
              </div>
              <a
                href="/shop"
                className="font-mono text-eyebrow text-leaf underline decoration-1 underline-offset-8 hover:text-leaf-deep"
              >
                See the whole shelf -&gt;
              </a>
            </div>

            <HomeProductBrowser products={PRODUCTS} categories={CATEGORIES} />
          </div>
        </section>

        <section className="container py-24 lg:py-32">
          <div className="max-w-2xl">
            <span className="eyebrow">The process</span>
            <h2
              className="mt-3 font-display text-display-lg text-leaf-deep"
              style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 64" }}
            >
              Three days, start to bottle.
            </h2>
          </div>

          <div className="mt-16 grid gap-px bg-shell/15 md:grid-cols-3">
            {[
              {
                step: "01",
                hours: "Day 1 - 06:00",
                title: "The grove",
                body:
                  "Mature coconuts are hand-picked, husked, opened, and prepared for pressing.",
              },
              {
                step: "02",
                hours: "Day 2 - 09:00",
                title: "The chekku",
                body:
                  "Kernel goes into a wooden press turned slowly for hours. No external heat is applied.",
              },
              {
                step: "03",
                hours: "Day 2 - 17:00",
                title: "The bottle",
                body:
                  "Oil is filtered, poured, sealed, and stamped with the batch number on the label.",
              },
            ].map((step) => (
              <div key={step.step} className="bg-kernel p-8 lg:p-10">
                <div className="flex items-baseline justify-between">
                  <span
                    className="font-display text-5xl text-oil-deep"
                    style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 48" }}
                  >
                    {step.step}
                  </span>
                  <span className="font-mono text-eyebrow text-shell-husk">
                    {step.hours}
                  </span>
                </div>
                <h3
                  className="mt-6 font-display text-2xl text-leaf-deep"
                  style={{ fontVariationSettings: "'SOFT' 50, 'opsz' 24" }}
                >
                  {step.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-shell">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-leaf-deep text-kernel">
          <div className="container py-20 lg:py-24">
            <span className="eyebrow text-oil">What is in the bottle</span>
            <h2
              className="mt-3 max-w-3xl font-display text-display-md"
              style={{ fontVariationSettings: "'SOFT' 50, 'opsz' 40" }}
            >
              Four things we will not change, no matter how big the press gets.
            </h2>

            <div className="mt-14 grid gap-px bg-kernel/10 sm:grid-cols-2 lg:grid-cols-4">
              {PROMISES.map(({ icon: Icon, label, body }) => (
                <div key={label} className="bg-leaf-deep p-8">
                  <Icon size={24} strokeWidth={1.25} className="text-oil" />
                  <h3
                    className="mt-6 font-display text-xl"
                    style={{ fontVariationSettings: "'SOFT' 50, 'opsz' 20" }}
                  >
                    {label}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-kernel/70">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
