import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { useAdminMetrics } from "../../hooks/useAdmin";
import { LoadingState } from "../../components/ui/LoadingState";
import { formatDateTime } from "../../utils/date";
import { getLocalizedText } from "../../utils/localized";

export const ImpactDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "mr";
  const { data: metrics, isLoading } = useAdminMetrics();

  if (isLoading || !metrics) return <LoadingState message={t("common.loading")} />;

  const metricCards = [
    metrics.detectionDelayHours,
    metrics.extractionAccuracy,
    metrics.falseAlertRate,
    metrics.sourceTraceability,
    metrics.farmerRelevance,
    metrics.discoveryTimeMinutes,
    metrics.actionabilityRate,
  ];

  // Chart data for accuracy & relevance benchmarks
  const chartData = [
    {
      name: getLocalizedText(metrics.extractionAccuracy, "label", lang, metrics.extractionAccuracy.labelEn),
      value: metrics.extractionAccuracy.value,
      sample: metrics.extractionAccuracy.sampleSize,
    },
    {
      name: getLocalizedText(metrics.farmerRelevance, "label", lang, metrics.farmerRelevance.labelEn),
      value: metrics.farmerRelevance.value,
      sample: metrics.farmerRelevance.sampleSize,
    },
    {
      name: getLocalizedText(metrics.actionabilityRate, "label", lang, metrics.actionabilityRate.labelEn),
      value: metrics.actionabilityRate.value,
      sample: metrics.actionabilityRate.sampleSize,
    },
    {
      name: getLocalizedText(metrics.sourceTraceability, "label", lang, metrics.sourceTraceability.labelEn),
      value: metrics.sourceTraceability.value,
      sample: metrics.sourceTraceability.sampleSize,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div>
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 mb-2 font-semibold">
          <ArrowLeft size={14} /> <span>{t("admin.returnToDashboard")}</span>
        </Link>
        <h1 className="text-xl md:text-2xl font-extrabold text-stone-900 flex items-center gap-2 tracking-tight">
          <BarChart3 size={24} className="text-emerald-800 shrink-0" />
          <span>{t("impact.title")}</span>
        </h1>
        <p className="text-xs md:text-sm text-stone-500 mt-0.5">
          {t("impact.subtitle")}
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((m) => {
          const label = getLocalizedText(m, "label", lang, m.labelEn);
          const desc = getLocalizedText(m, "description", lang, m.descriptionEn);

          return (
            <div
              key={m.key}
              className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-2">
                  <span>{label}</span>
                  <span className="bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold">
                    {t("impact.samples", { count: m.sampleSize })}
                  </span>
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-emerald-950 flex items-baseline gap-1">
                  <span>{m.value}</span>
                  <span className="text-sm font-bold text-stone-500">{m.unit}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 mt-3 text-xs text-stone-500 leading-relaxed">
                {desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 md:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-extrabold text-stone-900 text-base md:text-lg">
              {t("impact.benchmarkTitle")}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              {t("impact.benchmarkSubtitle")}
            </p>
          </div>
          <span className="text-xs text-stone-400 font-medium">
            {t("impact.updatedAt", { date: formatDateTime(metrics.lastUpdated, lang) })}
          </span>
        </div>

        <div className="h-64 sm:h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#444" }} interval={0} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#666" }} />
              <Tooltip
                formatter={(val: number) => [`${val}%`, t("impact.percentage")]}
                labelStyle={{ fontWeight: "bold", color: "#111" }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 1 ? "#d97706" : "#047857"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
