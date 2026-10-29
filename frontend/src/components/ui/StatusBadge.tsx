import React from "react";
import { useTranslation } from "react-i18next";
import { BadgeCheck, Clock, AlertTriangle, CalendarX, Replace } from "lucide-react";
import { STATUS_CONFIGS, VerificationStatus } from "../../utils/status";

interface StatusBadgeProps {
  status: VerificationStatus;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "md" }) => {
  const { t } = useTranslation();
  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.pending_review;

  const renderIcon = () => {
    const iconSize = size === "sm" ? 14 : 16;
    switch (config.iconName) {
      case "BadgeCheck":
        return <BadgeCheck size={iconSize} className="shrink-0 text-emerald-600" />;
      case "Clock":
        return <Clock size={iconSize} className="shrink-0 text-amber-600" />;
      case "AlertTriangle":
        return <AlertTriangle size={iconSize} className="shrink-0 text-red-600" />;
      case "CalendarX":
        return <CalendarX size={iconSize} className="shrink-0 text-stone-500" />;
      case "Replace":
        return <Replace size={iconSize} className="shrink-0 text-sky-600" />;
      default:
        return null;
    }
  };

  const padClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs md:text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bgClass} ${config.textClass} ${config.borderClass} ${padClass}`}
    >
      {renderIcon()}
      <span>{t(config.labelKey)}</span>
    </span>
  );
};

