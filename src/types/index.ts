// User and Authentication Types
export interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  profile_image_url?: string;
  language_preference: 'en' | 'am';
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
  role?: 'user';
  is_donor?: boolean;
  is_volunteer?: boolean;
  language_preference?: 'en' | 'am';
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Campaign Types
export interface Campaign {
  id: string;
  title: string;
  slug: string;
  description?: string;
  goal_amount: number;
  current_amount: number;
  currency: 'USD' | 'ETB';
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  start_date: string;
  end_date?: string;
  feature_image?: string;
  language: 'en' | 'am';
  translation_group_id?: string;
  created_at: string;
  updated_at: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  slug: string;
  description?: string;
  event_type: 'fundraising' | 'awareness' | 'volunteer' | 'training';
  start_date: string;
  end_date?: string;
  location?: string;
  max_participants?: number;
  current_participants: number;
  registration_required: boolean;
  feature_image?: string;
  language: 'en' | 'am';
  translation_group_id?: string;
  created_at: string;
  updated_at: string;
}

// Donation Types
export interface Donation {
  id: string;
  amount: number;
  currency: 'USD' | 'ETB';
  donation_type: 'one_time' | 'recurring';
  payment_method: 'stripe' | 'paypal' | 'telebirr';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  campaign_id?: string;
  donor_id?: string;
  anonymous: boolean;
  message?: string;
  created_at: string;
  updated_at: string;
}

// Language and Translation Types
export type Language = 'en' | 'am';

export interface TranslationNamespace {
  [key: string]: string | TranslationNamespace;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: any;
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Route Types
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  protected?: boolean;
  roles?: string[];
  layout?: 'public' | 'admin';
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  status?: number;
  field?: string;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
