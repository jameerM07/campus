import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import ExploreStaysPage from './pages/ExploreStaysPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterStudentPage from './pages/RegisterStudentPage';
import RegisterOwnerPage from './pages/RegisterOwnerPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
          <Navbar />
          <div className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExploreStaysPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register/student" element={<RegisterStudentPage />} />
              <Route path="/register/owner" element={<RegisterOwnerPage />} />

              {/* Protected Student Dashboard */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <StudentDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Owner Dashboard */}
              <Route
                path="/owner/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['OWNER']}>
                    <OwnerDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Dashboard */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect to Home */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

