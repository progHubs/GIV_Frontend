/**
 * Event Partner API Service
 * Handles all event partner-related API calls
 * Following campaign partner patterns
 */

import { api } from './api';
import type {
  EventPartner,
  EventPartnerFormData,
  EventPartnerUpdateData,
  EventPartnerFilters,
  EventPartnerResponse,
  EventPartnersResponse,
} from '../types/eventPartner';

// API endpoints
const ENDPOINTS = {
  eventPartners: (eventId: string) => `/events/${eventId}/partners`,
  eventPartner: (eventId: string, partnerId: string) => 
    `/events/${eventId}/partners/${partnerId}`,
} as const;

// Event Partner API Service
export const eventPartnerApi = {
  /**
   * Get all partners for an event
   */
  getEventPartners: async (
    eventId: string,
    filters?: EventPartnerFilters
  ): Promise<EventPartnersResponse> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = queryString 
      ? `${ENDPOINTS.eventPartners(eventId)}?${queryString}` 
      : ENDPOINTS.eventPartners(eventId);

    return api.get<EventPartnersResponse>(url);
  },

  /**
   * Get a single event partner
   */
  getEventPartner: async (
    eventId: string,
    partnerId: string
  ): Promise<EventPartnerResponse> => {
    return api.get<EventPartnerResponse>(
      ENDPOINTS.eventPartner(eventId, partnerId)
    );
  },

  /**
   * Create a new event partner
   */
  createEventPartner: async (
    eventId: string,
    data: EventPartnerFormData
  ): Promise<EventPartnerResponse> => {
    // Prepare form data for file upload
    const formData = new FormData();
    
    // Add text fields
    formData.append('name', data.name);
    if (data.website) formData.append('website', data.website);
    if (data.description) formData.append('description', data.description);
    if (data.is_active !== undefined) formData.append('is_active', String(data.is_active));
    
    // Add file if present
    if (data.logo) {
      formData.append('logo', data.logo);
    }

    return api.post<EventPartnerResponse>(
      ENDPOINTS.eventPartners(eventId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  /**
   * Update an event partner
   */
  updateEventPartner: async (
    eventId: string,
    partnerId: string,
    data: EventPartnerUpdateData
  ): Promise<EventPartnerResponse> => {
    // Prepare form data for file upload
    const formData = new FormData();
    
    // Add text fields (only if provided)
    if (data.name !== undefined) formData.append('name', data.name);
    if (data.website !== undefined) formData.append('website', data.website || '');
    if (data.description !== undefined) formData.append('description', data.description || '');
    if (data.is_active !== undefined) formData.append('is_active', String(data.is_active));
    
    // Add file if present
    if (data.logo) {
      formData.append('logo', data.logo);
    }

    return api.put<EventPartnerResponse>(
      ENDPOINTS.eventPartner(eventId, partnerId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  /**
   * Delete an event partner
   */
  deleteEventPartner: async (
    eventId: string,
    partnerId: string
  ): Promise<{ success: boolean; message: string }> => {
    return api.delete<{ success: boolean; message: string }>(
      ENDPOINTS.eventPartner(eventId, partnerId)
    );
  },
};

// Helper functions for event partner operations
export const eventPartnerHelpers = {
  /**
   * Validate event partner form data
   */
  validatePartnerData: (data: EventPartnerFormData): string[] => {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Partner name must be at least 2 characters long');
    }

    if (data.name && data.name.length > 255) {
      errors.push('Partner name cannot exceed 255 characters');
    }

    if (data.website && !isValidUrl(data.website)) {
      errors.push('Website must be a valid URL');
    }

    if (data.description && data.description.length > 1000) {
      errors.push('Description cannot exceed 1000 characters');
    }

    if (data.logo && !isValidImageFile(data.logo)) {
      errors.push('Logo must be a valid image file (JPEG, PNG, GIF, WebP) under 2MB');
    }

    return errors;
  },

  /**
   * Format partner data for display
   */
  formatPartnerForDisplay: (partner: EventPartner) => ({
    ...partner,
    displayName: partner.name,
    hasLogo: !!partner.logo_url,
    hasWebsite: !!partner.website,
    hasDescription: !!partner.description,
  }),

  /**
   * Filter active partners
   */
  getActivePartners: (partners: EventPartner[]) => {
    return partners.filter(partner => partner.is_active);
  },

  /**
   * Sort partners by name
   */
  sortPartnersByName: (partners: EventPartner[], order: 'asc' | 'desc' = 'asc') => {
    return [...partners].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return order === 'asc' ? comparison : -comparison;
    });
  },

  /**
   * Search partners by name or description
   */
  searchPartners: (partners: EventPartner[], query: string) => {
    if (!query.trim()) return partners;
    
    const searchTerm = query.toLowerCase().trim();
    return partners.filter(partner => 
      partner.name.toLowerCase().includes(searchTerm) ||
      (partner.description && partner.description.toLowerCase().includes(searchTerm))
    );
  },

  /**
   * Generate partner logo fallback initials
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

  /**
   * Validate and format website URL
   */
  formatWebsiteForSubmission: (url: string): string => {
    if (!url) return '';
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    
    return url;
  },

  /**
   * Get partner statistics
   */
  getPartnerStats: (partners: EventPartner[]) => {
    return {
      total: partners.length,
      active: partners.filter(p => p.is_active).length,
      inactive: partners.filter(p => !p.is_active).length,
      withLogos: partners.filter(p => p.logo_url).length,
      withWebsites: partners.filter(p => p.website).length,
      withDescriptions: partners.filter(p => p.description).length,
    };
  },

  /**
   * Prepare partner data for form
   */
  preparePartnerForForm: (partner: EventPartner) => ({
    name: partner.name,
    website: partner.website || '',
    description: partner.description || '',
    is_active: partner.is_active,
    // Note: logo file cannot be pre-filled in forms
  }),

  /**
   * Check if partner data has changes
   */
  hasPartnerDataChanged: (original: EventPartner, updated: EventPartnerFormData): boolean => {
    return (
      original.name !== updated.name ||
      (original.website || '') !== (updated.website || '') ||
      (original.description || '') !== (updated.description || '') ||
      original.is_active !== (updated.is_active ?? true) ||
      !!updated.logo // Always consider it changed if a new logo is provided
    );
  },
};

// Utility functions
function isValidUrl(url: string): boolean {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}

function isValidImageFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 2 * 1024 * 1024; // 2MB

  return allowedTypes.includes(file.type) && file.size <= maxSize;
}

// Export query keys for React Query
export const eventPartnerQueryKeys = {
  all: ['eventPartners'] as const,
  lists: () => [...eventPartnerQueryKeys.all, 'list'] as const,
  list: (eventId: string, filters?: EventPartnerFilters) => 
    [...eventPartnerQueryKeys.lists(), eventId, filters] as const,
  details: () => [...eventPartnerQueryKeys.all, 'detail'] as const,
  detail: (eventId: string, partnerId: string) => 
    [...eventPartnerQueryKeys.details(), eventId, partnerId] as const,
};
