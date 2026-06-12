"use client";

import { useLanguage } from "@/lib/language-context";

interface HeroBannerProps {
  businessName: string;
}

export function HeroBanner({ businessName }: HeroBannerProps) {
  const { t, lang } = useLanguage();

  const displayName = lang === "ta" ? t("businessName") : businessName;

  return (
    <section className="bg-leaf text-white text-center py-12 px-4 md:py-16 transition-all duration-300">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        {/* Coconut Emoji */}
        <span
          className="text-4xl mb-3 animate-bounce"
          style={{ animationDuration: "2.5s" }}
        >
          🥥
        </span>

        <h1 className="font-body font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-3">
          {displayName}
        </h1>

        <p className="font-body text-base md:text-lg font-bold text-white/95 mb-1">
          {t("taglineSubtitle")}
        </p>
        <p className="font-body text-sm text-white/80 mb-6">
          {t("exploreWhatsApp")}
        </p>

        <a
          href="#products"
          className="px-6 py-2.5 bg-white text-leaf font-bold rounded-full text-sm shadow-sm hover:bg-gray-50 transition-colors duration-200"
        >
          {t("browseProducts")}
        </a>
      </div>
    </section>
  );
}
