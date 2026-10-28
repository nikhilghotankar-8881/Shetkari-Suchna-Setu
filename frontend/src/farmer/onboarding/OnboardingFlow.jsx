import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAHARASHTRA_DISTRICTS, CROPS_LIST } from '../../utils/constants';
import { useFarmerToken } from '../../auth/FarmerTokenContext';
import { useTranslation } from '../../i18n/useTranslation';
import { ShieldCheck, MapPin, Sprout, Languages, ArrowRight, ArrowLeft } from 'lucide-react';

export const OnboardingFlow = ({ isEditing = false, onComplete }) => {
  const navigate = useNavigate();
  const { profile, saveProfile } = useFarmerToken();
  const { lang, setLang, t } = useTranslation();

  const [step, setStep] = useState(1);
  const [district, setDistrict] = useState(profile?.district || 'pune');
  const [taluka, setTaluka] = useState(profile?.taluka || '');
  const [selectedCrops, setSelectedCrops] = useState(profile?.crops || ['soybean', 'cotton']);
  const [consentChecked, setConsentChecked] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentDistrictObj = MAHARASHTRA_DISTRICTS.find(d => d.id === district);

  const toggleCrop = (cropId) => {
    setSelectedCrops(prev =>
      prev.includes(cropId) ? prev.filter(c => c !== cropId) : [...prev, cropId]
    );
  };

  const handleFinish = async () => {
    if (!consentChecked && !isEditing) return;
    setSaving(true);
    await saveProfile({
      district,
      taluka,
      crops: selectedCrops,
      lang
    });
    setSaving(false);
    if (onComplete) {
      onComplete();
    } else {
      navigate('/schemes');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Header & Step Tracker */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
          {t('onboarding_title')}
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          {t('onboarding_subtitle')}
        </p>

        {/* 3 Step Pill Indicator */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 1 ? 'bg-emerald-600' : 'bg-stone-200'}`} />
          <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 2 ? 'bg-emerald-600' : 'bg-stone-200'}`} />
          <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 3 ? 'bg-emerald-600' : 'bg-stone-200'}`} />
        </div>
      </div>

      {/* Step 1: District & Taluka */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200 space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base pb-2 border-b border-stone-100">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>{t('step_1_district')}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              {t('select_district')} *
            </label>
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setTaluka('');
              }}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 touch-target"
            >
              {MAHARASHTRA_DISTRICTS.map(d => (
                <option key={d.id} value={d.id}>
                  {lang === 'mr' ? d.name_mr : d.name_en}
                </option>
              ))}
            </select>
          </div>

          {currentDistrictObj && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                {t('select_taluka')}
              </label>
              <select
                value={taluka}
                onChange={(e) => setTaluka(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 touch-target"
              >
                <option value="">
                  {lang === 'mr' ? '-- सर्व तालुके / संपूर्ण जिल्हा --' : '-- All Talukas / Entire District --'}
                </option>
                {currentDistrictObj.talukas.map(tName => (
                  <option key={tName} value={tName}>{tName}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => setStep(2)}
            className="w-full mt-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors touch-target"
          >
            <span>{t('next_btn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Crops Selection */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200 space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base pb-2 border-b border-stone-100">
            <Sprout className="w-5 h-5 text-emerald-600" />
            <span>{t('step_2_crops')}</span>
          </div>

          <p className="text-xs text-stone-500">
            {t('select_crops_help')}
          </p>

          <div className="grid grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
            {CROPS_LIST.map(crop => {
              const isSelected = selectedCrops.includes(crop.id);
              return (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => toggleCrop(crop.id)}
                  className={`
                    p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all touch-target
                    ${isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-500'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'}
                  `}
                >
                  <span className="text-xl">{crop.icon}</span>
                  <span className="text-xs truncate">
                    {lang === 'mr' ? crop.name_mr : crop.name_en}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors touch-target"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('prev_btn')}</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors touch-target"
            >
              <span>{t('next_btn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Language & Explicit Privacy Notice */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200 space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base pb-2 border-b border-stone-100">
            <Languages className="w-5 h-5 text-emerald-600" />
            <span>{t('step_3_language')}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setLang('mr')}
              className={`p-3.5 rounded-xl border text-center transition-all touch-target ${lang === 'mr' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-600' : 'border-stone-200 bg-stone-50 text-stone-700'}`}
            >
              <div className="text-base font-bold">मराठी</div>
              <div className="text-[11px] text-stone-500">Default</div>
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`p-3.5 rounded-xl border text-center transition-all touch-target ${lang === 'en' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-600' : 'border-stone-200 bg-stone-50 text-stone-700'}`}
            >
              <div className="text-base font-bold">English</div>
              <div className="text-[11px] text-stone-500">Optional</div>
            </button>
          </div>

          {/* Privacy Notice Box (DPDP Mandatory) */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs text-stone-700 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('privacy_notice_title')}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-600">
              {t('privacy_notice_body')}
            </p>

            <label className="flex items-start gap-2.5 pt-2 border-t border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
              />
              <span className="text-[11px] font-medium text-stone-800 leading-tight">
                {t('privacy_consent')}
              </span>
            </label>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              onClick={() => setStep(2)}
              className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors touch-target"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('prev_btn')}</span>
            </button>
            <button
              disabled={(!consentChecked && !isEditing) || saving}
              onClick={handleFinish}
              className={`
                flex-2 py-3 px-4 rounded-xl font-bold text-white shadow-sm flex items-center justify-center gap-1.5 transition-all touch-target
                ${(consentChecked || isEditing) && !saving
                  ? 'bg-emerald-700 hover:bg-emerald-800'
                  : 'bg-stone-300 cursor-not-allowed text-stone-500'}
              `}
            >
              <span>{saving ? 'जतन करत आहे...' : t('save_profile_btn')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

