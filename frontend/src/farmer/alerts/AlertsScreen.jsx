import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useFarmerToken } from '../../auth/FarmerTokenContext';
import { useTranslation } from '../../i18n/useTranslation';
import { Bell, Check, Sparkles, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react';

export const AlertsScreen = () => {
  const { token } = useFarmerToken();
  const { lang, t } = useTranslation();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    setLoading(true);
    const data = await api.getAlerts(token);
    setAlerts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
  }, [token]);

  const handleMarkAsRead = async (alertId) => {
    await api.markAlertRead(alertId, token);
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, read: true } : a));
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-700" />
            <span>{t('nav_alerts')}</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            तुमच्या पिकांशी संबंधित महत्त्वाच्या सूचना
          </p>
        </div>
      </div>

      {/* Alerts list */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-stone-400 gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-xs">सूचना लोड होत आहेत...</span>
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 space-y-2">
          <div className="text-3xl">📭</div>
          <p className="text-sm font-semibold text-stone-600">
            {t('alerts_empty')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => {
            const isUnread = !alert.read;
            const title = lang === 'mr' ? alert.title_mr : alert.title_en;
            const body = lang === 'mr' ? alert.body_mr : alert.body_en;

            return (
              <div
                key={alert.id}
                className={`
                  rounded-2xl p-4 border transition-all space-y-2.5 relative
                  ${isUnread
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                    : 'bg-white border-stone-200 opacity-90'}
                `}
              >
                {/* Header with Type & Unread Dot */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-emerald-200 animate-pulse" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      {alert.kind}
                    </span>
                  </div>

                  <span className="text-[10px] text-stone-400">
                    {new Date(alert.created_at).toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-IN', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                </div>

                {/* Alert Title & Body */}
                <div>
                  <h3 className="text-sm font-bold text-stone-900 leading-snug">
                    {title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {body}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                  <Link
                    to="/schemes"
                    className="font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 touch-target"
                  >
                    <span>{lang === 'mr' ? 'योजना पहा' : 'View Scheme'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  {isUnread && (
                    <button
                      onClick={() => handleMarkAsRead(alert.id)}
                      className="text-stone-500 hover:text-stone-800 font-medium inline-flex items-center gap-1 touch-target px-2 py-1 rounded-md hover:bg-stone-100"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('mark_read')}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

