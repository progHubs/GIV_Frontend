import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type { ApiError } from '../types/api';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
const API_TIMEOUT = 50000; // 50 seconds

// Token storage keys
const ACCESS_TOKEN_KEY = 'giv_access_token';
const REFRESH_TOKEN_KEY = 'giv_refresh_token';

// Token management functions
export const setAccessToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setRefreshToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // Essential for cookie-based auth (accessToken, refreshToken, sessionId)
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Track if we're currently refreshing to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    // Add Authorization header if access token is available
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Log errors in development
    if (import.meta.env.DEV) {
      console.error(
        `❌ API Error: ${error.response?.status} ${error.config?.url}`,
        error.response?.data
      );
    }

    // Handle 401 Unauthorized - Token expired or invalid
    // Don't retry for login, register, or refresh endpoints
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh');

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      // If we're already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get refresh token from storage
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Attempt to refresh token using the backend's refresh endpoint
        const refreshResponse = await apiClient.post('/auth/refresh', {
          refreshToken: refreshToken,
        });

        if (refreshResponse.data.success && refreshResponse.data.tokens) {
          // Store new tokens
          setAccessToken(refreshResponse.data.tokens.accessToken);
          setRefreshToken(refreshResponse.data.tokens.refreshToken);

          // Process queued requests
          processQueue(null, 'refreshed');

          // Retry the original request
          return apiClient(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        // Refresh failed, clear auth state and redirect
        processQueue(refreshError, null);
        clearTokens();

        console.error('❌ Token refresh failed:', refreshError);

        // Clear all user data immediately
        clearTokens();

        // Dispatch custom event for complete logout
        window.dispatchEvent(
          new CustomEvent('auth:complete-logout', {
            detail: { reason: 'token_refresh_failed' },
          })
        );

        // Force redirect to login page
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Transform backend error format to frontend format
    const responseData = error.response?.data as any;
    const apiError: ApiError = {
      success: false,
      message:
        responseData?.errors?.[0] ||
        responseData?.message ||
        error.message ||
        'An unexpected error occurred',
      errors: responseData?.errors || [error.message],
      code: responseData?.code,
    };

    return Promise.reject(apiError);
  }
);

// API Methods with proper typing based on backend responses
export const api = {
  // GET request
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  // POST request
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  // PUT request
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  // PATCH request
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  // DELETE request
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },

  // File upload with multipart/form-data
  upload: async <T = any>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Export the axios instance for direct use if needed
export { apiClient };
export default api;
