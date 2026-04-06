// frontend/src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// ─── Public pages ─────────────────────────────────────────────────────────────
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// ─── Private pages ────────────────────────────────────────────────────────────
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportBuilder from './pages/ReportBuilder';
import EvidenceLibraryPage from './pages/EvidenceLibraryPage';
import SettingsPage from './pages/SettingsPage';

/**
 * PrivateRoute --- protects authenticated pages.
 * - Redirects to /login if not authenticated.
 * - Redirects to / if authenticated but wrong role.
 * - allowedRoles is optional: omit it to allow all authenticated users.
 */
function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ padding: '60px', textAlign: 'center', color: '#4B2E83' }}>
      Loading...
    </div>
  );

  if (!user) return <Navigate to='/login' replace />;

  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to='/' state={{ accessDenied: true }} replace />;

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ─── PUBLIC ROUTES (no login required) ──────────────────────── */}
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<SignUpPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/reset-password/:uid/:token' element={<ResetPasswordPage />} />

          {/* ─── PRIVATE ROUTES (all authenticated users) ───────────────── */}
          <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path='/evidence' element={<PrivateRoute><EvidenceLibraryPage /></PrivateRoute>} />
          <Route path='/settings' element={<PrivateRoute><SettingsPage /></PrivateRoute>} />

          {/* ─── PRIVATE ROUTES (role-restricted) ───────────────────────── */}
          <Route path='/upload'
            element={
              <PrivateRoute allowedRoles={['Admin', 'ME Officer']}>
                <UploadPage />
              </PrivateRoute>
            }
          />
          <Route path='/analytics'
            element={
              <PrivateRoute allowedRoles={['Admin', 'ME Officer', 'Program Manager']}>
                <AnalyticsPage />
              </PrivateRoute>
            }
          />
          <Route path='/report-builder'
            element={
              <PrivateRoute allowedRoles={['Admin', 'ME Officer']}>
                <ReportBuilder />
              </PrivateRoute>
            }
          />

          {/* ─── CATCH-ALL ───────────────────────────────────────────────── */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}