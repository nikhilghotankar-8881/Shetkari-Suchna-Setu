import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Home } from "./pages/Home";
import { FarmerDashboard } from "./pages/FarmerDashboard";
import { FarmerPreferences } from "./pages/FarmerPreferences";
import { SchemeNotices } from "./pages/SchemeNotices";
import { NoticeDetails } from "./pages/NoticeDetails";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { NoticeReview } from "./pages/admin/NoticeReview";
import { SourceHealth } from "./pages/admin/SourceHealth";
import { ImpactDashboard } from "./pages/admin/ImpactDashboard";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        {/* Farmer & Public Routes */}
        <Route index element={<Home />} />
        <Route path="farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="farmer/preferences" element={<FarmerPreferences />} />
        <Route path="notices" element={<SchemeNotices />} />
        <Route path="notices/:id" element={<NoticeDetails />} />

        {/* Admin Routes */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/notices/:id/review" element={<NoticeReview />} />
        <Route path="admin/sources" element={<SourceHealth />} />
        <Route path="admin/impact" element={<ImpactDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
