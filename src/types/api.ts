// API Response Types and Interfaces

// Generic API Response Structure
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationInfo;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
  code?: string;
}

// Pagination Types
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Search and Filter Types
export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  dateRange?: {
    start: string;
    end: string;
  };
}

// File Upload Types
export interface FileUploadResponse {
  success: boolean;
  data: {
    url: string;
    filename: string;
    size: number;
    mimetype: string;
  };
}

// Language and Translation Types
export interface TranslationGroup {
  id: string;
  key: string;
  translations: {
    en: string;
    am: string;
  };
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// API Request Configuration
export interface ApiRequestConfig {
  method: HttpMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
}

// Common Entity Types
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// Status Types
export type EntityStatus = 'active' | 'inactive' | 'pending' | 'archived';

// Common Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Toast/Notification Types
export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
