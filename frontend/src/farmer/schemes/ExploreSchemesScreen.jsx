import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SchemeCard } from './SchemeCard';
import { api } from '../../api/client';
import { useFarmerToken } from '../../auth/FarmerTokenContext';
import { useTranslation } from '../../i18n/useTranslation';
import { Search, Filter, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export const ExploreSchemesScreen = () => {
  const { profile } = useFarmerToken();
  const { lang, t } = useTranslation();

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const fetchSchemes = async () => {
    setLoading(true);
    const data = await api.getSchemes({
      district: profile?.district,
      crops: profile?.crops,
      search: searchQuery
    });
    setSchemes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSchemes();
  }, [profile?.district, JSON.stringify(profile?.crops), searchQuery]);

  const displayedSchemes = verifiedOnly
    ? schemes.filter(s => s.verification_status === 'Verified')
    : schemes;

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Title */}
      <div>
        <h2 className="text-base font-extrabold text-stone-900">
          {t('explore_title')}
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          {t('explore_subtitle')}
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('search_placeholder')}
          className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setVerifiedOnly(false)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all touch-target ${
              !verifiedOnly
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-white text-stone-600 border border-stone-200'
            }`}
          >
            {t('filter_all')} ({schemes.length})
          </button>
          <button
            onClick={() => setVerifiedOnly(true)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all touch-target flex items-center gap-1 ${
              verifiedOnly
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-white text-stone-600 border border-stone-200'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{t('filter_verified_only')}</span>
          </button>
        </div>

        <button
          onClick={fetchSchemes}
          className="p-1.5 text-stone-400 hover:text-stone-700"
          aria-label="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-stone-400 gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-xs">योजना लोड होत आहेत...</span>
        </div>
      ) : displayedSchemes.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 space-y-2">
          <p className="text-xs font-semibold text-stone-600">
            {t('no_schemes_found')}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {displayedSchemes.map(scheme => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  );
};

