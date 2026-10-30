import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
import { ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { setLang, t } = useTranslation();

  const handleStart = (chosenLang) => {
    setLang(chosenLang);
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between p-4 max-w-md mx-auto">
      {/* Top Branding */}
      <header className="pt-8 text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-700 text-white shadow-lg flex items-center justify-center text-3xl border-4 border-emerald-100">
          🌾
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">
            शेतकरी सूचना सेतू
          </h1>
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mt-0.5">
            Shetkari Suchna Setu
          </p>
        </div>
      </header>

      {/* Hero Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/90 space-y-5 my-auto">
        <div className="space-y-1.5 text-center">
          <h2 className="text-base font-extrabold text-stone-900 leading-snug">
            {t('welcome_title')}
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            {t('welcome_subtitle')}
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="space-y-3 pt-1">
          <div className="flex items-start gap-3 p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="text-xs text-stone-800 font-medium">
              {t('welcome_feature_1')}
            </p>
          </div>

          <div className="flex items-start gap-3 p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="text-xs text-stone-800 font-medium">
              {t('welcome_feature_2')}
            </p>
          </div>

          <div className="flex items-start gap-3 p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="text-xs text-stone-800 font-medium">
              {t('welcome_feature_3')}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => handleStart('mr')}
            className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-2xl shadow-sm flex items-center justify-between transition-all touch-target"
          >
            <span className="text-sm">मराठी मध्ये सुरू करा</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleStart('en')}
            className="w-full bg-stone-100 hover:bg-stone-200 active:scale-[0.99] text-stone-800 font-semibold py-3 px-4 rounded-2xl border border-stone-200 flex items-center justify-between transition-all touch-target text-xs"
          >
            <span>Start in English</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
          </button>
        </div>
      </div>

      {/* Privacy Footer Reassurance */}
      <footer className="py-4 text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-emerald-900">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>{t('privacy_notice_title')}</span>
        </div>
        <p className="text-[10px] text-stone-500 max-w-xs mx-auto">
          {t('disclaimer_text')}
        </p>
      </footer>
    </div>
  );
};
