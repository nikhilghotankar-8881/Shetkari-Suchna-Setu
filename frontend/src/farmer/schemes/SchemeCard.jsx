import { Link } from 'react-router-dom';
import { ExternalLink, Calendar, Building, CheckCircle, ChevronRight, FileText } from 'lucide-react';
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

  // STRICT RULE: Deadline shown ONLY if Verified
  const formattedDeadline = (isVerified && scheme.deadline)
    ? new Date(scheme.deadline).toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : null;

  return (
    <article className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200/90 hover:border-emerald-400 transition-all space-y-3">
      {/* Top Header: Eligibility Status Badge + Verification Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <EligibilityBadge status={eligibilityMatch.status} />
        <VerificationBadge status={scheme.verification_status} />
      </div>

      {/* Scheme Title */}
      <h3 className="text-sm font-bold text-stone-900 leading-snug">
        <Link to={`/schemes/${scheme.id}`} className="hover:text-emerald-800 transition-colors">
          {name}
        </Link>
      </h3>

      {/* Department Line */}
      <div className="text-[11px] font-medium text-stone-500 flex items-center gap-1 truncate">
        <Building className="w-3 h-3 text-stone-400 shrink-0" />
        <span className="truncate">{department}</span>
      </div>

      {/* Deadline Box - STRICT RULE: Deadline shown ONLY if Verified */}
      <div className={`p-2 rounded-xl flex items-center gap-2 text-xs ${
        isVerified ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/70' : 'bg-stone-50 text-stone-600 border border-stone-200'
      }`}>
        <Calendar className={`w-4 h-4 shrink-0 ${isVerified ? 'text-emerald-700' : 'text-stone-400'}`} />
        <div className="flex-1">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 block">
            {t('deadline')}
          </span>
          <span className="font-semibold text-xs">
            {isVerified && formattedDeadline ? formattedDeadline : t('deadline_unverified')}
          </span>
        </div>
      </div>

      {/* Key Benefits Snippet */}
      <div className="text-xs text-stone-700 bg-stone-50/70 p-2.5 rounded-xl border border-stone-100">
        <div className="font-bold text-stone-900 mb-0.5 flex items-center gap-1.5 text-[11px]">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('benefits')}</span>
        </div>
        <p className="leading-relaxed line-clamp-2">{benefits}</p>
      </div>

      {/* Primary Action: View Details + Traceability */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
        <Link
          to={`/schemes/${scheme.id}`}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-colors touch-target"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{t('view_details')}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        {scheme.source_url && (
          <a
            href={scheme.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-stone-500 hover:text-emerald-800 flex items-center gap-1 touch-target"
            title="View original government resolution"
          >
            <span>{lang === 'mr' ? 'अधिकृत GR' : 'Official GR'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </article>
  );
};
