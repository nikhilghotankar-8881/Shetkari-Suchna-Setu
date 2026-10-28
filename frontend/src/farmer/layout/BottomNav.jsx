import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, Sparkles, Bell, User } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

export const BottomNav = ({ unreadCount = 0 }) => {
  const { t } = useTranslation();

  const navItems = [
    { to: '/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
    { to: '/schemes', label: t('nav_schemes'), icon: Compass },
    { to: '/updates', label: t('nav_updates'), icon: Sparkles },
    { to: '/alerts', label: t('nav_alerts'), icon: Bell, badge: unreadCount },
    { to: '/profile', label: t('nav_profile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16">
        {navItems.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              relative flex flex-col items-center justify-center py-1 transition-all touch-target
              ${isActive ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'}
            `}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {Boolean(badge && badge > 0) && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {badge}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-1 tracking-tight truncate max-w-[64px] text-center">
              {label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
