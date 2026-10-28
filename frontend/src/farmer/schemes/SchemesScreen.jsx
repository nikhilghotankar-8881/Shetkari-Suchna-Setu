import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SchemeCard } from './SchemeCard';
import { api } from '../../api/client';
import { useFarmerToken } from '../../auth/FarmerTokenContext';
import { useTranslation } from '../../i18n/useTranslation';
import { MAHARASHTRA_DISTRICTS } from '../../utils/constants';
import { Filter, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export const SchemesScreen = () => {
  const { profile } = useFarmerToken();
  const { lang, t } = useTranslation();

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDistrictObj = MAHARASHTRA_DISTRICTS.find(d => d.id === profile?.district);

  const fetchSchemes = async () => {
    setLoading(true);
    const data = await api.getSchemes(profile?.district, profile?.crops);
    setSchemes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSchemes();
  }, [profile?.district, JSON.stringify(profile?.crops)]);

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Disclaimer / Match Notification Banner */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 shadow-2xs">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xs font-bold text-emerald-950">
              {t('potentially_relevant')}
            </h2>
            <p className="text-[11px] text-emerald-800/90 mt-0.5 leading-snug">
              {t('not_eligible_notice')}
            </p>
          </div>
        </div>

        {/* Active Profile Filter Tags */}
        {profile && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-emerald-200/60 text-[11px]">
            <span className="font-semibold text-emerald-900">
              {lang === 'mr' ? 'लागू केलेले फिल्टर:' : 'Active Filter:'}
            </span>
            <span className="bg-white/80 px-2 py-0.5 rounded-md font-medium text-emerald-800 border border-emerald-200">
              📍 {lang === 'mr' ? currentDistrictObj?.name_mr : currentDistrictObj?.name_en || profile.district}
            </span>
            <span className="bg-white/80 px-2 py-0.5 rounded-md font-medium text-emerald-800 border border-emerald-200">
              🌱 {profile.crops?.length || 0} {lang === 'mr' ? 'पिके' : 'crops'}
            </span>
            <Link
              to="/profile"
              className="ml-auto text-emerald-700 underline font-semibold hover:text-emerald-900"
            >
              {lang === 'mr' ? 'बदला' : 'Edit'}
            </Link>
          </div>
        )}
      </div>

      {/* Schemes List */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-stone-400 gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-xs">योजना लोड होत आहेत...</span>
        </div>
      ) : schemes.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 space-y-3">
          <div className="text-4xl">🌾</div>
          <p className="text-sm font-semibold text-stone-700">
            {t('no_schemes_found')}
          </p>
          <Link
            to="/profile"
            className="inline-block bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl"
          >
            {lang === 'mr' ? 'जिल्हा किंवा पिके बदला' : 'Change District/Crops'}
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {schemes.map(scheme => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  );
};

