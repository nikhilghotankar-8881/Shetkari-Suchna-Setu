import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Edit3, Bell } from "lucide-react";
import { useFarmerAlerts, useFarmerProfile } from "../hooks/useFarmerAlerts";
import { AlertCard } from "../components/alert/AlertCard";
import { LoadingState, EmptyState, ErrorMessage } from "../components/ui/LoadingState";
import { Disclaimer } from "../components/ui/Disclaimer";
import { DISTRICTS, CROPS, getLocalizedOption } from "../utils/constants";
import { daysRemaining } from "../utils/date";

export const FarmerDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "mr";

  const { data: profile, isLoading: profileLoading } = useFarmerProfile("farmer-01");
  const { data: alerts, isLoading: alertsLoading, error, refetch } = useFarmerAlerts("farmer-01");

  const [activeFilter, setActiveFilter] = useState<"all" | "closing_soon" | "insurance" | "subsidy">("all");

  if (profileLoading || alertsLoading) {
    return <LoadingState message={t("common.loading")} />;
  }

  if (error) {
    return <ErrorMessage message={(error as Error).message} onRetry={() => refetch()} />;
  }

  const districtObj = DISTRICTS.find((d) => d.id === profile?.district);
  const districtName = districtObj ? getLocalizedOption(districtObj, lang) : profile?.district;

  const cropNames = profile?.crops
    ?.map((cId) => {
      const c = CROPS.find((cr) => cr.id === cId);
      return c ? getLocalizedOption(c, lang) : cId;
    })
    .join(", ");

  let filtered = alerts || [];
  if (activeFilter === "insurance") {
    filtered = filtered.filter((a) => a.notice.category === "insurance");
  } else if (activeFilter === "subsidy") {
    filtered = filtered.filter((a) => a.notice.category === "subsidy");
  } else if (activeFilter === "closing_soon") {
    filtered = filtered.filter((a) => {
      const days = daysRemaining(a.notice.applicationClosingDate);
      return days !== null && days <= 7 && days >= 0;
    });
  }

  return (
    <div className="space-y-6">
      {/* Farmer Greeting Profile Banner */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0">
            <User size={24} />
          </div>
          <div>
            <h1 className="font-extrabold text-stone-900 text-lg md:text-xl">
              {profile?.name || t("dashboard.greeting")}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-stone-600 mt-0.5">
              <span className="font-semibold text-emerald-950 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/50">
                📍 {districtName || t("dashboard.districtNotSelected")}
              </span>
              <span>•</span>
              <span className="text-stone-500">
                {t("dashboard.cropsLabel")}: {cropNames || t("dashboard.cropsNotSelected")}
              </span>
            </div>
          </div>
        </div>

        <Link
          to="/farmer/preferences"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs md:text-sm font-semibold transition-colors shrink-0"
        >
          <Edit3 size={15} />
          <span>{t("dashboard.editPreferences")}</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold shrink-0 transition-colors cursor-pointer ${
            activeFilter === "all"
              ? "bg-emerald-800 text-white shadow-xs"
              : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            <Bell size={14} />
            <span>{t("dashboard.myAlertsTab", { count: alerts?.length || 0 })}</span>
          </span>
        </button>

        <button
          onClick={() => setActiveFilter("closing_soon")}
          className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold shrink-0 transition-colors cursor-pointer ${
            activeFilter === "closing_soon"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
          }`}
        >
          <span>{t("dashboard.closingSoonTab")}</span>
        </button>

        <button
          onClick={() => setActiveFilter("insurance")}
          className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold shrink-0 transition-colors cursor-pointer ${
            activeFilter === "insurance"
              ? "bg-emerald-800 text-white shadow-xs"
              : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
          }`}
        >
          <span>{t("dashboard.insuranceTab")}</span>
        </button>

        <button
          onClick={() => setActiveFilter("subsidy")}
          className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold shrink-0 transition-colors cursor-pointer ${
            activeFilter === "subsidy"
              ? "bg-emerald-800 text-white shadow-xs"
              : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
          }`}
        >
          <span>{t("dashboard.subsidyTab")}</span>
        </button>
      </div>

      {/* Alert Cards Feed */}
      {filtered.length === 0 ? (
        <EmptyState
          title={t("dashboard.emptyAlertsTitle")}
          description={t("dashboard.emptyAlertsDesc")}
          actionText={t("dashboard.viewAllNoticesAction")}
          onAction={() => (window.location.href = "/notices")}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {/* Mandatory Disclaimer */}
      <Disclaimer type="short" />
    </div>
  );
};
