import { ExternalLink, Calendar, Building, CheckCircle, FileCheck, AlertCircle } from 'lucide-react';
import { VerificationBadge } from '../../components/VerificationBadge';
import { SourceLink } from '../../components/SourceLink';
import { useTranslation } from '../../i18n/useTranslation';

export const SchemeCard = ({ scheme }) => {
  const { lang, t } = useTranslation();

  const isVerified = scheme.verification_status === 'Verified';
  const name = lang === 'mr' ? scheme.name_mr : scheme.name_en;
  const department = lang === 'mr' ? scheme.department_mr : scheme.department_en;
  const eligibility = lang === 'mr' ? scheme.eligibility_mr : scheme.eligibility_en;
  const benefits = lang === 'mr' ? scheme.benefits_mr : scheme.benefits_en;
  const documents = lang === 'mr' ? scheme.documents_mr : scheme.documents_en;

  // Deadline logic: ONLY format and display if Verified
  const formattedDeadline = (isVerified && scheme.deadline)
    ? new Date(scheme.deadline).toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : null;

  return (
    <article className="bg-white rounded-2xl p-4.5 shadow-xs border border-stone-200/90 hover:border-emerald-300 transition-all space-y-3.5">
      {/* Top Header: Badge + Department */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <VerificationBadge status={scheme.verification_status} />
        <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1 truncate max-w-[200px]">
          <Building className="w-3 h-3 text-stone-400 shrink-0" />
          {department}
        </span>
      </div>

      {/* Scheme Title */}
      <h3 className="text-base font-bold text-stone-900 leading-snug">
        {name}
      </h3>

      {/* Deadline Box - STRICT RULE: Deadline shown ONLY if Verified */}
      <div className={`p-2.5 rounded-xl flex items-center gap-2.5 text-xs ${
        isVerified ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/70' : 'bg-stone-50 text-stone-600 border border-stone-200'
      }`}>
        <Calendar className={`w-4 h-4 shrink-0 ${isVerified ? 'text-emerald-700' : 'text-stone-400'}`} />
        <div className="flex-1">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 block">
            {t('deadline')}
          </span>
          <span className="font-semibold text-sm">
            {isVerified && formattedDeadline ? formattedDeadline : t('deadline_unverified')}
          </span>
        </div>
      </div>

      {/* Benefits */}
      <div className="text-xs text-stone-700 bg-stone-50/70 p-3 rounded-xl border border-stone-100">
        <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5 text-[11px]">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('benefits')}</span>
        </div>
        <p className="leading-relaxed">{benefits}</p>
      </div>

      {/* Eligibility */}
      <div className="text-xs text-stone-700 space-y-1">
        <span className="font-bold text-stone-800 text-[11px] block">
          {t('eligibility')}:
        </span>
        <p className="text-stone-600 leading-relaxed">{eligibility}</p>
      </div>

      {/* Documents */}
      {documents && (
        <div className="text-xs text-stone-700 space-y-1">
          <span className="font-bold text-stone-800 text-[11px] flex items-center gap-1">
            <FileCheck className="w-3.5 h-3.5 text-stone-400" />
            {t('documents')}:
          </span>
          <p className="text-stone-600 leading-relaxed">{documents}</p>
        </div>
      )}

      {/* Official Application Portal Button */}
      {scheme.official_url && (
        <a
          href={scheme.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors touch-target"
        >
          <span>{t('view_official_portal')}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}

      {/* Source Provenance Link + Last Verified Date */}
      <SourceLink
        sourceUrl={scheme.source_url}
        lastVerifiedAt={scheme.last_verified_at}
      />
    </article>
  );
};

