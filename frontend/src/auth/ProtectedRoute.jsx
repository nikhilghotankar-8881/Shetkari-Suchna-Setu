import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

export const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, role, adminUser, logout } = useAdminAuth();

  // Check if session has expired
  if (!isAuthenticated || (adminUser?.expiresAt && Date.now() >= adminUser.expiresAt)) {
    if (adminUser) logout();
    return <Navigate to="/admin/login" replace />;
  }

  // RBAC checks: admin > reviewer > viewer
  if (requiredRole === 'admin' && role !== 'admin') {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-200 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-stone-900 border border-rose-900/60 rounded-2xl p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto text-lg font-bold">
            403
          </div>
          <h2 className="text-lg font-bold text-white">Access Denied</h2>
          <p className="text-xs text-stone-400">
            Administrator privileges required for this section. Your current role is <span className="font-mono text-amber-400 uppercase">{role}</span>.
          </p>
        </div>
      </div>
    );
  }

  if (requiredRole === 'reviewer' && role !== 'reviewer' && role !== 'admin') {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-200 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-stone-900 border border-rose-900/60 rounded-2xl p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto text-lg font-bold">
            403
          </div>
          <h2 className="text-lg font-bold text-white">Access Denied</h2>
          <p className="text-xs text-stone-400">
            Reviewer privileges required.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

