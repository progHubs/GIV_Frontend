// Campaign API Service
import { api } from './api';
import type {
  Campaign,
  CampaignFormData,
  CampaignFilters,
  CampaignStats,
  CampaignTranslation,
  ApiResponse,
  PaginationInfo,
} from '../types';

// API endpoints
const ENDPOINTS = {
  campaigns: '/campaigns',
  campaignById: (id: string) => `/campaigns/${id}`,
  campaignTranslations: (id: string) => `/campaigns/${id}/translations`,
  campaignTranslationByLanguage: (id: string, language: string) =>
    `/campaigns/${id}/translations/${language}`,
  featuredCampaigns: '/campaigns/featured',
  activeCampaigns: '/campaigns/active',
  campaignStats: '/campaigns/stats',
  searchCampaigns: '/campaigns/search',
  // Volunteer endpoints
  campaignVolunteers: (id: string) => `/campaigns/${id}/volunteers`,
  applyVolunteer: (id: string) => `/campaigns/${id}/volunteers/apply`,
  updateVolunteerStatus: (campaignId: string, userId: string) =>
    `/campaigns/${campaignId}/volunteers/${userId}/status`,
  logVolunteerHours: (volunteerId: string) => `/volunteers/${volunteerId}/hours`,
  volunteerStats: (userId?: string) =>
    userId ? `/volunteers/stats/${userId}` : '/volunteers/stats',
  userVolunteerCampaigns: '/volunteers/my-campaigns',
  filterOptions: '/campaigns/filter-options',
} as const;

// Campaign API Response Types
interface CampaignsResponse {
  success: boolean;
  data: Campaign[];
  pagination: PaginationInfo;
}

interface CampaignResponse {
  success: boolean;
  data: Campaign;
}

interface CampaignStatsResponse {
  success: boolean;
  data: CampaignStats;
}

interface CampaignTranslationsResponse {
  success: boolean;
  data: CampaignTranslation[];
}

