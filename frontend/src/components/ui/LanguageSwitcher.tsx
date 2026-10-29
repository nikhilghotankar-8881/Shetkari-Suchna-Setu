import React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
] as const;

export const LanguageSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { i18n, t } = useTranslation();
  const currentLang = (i18n.language?.split("-")[0] || "mr") as "en" | "hi" | "mr";

  const handleSelect = (code: string) => {
    if (code !== currentLang) {
      i18n.changeLanguage(code);
      try {
        localStorage.setItem("lang", code);
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="flex items-center">
      {/* Desktop & Tablet Segmented Pill (visible sm and up) */}
      <div
        className={`hidden sm:inline-flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200/80 ${
          compact ? "scale-90 origin-right" : ""
        }`}
        role="group"
        aria-label={t("nav.switchLanguage")}
      >
        <div className="pl-1.5 pr-1 text-emerald-800 flex items-center">
          <Globe size={14} className="text-emerald-700" />
        </div>
        {LANGUAGES.map((lang) => {
          const isActive = currentLang === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
                isActive
                  ? "bg-white text-emerald-950 shadow-xs border border-stone-200/60 font-bold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
              aria-pressed={isActive}
            >
              {lang.label}
            </button>
          );
        })}
      </div>

      {/* Mobile Select (visible on narrow screens < 640px) */}
      <div className="sm:hidden relative inline-flex items-center">
        <label htmlFor="mobile-lang-select" className="sr-only">
          {t("nav.switchLanguage")}
        </label>
        <div className="absolute left-2.5 pointer-events-none text-emerald-700">
          <Globe size={14} />
        </div>
        <select
          id="mobile-lang-select"
          value={currentLang}
          onChange={(e) => handleSelect(e.target.value)}
          className="appearance-none bg-white border border-stone-200 text-emerald-950 font-bold text-xs pl-8 pr-6 py-1.5 rounded-xl shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 cursor-pointer"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2 pointer-events-none text-stone-400 text-[10px]">
          ▼
        </div>
      </div>
    </div>
  );
};
