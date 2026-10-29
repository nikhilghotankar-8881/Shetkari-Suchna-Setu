import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Target, ArrowRight, ShieldCheck } from "lucide-react";
import { FarmerAlert } from "../../types/alert";
import { Card } from "../ui/Card";
import { StatusBadge } from "../ui/StatusBadge";
import { DeadlineDisplay } from "../notice/DeadlineDisplay";
import { SourceInfo } from "../notice/SourceInfo";
import { getLocalizedText } from "../../utils/localized";

interface AlertCardProps {
  alert: FarmerAlert;
  onMarkRead?: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "mr";
  const { notice, matchReason } = alert;

  const title = getLocalizedText(notice, "title", lang, notice.title);
  const department = getLocalizedText(notice, "department", lang, notice.department);
  const sourceName = getLocalizedText(notice, "sourceName", lang, notice.sourceName);
  const matchExplanation = getLocalizedText(matchReason, "explanation", lang, matchReason.explanationEn);

  return (
    <Card hoverable className={`flex flex-col gap-3.5 border-l-4 ${alert.isRead ? "border-l-stone-300" : "border-l-emerald-600 shadow-xs"}`}>
      {/* Top Bar: Match Tag & Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-semibold">
          <Target size={13} className="text-emerald-700" />
          <span>{matchExplanation}</span>
        </div>
        <StatusBadge status={notice.status} size="sm" />
      </div>

      {/* Title & Category */}
      <div>
        <h3 className="font-bold text-base md:text-lg text-stone-900 leading-snug">
          <Link to={`/notices/${notice.id}`} className="hover:text-emerald-900 transition-colors">
            {title}
          </Link>
        </h3>
        <p className="text-xs text-stone-500 mt-1">{department}</p>
      </div>

      {/* Deadline info */}
      <div className="pt-1">
        <DeadlineDisplay
          closingDate={notice.applicationClosingDate}
          isVerified={notice.isDeadlineVerified}
        />
      </div>

      {/* Source Info & Action */}
      <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
        <SourceInfo
          sourceName={sourceName}
          sourceUrl={notice.sourceUrl}
          lastCheckedAt={notice.lastCheckedAt}
        />

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
            <ShieldCheck size={14} />
            <span>{t("status.verifiedBadge")}</span>
          </div>

          <Link
            to={`/notices/${notice.id}`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs md:text-sm font-semibold transition-all shadow-xs group"
          >
            <span>{t("notice.viewDetails")}</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </Card>
  );
};
