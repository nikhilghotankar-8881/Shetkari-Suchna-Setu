import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Tag } from "lucide-react";
import { Notice } from "../../types/notice";
import { Card } from "../ui/Card";
import { StatusBadge } from "../ui/StatusBadge";
import { DeadlineDisplay } from "./DeadlineDisplay";
import { SourceInfo } from "./SourceInfo";
import { formatDate } from "../../utils/date";
import { getLocalizedText } from "../../utils/localized";

export const NoticeCard: React.FC<{ notice: Notice }> = ({ notice }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "mr";

  const title = getLocalizedText(notice, "title", lang, notice.title);
  const department = getLocalizedText(notice, "department", lang, notice.department);
  const summary = getLocalizedText(notice, "summary", lang, notice.summary);
  const sourceName = getLocalizedText(notice, "sourceName", lang, notice.sourceName);

  return (
    <Card hoverable className="flex flex-col gap-3.5">
      {/* Top Header: Category & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
          <Tag size={13} className="text-emerald-700" />
          <span className="capitalize">{t(`notice.${notice.category}`)}</span>
          {notice.isManualImport && (
            <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-medium">
              {t("notice.manualImport")}
            </span>
          )}
        </div>
        <StatusBadge status={notice.status} size="sm" />
      </div>

      {/* Title & Department */}
      <div>
        <h3 className="font-bold text-base md:text-lg text-stone-900 leading-snug hover:text-emerald-900 transition-colors">
          <Link to={`/notices/${notice.id}`}>{title}</Link>
        </h3>
        <p className="text-xs text-stone-500 mt-1">{department}</p>
      </div>

      {/* Summary */}
      <p className="text-xs md:text-sm text-stone-600 line-clamp-2 leading-relaxed">
        {summary}
      </p>

      {/* Deadline box */}
      <div className="pt-1">
        <DeadlineDisplay
          closingDate={notice.applicationClosingDate}
          isVerified={notice.isDeadlineVerified}
        />
      </div>

      {/* Source Info & Footer Link */}
      <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
        <SourceInfo
          sourceName={sourceName}
          sourceUrl={notice.sourceUrl}
          lastCheckedAt={notice.lastCheckedAt}
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-stone-400">
            {notice.publishedAt ? t("notice.published", { date: formatDate(notice.publishedAt, lang) }) : ""}
          </span>
          <Link
            to={`/notices/${notice.id}`}
            className="inline-flex items-center gap-1 text-xs md:text-sm font-semibold text-emerald-800 hover:text-emerald-950 group"
          >
            <span>{t("notice.viewDetails")}</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </Card>
  );
};
