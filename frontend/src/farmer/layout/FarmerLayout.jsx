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
      {/* Top Clean Header */}
      <header className="sticky top-0 z-20 bg-emerald-800 text-white shadow-xs">
        <div className="max-w-md mx-auto px-3.5 py-2.5 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">🌾</span>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight leading-none text-white">
                {t('app_name')}
              </h1>
              <p className="text-[10px] text-emerald-200/80 leading-none mt-1">
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

      {/* Bottom Navigation */}
      <BottomNav unreadCount={unreadCount} />
    </div>
  );
};
