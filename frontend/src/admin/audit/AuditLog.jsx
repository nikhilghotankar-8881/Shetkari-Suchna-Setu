import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useAdminAuth } from '../../auth/AdminAuthContext';
import { ShieldAlert, RefreshCw, Clock, UserCheck } from 'lucide-react';

export const AuditLog = () => {
  const { adminUser } = useAdminAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await api.getAuditLog(adminUser?.jwt);
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <span>Tamper-Evident Audit Log</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Immutable append-only record of all reviewer decisions and alert publications
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-900/80 text-stone-400 uppercase font-mono text-[10px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target / Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-850 text-stone-300">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-stone-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-stone-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded text-[11px] border border-emerald-900">
                      {log.actor}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 text-stone-400">
                    {log.target}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

