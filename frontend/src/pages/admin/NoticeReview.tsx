import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, CheckCircle2, AlertTriangle, FileText, Check, ShieldAlert } from "lucide-react";
import { useNotice } from "../../hooks/useNotices";
import { useVerifyNotice, useMarkConflicting } from "../../hooks/useAdmin";
import { LoadingState } from "../../components/ui/LoadingState";
import { Button } from "../../components/ui/Button";
import { getLocalizedText } from "../../utils/localized";

export const NoticeReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "mr";
  const navigate = useNavigate();

  const { data: notice, isLoading } = useNotice(id || "");
  const verifyMutation = useVerifyNotice();
  const conflictMutation = useMarkConflicting();

  const [closingDate, setClosingDate] = useState("2026-11-25");
  const [isDeadlineVerified, setIsDeadlineVerified] = useState(true);
  const [reviewerNotes, setReviewerNotes] = useState(
    lang.startsWith("mr")
      ? "अधिकृत राजपत्रातील शासन निर्णयावरून तारखा व पात्रतेची खात्री केली."
      : lang.startsWith("hi")
      ? "आधिकारिक राजपत्र परिपत्रक से अंतिम तिथि और पात्रता की पुष्टि की गई।"
      : "Official Gazette circular verified by reviewer."
  );

  if (isLoading || !notice) return <LoadingState message={t("common.loading")} />;

  const title = getLocalizedText(notice, "title", lang, notice.title);
  const sourceName = getLocalizedText(notice, "sourceName", lang, notice.sourceName);

  const handleVerify = async () => {
    await verifyMutation.mutateAsync({
      noticeId: notice.id,
      updatedFields: {
        applicationClosingDate: `${closingDate}T23:59:59+05:30`,
        isDeadlineVerified: isDeadlineVerified,
      },
    });
    alert(t("admin.verifySuccess"));
    navigate("/admin");
  };

  const handleConflict = async () => {
    await conflictMutation.mutateAsync({
      noticeId: notice.id,
      reason: "Contradiction in guidelines regarding eligibility.",
    });
    alert(t("admin.markConflictSuccess"));
    navigate("/admin");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 mb-2 font-semibold">
          <ArrowLeft size={14} /> <span>{t("admin.returnToDashboard")}</span>
        </Link>
        <h1 className="text-xl md:text-2xl font-extrabold text-stone-900 tracking-tight">
          {t("admin.title")}
        </h1>
        <p className="text-xs md:text-sm text-stone-500 mt-0.5">
          {t("admin.subtitle")}
        </p>
      </div>

      {/* Side-by-Side Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Original Raw Circular */}
        <div className="bg-stone-100 rounded-3xl border border-stone-300 p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
            <FileText size={18} className="text-stone-600" />
            <span>{t("admin.rawNotice")}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-xs font-mono text-stone-700 leading-relaxed max-h-[460px] overflow-y-auto space-y-2">
            <p className="font-bold text-stone-900">{t("app.officialCell")}</p>
            <p>GR Ref: 2026/CR-08/AGRI-PMFBY</p>
            <p>Subject: Extension of Enrolment Deadlines for Kharif 2026 Notified Crops...</p>
            <hr className="border-stone-200" />
            <p>
              All eligible cultivating farmers in notified revenue circles are hereby notified that the final enrolment date has been revised to 25 November 2026.
            </p>
            <p>
              Eligibility: Valid 7/12 land extract noting notified crops or certified tenant sowing declaration.
            </p>
            <p>
              Mandatory Documents: Current 7/12 extract, 8-A holding summary, Aadhaar-linked active bank account passbook.
            </p>
            <p className="text-stone-400 text-[10px] pt-2">
              {t("admin.sourceName", { name: sourceName })} • URL: {notice.sourceUrl} • Verified: {notice.lastCheckedAt}
            </p>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5 font-medium">
            <AlertTriangle size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <span>{t("admin.aiWarning")}</span>
          </div>
        </div>

        {/* Right: Extracted Fields Editor */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 md:p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
            <CheckCircle2 size={18} className="text-emerald-700" />
            <span>{t("admin.extractedFields")}</span>
          </div>

          <div className="space-y-4 text-xs md:text-sm">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                {t("notice.category")}: {t(`notice.${notice.category}`)}
              </label>
              <input
                type="text"
                disabled
                value={title}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 font-medium"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                {t("admin.closingDateLabel")} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-emerald-400 rounded-xl font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isDeadlineVerified}
                onChange={(e) => setIsDeadlineVerified(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-emerald-800 rounded focus:ring-emerald-600"
              />
              <span className="font-semibold text-stone-800 text-xs select-none">
                {t("admin.deadlineVerificationCheck")}
              </span>
            </label>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                {t("admin.officerNotes")}
              </label>
              <textarea
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                rows={3}
                placeholder={t("admin.officerNotesPlaceholder")}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 font-medium focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleVerify}
              disabled={verifyMutation.isPending}
              className="bg-emerald-800 hover:bg-emerald-900 font-bold"
            >
              <Check size={16} className="mr-1.5" />
              <span>{t("admin.verifyAndPublish")}</span>
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={handleConflict}
              className="border-red-300 text-red-800 hover:bg-red-50 font-bold shrink-0"
            >
              <ShieldAlert size={16} className="mr-1.5" />
              <span>{t("admin.markConflicting")}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
