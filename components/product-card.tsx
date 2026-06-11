"use client";

import { useState } from "react";
import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { BatchStamp } from "./batch-stamp";

export interface ProductCardData {
  slug: string;
  name: string;
  tagline: string;
  variant: string;        // e.g. "Wood-pressed"
  startingFrom: number;   // in INR, lowest variant price
  batch: string;
  pressed: string;
  hueA: string;
  hueB: string;
  rating?: number;
  category?: string;
  description?: string;
  benefits?: string[];
}

interface ProductCardProps {
  data: ProductCardData;
  className?: string;
  onViewDetails?: (product: ProductCardData) => void;
}

export function ProductCard({
  data,
  className,
  onViewDetails,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const whatsappText = `Hi, I'm interested in ordering: *${data.name}* (${data.variant}) from Coconet.
Batch: ${data.batch}
Pressed: ${data.pressed}
Starting Price: ₹${data.startingFrom}`;
  const whatsappUrl = `https://wa.me/918124165047?text=${encodeURIComponent(whatsappText)}`;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(data);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group block bg-kernel-deeper/40 border hairline overflow-hidden cursor-pointer",
        "hover:border-leaf/40 transition-colors duration-300",
        className
      )}
    >
      {/* Bottle area — placeholder gradient with overlays */}
      <div
        className="aspect-[4/5] relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${data.hueA} 0%, ${data.hueB} 100%)`,
        }}
      >
        {/* Top left favorite button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute left-3 top-3 p-2 bg-kernel/90 border hairline rounded-full hover:bg-kernel-deeper transition-colors duration-200 z-10 text-shell"
          aria-label="Add to favorites"
        >
          <Heart
            size={14}
            className={cn(
              "transition-colors duration-200",
              isFavorite ? "fill-oil text-oil" : "text-shell hover:text-oil"
            )}
          />
        </button>

        {/* Top right Vegan/Natural badge */}
        <div className="absolute right-3 top-3 px-2 py-0.5 bg-leaf-deep/90 text-kernel text-[9px] font-mono tracking-wider rounded-sm z-10">
          100% VEGAN
        </div>

        {/* Bottom Left Variant */}
        <div className="absolute bottom-3 left-3">
          <span className="eyebrow text-kernel/90">{data.variant}</span>
        </div>

        {/* Bottom Right Rating */}
        {data.rating && (
          <div className="absolute bottom-3 right-3 flex items-center gap-0.5 px-2 py-0.5 bg-ink/60 text-kernel text-[10px] font-mono tracking-wider rounded-sm backdrop-blur-xs">
            <Star size={10} className="fill-oil text-oil" />
            <span>{data.rating}</span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        <BatchStamp
          batch={data.batch}
          pressed={data.pressed}
          className="!px-0 !py-0 !border-0 !bg-transparent"
        />

        <div className="flex items-baseline justify-between gap-4">
          <h3
            className="font-display text-xl text-leaf-deep group-hover:text-leaf transition-colors line-clamp-1"
            style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 20" }}
          >
            {data.name}
          </h3>
          <span className="font-mono text-sm text-shell whitespace-nowrap">
            from ₹{data.startingFrom}
          </span>
        </div>

        <p className="font-body text-xs text-shell-husk leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {data.tagline}
        </p>

        {/* Card Actions Grid (inspired by model layout) */}
        <div className="pt-3 grid grid-cols-2 gap-2 border-t border-shell/10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="btn-secondary !px-2 !py-2 !text-[11px] rounded-sm text-center justify-center"
          >
            Know more
          </button>
          
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn-primary !px-2 !py-2 !text-[11px] rounded-sm flex items-center justify-center gap-1"
          >
            <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.46h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Order
          </a>
        </div>
      </div>
    </div>
  );
}
