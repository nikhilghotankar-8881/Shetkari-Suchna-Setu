export type VerificationStatus =
  | "verified"
  | "pending_review"
  | "conflicting"
  | "expired"
  | "superseded";

export interface StatusConfig {
  labelKey: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  iconName: string;
}

export const STATUS_CONFIGS: Record<VerificationStatus, StatusConfig> = {
  verified: {
    labelKey: "status.verified",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    borderClass: "border-emerald-200",
    iconName: "BadgeCheck",
  },
  pending_review: {
    labelKey: "status.pending_review",
    bgClass: "bg-amber-50",
    textClass: "text-amber-800",
    borderClass: "border-amber-300",
    iconName: "Clock",
  },
  conflicting: {
    labelKey: "status.conflicting",
    bgClass: "bg-red-50",
    textClass: "text-red-700",
    borderClass: "border-red-200",
    iconName: "AlertTriangle",
  },
  expired: {
    labelKey: "status.expired",
    bgClass: "bg-stone-100",
    textClass: "text-stone-600",
    borderClass: "border-stone-200",
    iconName: "CalendarX",
  },
  superseded: {
    labelKey: "status.superseded",
    bgClass: "bg-sky-50",
    textClass: "text-sky-700",
    borderClass: "border-sky-200",
    iconName: "Replace",
  },
};

