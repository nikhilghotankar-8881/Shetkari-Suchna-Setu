import React from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { formatDateTime } from "../../utils/date";

interface SourceInfoProps {
  sourceName: string;
  sourceUrl: string;
  lastCheckedAt: string;
  className?: string;
}

export const SourceInfo: React.FC<SourceInfoProps> = ({
  sourceName,
  sourceUrl,
  lastCheckedAt,
  className = "",
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "mr";

  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 ${className}`}>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="font-medium text-stone-700">{t("notice.source")}:</span>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-medium hover:underline truncate max-w-[220px] sm:max-w-xs"
        >
          <span>{sourceName}</span>
          <ExternalLink size={12} className="shrink-0" />
        </a>
      </div>

      <div className="inline-flex items-center gap-1 text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
        <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
        <span>{t("notice.lastChecked", { date: formatDateTime(lastCheckedAt, lang) })}</span>
      </div>
    </div>
  );
};

