"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: "What is wood-pressed (Chekku) oil?",
    answer: "Wood-pressed oil is extracted using a traditional wooden mortar and pestle (Chekku) made of Vagai (East Indian Walnut) wood. The process rotates slowly at low temperatures (below 38°C), preventing friction heat and chemical solvents to preserve the original nutrients, natural aroma, and health benefits of the coconut copra."
  },
  {
    question: "How is wood-pressed oil different from refined oil?",
    answer: "Refined oils undergo heavy industrial processing, including high-temperature heating (up to 200°C), bleaching, and chemical solvent extraction (such as hexane) which strips all natural vitamins, MCTs, and antioxidants. Wood-pressed oil is cold-extracted, naturally filtered through cotton cloth, and contains zero chemical additives or preservatives."
  },
  {
    question: "Do you add any chemicals, mineral oils, or preservatives?",
    answer: "No, absolutely not. All Thennaiyan oils are 100% raw, unrefined, and free from paraffin, mineral oils, argemone oil, chemical solvents, or artificial coloring agents. They are bottled exactly as pressed."
  },
  {
    question: "How do I place an order through WhatsApp?",
    answer: "Browse our products, select your preferred size variant, and add them to your cart. Once ready, go to the cart page and click 'Order on WhatsApp'. This registers a secure order intent in our database and opens a pre-filled chat with our support team containing your order details to confirm payment and delivery."
  },
  {
    question: "How long does shipping and delivery take?",
    answer: "All orders are packaged and dispatched directly from our pressing unit in Madurai, Tamil Nadu. Shipping usually takes 2-4 business days for South India and 5-7 business days for the rest of India. You can track your order status in real time on your account dashboard."
  }
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 max-w-3xl mt-8">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-shell/15 bg-kernel-deeper/10 shadow-sm overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-leaf-deep hover:text-oil transition-colors"
            >
              <span className="text-base md:text-lg">{faq.question}</span>
              {isOpen ? (
                <ChevronUp className="text-oil flex-shrink-0 ml-4" size={20} />
              ) : (
                <ChevronDown className="text-leaf flex-shrink-0 ml-4" size={20} />
              )}
            </button>
            
            <div
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-96 opacity-100 border-t border-shell/10" : "max-h-0 opacity-0 pointer-events-none"
              }`}
            >
              <div className="p-5 font-body text-sm md:text-base text-shell leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