// Campaign API Service
export const campaignApi = {
  // Get all campaigns with filtering and pagination
  getCampaigns: async (filters?: CampaignFilters): Promise<CampaignsResponse> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `${ENDPOINTS.campaigns}?${queryString}` : ENDPOINTS.campaigns;

    return api.get<CampaignsResponse>(url);
  },

  // Search campaigns
  searchCampaigns: async (query: string, filters?: CampaignFilters): Promise<CampaignsResponse> => {
    const params = new URLSearchParams({ q: query });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    return api.get<CampaignsResponse>(`${ENDPOINTS.searchCampaigns}?${params.toString()}`);
  },

  // Get featured campaigns
  getFeaturedCampaigns: async (filters?: Partial<CampaignFilters>): Promise<CampaignsResponse> => {
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
      ? `${ENDPOINTS.featuredCampaigns}?${queryString}`
      : ENDPOINTS.featuredCampaigns;

    return api.get<CampaignsResponse>(url);
  },

  // Get active campaigns
  getActiveCampaigns: async (filters?: Partial<CampaignFilters>): Promise<CampaignsResponse> => {
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
      ? `${ENDPOINTS.activeCampaigns}?${queryString}`
      : ENDPOINTS.activeCampaigns;

    return api.get<CampaignsResponse>(url);
  },

  // Get campaign by ID
  getCampaignById: async (id: string): Promise<CampaignResponse> => {
    return api.get<CampaignResponse>(ENDPOINTS.campaignById(id));
  },

  // Get campaign statistics
  getCampaignStats: async (): Promise<CampaignStatsResponse> => {
    return api.get<CampaignStatsResponse>(ENDPOINTS.campaignStats);
  },

  // Get campaign translations
  getCampaignTranslations: async (id: string): Promise<CampaignTranslationsResponse> => {
    return api.get<CampaignTranslationsResponse>(ENDPOINTS.campaignTranslations(id));
  },

  // ==================== VOLUNTEER ENDPOINTS ====================

  // Apply to volunteer for a campaign
  applyCampaignVolunteer: async (campaignId: string, applicationData: any) => {
    return api.post(ENDPOINTS.applyVolunteer(campaignId), applicationData);
  },

  // Get campaign volunteers
  getCampaignVolunteers: async (campaignId: string, filters: any = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.append(key, value.join(','));
          }
        } else {
          params.append(key, String(value));
        }
      }
    });

    const queryString = params.toString();
    const url = queryString
      ? `${ENDPOINTS.campaignVolunteers(campaignId)}?${queryString}`
      : ENDPOINTS.campaignVolunteers(campaignId);

    return api.get(url);
  },

  // Update volunteer status (admin only)
  updateVolunteerStatus: async (campaignId: string, userId: string, statusData: any) => {
    return api.put(ENDPOINTS.updateVolunteerStatus(campaignId, userId), statusData);
  },

  // Log volunteer hours
  logVolunteerHours: async (campaignVolunteerId: string, hoursData: any) => {
    return api.post(ENDPOINTS.logVolunteerHours(campaignVolunteerId), hoursData);
  },

  // Get volunteer statistics
  getVolunteerStats: async (userId?: string) => {
    return api.get(ENDPOINTS.volunteerStats(userId));
  },

  // Get user's volunteer campaigns
  getUserVolunteerCampaigns: async () => {
    return api.get(ENDPOINTS.userVolunteerCampaigns);
  },

  // Get campaign filter options
  getCampaignFilterOptions: async () => {
    return api.get(ENDPOINTS.filterOptions);
  },

  // Admin-only endpoints
  admin: {
    // Create campaign with optional file uploads
    createCampaign: async (
      data: CampaignFormData,
      files?: { image?: File; video?: File }
    ): Promise<CampaignResponse> => {
      if (files && (files.image || files.video)) {
        // Use FormData for file uploads
        const formData = new FormData();

        // Append all campaign data
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });

        // Append files
        if (files.image) {
          formData.append('image', files.image);
        }
        if (files.video) {
          formData.append('video', files.video);
        }

        return api.upload<CampaignResponse>(ENDPOINTS.campaigns, formData);
      } else {
        // Use regular JSON for data-only requests
        return api.post<CampaignResponse>(ENDPOINTS.campaigns, data);
      }
    },

    // Update campaign with optional file uploads
    updateCampaign: async (
      id: string,
      data: Partial<CampaignFormData>,
      files?: { image?: File; video?: File }
    ): Promise<CampaignResponse> => {
      if (files && (files.image || files.video)) {
        // Use FormData for file uploads
        const formData = new FormData();

        // Append all campaign data
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });

        // Append files
        if (files.image) {
          formData.append('image', files.image);
        }
        if (files.video) {
          formData.append('video', files.video);
        }

        return api.uploadPut<CampaignResponse>(ENDPOINTS.campaignById(id), formData);
      } else {
        // Use regular JSON for data-only requests
        return api.put<CampaignResponse>(ENDPOINTS.campaignById(id), data);
      }
    },

    // Delete campaign
    deleteCampaign: async (id: string): Promise<ApiResponse> => {
      return api.delete<ApiResponse>(ENDPOINTS.campaignById(id));
    },

    // Add campaign translation
    addCampaignTranslation: async (
      id: string,
      translation: { title: string; description: string; language: string }
    ): Promise<ApiResponse> => {
      return api.post<ApiResponse>(ENDPOINTS.campaignTranslations(id), translation);
    },

    // Update campaign translation
    updateCampaignTranslation: async (
      id: string,
      language: string,
      translation: { title?: string; description?: string }
    ): Promise<ApiResponse> => {
      return api.patch<ApiResponse>(
        ENDPOINTS.campaignTranslationByLanguage(id, language),
        translation
      );
    },
  },
};

export default campaignApi;
