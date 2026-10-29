import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Activity, CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { useAdminSources } from "../../hooks/useAdmin";
import { LoadingState } from "../../components/ui/LoadingState";
import { formatDateTime } from "../../utils/date";
import { getLocalizedText } from "../../utils/localized";

export const SourceHealth: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "mr";
  const { data: sources, isLoading, refetch } = useAdminSources();

  if (isLoading) return <LoadingState message={t("common.loading")} />;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
            <CheckCircle size={13} className="text-emerald-700" />
            {t("sources.healthy")}
          </span>
        );
      case "warning":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold">
            <AlertTriangle size={13} className="text-amber-700" />
            {t("sources.warning")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-950 text-xs font-bold">
            <XCircle size={13} className="text-red-700" />
            {t("sources.offline")}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 mb-2 font-semibold">
            <ArrowLeft size={14} /> <span>{t("admin.returnToDashboard")}</span>
          </Link>
          <h1 className="text-xl md:text-2xl font-extrabold text-stone-900 flex items-center gap-2 tracking-tight">
            <Activity size={22} className="text-emerald-800 shrink-0" />
            <span>{t("sources.title")}</span>
          </h1>
          <p className="text-xs md:text-sm text-stone-500 mt-0.5">
            {t("sources.subtitle")}
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 shrink-0 self-start sm:self-auto shadow-2xs cursor-pointer"
        >
          <RefreshCw size={13} />
          <span>{t("sources.refresh")}</span>
        </button>
      </div>

      {/* Source Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sources?.map((src) => {
          const name = getLocalizedText(src, "name", lang, src.name);
          const errorMsg = getLocalizedText(src, "errorMessage", lang, src.errorMessage || "");

          return (
            <div
              key={src.id}
              className={`bg-white rounded-3xl border p-5 space-y-4 shadow-xs ${
                src.status === "warning" ? "border-amber-300" : "border-stone-200/90"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-stone-900 text-sm md:text-base leading-snug">
                  {name}
                </h3>
                {getStatusBadge(src.status)}
              </div>

              <p className="text-xs text-stone-500 font-mono truncate">{src.url}</p>

              <div className="space-y-2 text-xs border-t border-stone-100 pt-3 text-stone-600">
                <div className="flex justify-between">
                  <span className="text-stone-400 font-medium">{t("sources.checkFrequency")}</span>
                  <span className="font-bold text-stone-800">
                    {t("sources.everyHours", { count: src.checkFrequencyHours })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400 font-medium">{t("sources.lastCheck")}</span>
                  <span className="font-semibold text-stone-800">{formatDateTime(src.lastCheckedAt, lang)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400 font-medium">{t("sources.lastSuccessfulCheck")}</span>
                  <span className="font-semibold text-emerald-800 font-medium">
                    {formatDateTime(src.lastSuccessfulRetrievalAt, lang)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400 font-medium">{t("sources.totalDetected")}</span>
                  <span className="font-bold text-stone-900">{src.detectedCount}</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-950 leading-relaxed font-medium">
                  <strong>{t("sources.errorLog")}</strong> {errorMsg}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
