import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../../../lib/auth';
import { clearTokens, getAccessToken } from '../../../lib/api';
import type {
  User,
  AuthState,
  AuthContextType,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../../../types/auth';

// Auth action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'CLEAR_LOADING' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'INITIAL_CHECK_START' }
  | { type: 'INITIAL_CHECK_COMPLETE' };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false, // For login/register/logout actions
  isInitializing: true, // Start with true to check auth status
  error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'INITIAL_CHECK_START':
      return {
        ...state,
        isInitializing: true,
        error: null,
      };
    case 'INITIAL_CHECK_COMPLETE':
      return {
        ...state,
        isInitializing: false,
      };
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitializing: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitializing: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'CLEAR_LOADING':
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Listen for logout events from API interceptor
  useEffect(() => {
    const handleLogout = () => {
      dispatch({ type: 'AUTH_LOGOUT' });
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: 'INITIAL_CHECK_START' });

      // Check if we have a stored access token
      const storedToken = getAccessToken();
      if (!storedToken) {
        dispatch({ type: 'AUTH_LOGOUT' });
        return;
      }

      // Verify the token by getting current user
      const response = await authService.getCurrentUser();

      if (response.success && response.user) {
        // Token is valid, set user state
        dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      } else {
        // Token is invalid, clear everything
        clearTokens();
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    } catch (error) {
      // Error occurred, clear everything
      clearTokens();
      dispatch({ type: 'AUTH_LOGOUT' });
    } finally {
      dispatch({ type: 'INITIAL_CHECK_COMPLETE' });
    }
  };

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.login(credentials);

      if (response.success && response.user) {
        // Tokens are already stored in authService.login
        dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      } else {
        throw new Error('Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.register(userData);

      if (response.success) {
        // If email verification is required, user won't be logged in immediately
        if (response.user && response.tokens) {
          // Tokens are already stored in authService.register
          dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
        } else {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } else {
        throw new Error('Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      // Tokens are already cleared in authService.logout
    } catch (error) {
      // Even if logout fails on server, clear local state and tokens
      console.error('Logout error:', error);
      clearTokens();
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }, []);

  const updateProfile = async (profileData: UpdateProfileRequest) => {
    try {
      const response = await authService.updateProfile(profileData);

      if (response.success && response.user) {
        dispatch({ type: 'UPDATE_USER', payload: response.user });
      } else {
        throw new Error('Profile update failed');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Profile update failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const changePassword = async (passwordData: ChangePasswordRequest) => {
    try {
      const response = await authService.changePassword(passwordData);

      if (!response.success) {
        throw new Error('Password change failed');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Password change failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const forgotPassword = useCallback(async (emailData: ForgotPasswordRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.forgotPassword(emailData);

      if (response.success) {
        // Reset password request successful - clear loading state
        dispatch({ type: 'CLEAR_LOADING' });
      } else {
        throw new Error('Password reset request failed');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Password reset request failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (resetData: ResetPasswordRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.resetPassword(resetData);

      if (response.success) {
        // Password reset successful - clear loading state
        dispatch({ type: 'CLEAR_LOADING' });
      } else {
        throw new Error('Password reset failed');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Password reset failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const refreshToken = async () => {
    try {
      await authService.refreshToken();
    } catch (error: any) {
      dispatch({ type: 'AUTH_LOGOUT' });
      throw error;
    }
  };

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
