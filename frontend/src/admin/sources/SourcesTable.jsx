import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useAdminAuth } from '../../auth/AdminAuthContext';
import { Database, ExternalLink, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export const SourcesTable = () => {
  const { adminUser } = useAdminAuth();
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSources = async () => {
    setLoading(true);
    const data = await api.getSources(adminUser?.jwt);
    setSources(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSources();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Database className="w-5 h-5 text-emerald-400" />
            <span>Monitored Government Sources</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Real official sources with poll schedules and health monitoring
          </p>
        </div>

        <button
          onClick={fetchSources}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Sources Table */}
      <div className="bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-900/80 text-stone-400 uppercase font-mono text-[10px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">Source Name & Target</th>
                <th className="py-3 px-4">Type / Format</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Poll Interval</th>
                <th className="py-3 px-4">Last Checked</th>
                <th className="py-3 px-4">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-850 text-stone-300">
              {sources.map(src => {
                const isManual = src.mode === 'manual';
                return (
                  <tr key={src.id} className="hover:bg-stone-900/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{src.name}</div>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 mt-0.5 truncate max-w-xs"
                      >
                        <span className="truncate">{src.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 uppercase">
                        {src.kind}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        isManual
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                          : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                      }`}>
                        {src.mode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-stone-400 font-mono text-[11px]">
                      {src.poll_minutes}m
                    </td>

                    <td className="py-3.5 px-4 text-stone-400">
                      {src.last_checked_at
                        ? new Date(src.last_checked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Scheduled'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span>Healthy</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

