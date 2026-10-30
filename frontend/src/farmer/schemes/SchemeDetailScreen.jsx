import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import { VerificationBadge } from '../../components/VerificationBadge';
import { EligibilityBadge } from '../../components/EligibilityBadge';
import { useEligibilityMatch } from '../eligibility/useEligibilityMatch';
import { useFarmerToken } from '../../auth/FarmerTokenContext';
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
  Bookmark,
  Check,
  HelpCircle,
  FileBadge
} from 'lucide-react';

export const SchemeDetailScreen = () => {
  const { id } = useParams();
  const { profile } = useFarmerToken();
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

  const eligibilityMatch = useEligibilityMatch(scheme, profile);

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
          <EligibilityBadge status={eligibilityMatch.status} />
          <VerificationBadge status={scheme.verification_status} />
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

      {/* ── PERSONALIZED ELIGIBILITY MATCH BREAKDOWN ── */}
      <section className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'mr' ? 'तुमच्या प्रोफाईलशी जुळणी' : 'Match for Your Profile'}</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            {t(`elig_${eligibilityMatch.status}`)}
          </span>
        </div>

        <p className="text-[11px] text-emerald-950/90 leading-relaxed">
          {t(`elig_${eligibilityMatch.status}_tip`)}
        </p>

        {/* Condition Checkmarks */}
        <div className="space-y-1 pt-1 border-t border-emerald-200/80 text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-900">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {lang === 'mr'
                ? `जिल्हा: ${profile?.district ? 'जुळला' : 'सर्व जिल्हे'}`
                : `District: ${profile?.district ? 'Matched' : 'State-wide'}`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-900">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {lang === 'mr'
                ? `शेती क्षेत्र: ${profile?.land_area || '१.५'} ${t(`land_unit_${profile?.land_unit || 'hectare'}`)}`
                : `Landholding: ${profile?.land_area || '1.5'} ${t(`land_unit_${profile?.land_unit || 'hectare'}`)}`}
            </span>
          </div>
          {eligibilityMatch.needsFarmerId && (
            <div className="flex items-center gap-1.5 text-amber-900 font-semibold pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{lang === 'mr' ? 'महाडीबीटी शेतकरी आयडी देणे आवश्यक आहे.' : 'MahaDBT Farmer ID is needed for application.'}</span>
            </div>
          )}
        </div>
      </section>

      {/* ── CONDITIONAL DOCUMENT GUIDANCE (MahaDBT Rule) ── */}
      <section className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200/90 space-y-3">
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('doc_hint_title')}</span>
          </h3>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            {t('doc_hint_body')}
          </p>
        </div>

        <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden text-xs">
          {/* Document 1: Farmer ID */}
          <div className="p-2.5 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <FileBadge className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium text-stone-800">{t('farmer_id_label')}</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              profile?.farmer_id
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {profile?.farmer_id ? t('doc_status_provided') : t('doc_status_needed')}
            </span>
          </div>

          {/* Document 2: 7/12 Extract */}
          <div className="p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-stone-500 shrink-0" />
              <span className="font-medium text-stone-800">{t('doc_712')}</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
              {t('doc_status_needed')}
            </span>
          </div>

          {/* Document 3: 8-A Extract */}
          <div className="p-2.5 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-stone-500 shrink-0" />
              <span className="font-medium text-stone-800">{t('doc_8a')}</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
              {t('doc_status_needed')}
            </span>
          </div>

          {/* Document 4: Water / Electricity Proof if applicable */}
          {scheme.category_en === 'Micro-irrigation assistance' && (
            <div className="p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-stone-500 shrink-0" />
                <span className="font-medium text-stone-800">{t('doc_electricity')}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                {t('doc_status_needed')}
              </span>
            </div>
          )}
        </div>
      </section>

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
            <ExternalLink className="w-3 h-3" />
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
