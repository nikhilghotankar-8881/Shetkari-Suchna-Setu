import { useState, useEffect } from 'react';
import { UpdateItem } from './UpdateItem';
import { api } from '../../api/client';
import { useFarmerToken } from '../../auth/FarmerTokenContext';
import { useTranslation } from '../../i18n/useTranslation';
import { RefreshCw, Sparkles } from 'lucide-react';

export const UpdatesScreen = () => {
  const { profile } = useFarmerToken();
  const { t } = useTranslation();

  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUpdates = async () => {
    setLoading(true);
    const data = await api.getLatestUpdates(profile?.district, profile?.crops);
    setUpdates(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUpdates();
  }, [profile?.district, JSON.stringify(profile?.crops)]);

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Screen Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <span>{t('updates_title')}</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            वेळेवर माहिती मिळवून योजनांचा लाभ घ्या
          </p>
        </div>
        <button
          onClick={fetchUpdates}
          className="p-2 rounded-xl text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors touch-target"
          aria-label="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Feed list */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-stone-400 gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-xs">नवीन सूचना लोड होत आहेत...</span>
        </div>
      ) : updates.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-stone-200">
          <p className="text-sm font-semibold text-stone-600">
            कोणतीही नवीन सूचना उपलब्ध नाही.
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

