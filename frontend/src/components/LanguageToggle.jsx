import { Languages } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export const LanguageToggle = ({ className = '' }) => {
  const { lang, setLang } = useTranslation();

  return (
    <button
      onClick={() => setLang(lang === 'mr' ? 'en' : 'mr')}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-800 text-emerald-50 hover:bg-emerald-900 border border-emerald-700/60 shadow-xs transition-colors touch-target ${className}`}
      aria-label="Toggle Language"
    >
      <Languages className="w-3.5 h-3.5 text-emerald-300" />
      <span>{lang === 'mr' ? 'English' : 'मराठी'}</span>
    </button>
  );
};

