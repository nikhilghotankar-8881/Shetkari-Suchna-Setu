import React from "react";
import { useTranslation } from "react-i18next";
import { Clock, AlertCircle } from "lucide-react";
import { formatDate, daysRemaining } from "../../utils/date";

interface DeadlineDisplayProps {
  closingDate?: string | null;
  isVerified: boolean;
  compact?: boolean;
}

export const DeadlineDisplay: React.FC<DeadlineDisplayProps> = ({
  closingDate,
  isVerified,
  compact = false,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "mr";

  if (!isVerified || !closingDate) {
    return (
      <div className="inline-flex items-center gap-1.5 text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-xl text-xs font-semibold">
        <AlertCircle size={14} className="text-amber-600 shrink-0" />
        <span>{t("notice.deadlineNotVerified")}</span>
      </div>
    );
  }

  const remaining = daysRemaining(closingDate);
  const formatted = formatDate(closingDate, lang);

  const isUrgent = remaining !== null && remaining <= 7 && remaining >= 0;
  const isPast = remaining !== null && remaining < 0;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs md:text-sm font-medium ${
        isPast
          ? "bg-stone-100 border-stone-200 text-stone-500"
          : isUrgent
          ? "bg-amber-50 border-amber-300 text-amber-900 shadow-2xs"
          : "bg-emerald-50/70 border-emerald-200 text-emerald-950"
      }`}
    >
      <Clock
        size={15}
        className={
          isPast
            ? "text-stone-400"
            : isUrgent
            ? "text-amber-600 animate-pulse shrink-0"
            : "text-emerald-700 shrink-0"
        }
      />
      <div className="flex flex-wrap items-center gap-1">
        <span className="text-stone-600 font-normal">{t("notice.deadline")}:</span>
        <span className="font-bold">{formatted}</span>
        {!compact && remaining !== null && (
          <span className="ml-1 text-[11px] font-bold opacity-90">
            {isPast
              ? `(${t("notice.expiredNotice")})`
              : remaining === 0
              ? `(${t("notice.todayDeadline")})`
              : `(${t("notice.daysLeft", { count: remaining })})`}
          </span>
        )}
      </div>
    </div>
  );
};
