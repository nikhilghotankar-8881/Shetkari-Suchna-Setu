import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileCheck, CheckSquare, Square } from "lucide-react";
import { DocumentRequirement } from "../../types/notice";
import { getLocalizedText } from "../../utils/localized";

interface DocumentChecklistProps {
  documents: DocumentRequirement[];
  noticeId: string;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  documents,
  noticeId,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "mr";

  const storageKey = `docs_checked_${noticeId}`;
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleCheck = (id: string) => {
    const next = checkedIds.includes(id)
      ? checkedIds.filter((item) => item !== id)
      : [...checkedIds, id];
    setCheckedIds(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  if (!documents || documents.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-5 md:p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h4 className="font-bold text-stone-900 text-sm md:text-base flex items-center gap-2">
          <FileCheck size={18} className="text-emerald-700" />
          <span>{t("notice.documents")}</span>
        </h4>
        <span className="text-xs text-stone-500 font-medium bg-stone-100 px-2.5 py-1 rounded-full">
          {t("notice.docCountReady", { ready: checkedIds.length, total: documents.length })}
        </span>
      </div>

      <div className="space-y-2">
        {documents.map((doc) => {
          const isChecked = checkedIds.includes(doc.id);
          const docName = getLocalizedText(doc, "name", lang, doc.name);

          return (
            <div
              key={doc.id}
              onClick={() => toggleCheck(doc.id)}
              className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                isChecked
                  ? "bg-emerald-50/60 border-emerald-300 text-emerald-950"
                  : "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800"
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-emerald-700 shrink-0 focus:outline-hidden"
                aria-label={docName}
              >
                {isChecked ? (
                  <CheckSquare size={18} className="text-emerald-700" />
                ) : (
                  <Square size={18} className="text-stone-400" />
                )}
              </button>
              <div className="flex-1 text-xs md:text-sm">
                <span className={isChecked ? "line-through text-stone-500 font-normal" : "font-semibold"}>
                  {docName}
                </span>
                {doc.isMandatory && (
                  <span className="ml-2 text-[10px] text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md font-bold">
                    {t("notice.mandatoryBadge", "Mandatory")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-stone-400 mt-3 leading-relaxed">
        {t("notice.docChecklistNote")}
      </p>
    </div>
  );
};
