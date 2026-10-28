import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SchemeCard } from '../schemes/SchemeCard';
import { UpdateItem } from '../updates/UpdateItem';
import { api } from '../../api/client';
import { useFarmerToken } from '../../auth/FarmerTokenContext';
import { useTranslation } from '../../i18n/useTranslation';
import { MAHARASHTRA_DISTRICTS } from '../../utils/constants';
import {
  Sparkles,
  Compass,
  Bell,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';

export const FarmerDashboard = () => {
  const { profile } = useFarmerToken();
  const { lang, t } = useTranslation();

  const [schemes, setSchemes] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDistrictObj = MAHARASHTRA_DISTRICTS.find(d => d.id === profile?.district);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      api.getSchemes({ district: profile?.district, crops: profile?.crops }),
      api.getNoticeUpdates({ district: profile?.district, crops: profile?.crops })
    ]).then(([sData, uData]) => {
      if (isMounted) {
        setSchemes(sData);
        setUpdates(uData);
        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, [profile?.district, JSON.stringify(profile?.crops)]);

  const verifiedCount = schemes.filter(s => s.verification_status === 'Verified').length;
  const recentUpdates = updates.slice(0, 2);
  const featuredSchemes = schemes.slice(0, 2);

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Personalized Header Greeting */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200/90 space-y-2.5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-extrabold text-stone-900 leading-tight">
              {t('dashboard_title')}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {t('dashboard_subtitle')}
            </p>
          </div>
          <Link
            to="/profile"
            className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80 hover:bg-emerald-100"
          >
            {lang === 'mr' ? 'बदला' : 'Edit'}
          </Link>
        </div>

        {/* Current Active Farmer Profile summary */}
        {profile && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100 text-[11px]">
            <span className="bg-stone-50 px-2.5 py-1 rounded-lg text-stone-700 font-semibold border border-stone-200">
              📍 {lang === 'mr' ? currentDistrictObj?.name_mr : currentDistrictObj?.name_en || profile.district}
              {profile.taluka ? ` (${profile.taluka})` : ''}
            </span>
            <span className="bg-stone-50 px-2.5 py-1 rounded-lg text-stone-700 font-semibold border border-stone-200">
              🌱 {profile.crops?.length || 0} {lang === 'mr' ? 'पिके' : 'crops'}
            </span>
          </div>
        )}
      </div>

      {/* Purpose / Trust Banner (30-sec communication) */}
      <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3.5 space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{t('potentially_relevant')}</span>
        </div>
        <p className="text-[11px] text-emerald-900/90 leading-relaxed">
          {t('not_eligible_notice')}
        </p>
      </div>

      {/* ── SECTION 1: RECENT GOVERNMENT NOTICE UPDATES (THE CORE) ── */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
              {t('recent_updates_heading')}
            </h3>
          </div>
          <Link
            to="/updates"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5"
          >
            <span>{t('view_all_updates')}</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-6 text-center text-xs text-stone-400">
            अपडेट्स लोड होत आहेत...
          </div>
        ) : recentUpdates.length === 0 ? (
          <div className="p-4 bg-white rounded-2xl border border-stone-200 text-xs text-stone-500 text-center">
            सध्या नवीन बदल नाहीत.
          </div>
        ) : (
          <div className="space-y-3">
            {recentUpdates.map(u => (
              <UpdateItem key={u.id} update={u} />
            ))}
          </div>
        )}
      </section>

      {/* ── SECTION 2: RELEVANT GOVERNMENT SCHEMES ── */}
      <section className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
              {t('relevant_schemes_heading')}
            </h3>
          </div>
          <Link
            to="/schemes"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5"
          >
            <span>{t('view_all_schemes')}</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-6 text-center text-xs text-stone-400">
            योजना लोड होत आहेत...
          </div>
        ) : featuredSchemes.length === 0 ? (
          <div className="p-4 bg-white rounded-2xl border border-stone-200 text-xs text-stone-500 text-center">
            {t('no_schemes_found')}
          </div>
        ) : (
          <div className="space-y-3">
            {featuredSchemes.map(s => (
              <SchemeCard key={s.id} scheme={s} />
            ))}
          </div>
        )}
      </section>

      {/* Crop Insurance Card Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
            प्रधानमंत्री पीक विमा (PMFBY)
          </span>
          <span className="text-[10px] text-stone-400">७२ तासांत नुकसान नोंदणी</span>
        </div>
        <h4 className="text-sm font-bold leading-tight">
          पीक नुकसानीची माहिती नोंदवण्याच्या अधिकृत सूचना
        </h4>
        <Link
          to="/insurance"
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 hover:text-emerald-200 pt-1"
        >
          <span>विमा मार्गदर्शक व अधिकृत पोर्टल →</span>
        </Link>
      </div>

      {/* Clear product purpose disclaimer */}
      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[10px] text-stone-500 leading-snug">
        {t('disclaimer_text')}
      </div>
    </div>
  );
};

