import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SchemeCard } from '../schemes/SchemeCard';
import { UpdateItem } from '../updates/UpdateItem';
import { api } from '../../api/client';
import { useFarmerToken } from '../../auth/FarmerTokenContext';
import { useTranslation } from '../../i18n/useTranslation';
import { MAHARASHTRA_DISTRICTS, CROPS_LIST } from '../../utils/constants';
import { evaluateEligibility } from '../eligibility/useEligibilityMatch';
import { Sparkles, Compass, RefreshCw, ChevronRight } from 'lucide-react';

export const FarmerDashboard = () => {
  const { profile, token } = useFarmerToken();
  const { lang, t } = useTranslation();

  const [schemes, setSchemes] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const currentDistrictObj = MAHARASHTRA_DISTRICTS.find(d => d.id === profile?.district);

  // Formatted district name without clumsy double parentheses
  const districtName = useMemo(() => {
    if (!currentDistrictObj) return profile?.district || (lang === 'mr' ? 'महाराष्ट्र' : 'Maharashtra');
    if (lang === 'mr') {
      return currentDistrictObj.name_mr.split(' ')[0]; // e.g. "अहिल्यानगर"
    }
    return currentDistrictObj.name_en;
  }, [currentDistrictObj, profile?.district, lang]);

  // Formatted crops text
  const cropsText = useMemo(() => {
    if (!profile?.crops || profile.crops.length === 0) {
      return lang === 'mr' ? 'पिके नोंदवा' : 'Add crops';
    }
    return profile.crops.map(cId => {
      const c = CROPS_LIST.find(item => item.id === cId);
      return lang === 'mr' ? (c?.name_mr || cId) : (c?.name_en || cId);
    }).join(', ');
  }, [profile?.crops, lang]);

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

  // Score & sort schemes
  const rankedSchemes = useMemo(() => {
    return schemes.map(scheme => ({
      ...scheme,
      _match: evaluateEligibility(scheme, profile)
    })).sort((a, b) => b._match.score - a._match.score);
  }, [schemes, profile]);

  const displayedSchemes = useMemo(() => {
    if (activeFilter === 'eligible') {
      return rankedSchemes.filter(s => s._match.status === 'green' || s._match.status === 'blue');
    }
    return rankedSchemes;
  }, [rankedSchemes, activeFilter]);

  const recentUpdates = updates.slice(0, 2);
  const featuredSchemes = displayedSchemes.slice(0, 3);
  const eligibleCount = rankedSchemes.filter(s => s._match.status === 'green' || s._match.status === 'blue').length;

  return (
    <div className="p-3.5 max-w-md mx-auto space-y-3.5">
      {/* ── 1. CLEAN FARMER IDENTITY BAR ── */}
      <div className="bg-white rounded-2xl p-3.5 shadow-2xs border border-stone-200/90 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-2xs">
            🌾
          </div>
          <div className="min-w-0">
            <div className="text-sm font-extrabold text-stone-900 truncate leading-tight">
              {profile?.taluka ? `${profile.taluka}, ` : ''}{districtName}
            </div>
            <div className="text-xs text-stone-500 font-medium truncate mt-0.5">
              <span>{profile?.land_area || '१.५'} {lang === 'mr' ? 'एकर' : 'acres'}</span>
              <span className="mx-1">•</span>
              <span className="text-emerald-800 font-semibold">{cropsText}</span>
            </div>
          </div>
        </div>

        <Link
          to="/profile"
          className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors shrink-0 ml-2"
        >
          {lang === 'mr' ? 'बदला' : 'Edit'}
        </Link>
      </div>

      {/* ── 2. QUICK FILTER TABS ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all touch-target whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
          }`}
        >
          {lang === 'mr' ? 'सर्व योजना' : 'All Schemes'} ({rankedSchemes.length})
        </button>

        <button
          onClick={() => setActiveFilter('eligible')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all touch-target whitespace-nowrap flex items-center gap-1.5 ${
            activeFilter === 'eligible'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{lang === 'mr' ? 'पात्र योजना' : 'Eligible'} ({eligibleCount})</span>
        </button>
      </div>

      {/* ── 3. SCHEMES SECTION (CLEAN CARDS) ── */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-700" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
              {t('relevant_schemes_heading')}
            </h2>
          </div>
          <Link
            to="/schemes"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5"
          >
            <span>{t('view_all_schemes')}</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-stone-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
            <span>{lang === 'mr' ? 'लोड होत आहे...' : 'Loading...'}</span>
          </div>
        ) : featuredSchemes.length === 0 ? (
          <div className="p-4 bg-white rounded-2xl border border-stone-200 text-xs text-stone-500 text-center">
            {t('no_schemes_found')}
          </div>
        ) : (
          <div className="space-y-2.5">
            {featuredSchemes.map(s => (
              <SchemeCard key={s.id} scheme={s} />
            ))}
          </div>
        )}
      </section>

      {/* ── 4. RECENT GOVERNMENT UPDATES ── */}
      <section className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
              {t('recent_updates_heading')}
            </h2>
          </div>
          <Link
            to="/updates"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950"
          >
            {t('view_all_updates')}
          </Link>
        </div>

        {recentUpdates.length > 0 && (
          <div className="space-y-2">
            {recentUpdates.map(u => (
              <UpdateItem key={u.id} update={u} />
            ))}
          </div>
        )}
      </section>

      {/* ── 5. CROP INSURANCE COMPACT ACTION ── */}
      <Link
        to="/insurance"
        className="block bg-stone-900 text-white rounded-2xl p-3.5 shadow-2xs hover:bg-stone-800 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌧️</span>
            <div>
              <div className="text-xs font-extrabold text-amber-300">
                {lang === 'mr' ? 'पंतप्रधान पीक विमा योजना (PMFBY)' : 'Pradhan Mantri Fasal Bima (PMFBY)'}
              </div>
              <div className="text-[11px] text-stone-300">
                {lang === 'mr' ? '७२ तासांत पीक नुकसानीची तक्रार करा' : 'Report crop loss within 72 hours'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </div>
      </Link>
    </div>
  );
};
