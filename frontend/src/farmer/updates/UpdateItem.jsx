import { ExternalLink, Sparkles, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

export const UpdateItem = ({ update }) => {
  const { lang, t } = useTranslation();

  const title = lang === 'mr' ? update.title_mr : update.title_en;
  const isChanged = update.type === 'CHANGED';
  const isNew = update.type === 'NEW';
  const isVerified = update.type === 'DEADLINE_VERIFIED';

  const formattedDate = update.changed_at
    ? new Date(update.changed_at).toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : null;

  return (
    <article className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200/90 hover:border-emerald-300 transition-all space-y-3">
      {/* Type Badge & Date */}
      <div className="flex items-center justify-between gap-2">
        {isChanged && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <RefreshCw className="w-3 h-3 text-amber-700 animate-spin-slow" />
            <span>{lang === 'mr' ? 'बदलाव / सुधारणा (CHANGED)' : 'Changed'}</span>
          </span>
        )}
        {isNew && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Sparkles className="w-3 h-3 text-emerald-700" />
            <span>{lang === 'mr' ? 'नवीन सूचना (NEW)' : 'New Notice'}</span>
          </span>
        )}
        {isVerified && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
            <CheckCircle2 className="w-3 h-3 text-sky-700" />
            <span>{lang === 'mr' ? 'मुदत पडताळणी (VERIFIED)' : 'Deadline Confirmed'}</span>
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
        {title}
      </h3>

      {/* Visual Diff Box for CHANGED notices: Old -> New comparison */}
      {isChanged && update.diff && (
        <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs space-y-2">
          <div className="font-bold text-stone-700 text-[11px]">
            {lang === 'mr' ? update.diff.field_mr : update.diff.field_en}
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 text-rose-900 border border-rose-200">
              <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider shrink-0">
                {t('diff_old')}:
              </span>
              <span className="line-through text-stone-500 font-medium">
                {lang === 'mr' ? update.diff.old_val_mr : update.diff.old_val_en}
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 text-emerald-950 border border-emerald-300 font-semibold">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider shrink-0">
                {t('diff_new')}:
              </span>
              <span className="text-emerald-900">
                {lang === 'mr' ? update.diff.new_val_mr : update.diff.new_val_en}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Source Provenance Link */}
      {update.source_url && (
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <a
            href={update.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 touch-target"
          >
            <span>{t('view_source')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </article>
  );
};

