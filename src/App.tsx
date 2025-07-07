import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './features/auth/context/AuthContext';
import queryClient from './lib/queryClient';
import './lib/i18n'; // Initialize i18n

// Layouts
import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import RegisterPage from './features/auth/pages/RegisterPage';
import LoginPage from './features/auth/pages/LoginPage';

// Placeholder pages (to be implemented)
const HomePage = () => (
  <PublicLayout>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome to GIV Society</h1>
      <p className="text-lg text-gray-600">
        This is the home page. Authentication system is now set up and ready to use.
      </p>
    </div>
  </PublicLayout>
);

const DashboardPage = () => (
  <ProtectedRoute>
    <PrivateLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
        <p className="text-gray-600">Welcome to your dashboard!</p>
      </div>
    </PrivateLayout>
  </ProtectedRoute>
);

const ProfilePage = () => (
  <ProtectedRoute>
    <PrivateLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile</h1>
        <p className="text-gray-600">Profile settings will be implemented here.</p>
      </div>
    </PrivateLayout>
  </ProtectedRoute>
);

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
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />

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
