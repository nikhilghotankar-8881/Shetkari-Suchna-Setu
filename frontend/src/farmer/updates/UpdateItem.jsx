import { Link } from 'react-router-dom';
import { ExternalLink, Sparkles, RefreshCw, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

export const UpdateItem = ({ update }) => {
  const { lang, t } = useTranslation();

  const title = lang === 'mr' ? update.title_mr : update.title_en;
  const isChanged = update.type === 'CHANGED';
  const isNew = update.type === 'NEW';
  const isVerified = update.type === 'DEADLINE_VERIFIED';

  const formattedDate = update.detected_at
    ? new Date(update.detected_at).toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : null;

  const firstChange = update.changes && update.changes[0];

  return (
    <article className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200/90 hover:border-emerald-400 transition-all space-y-3">
      {/* Type Badge & Date */}
      <div className="flex items-center justify-between gap-2">
        {isChanged && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <RefreshCw className="w-3 h-3 text-amber-700" />
            <span>{lang === 'mr' ? 'बदल झालेला GR' : 'Revised GR'}</span>
          </span>
        )}
        {isNew && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <Sparkles className="w-3 h-3 text-emerald-700" />
            <span>{lang === 'mr' ? 'नवीन प्रसिद्ध शासन निर्णय' : 'New GR Published'}</span>
          </span>
        )}
        {isVerified && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-900 border border-sky-300">
            <CheckCircle2 className="w-3 h-3 text-sky-700" />
            <span>{lang === 'mr' ? 'मुदत पडताळणी पूर्ण' : 'Deadline Confirmed'}</span>
          </span>
        )}

        {formattedDate && (
          <span className="text-[11px] font-medium text-stone-400">
            {formattedDate}
          </span>
        )}
      </div>

      {/* Notice Title */}
      <h3 className="text-sm font-bold text-stone-900 leading-snug">
        <Link to={`/updates/${update.id}`} className="hover:text-emerald-800 transition-colors">
          {title}
        </Link>
      </h3>

      {/* Visual Diff Snippet Preview for CHANGED notices */}
      {isChanged && firstChange && (
        <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs space-y-1.5">
          <div className="font-bold text-stone-700 text-[11px]">
            {lang === 'mr' ? firstChange.field_mr : firstChange.field_en}:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-900 border border-rose-200">
              <span className="text-[9px] uppercase font-bold text-rose-700 block">
                {t('old_value')}:
              </span>
              <span className="line-through text-stone-500 font-medium truncate block">
                {lang === 'mr' ? firstChange.old_value_mr : firstChange.old_value_en}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-950 border border-emerald-300 font-semibold">
              <span className="text-[9px] uppercase font-bold text-emerald-800 block">
                {t('new_value')}:
              </span>
              <span className="text-emerald-900 truncate block">
                {lang === 'mr' ? firstChange.new_value_mr : firstChange.new_value_en}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Primary Action Button: Opens the Change-Comparison Detail Screen */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
        <Link
          to={`/updates/${update.id}`}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-colors touch-target"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>{t('compare_changes')}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        {update.source_url && (
          <a
            href={update.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-stone-500 hover:text-emerald-800 flex items-center gap-1 touch-target"
          >
            <span>{lang === 'mr' ? 'मूळ GR' : 'Original GR'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </article>
  );
};
