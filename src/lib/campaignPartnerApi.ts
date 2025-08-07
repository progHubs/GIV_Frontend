/**
 * Campaign Partner API Service
 * Handles all campaign partner-related API calls
 */

import { api } from './api';
import type {
  CampaignPartner,
  CampaignPartnerFormData,
  CampaignPartnerUpdateData,
  CampaignPartnerFilters,
  CampaignPartnerResponse,
  CampaignPartnersResponse,
} from '../types/campaignPartner';

// API endpoints
const ENDPOINTS = {
  campaignPartners: (campaignId: string) => `/campaigns/${campaignId}/partners`,
  campaignPartner: (campaignId: string, partnerId: string) => 
    `/campaigns/${campaignId}/partners/${partnerId}`,
} as const;

// Campaign Partner API Service
export const campaignPartnerApi = {
  /**
   * Get all partners for a campaign
   */
  getCampaignPartners: async (
    campaignId: string,
    filters?: CampaignPartnerFilters
  ): Promise<CampaignPartnersResponse> => {
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
      ? `${ENDPOINTS.campaignPartners(campaignId)}?${queryString}` 
      : ENDPOINTS.campaignPartners(campaignId);

    return api.get<CampaignPartnersResponse>(url);
  },

  /**
   * Get a single campaign partner
   */
  getCampaignPartner: async (
    campaignId: string,
    partnerId: string
  ): Promise<CampaignPartnerResponse> => {
    return api.get<CampaignPartnerResponse>(
      ENDPOINTS.campaignPartner(campaignId, partnerId)
    );
  },

  /**
   * Create a new campaign partner
   */
  createCampaignPartner: async (
    campaignId: string,
    data: CampaignPartnerFormData
  ): Promise<CampaignPartnerResponse> => {
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

    return api.post<CampaignPartnerResponse>(
      ENDPOINTS.campaignPartners(campaignId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  /**
   * Update a campaign partner
   */
  updateCampaignPartner: async (
    campaignId: string,
    partnerId: string,
    data: CampaignPartnerUpdateData
  ): Promise<CampaignPartnerResponse> => {
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

    return api.put<CampaignPartnerResponse>(
      ENDPOINTS.campaignPartner(campaignId, partnerId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  /**
   * Delete a campaign partner
   */
  deleteCampaignPartner: async (
    campaignId: string,
    partnerId: string
  ): Promise<{ success: boolean; message: string }> => {
    return api.delete<{ success: boolean; message: string }>(
      ENDPOINTS.campaignPartner(campaignId, partnerId)
    );
  },
};

// Helper functions for campaign partner operations
export const campaignPartnerHelpers = {
  /**
   * Validate campaign partner form data
   */
  validatePartnerData: (data: CampaignPartnerFormData): string[] => {
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
  formatPartnerForDisplay: (partner: CampaignPartner) => ({
    ...partner,
    displayName: partner.name,
    hasLogo: !!partner.logo_url,
    hasWebsite: !!partner.website,
    hasDescription: !!partner.description,
  }),



  /**
   * Filter active partners
   */
  getActivePartners: (partners: CampaignPartner[]) => {
    return partners.filter(partner => partner.is_active);
  },
};

// Utility functions
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
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
export const campaignPartnerQueryKeys = {
  all: ['campaignPartners'] as const,
  lists: () => [...campaignPartnerQueryKeys.all, 'list'] as const,
  list: (campaignId: string, filters?: CampaignPartnerFilters) => 
    [...campaignPartnerQueryKeys.lists(), campaignId, filters] as const,
  details: () => [...campaignPartnerQueryKeys.all, 'detail'] as const,
  detail: (campaignId: string, partnerId: string) => 
    [...campaignPartnerQueryKeys.details(), campaignId, partnerId] as const,
};
