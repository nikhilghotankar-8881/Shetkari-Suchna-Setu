import { useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';

export const EligibilityBadge = ({ status = 'green', showTooltip = true }) => {
  const { t } = useTranslation();
  const [openTip, setOpenTip] = useState(false);

  const configs = {
    green: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      dot: 'bg-emerald-600',
      labelKey: 'elig_green',
      tipKey: 'elig_green_tip'
    },
    yellow: {
      bg: 'bg-amber-50 border-amber-300 text-amber-900',
      dot: 'bg-amber-500',
      labelKey: 'elig_yellow',
      tipKey: 'elig_yellow_tip'
    },
    blue: {
      bg: 'bg-sky-50 border-sky-300 text-sky-900',
      dot: 'bg-sky-600',
      labelKey: 'elig_blue',
      tipKey: 'elig_blue_tip'
    },
    grey: {
      bg: 'bg-stone-100 border-stone-300 text-stone-600',
      dot: 'bg-stone-400',
      labelKey: 'elig_grey',
      tipKey: 'elig_grey_tip'
    }
  };

  const config = configs[status] || configs.green;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (showTooltip) setOpenTip(!openTip);
        }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${config.bg} active:scale-95`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span>{t(config.labelKey)}</span>
      </button>

      {/* Lightweight, farmer-friendly tooltip */}
      {openTip && showTooltip && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 top-full mt-1.5 z-40 w-60 p-2.5 bg-stone-900 text-white rounded-xl shadow-xl text-[11px] leading-relaxed border border-stone-700 space-y-1"
        >
          <div className="flex items-center justify-between font-bold text-amber-300 text-[10px] uppercase">
            <span>{t(config.labelKey)}</span>
            <button
              onClick={() => setOpenTip(false)}
              className="text-stone-400 hover:text-white px-1 text-xs"
            >
              ✕
            </button>
          </div>
          <p className="text-stone-200">
            {t(config.tipKey)}
          </p>
        </div>
      )}
    </div>
  );
};
