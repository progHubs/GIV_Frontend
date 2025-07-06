import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/contexts/AuthContext';
import PrivateRoute from '@/components/auth/PrivateRoute';
import PublicLayout from '@/layouts/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Pages
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';

// Initialize i18n
import '@/lib/i18n';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes with PublicLayout */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <HomePage />
                </PublicLayout>
              }
            />

            {/* Auth routes (no layout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes with PublicLayout */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <PublicLayout>
                    <DashboardPage />
                  </PublicLayout>
                </PrivateRoute>
              }
            />

            {/* Admin routes with AdminLayout */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute roles={['admin']}>
                  <AdminLayout>
                    <Routes>
                      <Route
                        index
                        element={
                          <div className="p-8">
                            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                            <p>Welcome to the admin panel!</p>
                          </div>
                        }
                      />
                      <Route
                        path="users"
                        element={
                          <div className="p-8">
                            <h1 className="text-2xl font-bold">User Management</h1>
                            <p>Manage users here.</p>
                          </div>
                        }
                      />
                      <Route
                        path="campaigns"
                        element={
                          <div className="p-8">
                            <h1 className="text-2xl font-bold">Campaign Management</h1>
                            <p>Manage campaigns here.</p>
                          </div>
                        }
                      />
                      <Route
                        path="events"
                        element={
                          <div className="p-8">
                            <h1 className="text-2xl font-bold">Event Management</h1>
                            <p>Manage events here.</p>
                          </div>
                        }
                      />
                      <Route
                        path="content"
                        element={
                          <div className="p-8">
                            <h1 className="text-2xl font-bold">Content Management</h1>
                            <p>Manage content here.</p>
                          </div>
                        }
                      />
                      <Route
                        path="media"
                        element={
                          <div className="p-8">
                            <h1 className="text-2xl font-bold">Media Management</h1>
                            <p>Manage media here.</p>
                          </div>
                        }
                      />
                      <Route
                        path="analytics"
                        element={
                          <div className="p-8">
                            <h1 className="text-2xl font-bold">Analytics</h1>
                            <p>View analytics here.</p>
                          </div>
                        }
                      />
                      <Route
                        path="settings"
                        element={
                          <div className="p-8">
                            <h1 className="text-2xl font-bold">System Settings</h1>
                            <p>Configure system settings here.</p>
                          </div>
                        }
                      />
                    </Routes>
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            {/* Placeholder routes for future implementation */}
            <Route
              path="/about"
              element={
                <PublicLayout>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
                      <p className="text-lg text-gray-600">Coming soon...</p>
                    </div>
                  </div>
                </PublicLayout>
              }
            />

            <Route
              path="/campaigns"
              element={
                <PublicLayout>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">Campaigns</h1>
                      <p className="text-lg text-gray-600">Coming soon...</p>
                    </div>
                  </div>
                </PublicLayout>
              }
            />

            <Route
              path="/events"
              element={
                <PublicLayout>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">Events</h1>
                      <p className="text-lg text-gray-600">Coming soon...</p>
                    </div>
                  </div>
                </PublicLayout>
              }
            />

            <Route
              path="/blog"
              element={
                <PublicLayout>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
                      <p className="text-lg text-gray-600">Coming soon...</p>
                    </div>
                  </div>
                </PublicLayout>
              }
            />

            <Route
              path="/contact"
              element={
                <PublicLayout>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                      <p className="text-lg text-gray-600">Coming soon...</p>
                    </div>
                  </div>
                </PublicLayout>
              }
            />

            <Route
              path="/donate"
              element={
                <PublicLayout>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">Make a Donation</h1>
                      <p className="text-lg text-gray-600">Coming soon...</p>
                    </div>
                  </div>
                </PublicLayout>
              }
            />

            {/* Unauthorized page */}
            <Route
              path="/unauthorized"
              element={
                <PublicLayout>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
                      <p className="text-lg text-gray-600 mb-4">
                        You don't have permission to access this page.
                      </p>
                      <a href="/" className="text-primary-600 hover:text-primary-500">
                        Go back to homepage
                      </a>
                    </div>
                  </div>
                </PublicLayout>
              }
            />

            {/* 404 page */}
            <Route
              path="*"
              element={
                <PublicLayout>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        404 - Page Not Found
                      </h1>
                      <p className="text-lg text-gray-600 mb-4">
                        The page you're looking for doesn't exist.
                      </p>
                      <a href="/" className="text-primary-600 hover:text-primary-500">
                        Go back to homepage
                      </a>
                    </div>
                  </div>
                </PublicLayout>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
