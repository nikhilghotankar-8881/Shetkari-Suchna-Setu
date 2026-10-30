import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAHARASHTRA_DISTRICTS, CROPS_LIST } from '../../utils/constants';
import { useFarmerToken } from '../../auth/FarmerTokenContext';
import { useTranslation } from '../../i18n/useTranslation';
import {
  ShieldCheck,
  MapPin,
  Sprout,
  Languages,
  ArrowRight,
  ArrowLeft,
  FileBadge,
  Droplets,
  Layers,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export const OnboardingFlow = ({ isEditing = false, onComplete }) => {
  const navigate = useNavigate();
  const { profile, saveProfile } = useFarmerToken();
  const { lang, setLang, t } = useTranslation();

  // If editing, start at location or farm details step; otherwise start at step 1
  const [step, setStep] = useState(isEditing ? 2 : 1);

  // Form State
  const [district, setDistrict] = useState(profile?.district || 'ahmednagar');
  const [taluka, setTaluka] = useState(profile?.taluka || 'राहुरी');
  const [selectedCrops, setSelectedCrops] = useState(profile?.crops || ['onion']);
  const [farmerId, setFarmerId] = useState(profile?.farmer_id || '');
  const [landArea, setLandArea] = useState(profile?.land_area || '1.5');
  const [landUnit, setLandUnit] = useState(profile?.land_unit || 'hectare');
  const [landOwnership, setLandOwnership] = useState(profile?.land_ownership || 'owner');
  const [irrigation, setIrrigation] = useState(profile?.irrigation || 'yes');
  const [consentChecked, setConsentChecked] = useState(true);
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
      farmer_id: farmerId.trim(),
      land_area: landArea,
      land_unit: landUnit,
      land_ownership: landOwnership,
      irrigation,
      lang
    });
    setSaving(false);
    if (onComplete) {
      onComplete();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Header & Step Tracker */}
      <div className="mb-5 text-center">
        <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
          {t('onboarding_title')}
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          {t('onboarding_subtitle')}
        </p>

        {/* 4 Step Pill Indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-3.5">
          <div className={`h-1.5 flex-1 max-w-14 rounded-full transition-all ${step >= 1 ? 'bg-emerald-600' : 'bg-stone-200'}`} />
          <div className={`h-1.5 flex-1 max-w-14 rounded-full transition-all ${step >= 2 ? 'bg-emerald-600' : 'bg-stone-200'}`} />
          <div className={`h-1.5 flex-1 max-w-14 rounded-full transition-all ${step >= 3 ? 'bg-emerald-600' : 'bg-stone-200'}`} />
          <div className={`h-1.5 flex-1 max-w-14 rounded-full transition-all ${step >= 4 ? 'bg-emerald-600' : 'bg-stone-200'}`} />
        </div>
      </div>

      {/* ── STEP 1: LANGUAGE PREFERENCE ── */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200/90 space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm pb-2 border-b border-stone-100">
            <Languages className="w-5 h-5 text-emerald-600" />
            <span>{t('step_1_language')}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setLang('mr')}
              className={`p-4 rounded-2xl border text-center transition-all touch-target ${
                lang === 'mr'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-600 shadow-xs'
                  : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
              }`}
            >
              <div className="text-lg font-bold">मराठी</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">प्राधान्य (Default)</div>
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`p-4 rounded-2xl border text-center transition-all touch-target ${
                lang === 'en'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-600 shadow-xs'
                  : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
              }`}
            >
              <div className="text-lg font-bold">English</div>
              <div className="text-[11px] text-stone-500 mt-0.5">Optional</div>
            </button>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full mt-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all touch-target"
          >
            <span>{t('next_btn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── STEP 2: LOCATION (DISTRICT & TALUKA) ── */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200/90 space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm pb-2 border-b border-stone-100">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>{t('step_2_location')}</span>
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
              className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3.5 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 touch-target"
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
                className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3.5 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 touch-target"
              >
                <option value="">
                  {t('select_taluka_all')}
                </option>
                {currentDistrictObj.talukas.map(tName => (
                  <option key={tName} value={tName}>{tName}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-2.5 pt-2">
            {!isEditing && (
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-1.5 transition-colors touch-target text-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('prev_btn')}</span>
              </button>
            )}
            <button
              onClick={() => setStep(3)}
              className="flex-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-1.5 shadow-sm transition-colors touch-target text-xs"
            >
              <span>{t('next_btn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: FARM DETAILS & CROPS ── */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200/90 space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm pb-2 border-b border-stone-100">
            <Sprout className="w-5 h-5 text-emerald-600" />
            <span>{t('step_3_farm')}</span>
          </div>

          {/* MahaDBT Farmer ID (Optional) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <FileBadge className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t('farmer_id_label')}</span>
              </label>
              <span className="text-[10px] text-stone-400 font-medium">{t('farmer_id_help')}</span>
            </div>
            <input
              type="text"
              value={farmerId}
              onChange={(e) => setFarmerId(e.target.value)}
              placeholder={t('farmer_id_placeholder')}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <p className="text-[10px] text-stone-500 leading-tight pt-0.5">
              💡 {t('farmer_id_csc_hint')}
            </p>
          </div>

          {/* Land Area */}
          <div className="space-y-1 pt-1">
            <label className="block text-xs font-semibold text-stone-800">
              {t('land_area_label')}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                min="0"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                placeholder={t('land_area_placeholder')}
                className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex bg-stone-100 rounded-xl p-1 border border-stone-200 text-xs">
                <button
                  type="button"
                  onClick={() => setLandUnit('hectare')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                    landUnit === 'hectare' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  {t('land_unit_hectare')}
                </button>
                <button
                  type="button"
                  onClick={() => setLandUnit('acre')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                    landUnit === 'acre' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  {t('land_unit_acre')}
                </button>
              </div>
            </div>
          </div>

          {/* Land Ownership */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('land_ownership_label')}</span>
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: 'owner', labelKey: 'land_owner' },
                { id: 'tenant', labelKey: 'land_tenant' },
                { id: 'family', labelKey: 'land_family' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLandOwnership(opt.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                    landOwnership === opt.id
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold ring-1 ring-emerald-500'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Irrigation Availability */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('irrigation_label')}</span>
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: 'yes', labelKey: 'irrigation_yes' },
                { id: 'partial', labelKey: 'irrigation_partial' },
                { id: 'no', labelKey: 'irrigation_no' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setIrrigation(opt.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                    irrigation === opt.id
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold ring-1 ring-emerald-500'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Crops Multi-Select */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-semibold text-stone-800">
              {t('select_crops_help')}
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {CROPS_LIST.map(crop => {
                const isSelected = selectedCrops.includes(crop.id);
                return (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => toggleCrop(crop.id)}
                    className={`
                      p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all touch-target
                      ${isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'}
                    `}
                  >
                    <span className="text-lg">{crop.icon}</span>
                    <span className="text-xs truncate">
                      {lang === 'mr' ? crop.name_mr : crop.name_en}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              onClick={() => setStep(2)}
              className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-1.5 transition-colors touch-target text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('prev_btn')}</span>
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-1.5 shadow-sm transition-colors touch-target text-xs"
            >
              <span>{t('next_btn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: PRIVACY CONSENT & FINISH ── */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200/90 space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm pb-2 border-b border-stone-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>{t('step_4_consent')}</span>
          </div>

          {/* Profile Summary Card */}
          <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200 space-y-2 text-xs">
            <div className="font-bold text-stone-900 text-xs">
              🌾 {lang === 'mr' ? 'तुमचा शेती तपशील सारांश:' : 'Your Profile Summary:'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-700">
              <div>
                <span className="text-stone-400 block">{t('select_district')}</span>
                <span className="font-semibold">{currentDistrictObj?.name_mr || district} ({taluka || 'सर्व'})</span>
              </div>
              <div>
                <span className="text-stone-400 block">{t('land_area_label')}</span>
                <span className="font-semibold">{landArea} {t(`land_unit_${landUnit}`)}</span>
              </div>
              <div>
                <span className="text-stone-400 block">{t('irrigation_label')}</span>
                <span className="font-semibold">{t(`irrigation_${irrigation}`)}</span>
              </div>
              <div>
                <span className="text-stone-400 block">{t('farmer_id_label')}</span>
                <span className="font-semibold">{farmerId ? farmerId : (lang === 'mr' ? 'दिलेला नाही' : 'Not provided')}</span>
              </div>
            </div>
            <div className="pt-1 border-t border-stone-200 text-[11px]">
              <span className="text-stone-400 block mb-1">{lang === 'mr' ? 'पिके:' : 'Crops:'}</span>
              <div className="flex flex-wrap gap-1">
                {selectedCrops.map(cId => {
                  const cObj = CROPS_LIST.find(c => c.id === cId);
                  return (
                    <span key={cId} className="px-2 py-0.5 rounded-md bg-white border border-stone-300 text-stone-800 font-medium">
                      {cObj?.icon} {lang === 'mr' ? cObj?.name_mr : cObj?.name_en || cId}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Privacy Notice Box (DPDP Purpose Limitation & Data Minimisation) */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 text-xs text-stone-700 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-950 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{t('privacy_notice_title')}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-600">
              {t('privacy_notice_body')}
            </p>

            <label className="flex items-start gap-2.5 pt-2 border-t border-emerald-200/80 cursor-pointer">
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
              onClick={() => setStep(3)}
              className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-1.5 transition-colors touch-target text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('prev_btn')}</span>
            </button>
            <button
              disabled={(!consentChecked && !isEditing) || saving}
              onClick={handleFinish}
              className={`
                flex-2 py-3.5 px-4 rounded-2xl font-bold text-white shadow-sm flex items-center justify-center gap-2 transition-all touch-target text-xs
                ${(consentChecked || isEditing) && !saving
                  ? 'bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99]'
                  : 'bg-stone-300 cursor-not-allowed text-stone-500'}
              `}
            >
              <span>{saving ? t('saving_btn') : t('save_profile_btn')}</span>
              {!saving && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
