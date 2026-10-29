import React from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Inbox, AlertTriangle } from "lucide-react";
import { Button } from "./Button";

export const LoadingState: React.FC<{ message?: string }> = ({ message }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[220px] text-stone-500">
      <Loader2 className="animate-spin text-emerald-700 mb-3" size={32} />
      <p className="text-sm font-medium">{message || t("common.loading")}</p>
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ title, description, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-stone-50 rounded-3xl border border-dashed border-stone-300 min-h-[240px]">
      <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 flex items-center justify-center text-emerald-800 mb-3">
        <Inbox size={24} />
      </div>
      <h3 className="text-base font-bold text-stone-900 mb-1">{title}</h3>
      <p className="text-xs md:text-sm text-stone-500 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button size="sm" variant="outline" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export const ErrorMessage: React.FC<{
  message?: string;
  onRetry?: () => void;
}> = ({ message, onRetry }) => {
  const { t } = useTranslation();
  return (
    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={18} />
        <div>
          <h4 className="text-sm font-bold">{t("common.errorTitle")}</h4>
          <p className="text-xs text-red-700 leading-relaxed mt-0.5">
            {message || t("common.networkError")}
          </p>
        </div>
      </div>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          className="border-red-300 text-red-800 hover:bg-red-100 shrink-0"
          onClick={onRetry}
        >
          {t("common.retry")}
        </Button>
      )}
    </div>
  );
};
