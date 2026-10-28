import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { LanguageToggle } from '../../components/LanguageToggle';
import { OfflineBanner } from '../../components/OfflineBanner';
import { useTranslation } from '../../i18n/useTranslation';
import { api } from '../../api/client';
import { useFarmerToken } from '../../auth/FarmerTokenContext';

export const FarmerLayout = () => {
  const { t } = useTranslation();
  const { token } = useFarmerToken();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    api.getAlerts(token).then(alerts => {
      if (isMounted && Array.isArray(alerts)) {
        const unread = alerts.filter(a => !a.read).length;
        setUnreadCount(unread);
      }
    });
    return () => { isMounted = false; };
  }, [token]);

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col justify-between">
      {/* Top Banner / Header */}
      <header className="sticky top-0 z-20 bg-emerald-800 text-white shadow-md">
        <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-lg shadow-inner border border-white/20">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-extrabold tracking-tight leading-tight group-hover:text-emerald-100 transition-colors">
                  {t('app_name')}
                </h1>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-amber-400 text-stone-950">
                  {t('demo_badge')}
                </span>
              </div>
              <p className="text-[10px] text-emerald-200/90 leading-tight">
                {t('app_subtitle')}
              </p>
            </div>
          </Link>
          <LanguageToggle />
        </div>
        {/* Offline Status Bar if network disconnects */}
        <OfflineBanner />
      </header>

      {/* Main Screen Content */}
      <main className="flex-1 max-w-md w-full mx-auto pb-safe-nav">
        <Outlet />
      </main>

      {/* Bottom Sticky Navigation */}
      <BottomNav unreadCount={unreadCount} />
    </div>
  );
};
