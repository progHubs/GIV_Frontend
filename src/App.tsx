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
import { ThemeProvider } from './theme';
import queryClient from './lib/queryClient';
import './lib/i18n'; // Initialize i18n

// Components
import ProtectedRoute from './components/ProtectedRoute';
import RouteChangeLoader from './components/common/RouteChangeLoader';

// Auth Pages
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';

// Public Pages
import HomePage from './pages/HomePage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Donation Pages
import DonationSuccess from './pages/donations/DonationSuccess';
import DonationCancelled from './pages/donations/DonationCancelled';

// User Pages
import UserProfile from './pages/profile/UserProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import DonationManagement from './pages/admin/DonationManagement';
import DonorManagement from './pages/admin/DonorManagement';
import DonorDetail from './pages/admin/DonorDetail';
import CampaignManagement from './pages/admin/CampaignManagement';
import UserManagement from './pages/admin/UserManagement';
import UserDetail from './pages/admin/UserDetail';

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <RouteChangeLoader />
            <Routes>
              {/* Public routes - No authentication required */}
              <Route path="/" element={<HomePage />} />
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/campaigns/:id" element={<CampaignDetailPage />} />

              {/* Donation routes - Public */}
              <Route path="/donation-success" element={<DonationSuccess />} />
              <Route path="/donation-cancelled" element={<DonationCancelled />} />

              {/* Auth routes */}
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordRedirect />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Protected routes - Authentication required */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute requiredRole="user">
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes - Admin role required */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/campaigns"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <CampaignManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/donations"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <DonationManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/donors"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <DonorManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/donors/:donorId"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <DonorDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/:userId"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <UserDetail />
                  </ProtectedRoute>
                }
              />

              {/* Error pages */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Catch all route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>

      {/* React Query DevTools (only in development) */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
