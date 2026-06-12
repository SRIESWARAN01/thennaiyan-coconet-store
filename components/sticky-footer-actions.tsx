"use client";

import { useLanguage } from "@/lib/language-context";
import { ShoppingCart, MessageCircle } from "lucide-react";

interface StickyFooterActionsProps {
  whatsappNumber: string;
  businessName: string;
}

export function StickyFooterActions({
  whatsappNumber,
  businessName,
}: StickyFooterActionsProps) {
  const { t, lang } = useLanguage();

  const displayName = lang === "ta" ? t("businessName") : businessName;

  const cartText =
    lang === "ta"
      ? `வணக்கம், நான் ${displayName}-ல் தயாரிப்புகளைப் பார்க்கிறேன்.`
      : `Hi, I'm checking out products at ${displayName}.`;

  const enquireText =
    lang === "ta"
      ? `வணக்கம், நான் ${displayName}-ல் வணிக விசாரணை செய்ய விரும்புகிறேன்.`
      : `Hi, I'd like to place a business enquiry with ${displayName}.`;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white/95 border-t border-gray-100 p-4 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] backdrop-blur z-30">
      <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(cartText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 bg-leaf hover:bg-leaf-deep text-white font-bold rounded-full text-sm shadow-sm transition-colors duration-200"
        >
          <ShoppingCart size={16} />
          <span>{t("viewCart")}</span>
        </a>
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(enquireText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 border border-leaf hover:bg-leaf/5 text-leaf font-bold rounded-full text-sm transition-colors duration-200"
        >
          <MessageCircle size={16} />
          <span>{t("enquire")}</span>
        </a>
      </div>
    </div>
  );
}
