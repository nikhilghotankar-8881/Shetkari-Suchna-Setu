import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FarmerLayout } from './farmer/layout/FarmerLayout';
import { SchemesScreen } from './farmer/schemes/SchemesScreen';
import { UpdatesScreen } from './farmer/updates/UpdatesScreen';
import { InsuranceScreen } from './farmer/insurance/InsuranceScreen';
import { AlertsScreen } from './farmer/alerts/AlertsScreen';
import { ProfileScreen } from './farmer/profile/ProfileScreen';
import { OnboardingFlow } from './farmer/onboarding/OnboardingFlow';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { useFarmerToken } from './auth/FarmerTokenContext';

// Admin bundle is strictly lazy-loaded to keep farmer page weight light
const AdminLayout = lazy(() => import('./admin/layout/AdminLayout').then(m => ({ default: m.AdminLayout })));
const LoginPage = lazy(() => import('./admin/login/LoginPage').then(m => ({ default: m.LoginPage })));
const SourcesTable = lazy(() => import('./admin/sources/SourcesTable').then(m => ({ default: m.SourcesTable })));
const ReviewQueue = lazy(() => import('./admin/review/ReviewQueue').then(m => ({ default: m.ReviewQueue })));
const AuditLog = lazy(() => import('./admin/audit/AuditLog').then(m => ({ default: m.AuditLog })));
const MetricsPanel = lazy(() => import('./admin/metrics/MetricsPanel').then(m => ({ default: m.MetricsPanel })));

const AdminLoadingFallback = () => (
  <div className="min-h-screen bg-stone-950 flex items-center justify-center text-emerald-400 text-xs font-mono">
    Loading Admin Console...
  </div>
);

export default function App() {
  const { hasProfile } = useFarmerToken();

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={hasProfile ? <Navigate to="/schemes" replace /> : <Navigate to="/onboarding" replace />}
      />

      {/* Onboarding Wizard */}
      <Route path="/onboarding" element={<OnboardingFlow />} />

      {/* Farmer Dashboard Routes */}
      <Route element={<FarmerLayout />}>
        <Route path="/schemes" element={<SchemesScreen />} />
        <Route path="/updates" element={<UpdatesScreen />} />
        <Route path="/insurance" element={<InsuranceScreen />} />
        <Route path="/alerts" element={<AlertsScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>

      {/* Admin Public Login */}
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminLoadingFallback />}>
            <LoginPage />
          </Suspense>
        }
      />

      {/* Admin Protected Dashboard Routes */}
      <Route
        path="/admin"
        element={
          <Suspense fallback={<AdminLoadingFallback />}>
            <ProtectedRoute requiredRole="viewer" />
          </Suspense>
        }
      >
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/review" replace />} />
          <Route path="sources" element={<SourcesTable />} />
          <Route path="review" element={<ReviewQueue />} />
          <Route path="audit" element={<AuditLog />} />
          <Route path="metrics" element={<MetricsPanel />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
