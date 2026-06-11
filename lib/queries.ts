// ============================================================================
// Server-side data access for the storefront + admin.
//
// Every public getter degrades gracefully: if Supabase is not configured yet
// (or a query fails), it returns the built-in fallback content so the site
// never renders blank. Once the schema is seeded and the admin edits content,
// the database values take over automatically.
// ============================================================================

import { createClient } from "@/lib/supabase/server";
import type { ProductCardData } from "@/components/product-card";

// ── Shared types ─────────────────────────────────────────────────────────────

export interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  position: number;
}

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  variant_label: string;
  tagline: string;
  description: string | null;
  category_id: string | null;
  batch_no: string;
  pressed_at: string; // "YYYY-MM-DD"
  origin: string;
  hero_image: string | null;
  is_active: boolean;
  position: number;
  starting_from_inr: number | string;
  rating: number | string | null;
  benefits: string[] | null;
  hue_a: string;
  hue_b: string;
  categories?: { slug: string } | { slug: string }[] | null;
  is_veg?: boolean;
  is_best_seller?: boolean;
}

export interface JournalEntryView {
  id?: string;
  slug: string;
  date_label: string;
  batch: string | null;
  title: string;
  excerpt: string;
  body: string | null;
  read_time: string;
  is_published: boolean;
  position: number;
}

export interface SiteSettings {
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

// ── Defaults / fallbacks ──────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: SiteSettings = {
  business_name: "Thennaiyan Coconut Company",
  brand_short: "Thennaiyan",
  whatsapp_number: "918124165047",
  contact_phone: "+91 81241 65047",
  contact_email: "support@thennaiyan.in",
  business_hours: "Monday - Saturday: 08:00 AM - 06:00 PM IST",
  legal_owner: "Tamilarasan Sathuragiri",
  gst_number: "33RRKPS2222A1ZU",
  business_type: "Proprietorship (Single Owner Business)",
  registration_type: "Regular GST Registration",
  gst_reg_date: "22 January 2026",
  gst_valid_from: "22/01/2026",
  gst_valid_to: "Not Applicable (Active Registration)",
  jurisdiction: "Thirumangalam",
  proprietor_designation: "Proprietor",
  proprietor_state: "Tamil Nadu",
  gst_approving_officer: "Assistant Commissioner",
  gst_certificate_issue_date: "22/01/2026",
  additional_branches: "0 (No additional registered business locations)",
  address: "No. 265/3B, Veppampatti Vilakku, Peraiyur Main Road Near Bus Stop, Pappinaickanpatti, Peraiyur, Madurai District, Tamil Nadu - 625705, India",
};

