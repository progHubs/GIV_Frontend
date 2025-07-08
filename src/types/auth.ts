// Authentication Types and Interfaces

export type UserRole = 'admin' | 'user';
export type LanguagePreference = 'en' | 'am';

// User Interface based on backend schema
export interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  is_donor: boolean;
  is_volunteer: boolean;
  profile_image_url?: string;
  language_preference: LanguagePreference;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// JWT Token Payloads
export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  sessionId: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
  tokenType: 'refresh';
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

// Authentication Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  language_preference?: LanguagePreference;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
    sessionId: string;
  };
}

export interface AuthError {
  success: false;
  errors: string[];
  code: string;
}

// Password Reset Types
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}

// Profile Update Types
export interface UpdateProfileRequest {
  full_name?: string;
  phone?: string;
  profile_image_url?: string;
  language_preference?: LanguagePreference;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Auth Context State
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // For login/register/logout actions
  isInitializing: boolean; // For initial auth check
  error: string | null;
}

// Auth Context Actions
export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

// Route Protection Types
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
  redirectTo?: string;
}
