import { apiClient } from '@/lib/axios';
import type { User, LoginCredentials, RegisterData, ApiResponse } from '@/types';

export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User; token?: string }>> {
    try {
      const response = await apiClient.post<{ user: User; token?: string }>(
        '/auth/login',
        credentials
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  /**
   * Register new user
   */
  static async register(
    userData: RegisterData
  ): Promise<ApiResponse<{ user: User; token?: string }>> {
    try {
      const response = await apiClient.post<{ user: User; token?: string }>(
        '/auth/register',
        userData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  /**
   * Logout current user
   */
  static async logout(): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error: any) {
      // Even if logout fails on server, we should clear local state
      console.warn('Logout request failed:', error.response?.data?.message);
      return { success: true, message: 'Logged out locally' };
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user profile');
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<ApiResponse<{ user: User; token?: string }>> {
    try {
      const response = await apiClient.post<{ user: User; token?: string }>('/auth/refresh');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/auth/request-reset', { email });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset request failed');
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(
    token: string,
    password: string,
    passwordConfirmation: string
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  /**
   * Change password for authenticated user
   */
  static async changePassword(
    currentPassword: string,
    newPassword: string,
    passwordConfirmation: string
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.patch('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        password_confirmation: passwordConfirmation,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password change failed');
    }
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/auth/verify-email', { token });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Email verification failed');
    }
  }

  /**
   * Resend email verification
   */
  static async resendEmailVerification(): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/auth/resend-verification');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to resend verification email');
    }
  }
}
