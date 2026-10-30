import { useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { CheckCircle2, HelpCircle, FileText, AlertOctagon, Info } from 'lucide-react';

export const EligibilityBadge = ({ status = 'green', showTooltip = true }) => {
  const { t } = useTranslation();
  const [openTip, setOpenTip] = useState(false);

  const configs = {
    green: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      dot: 'bg-emerald-500',
      icon: CheckCircle2,
      labelKey: 'elig_green',
      tipKey: 'elig_green_tip'
    },
    yellow: {
      bg: 'bg-amber-50 border-amber-300 text-amber-900',
      dot: 'bg-amber-500',
      icon: HelpCircle,
      labelKey: 'elig_yellow',
      tipKey: 'elig_yellow_tip'
    },
    blue: {
      bg: 'bg-sky-50 border-sky-300 text-sky-900',
      dot: 'bg-sky-500',
      icon: FileText,
      labelKey: 'elig_blue',
      tipKey: 'elig_blue_tip'
    },
    grey: {
      bg: 'bg-stone-100 border-stone-300 text-stone-600',
      dot: 'bg-stone-400',
      icon: AlertOctagon,
      labelKey: 'elig_grey',
      tipKey: 'elig_grey_tip'
    }
  };

  const config = configs[status] || configs.green;
  const Icon = config.icon;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpenTip(!openTip);
        }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${config.bg} hover:shadow-xs`}
        title={t(config.tipKey)}
      >
        <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
        <span>{t(config.labelKey)}</span>
        <Info className="w-3 h-3 opacity-60 ml-0.5" />
      </button>

      {/* Interactive Tooltip Card */}
      {openTip && showTooltip && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 top-full mt-1.5 z-40 w-64 p-2.5 bg-stone-900 text-white rounded-xl shadow-xl text-[11px] leading-relaxed border border-stone-700 space-y-1.5"
        >
          <div className="flex items-center justify-between font-bold text-amber-300 text-[10px] uppercase tracking-wider">
            <span>{t(config.labelKey)}</span>
            <button
              onClick={() => setOpenTip(false)}
              className="text-stone-400 hover:text-white px-1"
            >
              ✕
            </button>
          </div>
          <p className="text-stone-200">
            {t(config.tipKey)}
          </p>
          <p className="text-[10px] text-stone-400 italic pt-1 border-t border-stone-800">
            {t('not_eligible_notice')}
          </p>
        </div>
      )}
    </div>
  );
};
