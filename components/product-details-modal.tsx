"use client";

import { Check, MessageCircle, X } from "lucide-react";
import type { ProductCardData } from "./product-card";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductCardData | null;
  whatsappNumber?: string;
  brand?: string;
}

const INR = "\u20B9";

export function ProductDetailsModal({
  isOpen,
  onClose,
  product,
  whatsappNumber = "918124165047",
  brand = "Coconet",
}: ProductDetailsModalProps) {
  if (!isOpen || !product) return null;

  const whatsappText = `Hi, I want to order ${product.name} (${product.variant}) from ${brand}.
Batch: ${product.batch}
Pressed: ${product.pressed}
Starting Price: ${INR}${product.startingFrom}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappText,
  )}`;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
      <section className="w-full max-w-md overflow-hidden rounded-[8px] bg-white shadow-2xl">
        <div
          className="relative aspect-[16/9]"
          style={{
            background: `radial-gradient(circle at 28% 18%, rgba(255,255,255,0.78), transparent 26%), linear-gradient(150deg, ${product.hueA}, ${product.hueB})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[#111827]"
          >
            <X size={16} />
          </button>
          <div className="absolute bottom-3 left-4 right-4">
            <p className="font-body text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/75">
              Batch {product.batch} - {product.pressed}
            </p>
            <h2 className="mt-1 truncate font-body text-xl font-extrabold text-white">
              {product.name}
            </h2>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-body text-sm font-bold text-[#667085]">
                {product.variant}
              </p>
              <p className="mt-1 font-body text-2xl font-extrabold text-[#05833f]">
                {INR}
                {product.startingFrom.toFixed(2)}
              </p>
            </div>
            <span className="rounded-full bg-[#edf6ee] px-3 py-1 font-body text-[11px] font-extrabold uppercase text-[#1f6b3b]">
              Natural
            </span>
          </div>

          <p className="mt-4 font-body text-sm font-semibold leading-relaxed text-[#475467]">
            {product.description || product.tagline}
          </p>

          {product.benefits && product.benefits.length > 0 && (
            <div className="mt-4 grid gap-2">
              {product.benefits.slice(0, 4).map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2 rounded-[8px] bg-[#f3f7f2] px-3 py-2 font-body text-xs font-bold text-[#344054]"
                >
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1f6b3b] text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {benefit}
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 grid grid-cols-[0.9fr_1.1fr] gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-[8px] border border-[#356f3b] font-body text-sm font-extrabold text-[#356f3b]"
            >
              Close
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#356f3b] font-body text-sm font-extrabold text-white"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
