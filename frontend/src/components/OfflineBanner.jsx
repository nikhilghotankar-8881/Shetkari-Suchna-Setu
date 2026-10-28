import { WifiOff } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useTranslation } from '../i18n/useTranslation';

export const OfflineBanner = () => {
  const isOnline = useNetworkStatus();
  const { lang } = useTranslation();

  if (isOnline) return null;

  return (
    <div className="bg-stone-900 text-stone-100 px-4 py-2 text-xs flex items-center justify-center gap-2 border-b border-stone-800 transition-all">
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
      <span className="font-medium">
        {lang === 'mr'
          ? 'ऑफलाईन मोड: फक्त जतन केलेल्या योजना दिसत आहेत (Cached Data)'
          : 'Offline Mode: Showing cached notices only'}
      </span>
    </div>
  );
};

