import React from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck, UserCheck } from "lucide-react";
import { VerificationLog } from "../../types/notice";
import { formatDateTime } from "../../utils/date";
import { StatusBadge } from "../ui/StatusBadge";
import { getLocalizedText } from "../../utils/localized";

export const VerificationTimeline: React.FC<{ history?: VerificationLog[] }> = ({ history }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "mr";

  if (!history || history.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-5 md:p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck size={18} className="text-emerald-700" />
        <h4 className="font-bold text-stone-900 text-sm md:text-base">
          {t("notice.auditTrailTitle")}
        </h4>
      </div>

      <div className="space-y-3">
        {history.map((log, i) => {
          const notes = getLocalizedText(log, "notes", lang, log.notes || "");

          return (
            <div key={i} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex flex-col gap-1.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <StatusBadge status={log.status} size="sm" />
                <span className="text-[11px] text-stone-400 font-medium">
                  {formatDateTime(log.timestamp, lang)}
                </span>
              </div>

              {log.reviewedBy && (
                <div className="flex items-center gap-1.5 text-stone-700 font-semibold mt-1">
                  <UserCheck size={14} className="text-emerald-700 shrink-0" />
                  <span>{t("notice.reviewerOfficer", { name: log.reviewedBy })}</span>
                </div>
              )}

              {notes && (
                <p className="text-stone-600 italic bg-white p-2.5 rounded-xl border border-stone-200/60 mt-1 leading-relaxed">
                  "{notes}"
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
