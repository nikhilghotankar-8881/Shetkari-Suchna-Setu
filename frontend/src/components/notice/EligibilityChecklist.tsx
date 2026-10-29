import React from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { getLocalizedList } from "../../utils/localized";

interface EligibilityChecklistProps {
  conditions: string[];
  conditionsHi?: string[];
  conditionsMr?: string[];
}

export const EligibilityChecklist: React.FC<EligibilityChecklistProps> = ({
  conditions,
  conditionsHi,
  conditionsMr,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "mr";

  const list = getLocalizedList(
    { conditions, conditionsHi, conditionsMr },
    "conditions",
    lang
  );

  if (!list || list.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-5 md:p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle size={18} className="text-emerald-700" />
        <h4 className="font-bold text-stone-900 text-sm md:text-base">
          {t("notice.conditions")}
        </h4>
      </div>

      <ul className="space-y-3">
        {list.map((cond, index) => (
          <li
            key={index}
            className="flex items-start gap-2.5 text-xs md:text-sm text-stone-700 leading-relaxed"
          >
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {index + 1}
            </span>
            <span className="font-medium">{cond}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-start sm:items-center gap-2 text-xs text-amber-900 font-medium">
        <AlertTriangle size={15} className="text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
        <span>{t("notice.verifyConditionsWarning")}</span>
      </div>
    </div>
  );
};
