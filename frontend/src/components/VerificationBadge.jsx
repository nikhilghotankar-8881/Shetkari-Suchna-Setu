import { CheckCircle2, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export const VerificationBadge = ({ status, className = '' }) => {
  const { lang, t } = useTranslation();

  switch (status) {
    case 'Verified':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 ${className}`}>
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>{lang === 'mr' ? 'तपासलेले' : 'Verified'}</span>
        </span>
      );

    case 'Auto-checked':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 ${className}`}>
          <Clock className="w-3 h-3 text-amber-600" />
          <span>{lang === 'mr' ? 'स्वयंचलित' : 'Auto-checked'}</span>
        </span>
      );

    case 'Superseded':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-stone-100 text-stone-600 border border-stone-300 line-through ${className}`}>
          <RefreshCw className="w-3 h-3 text-stone-500" />
          <span>{lang === 'mr' ? 'जुने' : 'Superseded'}</span>
        </span>
      );

    case 'Needs review':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300 ${className}`}>
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          <span>{lang === 'mr' ? 'तपासणी बाकी' : 'In Review'}</span>
        </span>
      );

    default:
      return null;
  }
};
