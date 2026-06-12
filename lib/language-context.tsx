"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, productTranslations, type Language } from "./i18n";

type LanguageContextType = {
  lang: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  translateProduct: (
    slug: string,
    fallback: { name: string; tagline: string; description?: string; benefits?: string[] }
  ) => { name: string; tagline: string; description: string; benefits: string[] };
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  // Sync state with localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("thennaiyan_lang") as Language;
    if (saved === "en" || saved === "ta") {
      setLang(saved);
    }
    setMounted(true);
  }, []);

  const setLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("thennaiyan_lang", newLang);
  };

  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "ta" : "en";
    setLanguage(nextLang);
  };

  // Translation helper
  const t = (key: string): string => {
    const dict = translations[lang] as Record<string, string>;
    const fallbackDict = translations["en"] as Record<string, string>;
    return dict?.[key] || fallbackDict?.[key] || key;
  };

  // Product translation helper
  const translateProduct = (
    slug: string,
    fallback: { name: string; tagline: string; description?: string; benefits?: string[] }
  ) => {
    if (lang === "ta" && productTranslations[slug]) {
      return productTranslations[slug];
    }
    return {
      name: fallback.name,
      tagline: fallback.tagline,
      description: fallback.description || fallback.tagline,
      benefits: fallback.benefits || [],
    };
  };

  // Prevent hydration mismatch by rendering default English translation logic on server/first-load
  if (!mounted) {
    return (
      <LanguageContext.Provider
        value={{
          lang: "en",
          setLanguage: () => {},
          toggleLanguage: () => {},
          t: (key) => (translations["en"] as Record<string, string>)[key] || key,
          translateProduct: (slug, fb) => ({
            name: fb.name,
            tagline: fb.tagline,
            description: fb.description || fb.tagline,
            benefits: fb.benefits || [],
          }),
        }}
      >
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, toggleLanguage, t, translateProduct }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
