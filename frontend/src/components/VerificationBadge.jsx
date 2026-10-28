import { CheckCircle2, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export const VerificationBadge = ({ status, className = '' }) => {
  const { lang, t } = useTranslation();

  switch (status) {
    case 'Verified':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          {lang === 'mr' ? 'तपासलेले (Verified)' : 'Verified'}
        </span>
      );

    case 'Auto-checked':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 ${className}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          {lang === 'mr' ? 'स्वयंचलित तपासणी (Auto-checked)' : 'Auto-checked'}
        </span>
      );

    case 'Superseded':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-200 text-stone-700 border border-stone-300 line-through ${className}`}>
          <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
          {lang === 'mr' ? 'जुनी / सुधारित सूचना' : 'Superseded'}
        </span>
      );

    case 'Needs review':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300 ${className}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          {lang === 'mr' ? 'पुनरावलोकन आवश्यक' : 'Needs Review'}
        </span>
      );

    default:
      return null;
  }
};

