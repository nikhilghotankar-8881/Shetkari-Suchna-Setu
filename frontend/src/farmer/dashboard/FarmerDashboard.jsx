import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SchemeCard } from '../schemes/SchemeCard';
import { UpdateItem } from '../updates/UpdateItem';
import { api } from '../../api/client';
import { useFarmerToken } from '../../auth/FarmerTokenContext';
import { useTranslation } from '../../i18n/useTranslation';
import { MAHARASHTRA_DISTRICTS, CROPS_LIST } from '../../utils/constants';
import { evaluateEligibility } from '../eligibility/useEligibilityMatch';
import {
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Droplets,
  Layers,
  FileBadge
} from 'lucide-react';

export const FarmerDashboard = () => {
  const { profile, token } = useFarmerToken();
  const { lang, t } = useTranslation();

  const [schemes, setSchemes] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDistrictObj = MAHARASHTRA_DISTRICTS.find(d => d.id === profile?.district);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      api.getSchemes({ district: profile?.district, crops: profile?.crops, token }),
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

  // Prioritize schemes with eligibility matching (🟢 > 🟡 > 🔵 > ⚪)
  const rankedSchemes = useMemo(() => {
    return schemes.map(scheme => ({
      ...scheme,
      _match: evaluateEligibility(scheme, profile)
    })).sort((a, b) => b._match.score - a._match.score);
  }, [schemes, profile]);

  const recentUpdates = updates.slice(0, 2);
  const featuredSchemes = rankedSchemes.slice(0, 3);
  const greenSchemesCount = rankedSchemes.filter(s => s._match.status === 'green').length;

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Personalized Header Greeting */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-stone-200/90 space-y-3">
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
            className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/80 hover:bg-emerald-100 transition-colors"
          >
            {lang === 'mr' ? 'बदला' : 'Edit'}
          </Link>
        </div>

        {/* Current Active Farmer Profile summary pill row */}
        {profile && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100 text-[11px]">
            <Link
              to="/profile"
              className="bg-stone-50 px-2.5 py-1 rounded-xl text-stone-700 font-semibold border border-stone-200 hover:border-emerald-300"
            >
              📍 {lang === 'mr' ? currentDistrictObj?.name_mr : currentDistrictObj?.name_en || profile.district}
              {profile.taluka ? ` (${profile.taluka})` : ''}
            </Link>

            <Link
              to="/profile"
              className="bg-stone-50 px-2.5 py-1 rounded-xl text-stone-700 font-semibold border border-stone-200 hover:border-emerald-300"
            >
              🌾 {profile.land_area || '1.5'} {t(`land_unit_${profile.land_unit || 'hectare'}`)}
            </Link>

            <Link
              to="/profile"
              className="bg-stone-50 px-2.5 py-1 rounded-xl text-stone-700 font-semibold border border-stone-200 hover:border-emerald-300"
            >
              💧 {t(`irrigation_${profile.irrigation || 'yes'}`)}
            </Link>

            <Link
              to="/profile"
              className="bg-stone-50 px-2.5 py-1 rounded-xl text-stone-700 font-semibold border border-stone-200 hover:border-emerald-300"
            >
              🆔 {profile.farmer_id ? profile.farmer_id : (lang === 'mr' ? 'आयडी: ऐच्छिक' : 'ID: Optional')}
            </Link>
          </div>
        )}
      </div>

      {/* Purpose / Trust Banner */}
      <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3.5 space-y-1.5 shadow-2xs">
        <div className="flex items-center justify-between text-emerald-950 font-bold text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{t('potentially_relevant')}</span>
          </div>
          <span className="text-[10px] bg-emerald-200/70 text-emerald-950 px-2 py-0.5 rounded-full font-extrabold">
            {greenSchemesCount} {lang === 'mr' ? 'पात्र योजना' : 'matched'}
          </span>
        </div>
        <p className="text-[11px] text-emerald-900/90 leading-relaxed">
          {t('not_eligible_notice')}
        </p>
      </div>

      {/* ── SECTION 1: RELEVANT GOVERNMENT SCHEMES (PRIORITIZED BY MATCH) ── */}
      <section className="space-y-2.5">
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

      {/* ── SECTION 2: RECENT GOVERNMENT NOTICE UPDATES ── */}
      <section className="space-y-2.5 pt-1">
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

      {/* Crop Insurance Card Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
            प्रधानमंत्री पीक विमा (PMFBY)
          </span>
          <span className="text-[10px] text-stone-400">७२ तासांत तक्रार</span>
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
      <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-[10px] text-stone-500 leading-snug">
        {t('disclaimer_text')}
      </div>
    </div>
  );
};
