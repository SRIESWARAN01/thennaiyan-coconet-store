// ============================================================================
// Server-side data access for the storefront + admin.
// All queries read directly from Supabase, returning empty results or null
// on database errors or empty sets, ensuring strict dependence on DB data.
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

// ── Default settings ─────────────────────────────────────────────────────────

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

// ── Public storefront getters (DB data only) ─────────────────────────────────

export async function getProducts(): Promise<ProductCardData[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(slug)")
      .eq("is_active", true)
      .order("position", { ascending: true });
    if (error || !data) return [];
    return (data as ProductRow[]).map(mapProductRowToCard);
  } catch {
    return [];
  }
}

export async function getCategories(): Promise<CategoryRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("position", { ascending: true });
    if (error || !data) return [];
    return data as CategoryRow[];
  } catch {
    return [];
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
    if (error || !data) return null;
    return data as JournalEntryView;
  } catch {
    return null;
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
    if (error || !data) return [];
    return data as JournalEntryView[];
  } catch {
    return [];
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
