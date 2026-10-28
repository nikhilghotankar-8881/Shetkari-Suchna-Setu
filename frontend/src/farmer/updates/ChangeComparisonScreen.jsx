import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import { VerificationBadge } from '../../components/VerificationBadge';
import { useTranslation } from '../../i18n/useTranslation';
import {
  ArrowLeft,
  Building,
  Calendar,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileText,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Info
} from 'lucide-react';

export const ChangeComparisonScreen = () => {
  const { id } = useParams();
  const { lang, t } = useTranslation();

  const [update, setUpdate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getNoticeUpdateById(id).then(data => {
      if (isMounted) {
        setUpdate(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-stone-400">
        बदल तुलना लोड होत आहे...
      </div>
    );
  }

  if (!update) {
    return (
      <div className="p-6 text-center space-y-3">
        <p className="text-sm text-stone-600 font-semibold">ही सूचना आढळली नाही.</p>
        <Link to="/updates" className="text-xs text-emerald-700 underline font-bold">
          {t('back_to_updates')}
        </Link>
      </div>
    );
  }

  const title = lang === 'mr' ? update.title_mr : update.title_en;
  const summary = lang === 'mr' ? update.summary_mr : update.summary_en;
  const department = lang === 'mr' ? update.department_mr : update.department_en;

  const formattedDetectedDate = update.detected_at
    ? new Date(update.detected_at).toLocaleString(lang === 'mr' ? 'mr-IN' : 'en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : null;

  const formattedVerifiedDate = update.last_verified_at
    ? new Date(update.last_verified_at).toLocaleString(lang === 'mr' ? 'mr-IN' : 'en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : null;

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Back button */}
      <div>
        <Link
          to="/updates"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-800 touch-target py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back_to_updates')}</span>
        </Link>
      </div>

      {/* Illustrative Demo Notice Pill */}
      <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-snug">
          <span className="font-bold">{t('demo_badge')}:</span> {t('demo_notice')}
        </p>
      </div>

      {/* Header Summary Card */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200/90 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <VerificationBadge status={update.verification_status} />
          {update.notice_id && (
            <span className="font-mono text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              {update.notice_id}
            </span>
          )}
        </div>

        <h2 className="text-base font-extrabold text-stone-900 leading-snug">
          {title}
        </h2>

        <div className="text-xs text-stone-600 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="font-medium">{department}</span>
        </div>

        <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
          {summary}
        </p>

        {/* Timestamps & Version Traceability */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[10px] text-stone-500">
          <div>
            <span className="text-stone-400 block">{t('retrieved_at')}</span>
            <span className="font-mono font-semibold text-stone-700">{formattedDetectedDate || '—'}</span>
          </div>
          <div>
            <span className="text-stone-400 block">{t('last_verified')}</span>
            <span className="font-mono font-semibold text-stone-700">{formattedVerifiedDate || 'पडताळणी बाकी'}</span>
          </div>
        </div>
      </div>

      {/* ── THE SIGNATURE FEATURE: SIDE-BY-SIDE CHANGE COMPARISON ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
            {t('comparison_heading')}
          </h3>
        </div>

        {update.changes && update.changes.length > 0 ? (
          update.changes.map((change, index) => {
            const field = lang === 'mr' ? change.field_mr : change.field_en;
            const oldVal = lang === 'mr' ? change.old_value_mr : change.old_value_en;
            const newVal = lang === 'mr' ? change.new_value_mr : change.new_value_en;
            const expl = lang === 'mr' ? change.explanation_mr : change.explanation_en;

            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-4.5 shadow-xs border border-stone-200 space-y-3"
              >
                {/* Field title */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-xs font-bold text-stone-900">
                    {field}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {change.severity === 'high' ? 'महत्त्वाचा बदल' : 'सुधारणा'}
                  </span>
                </div>

                {/* Side-by-Side Values (Old vs New) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Previous State */}
                  <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider block">
                      {t('old_value')}
                    </span>
                    <div className="font-semibold text-stone-600 line-through">
                      {oldVal}
                    </div>
                  </div>

                  {/* Latest State */}
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                      {t('new_value')}
                    </span>
                    <div className="font-extrabold text-emerald-950 text-sm">
                      {newVal}
                    </div>
                  </div>
                </div>

                {/* Plain-Language Explanation */}
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block">
                    {t('explanation')}
                  </span>
                  <p className="text-stone-700 leading-relaxed font-medium">
                    {expl}
                  </p>
                </div>

                {/* Evidence Quote from official notice */}
                {change.evidence_quote && (
                  <div className="pt-2 border-t border-stone-100 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t('evidence_reference')}</span>
                    </div>
                    <blockquote className="p-2.5 bg-stone-50 rounded-xl text-stone-700 font-serif italic border-l-2 border-emerald-600 text-xs leading-relaxed">
                      "{change.evidence_quote}"
                    </blockquote>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl p-5 border border-stone-200 text-xs text-stone-600">
            ही नवीन प्रसिद्ध झालेली सूचना आहे. पूर्व-आवृत्ती उपलब्ध नाही.
          </div>
        )}
      </section>

      {/* Primary Actions */}
      <div className="space-y-2 pt-2">
        {update.source_url && (
          <a
            href={update.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors touch-target"
          >
            <span>{t('view_original_notice')}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        {update.scheme_id && (
          <Link
            to={`/schemes/${update.scheme_id}`}
            className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-stone-300 transition-colors touch-target"
          >
            <FileText className="w-4 h-4" />
            <span>{t('view_details')}</span>
          </Link>
        )}
      </div>

      {/* Trust disclaimer */}
      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[10px] text-stone-500 leading-snug">
        {t('disclaimer_text')}
      </div>
    </div>
  );
};

