import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

export const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, role } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // RBAC checks: admin > reviewer > viewer
  if (requiredRole === 'admin' && role !== 'admin') {
    return (
      <div className="p-8 text-center text-rose-700 bg-rose-50 rounded-xl m-6 border border-rose-200">
        <h2 className="text-xl font-bold">403 Access Denied</h2>
        <p className="mt-2 text-sm text-stone-600">
          Administrator privileges required for this action.
        </p>
      </div>
    );
  }

  if (requiredRole === 'reviewer' && role !== 'reviewer' && role !== 'admin') {
    return (
      <div className="p-8 text-center text-rose-700 bg-rose-50 rounded-xl m-6 border border-rose-200">
        <h2 className="text-xl font-bold">403 Access Denied</h2>
        <p className="mt-2 text-sm text-stone-600">
          Reviewer privileges required.
        </p>
      </div>
    );
  }

  return <Outlet />;
};

