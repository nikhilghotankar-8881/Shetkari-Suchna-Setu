import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ExternalLink,
  Building2,
  FileCheck,
  History,
  ShieldCheck,
} from "lucide-react";
import { useNotice } from "../hooks/useNotices";
import { StatusBadge } from "../components/ui/StatusBadge";
import { DeadlineDisplay } from "../components/notice/DeadlineDisplay";
import { SourceInfo } from "../components/notice/SourceInfo";
import { EligibilityChecklist } from "../components/notice/EligibilityChecklist";
import { DocumentChecklist } from "../components/notice/DocumentChecklist";
import { ChangeHistory } from "../components/notice/ChangeHistory";
import { VerificationTimeline } from "../components/notice/VerificationTimeline";
import { LoadingState, ErrorMessage } from "../components/ui/LoadingState";
import { Disclaimer } from "../components/ui/Disclaimer";
import { Button } from "../components/ui/Button";
import { formatDate } from "../utils/date";
import { DISTRICTS, CROPS, getLocalizedOption } from "../utils/constants";
import { getLocalizedText } from "../utils/localized";

export const NoticeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "mr";

  const { data: notice, isLoading, error } = useNotice(id || "");
  const [activeTab, setActiveTab] = useState<"details" | "history" | "verification">("details");

  if (isLoading) return <LoadingState message={t("common.loading")} />;
  if (error || !notice) {
    return (
      <div className="space-y-4">
        <Link to="/notices" className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800">
          <ArrowLeft size={14} /> <span>{t("notice.backToNotices")}</span>
        </Link>
        <ErrorMessage message={t("common.notFound")} />
      </div>
    );
  }

  const title = getLocalizedText(notice, "title", lang, notice.title);
  const department = getLocalizedText(notice, "department", lang, notice.department);
  const summary = getLocalizedText(notice, "summary", lang, notice.summary);
  const sourceName = getLocalizedText(notice, "sourceName", lang, notice.sourceName);

  const districtLabels = notice.applicableDistricts.includes("all")
    ? t("notice.allMaharashtra")
    : notice.applicableDistricts
        .map((dId) => {
          const d = DISTRICTS.find((item) => item.id === dId);
          return d ? getLocalizedOption(d, lang) : dId;
        })
        .join(", ");

  const cropLabels = notice.applicableCrops.includes("all")
    ? t("notice.allCrops")
    : notice.applicableCrops
        .map((cId) => {
          const c = CROPS.find((item) => item.id === cId);
          return c ? getLocalizedOption(c, lang) : cId;
        })
        .join(", ");

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/notices"
          className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-stone-600 hover:text-emerald-950 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>{t("notice.backToNotices")}</span>
        </Link>
      </div>

      {/* Warning for unverified / conflicting notices */}
      {(notice.status === "pending_review" || notice.status === "conflicting") && (
        <Disclaimer type="unverified" />
      )}

      {/* Main Notice Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 md:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-950 border border-emerald-200/50">
            {t(`notice.${notice.category}`)}
          </span>
          <StatusBadge status={notice.status} size="md" />
        </div>

        <h1 className="text-xl md:text-3xl font-extrabold text-stone-900 leading-snug">
          {title}
        </h1>

        <div className="flex items-center gap-2 text-xs md:text-sm text-stone-600 font-medium">
          <Building2 size={16} className="text-stone-400 shrink-0" />
          <span>{department}</span>
        </div>

        {/* Source verification block */}
        <div className="pt-3 border-t border-stone-100">
          <SourceInfo
            sourceName={sourceName}
            sourceUrl={notice.sourceUrl}
            lastCheckedAt={notice.lastCheckedAt}
          />
        </div>
      </div>

      {/* Key Dates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs">
          <span className="text-xs text-stone-400 block mb-1 font-medium">{t("notice.published", { date: "" }).replace(":", "")}</span>
          <span className="font-bold text-sm text-stone-800">
            {formatDate(notice.publishedAt, lang)}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs">
          <span className="text-xs text-stone-400 block mb-1 font-medium">{t("notice.openingDate")}</span>
          <span className="font-bold text-sm text-stone-800">
            {formatDate(notice.applicationStartDate, lang)}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs">
          <span className="text-xs text-stone-400 block mb-1 font-medium">{t("notice.deadline")}</span>
          <DeadlineDisplay
            closingDate={notice.applicationClosingDate}
            isVerified={notice.isDeadlineVerified}
            compact
          />
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-stone-200 gap-4 text-xs md:text-sm font-semibold">
        <button
          onClick={() => setActiveTab("details")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === "details"
              ? "border-emerald-800 text-emerald-950 font-bold"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <FileCheck size={16} />
          <span>{t("notice.detailsTab")}</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === "history"
              ? "border-emerald-800 text-emerald-950 font-bold"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <History size={16} />
          <span>{t("notice.historyTab")}</span>
          {notice.versions && notice.versions.length > 1 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-900 font-bold">
              {notice.versions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("verification")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === "verification"
              ? "border-emerald-800 text-emerald-950 font-bold"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <ShieldCheck size={16} />
          <span>{t("notice.auditTab")}</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "details" && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-3xl border border-stone-200/90 p-5 md:p-6 space-y-3 shadow-xs">
            <h3 className="font-bold text-base text-stone-900">
              {t("notice.summaryTitle")}
            </h3>
            <p className="text-xs md:text-sm text-stone-700 leading-relaxed">{summary}</p>

            <div className="pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-stone-400 block font-medium">{t("notice.applicableDistricts")}:</span>
                <span className="font-semibold text-stone-800">{districtLabels}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-medium">{t("notice.eligibleCrops")}:</span>
                <span className="font-semibold text-stone-800">{cropLabels}</span>
              </div>
            </div>
          </div>

          {/* Conditions */}
          <EligibilityChecklist
            conditions={notice.eligibilityConditions}
            conditionsHi={notice.eligibilityConditionsHi}
            conditionsMr={notice.eligibilityConditionsMr}
          />

          {/* Documents */}
          <DocumentChecklist
            documents={notice.requiredDocuments}
            noticeId={notice.id}
          />

          {/* Action Callout: Open Official Government Portal */}
          <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <ExternalLink size={20} className="text-amber-400 shrink-0" />
              <h3 className="font-bold text-base sm:text-lg">{t("notice.howToApply")}</h3>
            </div>
            <p className="text-xs md:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
              {t("notice.howToApplyDesc")}
            </p>

            <div className="pt-2">
              <a
                href={notice.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold border-none shadow-sm cursor-pointer"
                >
                  <span>{t("notice.openPortal")}</span>
                  <ExternalLink size={16} className="ml-2 shrink-0" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && <ChangeHistory versions={notice.versions} />}

      {activeTab === "verification" && (
        <VerificationTimeline history={notice.verificationHistory} />
      )}

      {/* Statutory Disclaimer */}
      <Disclaimer type="short" />
    </div>
  );
};