export const FALLBACK_PRODUCTS: ProductCardData[] = [
  {
    slug: "brownie-with-choco",
    name: "Brownie With Choco",
    variant: "Warm Fudge",
    tagline: "Rich chocolate brownie drizzled with hot chocolate fudge sauce.",
    description: "Our signature dark chocolate brownie is baked fresh daily and served warm, generously drizzled with premium chocolate fudge sauce.",
    startingFrom: 90,
    batch: "B-01",
    pressed: "TODAY",
    hueA: "#4b5563",
    hueB: "#1f2937",
    rating: 4.3,
    category: "brownies",
    isVeg: true,
    isBestSeller: true,
    image: "/images/brownie-choco.png",
    benefits: ["100% Vegetarian", "Baked Fresh Daily", "Premium Dark Chocolate", "Served Warm"],
  },
  {
    slug: "brownie-with-icecream-takeaway",
    name: "Brownie With IceCream(Take...",
    variant: "Dessert Pack",
    tagline: "Vanilla ice cream on a classic brownie, packaged for takeaway.",
    description: "A convenient takeaway container holding our classic dark chocolate brownie, topped with a scoop of premium vanilla ice cream, whipped cream, chocolate syrup, and a cherry.",
    startingFrom: 125,
    batch: "B-02",
    pressed: "TODAY",
    hueA: "#4b5563",
    hueB: "#1f2937",
    rating: 4.4,
    category: "brownies",
    isVeg: true,
    isBestSeller: true,
    image: "/images/brownie-icecream.png",
    benefits: ["100% Vegetarian", "Convenient Takeaway Box", "Whipped Cream Included", "Topped with Cherry"],
  },
  {
    slug: "brownie-with-icecream",
    name: "Brownie With Icecream",
    variant: "Ala Mode",
    tagline: "Our signature brownie topped with a scoop of creamy vanilla ice cream.",
    description: "The classic dine-in favorite. A warm chocolate brownie base supporting a cold scoop of rich vanilla ice cream, finished with whipped cream, chocolate syrup, and a cherry.",
    startingFrom: 120,
    batch: "B-03",
    pressed: "TODAY",
    hueA: "#4b5563",
    hueB: "#1f2937",
    rating: 4.5,
    category: "brownies",
    isVeg: true,
    isBestSeller: true,
    image: "/images/brownie-icecream.png",
    benefits: ["100% Vegetarian", "Dine-in Favorite", "Warm & Cold Contrast", "Rich Chocolate Syrup"],
  },
  {
    slug: "brownie-with-choco-takeaway",
    name: "Brownie with Choco(Take...",
    variant: "Fudge Pack",
    tagline: "Rich chocolate brownie, served with hot chocolate fudge sauce.",
    description: "Our signature warm chocolate fudge brownie in a convenient takeaway packaging, perfect for sweet cravings on the go.",
    startingFrom: 95,
    batch: "B-04",
    pressed: "TODAY",
    hueA: "#4b5563",
    hueB: "#1f2937",
    rating: 4.3,
    category: "brownies",
    isVeg: true,
    isBestSeller: true,
    image: "/images/brownie-choco.png",
    benefits: ["100% Vegetarian", "Freshly Baked", "Fudge Sauce Included", "Travel Friendly Packaging"],
  },
  {
    slug: "chicken-popcorn-takeaway",
    name: "Chicken Popcorn(Take Away)",
    variant: "Crispy Bites",
    tagline: "Golden, crispy, seasoned bite-sized chicken pieces.",
    description: "Crispy and tender bite-sized chicken popcorn seasoned with traditional spices, served with a creamy garlic mayonnaise dip.",
    startingFrom: 155,
    batch: "C-01",
    pressed: "TODAY",
    hueA: "#b45309",
    hueB: "#78350f",
    rating: 4.4,
    category: "main-course",
    isVeg: false,
    isBestSeller: true,
    image: "/images/chicken-popcorn.png",
    benefits: ["100% Non-Vegetarian", "Crispy & Tender", "Spiced Seasoning", "Served with Garlic Dip"],
  },
  {
    slug: "crunchy-cake-takeaway",
    name: "Cho Cruncy Cake(Take Away)",
    variant: "Gateau slice",
    tagline: "Decadent chocolate cake with a crunchy texture layer.",
    description: "A rich slice of chocolate crunchy gateau featuring layers of moist chocolate sponge, hazelnut crunch, and dark chocolate ganache frosting.",
    startingFrom: 125,
    batch: "G-01",
    pressed: "TODAY",
    hueA: "#1e3a8a",
    hueB: "#172554",
    rating: 4.5,
    category: "birthday-cakes",
    isVeg: true,
    isBestSeller: true,
    image: "/images/crunchy-cake.png",
    benefits: ["100% Vegetarian", "Hazelnut Crunch", "Moist Sponge Layers", "Ganache Frosting"],
  },
];

export const FALLBACK_CATEGORIES: CategoryRow[] = [
  { id: "brownies", slug: "brownies", name: "BROWNIES", description: null, position: 1 },
  { id: "birthday-cakes", slug: "birthday-cakes", name: "Birthday Cakes", description: null, position: 2 },
  { id: "cold-beverages", slug: "cold-beverages", name: "COLD BEVERAGES", description: null, position: 3 },
  { id: "special-desserts", slug: "special-desserts", name: "Thennaiyan Specials", description: null, position: 4 },
  { id: "dessert", slug: "dessert", name: "Dessert", description: null, position: 5 },
  { id: "hot-serves", slug: "hot-serves", name: "Hot Serves", description: null, position: 6 },
  { id: "main-course", slug: "main-course", name: "Main Course", description: null, position: 7 },
  { id: "make-it-a-meal", slug: "make-it-a-meal", name: "Make It A Meal", description: null, position: 8 },
];

