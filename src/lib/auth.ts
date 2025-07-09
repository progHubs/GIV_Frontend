import { api, setAccessToken, setRefreshToken, clearTokens } from './api';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '../types/auth';

// Authentication service based on backend API structure
export const authService = {
  /**
   * Register a new user
   * POST /auth/register
   */
  register: async (userData: RegisterRequest) => {
    const response = await api.post<{
      success: boolean;
      message: string;
      user: User;
      tokens?: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      };
      verificationToken?: string;
    }>('/auth/register', userData);

    // Store tokens for subsequent requests if provided
    if (response.success && response.tokens?.accessToken) {
      setAccessToken(response.tokens.accessToken);
      setRefreshToken(response.tokens.refreshToken);
    }

    return response;
  },

  /**
   * Login user
   * POST /auth/login
   */
  login: async (credentials: LoginRequest) => {
    const response = await api.post<{
      success: boolean;
      message: string;
      user: User;
      tokens: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      };
      sessionId: string;
    }>('/auth/login', credentials);

    // Store tokens for subsequent requests
    if (response.success && response.tokens?.accessToken) {
      setAccessToken(response.tokens.accessToken);
      setRefreshToken(response.tokens.refreshToken);
    }

    return response;
  },

  /**
   * Logout user
   * POST /auth/logout
   */
  logout: async () => {
    try {
      const response = await api.post<{
        success: boolean;
        message: string;
      }>('/auth/logout');

      return response;
    } finally {
      // Always clear tokens, even if logout request fails
      clearTokens();
    }
  },

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  refreshToken: async () => {
    const response = await api.post<{
      success: boolean;
      message: string;
      tokens: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      };
      sessionId: string;
    }>('/auth/refresh');

    // Store new tokens
    if (response.success && response.tokens?.accessToken) {
      setAccessToken(response.tokens.accessToken);
      setRefreshToken(response.tokens.refreshToken);
    }

    return response;
  },

  /**
   * Get current user profile
   * GET /auth/me
   */
  getCurrentUser: async () => {
    const response = await api.get<{
      success: boolean;
      user: User;
      tokens?: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      };
    }>('/auth/me');

    // Store tokens if provided (e.g., after token refresh)
    if (response.success && response.tokens?.accessToken) {
      setAccessToken(response.tokens.accessToken);
      setRefreshToken(response.tokens.refreshToken);
    }

    return response;
  },

  /**
   * Update user profile
   * PUT /auth/profile
   */
  updateProfile: async (profileData: UpdateProfileRequest) => {
    const response = await api.put<{
      success: boolean;
      message: string;
      user: User;
    }>('/auth/profile', profileData);

    return response;
  },

  /**
   * Change password
   * PUT /auth/change-password
   */
  changePassword: async (passwordData: ChangePasswordRequest) => {
    const response = await api.put<{
      success: boolean;
      message: string;
    }>('/auth/change-password', passwordData);

    return response;
  },

  /**
   * Request password reset
   * POST /auth/request-password-reset
   */
  forgotPassword: async (emailData: ForgotPasswordRequest) => {
    const response = await api.post<{
      success: boolean;
      message: string;
      email_sent?: boolean;
      expires_in?: number;
      resetToken?: string; // Only in development
    }>('/auth/request-password-reset', emailData);

    return response;
  },

  /**
   * Reset password with token
   * POST /auth/reset-password
   */
  resetPassword: async (resetData: ResetPasswordRequest) => {
    const response = await api.post<{
      success: boolean;
      message: string;
      password_strength?: {
        score: number;
        level: string;
      };
      security_actions?: {
        all_sessions_terminated: boolean;
        all_tokens_revoked: boolean;
        notification_sent: boolean;
        security_log_created: boolean;
      };
    }>('/auth/reset-password', resetData);

    return response;
  },

  /**
   * Verify email address
   * POST /auth/verify-email
   */
  verifyEmail: async (token: string) => {
    const response = await api.post<{
      success: boolean;
      message: string;
      user?: User;
    }>('/auth/verify-email', { token });

    return response;
  },

  /**
   * Resend email verification
   * POST /auth/resend-verification
   */
  resendVerification: async (email: string) => {
    const response = await api.post<{
      success: boolean;
      message: string;
    }>('/auth/resend-verification', { email });

    return response;
  },

  /**
   * Delete user account
   * DELETE /auth/account
   */
  deleteAccount: async (password: string) => {
    const response = await api.delete<{
      success: boolean;
      message: string;
    }>('/auth/account', {
      data: { password },
    });

    return response;
  },

  /**
   * Check authentication status
   * GET /auth/status
   */
  checkAuthStatus: async () => {
    try {
      const response = await api.get<{
        success: boolean;
        authenticated: boolean;
        user?: User;
      }>('/auth/status');

      return response;
    } catch (error) {
      // If status check fails, user is not authenticated
      return {
        success: false,
        authenticated: false,
        user: null,
      };
    }
  },
};

export default authService;
