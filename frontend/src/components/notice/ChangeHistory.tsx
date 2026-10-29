import React from "react";
import { useTranslation } from "react-i18next";
import { History, GitCommit, ArrowRight } from "lucide-react";
import { NoticeVersion } from "../../types/notice";
import { formatDateTime, formatDate } from "../../utils/date";
import { getLocalizedText } from "../../utils/localized";

interface ChangeHistoryProps {
  versions?: NoticeVersion[];
}

export const ChangeHistory: React.FC<ChangeHistoryProps> = ({ versions }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "mr";

  if (!versions || versions.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-5 md:p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <History size={18} className="text-emerald-700" />
        <h4 className="font-bold text-stone-900 text-sm md:text-base">
          {t("notice.changeHistoryTitle")}
        </h4>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
        {versions.map((ver, idx) => {
          const summary = getLocalizedText(ver, "summary", lang, ver.summary);
          const changeSummary = getLocalizedText(ver, "changeSummary", lang, ver.changeSummary || "");

          return (
            <div key={ver.versionId} className="relative">
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center text-emerald-800">
                <GitCommit size={12} />
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-bold text-xs md:text-sm text-stone-900 bg-stone-100 px-2 py-0.5 rounded-lg">
                  v{ver.versionId}
                </span>
                <span className="text-xs text-stone-400">
                  {formatDateTime(ver.retrievedAt, lang)}
                </span>
                {idx === 0 && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-950 font-bold px-2 py-0.5 rounded-full">
                    {t("notice.currentVersion")}
                  </span>
                )}
              </div>

              {changeSummary && (
                <div className="p-2.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-semibold text-amber-950 mb-1.5 flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-amber-700 shrink-0" />
                  <span>{changeSummary}</span>
                </div>
              )}

              <p className="text-xs text-stone-600 leading-relaxed">{summary}</p>

              {ver.closingDate && (
                <p className="text-[11px] text-stone-500 mt-1.5 font-medium">
                  {t("notice.recordedDeadline", { date: formatDate(ver.closingDate, lang) })}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
