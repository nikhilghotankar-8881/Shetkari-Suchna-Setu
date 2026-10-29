import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Save, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { useFarmerProfile } from "../hooks/useFarmerAlerts";
import { DISTRICTS, CROPS, SCHEME_CATEGORIES, getLocalizedOption } from "../utils/constants";
import { Button } from "../components/ui/Button";
import { Disclaimer } from "../components/ui/Disclaimer";

export const FarmerPreferences: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "mr";
  const navigate = useNavigate();

  const { data: profile, updateProfile, isUpdating } = useFarmerProfile("farmer-01");

  const [name, setName] = useState("");
  const [district, setDistrict] = useState("nashik");
  const [selectedCrops, setSelectedCrops] = useState<string[]>(["soybean", "cotton"]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["insurance", "subsidy"]);
  const [consent, setConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setDistrict(profile.district || "nashik");
      setSelectedCrops(profile.crops || ["soybean"]);
      setSelectedInterests(profile.interests || ["insurance"]);
      setConsent(profile.hasGivenConsent || false);
    }
  }, [profile]);

  const toggleCrop = (cropId: string) => {
    setSelectedCrops((prev) =>
      prev.includes(cropId) ? prev.filter((c) => c !== cropId) : [...prev, cropId]
    );
  };

  const toggleInterest = (interestId: string) => {
    if (interestId === "all") return;
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((i) => i !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!consent) {
      setErrorMsg(t("prefs.consentError"));
      return;
    }

    if (selectedCrops.length === 0) {
      setErrorMsg(t("prefs.selectAtLeastOneCrop"));
      return;
    }

    try {
      await updateProfile({
        name,
        district,
        crops: selectedCrops,
        interests: selectedInterests,
        hasGivenConsent: consent,
      });
      setSuccessMsg(t("prefs.saveSuccess"));
      setTimeout(() => {
        navigate("/farmer/dashboard");
      }, 1200);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || t("prefs.saveError"));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-stone-900 tracking-tight">
          {t("prefs.title")}
        </h1>
        <p className="text-xs md:text-sm text-stone-500 mt-1">{t("prefs.subtitle")}</p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-900 text-xs md:text-sm flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs md:text-sm flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-700" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-stone-200/90 p-5 md:p-8 space-y-6 shadow-xs">
        {/* Name (Optional) */}
        <div className="space-y-1.5">
          <label className="text-xs md:text-sm font-semibold text-stone-800">
            {t("prefs.nameLabel")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("prefs.namePlaceholder")}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
          />
          <p className="text-[11px] text-stone-400">
            {t("prefs.nameHelp")}
          </p>
        </div>

        {/* District */}
        <div className="space-y-1.5">
          <label className="text-xs md:text-sm font-semibold text-stone-800">
            {t("prefs.districtLabel")} <span className="text-red-500">*</span>
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-stone-50/50 font-semibold text-stone-900 cursor-pointer"
          >
            {DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {getLocalizedOption(d, lang)}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-stone-500">{t("prefs.districtHelp")}</p>
        </div>

        {/* Crops */}
        <div className="space-y-2">
          <label className="text-xs md:text-sm font-semibold text-stone-800">
            {t("prefs.cropsLabel")} <span className="text-red-500">*</span>
          </label>
          <p className="text-[11px] text-stone-500 mb-2">{t("prefs.cropsHelp")}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CROPS.map((c) => {
              const isSelected = selectedCrops.includes(c.id);
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => toggleCrop(c.id)}
                  className={`px-3 py-2.5 rounded-2xl border text-xs md:text-sm font-medium transition-all text-left flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs"
                      : "bg-stone-50/60 border-stone-200 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  <span>{getLocalizedOption(c, lang)}</span>
                  {isSelected && <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <label className="text-xs md:text-sm font-semibold text-stone-800">
            {t("prefs.categoriesLabel")}
          </label>
          <div className="flex flex-wrap gap-2">
            {SCHEME_CATEGORIES.filter((sc) => sc.id !== "all").map((cat) => {
              const isSelected = selectedInterests.includes(cat.id);
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => toggleInterest(cat.id)}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-amber-50 border-amber-400 text-amber-950 font-bold shadow-2xs"
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {getLocalizedOption(cat, lang)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Consent Section (Strict Rule) */}
        <div className="p-4 rounded-3xl bg-emerald-50/80 border border-emerald-200/80 space-y-3">
          <div className="flex items-start gap-2.5">
            <ShieldCheck size={20} className="text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700 leading-relaxed">
              <span className="font-bold text-stone-900 block mb-1">
                {t("prefs.privacyTitle")}
              </span>
              {t("prefs.privacyDesc")}
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-emerald-200/50">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="w-4 h-4 mt-0.5 text-emerald-800 rounded focus:ring-emerald-600 cursor-pointer"
            />
            <span className="text-xs font-semibold text-stone-900 select-none">
              {t("prefs.consentLabel")} <span className="text-red-500">*</span>
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={isUpdating}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
          >
            <Save size={18} className="mr-1.5" />
            <span>{isUpdating ? t("prefs.saving") : t("common.save")}</span>
          </Button>
        </div>
      </form>

      <Disclaimer type="short" />
    </div>
  );
};
