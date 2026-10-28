import { ExternalLink, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export const SourceLink = ({ sourceUrl, lastVerifiedAt, className = '' }) => {
  const { lang } = useTranslation();

  const formattedDate = lastVerifiedAt
    ? new Date(lastVerifiedAt).toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : null;

  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-100 text-xs text-stone-500 ${className}`}>
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:text-emerald-800 hover:underline touch-target"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{lang === 'mr' ? 'मूळ शासन निर्णय / स्रोत पहा' : 'View Official GR / Source'}</span>
        </a>
      )}

      {formattedDate && (
        <span className="inline-flex items-center gap-1 text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
          <span>
            {lang === 'mr' ? 'पडताळणी:' : 'Verified:'} {formattedDate}
          </span>
        </span>
      )}
    </div>
  );
};

