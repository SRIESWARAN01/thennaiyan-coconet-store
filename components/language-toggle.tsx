"use client";

import { useLanguage } from "@/lib/language-context";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { lang, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50/50 p-0.5 shadow-sm">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-full px-3 py-1 font-body text-[11px] font-extrabold uppercase tracking-wide transition-all duration-200 ${
          lang === "en"
            ? "bg-leaf text-white shadow-xs"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("ta")}
        className={`rounded-full px-3 py-1 font-body text-[11px] font-extrabold transition-all duration-200 ${
          lang === "ta"
            ? "bg-leaf text-white shadow-xs"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        தமிழ்
      </button>
    </div>
  );
}
