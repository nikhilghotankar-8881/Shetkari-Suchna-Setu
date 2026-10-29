import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bell, FileSearch, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Disclaimer } from "../components/ui/Disclaimer";

export const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "mr";

  const getStepNumber = (n: number) => {
    if (lang.startsWith("mr")) {
      const mrNums = ["१", "२", "३", "४"];
      return mrNums[n - 1] || String(n);
    }
    if (lang.startsWith("hi")) {
      const hiNums = ["१", "२", "३", "४"];
      return hiNums[n - 1] || String(n);
    }
    return String(n);
  };

  const steps = [
    {
      num: getStepNumber(1),
      title: t("home.step1Title"),
      desc: t("home.step1Desc"),
    },
    {
      num: getStepNumber(2),
      title: t("home.step2Title"),
      desc: t("home.step2Desc"),
    },
    {
      num: getStepNumber(3),
      title: t("home.step3Title"),
      desc: t("home.step3Desc"),
    },
    {
      num: getStepNumber(4),
      title: t("home.step4Title"),
      desc: t("home.step4Desc"),
    },
  ];

  return (
    <div className="space-y-10 py-2">
      {/* Hero Section */}
      <section className="bg-radial from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
          <ShieldCheck size={320} />
        </div>

        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-semibold">
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            <span>{t("app.officialCell")}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {t("home.title")}
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            {t("home.subtitle")}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Link to="/farmer/preferences" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold border-none shadow-md"
              >
                <Bell size={18} className="mr-1.5" />
                <span>{t("home.setUpAlerts")}</span>
              </Button>
            </Link>

            {/* Fixed secondary button with proper styling for dark hero */}
            <Link to="/notices" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="inverse"
                className="w-full sm:w-auto font-bold border-emerald-400/60"
              >
                <FileSearch size={18} className="mr-1.5" />
                <span>{t("home.browseNotices")}</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo notice badge */}
      <div className="flex justify-center">
        <Disclaimer type="demoData" />
      </div>

      {/* How it works strip */}
      <section className="space-y-4">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            {t("home.howItWorksTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {t("home.howItWorksSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-950 font-extrabold text-sm flex items-center justify-center mb-3">
                  {step.num}
                </span>
                <h3 className="font-bold text-stone-900 text-sm mb-1.5">{step.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Quick Action Banner */}
      <section className="bg-emerald-50 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-emerald-950 text-base sm:text-lg">
            {t("home.quickBannerTitle")}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
            {t("home.quickBannerSubtitle")}
          </p>
        </div>
        <Link to="/farmer/dashboard" className="shrink-0 w-full sm:w-auto">
          <Button variant="primary" size="md" className="w-full sm:w-auto shadow-xs">
            <span>{t("home.openDashboard")}</span>
            <ArrowRight size={16} className="ml-1.5" />
          </Button>
        </Link>
      </section>

      {/* Statutory Disclaimer */}
      <Disclaimer type="short" />
    </div>
  );
};
