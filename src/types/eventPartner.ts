/**
 * Event Partner Types and Interfaces
 * Type definitions for event-specific partner data structures
 */

import type { BaseEntity } from './api';

// Event Partner Entity
export interface EventPartner extends BaseEntity {
  event_id: string;
  name: string;
  logo_url?: string | null;
  website?: string | null;
  description?: string | null;
  is_active: boolean;
}

// Event Partner Creation/Update Data
export interface EventPartnerFormData {
  name: string;
  website?: string;
  description?: string;
  is_active?: boolean;
  logo?: File; // For file upload
}

// Event Partner Update Data (all fields optional except validation)
export interface EventPartnerUpdateData {
  name?: string;
  website?: string;
  description?: string;
  is_active?: boolean;
  logo?: File; // For file upload
}

// Event Partner Filters
export interface EventPartnerFilters {
  is_active?: boolean;
}

// Event Partner API Response Types
export interface EventPartnerResponse {
  success: boolean;
  data: EventPartner;
  message?: string;
}

export interface EventPartnersResponse {
  success: boolean;
  data: EventPartner[];
}

// Event Partner Form Validation
export interface EventPartnerFormErrors {
  name?: string;
  website?: string;
  description?: string;
  logo?: string;
  general?: string;
}

// Event Partner Statistics
export interface EventPartnerStats {
  total_partners: number;
  active_partners: number;
  inactive_partners: number;
  partners_with_logos: number;
  partners_with_websites: number;
}

// Event Partner Management Data (Admin)
export interface EventPartnerManagementData {
  partner_id: string;
  name?: string;
  website?: string;
  description?: string;
  is_active?: boolean;
  logo?: File;
}

// Event Partner Display Data
export interface EventPartnerDisplayData extends EventPartner {
  displayName: string;
  hasLogo: boolean;
  hasWebsite: boolean;
  hasDescription: boolean;
}

// File Upload Types for Event Partners
export interface EventPartnerFileUpload {
  logo?: File;
}

export interface EventPartnerUploadResponse {
  success: boolean;
  logo_url?: string;
  error?: string;
}

// Event Partner Bulk Operations
export interface EventPartnerBulkAction {
  action: 'activate' | 'deactivate' | 'delete';
  partner_ids: string[];
}

export interface EventPartnerBulkResponse {
  success: boolean;
  processed: number;
  failed: number;
  errors?: string[];
}

// Event Partner Search and Filter Options
export interface EventPartnerSearchParams {
  query?: string;
  is_active?: boolean;
  has_logo?: boolean;
  has_website?: boolean;
  event_id?: string;
}

// Event Partner Sort Options
export type EventPartnerSortField = 'name' | 'created_at' | 'updated_at';
export type EventPartnerSortOrder = 'asc' | 'desc';

export interface EventPartnerSortOptions {
  field: EventPartnerSortField;
  order: EventPartnerSortOrder;
}

// Event Partner Validation Rules
export interface EventPartnerValidationRules {
  name: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  website: {
    required: boolean;
    pattern: RegExp;
  };
  description: {
    required: boolean;
    maxLength: number;
  };
  logo: {
    required: boolean;
    maxSize: number; // in bytes
    allowedTypes: string[];
  };
}

// Default values and constants
export const DEFAULT_EVENT_PARTNER: Partial<EventPartnerFormData> = {
  name: '',
  website: '',
  description: '',
  is_active: true,
};

export const EVENT_PARTNER_VALIDATION_RULES: EventPartnerValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  website: {
    required: false,
    pattern: /^https?:\/\/.+/,
  },
  description: {
    required: false,
    maxLength: 1000,
  },
  logo: {
    required: false,
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  },
};

// Event Partner Status Options
export const EVENT_PARTNER_STATUS_OPTIONS: { value: boolean; label: string }[] = [
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];

// Utility functions for event partner operations
export const eventPartnerUtils = {
  /**
   * Validate event partner form data
   */
  validatePartnerData: (data: EventPartnerFormData): string[] => {
    const errors: string[] = [];
    const rules = EVENT_PARTNER_VALIDATION_RULES;

    // Name validation
    if (rules.name.required && (!data.name || data.name.trim().length < rules.name.minLength)) {
      errors.push(`Partner name must be at least ${rules.name.minLength} characters long`);
    }
    if (data.name && data.name.length > rules.name.maxLength) {
      errors.push(`Partner name cannot exceed ${rules.name.maxLength} characters`);
    }

    // Website validation
    if (data.website && !rules.website.pattern.test(data.website)) {
      errors.push('Website must be a valid URL starting with http:// or https://');
    }

    // Description validation
    if (data.description && data.description.length > rules.description.maxLength) {
      errors.push(`Description cannot exceed ${rules.description.maxLength} characters`);
    }

    // Logo validation
    if (data.logo) {
      if (!rules.logo.allowedTypes.includes(data.logo.type)) {
        errors.push('Logo must be a valid image file (JPEG, PNG, GIF, WebP)');
      }
      if (data.logo.size > rules.logo.maxSize) {
        errors.push(`Logo file size cannot exceed ${rules.logo.maxSize / (1024 * 1024)}MB`);
      }
    }

    return errors;
  },

  /**
   * Format partner data for display
   */
  formatPartnerForDisplay: (partner: EventPartner): EventPartnerDisplayData => ({
    ...partner,
    displayName: partner.name,
    hasLogo: !!partner.logo_url,
    hasWebsite: !!partner.website,
    hasDescription: !!partner.description,
  }),

  /**
   * Filter active partners
   */
  getActivePartners: (partners: EventPartner[]): EventPartner[] => {
    return partners.filter(partner => partner.is_active);
  },

  /**
   * Sort partners by name
   */
  sortPartnersByName: (partners: EventPartner[], order: 'asc' | 'desc' = 'asc'): EventPartner[] => {
    return [...partners].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return order === 'asc' ? comparison : -comparison;
    });
  },

  /**
   * Search partners by name or description
   */
  searchPartners: (partners: EventPartner[], query: string): EventPartner[] => {
    if (!query.trim()) return partners;
    
    const searchTerm = query.toLowerCase().trim();
    return partners.filter(partner => 
      partner.name.toLowerCase().includes(searchTerm) ||
      (partner.description && partner.description.toLowerCase().includes(searchTerm))
    );
  },

  /**
   * Generate partner logo fallback
   */
  generateLogoFallback: (partnerName: string): string => {
    return partnerName
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  },

  /**
   * Validate website URL
   */
  isValidWebsiteUrl: (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  },

  /**
   * Format website URL for display
   */
  formatWebsiteUrl: (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  },
};
