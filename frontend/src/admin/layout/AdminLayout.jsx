import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../auth/AdminAuthContext';
import { Database, FileCheck2, ShieldAlert, BarChart3, LogOut, ArrowLeft, ShieldCheck } from 'lucide-react';

export const AdminLayout = () => {
  const { adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { to: '/admin/sources', label: 'Sources & Health', icon: Database },
    { to: '/admin/review', label: 'Review Queue', icon: FileCheck2 },
    { to: '/admin/audit', label: 'Audit Log', icon: ShieldAlert },
    { to: '/admin/metrics', label: 'Metrics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar for Desktop / Top Bar for Mobile */}
      <aside className="w-full md:w-64 bg-stone-950 border-b md:border-b-0 md:border-r border-stone-800 p-4 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand & Role */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                <span className="text-emerald-500 font-mono text-sm">SETU//</span>
                <span>Admin Console</span>
              </h1>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Shetkari Suchna Setu
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
              {adminUser?.role || 'reviewer'}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `
                  flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0
                  ${isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'}
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Info & Logout */}
        <div className="pt-4 border-t border-stone-800 mt-4 md:mt-0 flex items-center justify-between">
          <div className="truncate pr-2">
            <span className="text-[10px] text-stone-500 block">Logged in as</span>
            <span className="text-xs font-mono text-stone-300 truncate block">
              {adminUser?.email || 'admin@shetkari.gov.in'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-rose-400 hover:text-rose-300 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-stone-900">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
