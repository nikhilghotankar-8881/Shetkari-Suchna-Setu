import { Link } from 'react-router-dom';
import { ExternalLink, Calendar, ChevronRight } from 'lucide-react';
import { VerificationBadge } from '../../components/VerificationBadge';
import { EligibilityBadge } from '../../components/EligibilityBadge';
import { useEligibilityMatch } from '../eligibility/useEligibilityMatch';
import { useFarmerToken } from '../../auth/FarmerTokenContext';
import { useTranslation } from '../../i18n/useTranslation';

export const SchemeCard = ({ scheme }) => {
  const { profile } = useFarmerToken();
  const { lang, t } = useTranslation();
  const eligibilityMatch = useEligibilityMatch(scheme, profile);

  const isVerified = scheme.verification_status === 'Verified';
  const name = lang === 'mr' ? scheme.name_mr : scheme.name_en;
  const department = lang === 'mr' ? scheme.department_mr : scheme.department_en;
  const benefits = lang === 'mr' ? scheme.benefits_mr : scheme.benefits_en;

  const formattedDeadline = (isVerified && scheme.deadline)
    ? new Date(scheme.deadline).toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-IN', {
        day: 'numeric',
        month: 'short'
      })
    : null;

  return (
    <article className="bg-white rounded-2xl p-4 shadow-2xs border border-stone-200/80 hover:border-emerald-500 transition-all space-y-2.5">
      {/* Top Header: Eligibility Badge + Compact Deadline / Verification */}
      <div className="flex items-center justify-between gap-2">
        <EligibilityBadge status={eligibilityMatch.status} />

        {isVerified && formattedDeadline ? (
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50/90 px-2 py-0.5 rounded-md border border-emerald-200/80 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-emerald-600" />
            <span>{formattedDeadline} {lang === 'mr' ? 'पर्यंत' : 'deadline'}</span>
          </span>
        ) : (
          <VerificationBadge status={scheme.verification_status} />
        )}
      </div>

      {/* Scheme Title & Dept */}
      <div>
        <h3 className="text-sm font-extrabold text-stone-900 leading-snug">
          <Link to={`/schemes/${scheme.id}`} className="hover:text-emerald-700">
            {name}
          </Link>
        </h3>
        <p className="text-[11px] text-stone-400 truncate mt-0.5 font-medium">
          {department}
        </p>
      </div>

      {/* Key Benefit Highlight Box */}
      <div className="bg-emerald-50/60 rounded-xl px-3 py-2 border border-emerald-100 flex items-start gap-2">
        <span className="text-emerald-700 font-bold text-xs shrink-0 mt-0.5">💰</span>
        <p className="text-xs font-semibold text-emerald-950 leading-relaxed line-clamp-2">
          {benefits}
        </p>
      </div>

      {/* Primary Action Button + GR Link */}
      <div className="pt-1.5 flex items-center justify-between">
        <Link
          to={`/schemes/${scheme.id}`}
          className="text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 py-2 px-3.5 rounded-xl shadow-2xs inline-flex items-center gap-1.5 transition-all touch-target active:scale-95"
        >
          <span>{t('view_details')}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        {scheme.source_url && (
          <a
            href={scheme.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-stone-400 hover:text-emerald-800 flex items-center gap-1 touch-target px-2 py-1"
          >
            <span>{t('view_source')}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </article>
  );
};
