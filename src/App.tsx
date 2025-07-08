import {
  BrowserRouter as Router,
  Routes,
  Route,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './features/auth/context/AuthContext';
import queryClient from './lib/queryClient';
import './lib/i18n'; // Initialize i18n

// Layouts
import PublicLayout from './layouts/PublicLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import RegisterPage from './features/auth/pages/RegisterPage';
import LoginPage from './features/auth/pages/LoginPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';

// Public Pages
import HomePage from './pages/HomePage';
import CampaignsPage from './pages/CampaignsPage';
import EventsPage from './pages/EventsPage';
import PostsPage from './pages/PostsPage';

// User Pages
import DashboardPage from './pages/user/DashboardPage';
import ProfilePage from './pages/user/ProfilePage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Component to handle legacy reset password URLs with query parameters
const ResetPasswordRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      navigate(`/reset-password/${token}`, { replace: true });
    } else {
      navigate('/forgot-password', { replace: true });
    }
  }, [searchParams, navigate]);

  return <div>Redirecting...</div>;
};

const UnauthorizedPage = () => (
  <PublicLayout>
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h1>
      <p className="text-gray-600">You don't have permission to access this page.</p>
    </div>
  </PublicLayout>
);

const NotFoundPage = () => (
  <PublicLayout>
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p className="text-gray-600">The page you're looking for doesn't exist.</p>
    </div>
  </PublicLayout>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes - No authentication required */}
            <Route path="/" element={<HomePage />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/posts" element={<PostsPage />} />

            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordRedirect />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected routes - Authentication required */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Admin routes - Admin role required */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>

      {/* React Query DevTools (only in development) */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
