import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FarmerLayout } from './farmer/layout/FarmerLayout';
import { FarmerDashboard } from './farmer/dashboard/FarmerDashboard';
import { ExploreSchemesScreen } from './farmer/schemes/ExploreSchemesScreen';
import { SchemeDetailScreen } from './farmer/schemes/SchemeDetailScreen';
import { UpdatesScreen } from './farmer/updates/UpdatesScreen';
import { ChangeComparisonScreen } from './farmer/updates/ChangeComparisonScreen';
import { InsuranceScreen } from './farmer/insurance/InsuranceScreen';
import { AlertsScreen } from './farmer/alerts/AlertsScreen';
import { ProfileScreen } from './farmer/profile/ProfileScreen';
import { OnboardingFlow } from './farmer/onboarding/OnboardingFlow';
import { WelcomeScreen } from './farmer/welcome/WelcomeScreen';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { useFarmerToken } from './auth/FarmerTokenContext';

// Admin bundle is strictly lazy-loaded to keep farmer bundle lightweight
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
      {/* Root entry point */}
      <Route
        path="/"
        element={hasProfile ? <Navigate to="/dashboard" replace /> : <Navigate to="/welcome" replace />}
      />

      {/* Welcome Screen (Language & Introduction) */}
      <Route path="/welcome" element={<WelcomeScreen />} />

      {/* Onboarding Wizard (4 Steps) */}
      <Route path="/onboarding" element={<OnboardingFlow />} />

      {/* Farmer Interface Routes (User Journey) */}
      <Route element={<FarmerLayout />}>
        {/* A. Farmer Dashboard */}
        <Route path="/dashboard" element={<FarmerDashboard />} />

        {/* B. Explore Schemes */}
        <Route path="/schemes" element={<ExploreSchemesScreen />} />

        {/* C. Scheme Details */}
        <Route path="/schemes/:id" element={<SchemeDetailScreen />} />

        {/* D. Alerts and Updates Feed */}
        <Route path="/updates" element={<UpdatesScreen />} />

        {/* E. Notice Change-Comparison Details */}
        <Route path="/updates/:id" element={<ChangeComparisonScreen />} />

        {/* Supporting Pages */}
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
