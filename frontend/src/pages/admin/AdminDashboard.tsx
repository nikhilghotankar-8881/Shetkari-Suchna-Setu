import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShieldCheck, CheckCircle2, Clock, Activity, BarChart3, AlertCircle, ArrowRight } from "lucide-react";
import { useNotices } from "../../hooks/useNotices";
import { useAdminSources } from "../../hooks/useAdmin";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Button } from "../../components/ui/Button";
import { LoadingState } from "../../components/ui/LoadingState";
import { getLocalizedText } from "../../utils/localized";

export const AdminDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "mr";
  const { data: notices, isLoading: noticesLoading } = useNotices();
  const { isLoading: sourcesLoading } = useAdminSources();

  if (noticesLoading || sourcesLoading) {
    return <LoadingState message={t("common.loading")} />;
  }

  const pendingNotices = notices?.filter((n) => n.status === "pending_review") || [];
  const conflictingNotices = notices?.filter((n) => n.status === "conflicting") || [];
  const verifiedNotices = notices?.filter((n) => n.status === "verified") || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold mb-1">
            <ShieldCheck size={16} />
            <span>{t("admin.title")}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold">{t("admin.title")}</h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-xl">
            {t("admin.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/sources">
            <Button size="sm" variant="inverse" className="border-emerald-600/70 text-white hover:bg-emerald-900/60">
              <Activity size={14} className="mr-1" />
              <span>{t("admin.sourceHealth")}</span>
            </Button>
          </Link>
          <Link to="/admin/impact">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold border-none shadow-xs">
              <BarChart3 size={14} className="mr-1" />
              <span>{t("admin.impact")}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t("admin.pendingReviewCount")}</span>
            <Clock size={18} />
          </div>
          <div className="text-3xl font-extrabold text-amber-950">{pendingNotices.length}</div>
          <p className="text-xs text-amber-800 mt-1">{t("admin.pendingSubtitle")}</p>
        </div>

        <div className="bg-red-50 border border-red-200/80 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-red-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t("admin.conflictingCount")}</span>
            <AlertCircle size={18} />
          </div>
          <div className="text-3xl font-extrabold text-red-950">{conflictingNotices.length}</div>
          <p className="text-xs text-red-800 mt-1">{t("admin.conflictingSubtitle")}</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200/80 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t("admin.verifiedCount")}</span>
            <CheckCircle2 size={18} />
          </div>
          <div className="text-3xl font-extrabold text-emerald-950">{verifiedNotices.length}</div>
          <p className="text-xs text-emerald-800 mt-1">{t("admin.verifiedSubtitle")}</p>
        </div>
      </div>

      {/* Review Queue Table / List */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-lg text-stone-900 flex items-center gap-2">
            <Clock size={18} className="text-amber-600" />
            <span>{t("admin.queueTitle")}</span>
          </h2>
          <span className="text-xs text-stone-500 font-semibold bg-stone-100 px-2.5 py-1 rounded-full">
            {t("admin.noticesWaiting", { count: pendingNotices.length + conflictingNotices.length })}
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {[...pendingNotices, ...conflictingNotices].map((n) => {
            const title = getLocalizedText(n, "title", lang, n.title);
            const sourceName = getLocalizedText(n, "sourceName", lang, n.sourceName);

            return (
              <div
                key={n.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/70 px-3 rounded-2xl transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={n.status} size="sm" />
                    <span className="text-xs text-stone-500 font-medium">
                      {t("admin.sourceName", { name: sourceName })}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-stone-900 leading-snug">
                    {title}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {n.applicationClosingDate
                      ? t("admin.extractedDeadline", { date: n.applicationClosingDate })
                      : t("admin.deadlineNotSpecified")}
                  </p>
                </div>

                <Link to={`/admin/notices/${n.id}/review`} className="shrink-0">
                  <Button size="sm" variant="primary" className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-900">
                    <span>{t("admin.viewAndVerifyAction")}</span>
                    <ArrowRight size={14} className="ml-1" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
