import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useAdminAuth } from '../../auth/AdminAuthContext';
import { FileCheck, Check, X, ShieldAlert, FileText, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';

export const ReviewQueue = () => {
  const { adminUser } = useAdminAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const fetchQueue = async () => {
    setLoading(true);
    const data = await api.getReviewQueue(adminUser?.jwt);
    setQueue(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleApprove = async (id) => {
    await api.approveExtraction(id, adminUser?.jwt);
    setActionMsg(`Extraction #${id} successfully approved & verified! Farmer cards updated.`);
    setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'Verified' } : item));
    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleReject = async (id) => {
    setActionMsg(`Extraction #${id} marked as Rejected.`);
    setQueue(prev => prev.filter(item => item.id !== id));
    setTimeout(() => setActionMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-stone-800">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <FileCheck className="w-5 h-5 text-emerald-400" />
          <span>Extraction Verification Queue</span>
        </h2>
        <p className="text-xs text-stone-400 mt-1">
          Human verification gate: Machine proposes → Reviewer verifies evidence span → Farmer sees verified deadline
        </p>
      </div>

      {actionMsg && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-700 rounded-xl text-xs text-emerald-200 font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Queue Items */}
      {queue.length === 0 ? (
        <div className="p-12 text-center bg-stone-950 border border-stone-800 rounded-2xl text-stone-500 text-xs">
          No pending extraction items in the review queue.
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map(item => {
            const isVerified = item.status === 'Verified';

            return (
              <div
                key={item.id}
                className="bg-stone-950 border border-stone-800 rounded-2xl p-5 shadow-xl space-y-4"
              >
                {/* Header bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-850">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 uppercase font-bold">
                      {item.priority} Priority
                    </span>
                    <span className="text-xs font-bold text-white">
                      {item.notice_title}
                    </span>
                  </div>

                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    isVerified
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* Side-by-Side: Evidence Span vs Extracted Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Left: Original Evidence Span */}
                  <div className="bg-stone-900/90 rounded-xl p-3.5 border border-stone-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-stone-400 font-bold text-[11px] uppercase tracking-wider">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Source Text Snippet (Evidence Span)</span>
                    </div>
                    <blockquote className="p-2.5 bg-stone-950/80 rounded-lg text-stone-300 font-serif italic border-l-2 border-emerald-500 text-xs leading-relaxed">
                      "{item.evidence_span}"
                    </blockquote>
                    <div className="text-[10px] text-stone-500">
                      Source: {item.source_name}
                    </div>
                  </div>

                  {/* Right: Extracted Structured JSON */}
                  <div className="bg-stone-900/90 rounded-xl p-3.5 border border-stone-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-stone-400 font-bold text-[11px] uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>AI Extracted Fields</span>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div>
                        <span className="text-stone-500">Name:</span>{' '}
                        <span className="font-semibold text-white">{item.extracted_fields.name}</span>
                      </div>
                      <div>
                        <span className="text-stone-500">Department:</span>{' '}
                        <span className="text-stone-300">{item.extracted_fields.department}</span>
                      </div>
                      <div>
                        <span className="text-stone-500">Benefits:</span>{' '}
                        <span className="text-stone-300">{item.extracted_fields.benefits}</span>
                      </div>
                      <div className="p-1.5 bg-stone-950 rounded border border-stone-800">
                        <span className="text-amber-400 font-bold">Extracted Deadline:</span>{' '}
                        <span className="font-mono text-white font-bold">{item.extracted_fields.deadline}</span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          (Will only be shown to farmers if you click Approve)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviewer Actions */}
                {!isVerified ? (
                  <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-stone-850">
                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-rose-400 border border-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors touch-target"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors touch-target"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Verify (Publish to Farmers)</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-right text-xs text-emerald-400 font-semibold pt-2">
                    ✓ Approved & live in Farmer Dashboard
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