export const FALLBACK_JOURNAL: JournalEntryView[] = [
  {
    slug: "summer-crop-harvest",
    date_label: "28 FEB 2026",
    batch: "BATCH 042",
    title: "Harvesting the summer crop in Pappinaickanpatti",
    excerpt:
      "The hot dry winds of early summer yield coconuts with concentrated oil density. We document our harvest process in the groves of Pappinaickanpatti, picking only dry, fallen nuts for high-yield wooden extraction.",
    body: null,
    read_time: "4 min read",
    is_published: true,
    position: 1,
  },
  {
    slug: "teak-wood-vs-stone",
    date_label: "15 JAN 2026",
    batch: "BATCH 041",
    title: "Teak wood vs stone: why traditional wooden presses matter",
    excerpt:
      "While modern oil machines use steel screws and high heat, and old mills used stone, we chose teak-wood presses. Teak acts as a natural temperature absorber, keeping the seeds cool during friction turns.",
    body: null,
    read_time: "6 min read",
    is_published: true,
    position: 2,
  },
  {
    slug: "cotton-cloth-filtration",
    date_label: "04 DEC 2025",
    batch: "BATCH 039",
    title: "The slow art of cotton-cloth oil filtration",
    excerpt:
      "Clear coconut oil isn't always the purest. We let our freshly pressed oil settle naturally for 48 hours before passing it through organic cotton cloth.",
    body: null,
    read_time: "3 min read",
    is_published: true,
    position: 3,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

/** "2026-02-01" -> "FEB 2026" */
export function formatPressed(date?: string | null): string {
  if (!date) return "";
  const dt = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(dt.getTime())) return "";
  return `${MONTHS[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`;
}

export function mapProductRowToCard(row: ProductRow): ProductCardData {
  const cat = Array.isArray(row.categories)
    ? row.categories[0]?.slug
    : row.categories?.slug;
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    variant: row.variant_label,
    startingFrom: Number(row.starting_from_inr) || 0,
    batch: row.batch_no,
    pressed: formatPressed(row.pressed_at),
    hueA: row.hue_a || "#4b5563",
    hueB: row.hue_b || "#1f2937",
    rating: row.rating != null ? Number(row.rating) : undefined,
    category: cat ?? undefined,
    description: row.description ?? undefined,
    benefits: row.benefits ?? [],
    isVeg: row.is_veg ?? true,
    isBestSeller: row.is_best_seller ?? true,
    image: row.hero_image ?? undefined,
  };
}

// ── Public storefront getters (with fallbacks) ────────────────────────────────

export async function getProducts(): Promise<ProductCardData[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(slug)")
      .eq("is_active", true)
      .order("position", { ascending: true });
    if (error || !data || data.length === 0) return FALLBACK_PRODUCTS;
    return (data as ProductRow[]).map(mapProductRowToCard);
  } catch {
    return FALLBACK_PRODUCTS;
  }
}

export async function getCategories(): Promise<CategoryRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("position", { ascending: true });
    if (error || !data || data.length === 0) return FALLBACK_CATEGORIES;
    return data as CategoryRow[];
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

/** Chip list for the storefront filters: [{id:'all'...}, {id: slug, label: name}] */
export async function getCategoryChips(): Promise<{ id: string; label: string }[]> {
  const cats = await getCategories();
  return [
    { id: "all", label: "All Items" },
    ...cats.map((c) => ({ id: c.slug, label: c.name })),
  ];
}

export async function getJournalBySlug(
  slug: string,
): Promise<JournalEntryView | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error || !data) {
      return FALLBACK_JOURNAL.find((e) => e.slug === slug) ?? null;
    }
    return data as JournalEntryView;
  } catch {
    return FALLBACK_JOURNAL.find((e) => e.slug === slug) ?? null;
  }
}

export async function getJournalEntries(): Promise<JournalEntryView[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("is_published", true)
      .order("position", { ascending: true });
    if (error || !data || data.length === 0) return FALLBACK_JOURNAL;
    return data as JournalEntryView[];
  } catch {
    return FALLBACK_JOURNAL;
  }
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error || !data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(data as Partial<SiteSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// ── Admin getters (no fallback — return raw DB rows) ──────────────────────────

export async function getAllProductsAdmin(): Promise<ProductRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(slug)")
    .order("position", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as ProductRow[];
}

export async function getProductById(id: string): Promise<ProductRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as ProductRow) ?? null;
}

export async function getAllJournalAdmin(): Promise<JournalEntryView[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .order("position", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as JournalEntryView[];
}

export async function getJournalById(id: string): Promise<JournalEntryView | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as JournalEntryView) ?? null;
}
