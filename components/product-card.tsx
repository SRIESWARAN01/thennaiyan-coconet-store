"use client";

import { useState } from "react";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductCardData {
  slug: string;
  name: string;
  tagline: string;
  variant: string;
  startingFrom: number;
  batch: string;
  pressed: string;
  hueA: string;
  hueB: string;
  rating?: number;
  category?: string;
  description?: string;
  benefits?: string[];
  isVeg?: boolean;
  isBestSeller?: boolean;
  image?: string;
}

interface ProductCardProps {
  data: ProductCardData;
  className?: string;
  onViewDetails?: (product: ProductCardData) => void;
  whatsappNumber?: string;
  brand?: string;
}

export function ProductCard({
  data,
  className,
  onViewDetails,
  whatsappNumber = "918124165047",
  brand = "Thennaiyan",
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const whatsappText = `Hi, I'd like to order: *${data.name}* from ${brand}.
Price: ₹${data.startingFrom}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

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
        "group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden cursor-pointer",
        "hover:shadow-lg transition-all duration-300 flex flex-col",
        className
      )}
    >
      {/* Upper area — Image with overlays */}
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={data.image || "/images/placeholder.png"}
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top left favorite button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute left-3 top-3 p-1.5 bg-black/30 hover:bg-black/50 backdrop-blur-xs rounded-full transition-colors duration-200 z-10 text-white"
          aria-label="Add to favorites"
        >
          <Heart
            size={16}
            className={cn(
              "transition-colors duration-200",
              isFavorite ? "fill-red-500 text-red-500" : "text-white hover:text-red-400"
            )}
          />
        </button>

        {/* Top right Veg/Non-Veg badge */}
        <div
          className={cn(
            "absolute right-3 top-3 px-2 py-0.5 text-[9px] font-bold tracking-wider rounded text-white z-10",
            data.isVeg ? "bg-[#1fb36c]" : "bg-[#e23c3c]"
          )}
        >
          {data.isVeg ? "VEG" : "NON-VEG"}
        </div>

        {/* Bottom overlay for name & rating */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-8 flex items-end justify-between gap-2">
          <h3 className="font-body font-bold text-base text-white line-clamp-1">
            {data.name}
          </h3>
          {data.rating && (
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-black/40 text-white text-[10px] font-bold rounded backdrop-blur-xs flex-shrink-0">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
              <span>{data.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Lower area — Body and actions */}
      <div className="p-4 flex flex-col justify-between flex-grow space-y-3">
        {/* Price & Best Seller tag */}
        <div className="flex items-center justify-between">
          <span className="font-body font-extrabold text-lg text-leaf">
            ₹{Number(data.startingFrom).toFixed(2)}
          </span>
          {data.isBestSeller && (
            <span className="text-[10px] font-bold text-gray-400 tracking-wider">
              BEST SELLER
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn-primary !px-2.5 !py-2 !text-xs rounded-full flex items-center justify-center gap-1.5 hover:opacity-95"
          >
            <ShoppingCart size={13} strokeWidth={2.5} />
            <span>Add</span>
          </a>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="btn-secondary !px-2.5 !py-2 !text-xs rounded-full hover:bg-leaf/5"
          >
            View Nutrition
          </button>
        </div>
      </div>
    </div>
  );
}
