import { useState, useEffect } from 'react';
import { UpdateItem } from './UpdateItem';
import { api } from '../../api/client';
import { useFarmerToken } from '../../auth/FarmerTokenContext';
import { useTranslation } from '../../i18n/useTranslation';
import { RefreshCw, Sparkles, Filter, Info } from 'lucide-react';

export const UpdatesScreen = () => {
  const { profile } = useFarmerToken();
  const { lang, t } = useTranslation();

  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const fetchUpdates = async (filterType = activeFilter) => {
    setLoading(true);
    const filterArg = filterType === 'ALL' ? undefined : filterType;
    const data = await api.getNoticeUpdates({
      district: profile?.district,
      crops: profile?.crops,
      filter: filterArg
    });
    setUpdates(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUpdates(activeFilter);
  }, [profile?.district, JSON.stringify(profile?.crops), activeFilter]);

  const filterTabs = [
    { id: 'ALL', label: t('filter_all_updates') },
    { id: 'CHANGED', label: t('filter_changed') },
    { id: 'NEW', label: t('filter_new') },
    { id: 'NEEDS_REVIEW', label: t('filter_needs_review') }
  ];

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <span>{t('updates_page_title')}</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {t('updates_page_subtitle')}
          </p>
        </div>
        <button
          onClick={() => fetchUpdates(activeFilter)}
          className="p-2 rounded-xl text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors touch-target"
          aria-label="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Illustrative Demo Notice */}
      <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-snug">
          <span className="font-bold">{t('demo_badge')}:</span> {t('demo_notice')}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`
              px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all touch-target text-xs
              ${activeFilter === tab.id
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-emerald-300'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed list */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-stone-400 gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-xs">नवीन सूचना लोड होत आहेत...</span>
        </div>
      ) : updates.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 space-y-2">
          <p className="text-sm font-semibold text-stone-600">
            या फिल्टर अंतर्गत कोणतीही सूचना आढळली नाही.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {updates.map(item => (
            <UpdateItem key={item.id} update={item} />
          ))}
        </div>
      )}
    </div>
  );
};
