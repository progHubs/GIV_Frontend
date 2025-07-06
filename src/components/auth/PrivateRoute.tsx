import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[];
  requireEmailVerification?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  roles = [],
  requireEmailVerification = false,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Check email verification if required
  if (requireEmailVerification && !user.email_verified) {
    return (
      <Navigate
        to="/verify-email"
        state={{ from: location }}
        replace
      />
    );
  }

  // Check role-based access
  if (roles.length > 0 && !roles.includes(user.role)) {
    return (
      <Navigate
        to="/unauthorized"
        state={{ from: location }}
        replace
      />
    );
  }

  // Render protected content
  return <>{children}</>;
};

export default PrivateRoute;
