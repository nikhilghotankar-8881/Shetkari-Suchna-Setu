import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import { VerificationBadge } from '../../components/VerificationBadge';
import { SourceLink } from '../../components/SourceLink';
import { useTranslation } from '../../i18n/useTranslation';
import {
  ArrowLeft,
  Building,
  Calendar,
  CheckCircle,
  FileCheck,
  FileText,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  Bookmark
} from 'lucide-react';

export const SchemeDetailScreen = () => {
  const { id } = useParams();
  const { lang, t } = useTranslation();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getSchemeById(id).then(data => {
      if (isMounted) {
        setScheme(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-stone-400">
        योजनेची सविस्तर माहिती लोड होत आहे...
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="p-6 text-center space-y-3">
        <p className="text-sm text-stone-600 font-semibold">ही योजना आढळली नाही.</p>
        <Link to="/schemes" className="text-xs text-emerald-700 underline font-bold">
          {t('back_to_schemes')}
        </Link>
      </div>
    );
  }

  const isVerified = scheme.verification_status === 'Verified';
  const name = lang === 'mr' ? scheme.name_mr : scheme.name_en;
  const department = lang === 'mr' ? scheme.department_mr : scheme.department_en;
  const purpose = lang === 'mr' ? scheme.purpose_mr : scheme.purpose_en;
  const eligibility = lang === 'mr' ? scheme.eligibility_mr : scheme.eligibility_en;
  const benefits = lang === 'mr' ? scheme.benefits_mr : scheme.benefits_en;
  const documents = lang === 'mr' ? scheme.documents_mr : scheme.documents_en;
  const application = lang === 'mr' ? scheme.application_mr : scheme.application_en;

  const formattedDeadline = (isVerified && scheme.deadline)
    ? new Date(scheme.deadline).toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : null;

  const formattedPubDate = scheme.publication_date
    ? new Date(scheme.publication_date).toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : null;

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Back button */}
      <div>
        <Link
          to="/schemes"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-800 touch-target py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back_to_schemes')}</span>
        </Link>
      </div>

      {/* Main Detail Header Card */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200/90 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <VerificationBadge status={scheme.verification_status} />
          {scheme.notice_id && (
            <span className="font-mono text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              {scheme.notice_id}
            </span>
          )}
        </div>

        <h2 className="text-base font-extrabold text-stone-900 leading-snug">
          {name}
        </h2>

        <div className="text-xs text-stone-600 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="font-medium">{department}</span>
        </div>

        {/* Provenance Metadata bar */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
          <div>
            <span className="block text-[10px] text-stone-400">{t('publication_date')}</span>
            <span className="font-semibold text-stone-700">{formattedPubDate || '—'}</span>
          </div>
          <div>
            <span className="block text-[10px] text-stone-400">{t('version')}</span>
            <span className="font-semibold text-stone-700">v{scheme.version || 1} (Official GR)</span>
          </div>
        </div>
      </div>

      {/* Strict Deadline Box */}
      <div className={`rounded-2xl p-4 border text-xs space-y-1 ${
        isVerified ? 'bg-emerald-50 text-emerald-950 border-emerald-300' : 'bg-stone-50 text-stone-700 border-stone-200'
      }`}>
        <div className="flex items-center gap-2">
          <Calendar className={`w-4 h-4 shrink-0 ${isVerified ? 'text-emerald-700' : 'text-stone-400'}`} />
          <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
            {t('deadline')}
          </span>
        </div>
        <div className="text-sm font-extrabold pl-6">
          {isVerified && formattedDeadline ? formattedDeadline : t('deadline_unverified')}
        </div>
        {!isVerified && (
          <p className="text-[10px] text-stone-500 pl-6 leading-tight">
            * अंतिम मुदत अद्याप मानवी समीक्षकाद्वारे तपासली नाही, म्हणून दर्शवली जात नाही.
          </p>
        )}
      </div>

      {/* Purpose */}
      {purpose && (
        <section className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200/90 space-y-1.5">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wide flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('purpose')}</span>
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">{purpose}</p>
        </section>
      )}

      {/* Benefits */}
      <section className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200/90 space-y-1.5">
        <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wide flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('benefits')}</span>
        </h3>
        <p className="text-xs text-stone-700 font-medium leading-relaxed bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
          {benefits}
        </p>
      </section>

      {/* Eligibility Conditions */}
      <section className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200/90 space-y-1.5">
        <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wide flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('eligibility')}</span>
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed">{eligibility}</p>
      </section>

      {/* Required Documents */}
      {documents && (
        <section className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200/90 space-y-1.5">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wide flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('documents')}</span>
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">{documents}</p>
        </section>
      )}

      {/* Application Steps */}
      {application && (
        <section className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200/90 space-y-1.5">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wide flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('application_steps')}</span>
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">{application}</p>
        </section>
      )}

      {/* Evidence Quote from Source */}
      {scheme.evidence_quote && (
        <section className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('evidence_quote')}</span>
          </div>
          <blockquote className="p-2.5 bg-white rounded-xl text-stone-600 font-serif italic border-l-2 border-emerald-600 text-xs leading-relaxed">
            "{scheme.evidence_quote}"
          </blockquote>
        </section>
      )}

      {/* Action Buttons: Apply on Portal + View Original GR */}
      <div className="space-y-2 pt-2">
        {scheme.official_url && (
          <a
            href={scheme.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors touch-target"
          >
            <span>{t('view_official_portal')}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        {scheme.source_url && (
          <a
            href={scheme.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-stone-300 transition-colors touch-target"
          >
            <span>{t('view_source')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Legal / Service Disclaimer */}
      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[10px] text-amber-900 leading-snug">
        {t('disclaimer_text')}
      </div>
    </div>
  );
};

