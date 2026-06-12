"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { Sparkles, Heart, HelpCircle } from "lucide-react";

export function ConsumptionCalculator() {
  const { t } = useLanguage();
  const [familySize, setFamilySize] = useState(3);
  const [refinedUsage, setRefinedUsage] = useState(5); // in Liters per month

  // Chekku oil is denser and holds its viscosity longer under heat, resulting in ~15-20% less usage.
  const chekkuNeeded = (refinedUsage * 0.82).toFixed(1);
  const volumeSaved = (refinedUsage - parseFloat(chekkuNeeded)).toFixed(1);

  // Health Score calculations
  const transFatReduced = (refinedUsage * 22).toFixed(0); // estimated grams of trans fats avoided per month

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-leaf/10 bg-white p-6 shadow-[0_10px_35px_-10px_rgba(33,119,67,0.08)]">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-leaf/10 text-leaf">
          <Sparkles size={16} className="fill-leaf/20" />
        </span>
        <h2 className="font-body text-xl font-extrabold text-ink">
          {t("calcTitle")}
        </h2>
      </div>
      <p className="font-body text-xs font-semibold text-gray-500 mb-6 leading-relaxed">
        {t("calcSubtitle")}
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Side: Inputs */}
        <div className="space-y-5">
          {/* Family Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-body text-xs font-bold text-gray-700">
                {t("calcFamilySize")}
              </label>
              <span className="font-body text-sm font-extrabold text-leaf bg-leaf-mist px-2.5 py-0.5 rounded-full">
                {familySize} {familySize === 1 ? t("person") : t("people")}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={familySize}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setFamilySize(val);
                setRefinedUsage(val * 1.5 + 0.5); // auto adjust standard usage: ~1.5L per person
              }}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-leaf"
            />
          </div>

          {/* Current Usage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-body text-xs font-bold text-gray-700">
                {t("calcCurrentUsage")}
              </label>
              <span className="font-body text-sm font-extrabold text-leaf bg-leaf-mist px-2.5 py-0.5 rounded-full">
                {refinedUsage.toFixed(1)} {t("liters")}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={refinedUsage}
              onChange={(e) => setRefinedUsage(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-leaf"
            />
          </div>
        </div>

        {/* Right Side: Projections */}
        <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 space-y-4">
          <h3 className="font-body text-xs font-extrabold uppercase tracking-wider text-gray-400">
            {t("calcSwitchingTo")}
          </h3>

          {/* Recommendation */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-white border border-leaf/10 p-2 text-center shadow-xs flex-shrink-0 min-w-[70px]">
              <p className="font-body text-xs text-gray-400 font-bold uppercase tracking-tight">
                {t("liters")}
              </p>
              <p className="font-body text-2xl font-extrabold text-leaf">
                {chekkuNeeded}
              </p>
            </div>
            <div>
              <h4 className="font-body text-xs font-bold text-ink">
                {t("calcRecommendedQty")}
              </h4>
              <p className="font-body text-[11px] text-gray-500 font-semibold leading-relaxed mt-1">
                {t("calcExplanation")}
              </p>
            </div>
          </div>

          {/* Key Metric: Savings & Health */}
          <div className="border-t border-gray-200/80 pt-3 grid grid-cols-2 gap-2">
            <div className="bg-white border border-gray-100 p-2.5 rounded-lg">
              <p className="font-body text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {t("calcEstimatedSavings")}
              </p>
              <p className="font-body text-base font-extrabold text-ink mt-0.5">
                {volumeSaved} {t("liters")}
              </p>
            </div>
            <div className="bg-white border border-gray-100 p-2.5 rounded-lg">
              <p className="font-body text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Heart size={10} className="fill-red-500 text-red-500" />
                <span>Trans-Fats Avoided</span>
              </p>
              <p className="font-body text-base font-extrabold text-[#9d174d] mt-0.5">
                {transFatReduced}g
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="text-[10px] font-bold text-leaf/90 flex flex-col gap-1.5 bg-leaf/5 p-2.5 rounded-lg border border-leaf/10">
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-leaf" />
              <span>{t("calcHealthScore")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-leaf" />
              <span>{t("calcOrganicAcc")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
