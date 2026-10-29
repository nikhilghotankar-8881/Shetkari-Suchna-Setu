import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, RotateCcw } from "lucide-react";
import { useNotices } from "../hooks/useNotices";
import { NoticeCard } from "../components/notice/NoticeCard";
import { LoadingState, EmptyState, ErrorMessage } from "../components/ui/LoadingState";
import { Disclaimer } from "../components/ui/Disclaimer";
import { DISTRICTS, CROPS, getLocalizedOption } from "../utils/constants";

export const SchemeNotices: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "mr";

  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("all");
  const [crop, setCrop] = useState("all");
  const [status, setStatus] = useState("all");

  const { data: notices, isLoading, error, refetch } = useNotices({
    search: search || undefined,
    district: district !== "all" ? district : undefined,
    crop: crop !== "all" ? crop : undefined,
    status: status !== "all" ? status : undefined,
  });

  const resetFilters = () => {
    setSearch("");
    setDistrict("all");
    setCrop("all");
    setStatus("all");
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-stone-900 tracking-tight">
          {t("notice.allNotices")}
        </h1>
        <p className="text-xs md:text-sm text-stone-500 mt-1">
          {t("notice.allNoticesSubtitle")}
        </p>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-4 md:p-5 shadow-2xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("common.search")}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-stone-50/50"
          />
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          {/* District select */}
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-600 cursor-pointer"
          >
            <option value="all">{t("common.allDistricts")}</option>
            {DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {getLocalizedOption(d, lang)}
              </option>
            ))}
          </select>

          {/* Crop select */}
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-600 cursor-pointer"
          >
            <option value="all">{t("common.allCrops")}</option>
            {CROPS.map((c) => (
              <option key={c.id} value={c.id}>
                {getLocalizedOption(c, lang)}
              </option>
            ))}
          </select>

          {/* Status select */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-600 cursor-pointer"
          >
            <option value="all">{t("common.allStatuses")}</option>
            <option value="verified">{t("status.verified")}</option>
            <option value="pending_review">{t("status.pending_review")}</option>
            <option value="conflicting">{t("status.conflicting")}</option>
          </select>
        </div>

        {/* Reset Filters */}
        {(search || district !== "all" || crop !== "all" || status !== "all") && (
          <div className="flex justify-end pt-1">
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>{t("common.resetFilters")}</span>
            </button>
          </div>
        )}
      </div>

      {/* Notices Results List */}
      {isLoading ? (
        <LoadingState message={t("common.loading")} />
      ) : error ? (
        <ErrorMessage message={(error as Error).message} onRetry={() => refetch()} />
      ) : notices?.length === 0 ? (
        <EmptyState
          title={t("common.emptyNoticesTitle")}
          description={t("common.emptyNoticesDesc")}
          actionText={t("common.clearFilters")}
          onAction={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notices?.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      )}

      {/* Statutory Disclaimer */}
      <Disclaimer type="short" />
    </div>
  );
};
