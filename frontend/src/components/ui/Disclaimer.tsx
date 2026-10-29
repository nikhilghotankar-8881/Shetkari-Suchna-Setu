import React from "react";
import { useTranslation } from "react-i18next";
import { Info, AlertCircle, WifiOff } from "lucide-react";

interface DisclaimerProps {
  type: "short" | "footer" | "offline" | "unverified" | "sourceUnavailable" | "demoData";
  date?: string;
  className?: string;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ type, date, className = "" }) => {
  const { t } = useTranslation();

  if (type === "short") {
    return (
      <div className={`flex items-start gap-2 p-2.5 rounded-lg bg-stone-100/80 text-stone-700 text-xs ${className}`}>
        <Info size={15} className="text-stone-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{t("disclaimer.short")}</p>
      </div>
    );
  }

  if (type === "unverified") {
    return (
      <div className={`flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs md:text-sm ${className}`}>
        <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">{t("disclaimer.unverified")}</p>
      </div>
    );
  }

  if (type === "offline") {
    return (
      <div className={`flex items-center gap-2 p-2.5 bg-stone-800 text-stone-100 text-xs md:text-sm ${className}`}>
        <WifiOff size={16} className="text-amber-400 shrink-0" />
        <p>{t("disclaimer.offline")}</p>
      </div>
    );
  }

  if (type === "sourceUnavailable") {
    return (
      <div className={`flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs md:text-sm ${className}`}>
        <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{t("disclaimer.sourceUnavailable", { date: date || "—" })}</p>
      </div>
    );
  }

  if (type === "demoData") {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-200 text-stone-700 text-xs font-medium ${className}`}>
        <Info size={13} className="shrink-0" />
        <span>{t("disclaimer.demoData")}</span>
      </div>
    );
  }

  return (
    <footer className={`text-xs text-stone-500 leading-relaxed ${className}`}>
      {t("disclaimer.footer")}
    </footer>
  );
};

