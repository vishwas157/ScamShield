import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { ReportPage } from './pages/ReportPage';
import { DatabasePage } from './pages/DatabasePage';
import { SafetyPage } from './pages/SafetyPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminMLPage } from './pages/AdminMLPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-[#070d17] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/database" element={<DatabasePage />} />
              <Route path="/safety" element={<SafetyPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/my-reports" element={<MyReportsPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/ml" element={<AdminMLPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
