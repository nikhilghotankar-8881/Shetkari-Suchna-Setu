import React from "react";
import { useTranslation } from "react-i18next";
import { ShieldAlert, ExternalLink } from "lucide-react";
import { Disclaimer } from "../ui/Disclaimer";

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto bg-stone-100 border-t border-stone-200 py-8 px-4 sm:px-6 text-stone-600 mb-16 lg:mb-0">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <h4 className="font-bold text-emerald-950 text-sm md:text-base">{t("app.name")}</h4>
            <p className="text-xs text-stone-500 mt-0.5">{t("app.tagline")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-stone-500 font-semibold">{t("notice.source")}:</span>
            <a
              href="https://mahadbt.maharashtra.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-medium hover:underline"
            >
              <span>MahaDBT</span> <ExternalLink size={11} />
            </a>
            <span className="text-stone-300">•</span>
            <a
              href="https://pmfby.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-medium hover:underline"
            >
              <span>PMFBY</span> <ExternalLink size={11} />
            </a>
            <span className="text-stone-300">•</span>
            <a
              href="https://krishi.maharashtra.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-medium hover:underline"
            >
              <span>Krishi Vibhag</span> <ExternalLink size={11} />
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs">
          <ShieldAlert size={18} className="text-stone-500 shrink-0 mt-0.5" />
          <Disclaimer type="footer" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-stone-400 gap-2">
          <p>© 2026 Shetkari SuchnaSetu Pilot Project. All rights reserved.</p>
          <p>{t("app.officialCell")}</p>
        </div>
      </div>
    </footer>
  );
};
