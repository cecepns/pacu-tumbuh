import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ScreeningProvider } from "@/context/ScreeningContext";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import ScrollToTop from "@/components/layout/ScrollToTop";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

// 8 Main Public Pages
import HomePage from "@/pages/HomePage";
import TentangPage from "@/pages/TentangPage";
import ProfilRiwayatPage from "@/pages/ProfilRiwayatPage";
import SkriningKomunikasiPage from "@/pages/SkriningKomunikasiPage";
import SkriningMotorikPage from "@/pages/SkriningMotorikPage";
import SkriningGiziPage from "@/pages/SkriningGiziPage";
import EvaluasiPage from "@/pages/EvaluasiPage";
import KontakPage from "@/pages/KontakPage";

// Admin Pages
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminProfilesPage from "@/pages/admin/AdminProfilesPage";
import AdminScreeningPage from "@/pages/admin/AdminScreeningPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";

export default function App() {
  return (
    <AuthProvider>
      <ScreeningProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* 8 Public Menu Routes */}
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="tentang" element={<TentangPage />} />
              <Route path="profil-riwayat" element={<ProfilRiwayatPage />} />
              <Route path="skrining-komunikasi" element={<SkriningKomunikasiPage />} />
              <Route path="skrining-motorik" element={<SkriningMotorikPage />} />
              <Route path="skrining-gizi" element={<SkriningGiziPage />} />
              <Route path="evaluasi" element={<EvaluasiPage />} />
              <Route path="kontak" element={<KontakPage />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="profil-anak" element={<AdminProfilesPage />} />
                <Route path="hasil-skrining" element={<AdminScreeningPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>
            </Route>

            {/* Catch-all Fallback */}
            <Route path="admin/*" element={<Navigate to="/admin/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: "16px",
              background: "#0f172a",
              color: "#f8fafc",
              fontSize: "13px",
              fontWeight: "600",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
            },
          }}
        />
      </ScreeningProvider>
    </AuthProvider>
  );
}
