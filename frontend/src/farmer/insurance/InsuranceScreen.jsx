import { ExternalLink, ShieldAlert, PhoneCall, Clock, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

export const InsuranceScreen = () => {
  const { lang, t } = useTranslation();

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Disclaimer Box - Mandatory per Non-Goals */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5 shadow-2xs">
        <AlertOctagon className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-snug">
          <span className="font-bold block mb-0.5">
            {lang === 'mr' ? 'महत्त्वाची सूचना (Disclaimer):' : 'Important Notice:'}
          </span>
          {t('insurance_notice')}
        </div>
      </div>

      {/* Scheme Card PMFBY */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xl">
            🛡️
          </div>
          <div>
            <h2 className="text-base font-extrabold text-stone-900 leading-tight">
              {t('insurance_title')}
            </h2>
            <p className="text-xs text-stone-500">
              {lang === 'mr' ? 'महाराष्ट्र शासन ₹१ विमा योजना' : 'Maharashtra Govt ₹1 Crop Insurance Scheme'}
            </p>
          </div>
        </div>

        {/* 72 Hour Reporting Steps */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 uppercase tracking-wide">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>{t('insurance_steps_title')}</span>
          </h3>

          <div className="space-y-2 text-xs text-stone-700">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                १
              </span>
              <p className="leading-relaxed">
                {t('insurance_step_1')}
              </p>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                २
              </span>
              <p className="leading-relaxed">
                {t('insurance_step_2')}
              </p>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                ३
              </span>
              <p className="leading-relaxed">
                {t('insurance_step_3')}
              </p>
            </div>
          </div>
        </div>

        {/* Toll Free Helpline */}
        <div className="bg-emerald-50/70 rounded-xl p-3 border border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-700" />
            <div>
              <div className="text-[10px] text-emerald-800 uppercase font-bold">
                {lang === 'mr' ? 'राष्ट्रीय विमा हेल्पलाईन' : 'National Insurance Toll Free'}
              </div>
              <div className="text-sm font-extrabold text-emerald-950 font-mono">
                14447 / 1800-200-5147
              </div>
            </div>
          </div>
          <a
            href="tel:14447"
            className="text-xs bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg touch-target flex items-center"
          >
            {lang === 'mr' ? 'कॉल करा' : 'Call'}
          </a>
        </div>

        {/* Direct Link to Official Portal */}
        <a
          href="https://pmfby.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-colors touch-target"
        >
          <span>{t('insurance_portal_btn')}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

