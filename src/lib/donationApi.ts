// Donation API Service
// Handles all donation-related API calls

import { api } from './api';
import type {
  Donation,
  DonationRequest,
  DonationFilters,
  DonationListResponse,
  DonationResponse,
  DonationStatsResponse,
  DonorStatsResponse,
  DonationUpdateRequest,
  DonorProfile,
} from '../types/donation';

// Base donation API endpoints
const DONATION_ENDPOINTS = {
  donations: '/donations',
  donationStats: '/donations/stats',
  donationSearch: '/donations/search',
  donors: '/donors',
  donorStats: '/donors/stats',
  tierStats: '/donors/tier-stats',
  recalculateTiers: '/donors/recalculate-tiers',
  recalculateSingleTier: (id: string) => `/donors/${id}/recalculate-tier`,
} as const;

/**
 * Donation API Service
 * Provides methods for all donation-related operations
 */
export const donationApi = {
  // ==================== DONATION OPERATIONS ====================

  /**
   * Create a new donation
   * POST /donations
   */
  createDonation: async (donationData: DonationRequest): Promise<DonationResponse> => {
    return api.post<DonationResponse>(DONATION_ENDPOINTS.donations, donationData);
  },

  /**
   * Get donations with filters and pagination
   * GET /donations
   */
  getDonations: async (filters: DonationFilters = {}): Promise<DonationListResponse> => {
    const params = new URLSearchParams();

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    const url = queryString
      ? `${DONATION_ENDPOINTS.donations}?${queryString}`
      : DONATION_ENDPOINTS.donations;

    return api.get<DonationListResponse>(url);
  },

  /**
   * Get a single donation by ID
   * GET /donations/:id
   */
  getDonationById: async (donationId: string): Promise<DonationResponse> => {
    return api.get<DonationResponse>(`${DONATION_ENDPOINTS.donations}/${donationId}`);
  },

  /**
   * Update donation status (admin only)
   * PATCH /donations/:id/status
   */
  updateDonationStatus: async (
    donationId: string,
    updateData: DonationUpdateRequest
  ): Promise<DonationResponse> => {
    return api.patch<DonationResponse>(
      `${DONATION_ENDPOINTS.donations}/${donationId}/status`,
      updateData
    );
  },

  /**
   * Delete a donation (admin only)
   * DELETE /donations/:id
   */
  deleteDonation: async (donationId: string): Promise<{ success: boolean; message: string }> => {
    return api.delete<{ success: boolean; message: string }>(
      `${DONATION_ENDPOINTS.donations}/${donationId}`
    );
  },

  /**
   * Search donations (authenticated users)
   * GET /donations/search
   */
  searchDonations: async (
    searchQuery: string,
    filters: DonationFilters = {}
  ): Promise<DonationListResponse> => {
    const params = new URLSearchParams({ search: searchQuery });

    // Add additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && key !== 'search') {
        params.append(key, String(value));
      }
    });

    return api.get<DonationListResponse>(
      `${DONATION_ENDPOINTS.donationSearch}?${params.toString()}`
    );
  },

  /**
   * Get donation statistics (admin only)
   * GET /donations/stats
   */
  getDonationStats: async (): Promise<DonationStatsResponse> => {
    return api.get<DonationStatsResponse>(DONATION_ENDPOINTS.donationStats);
  },

  // ==================== DONOR OPERATIONS ====================

  /**
   * Get donors with filters and pagination
   * GET /donors
   */
  getDonors: async (
    filters: {
      search?: string;
      donation_tier?: string;
      is_recurring_donor?: boolean;
      donation_frequency?: string;
      created_after?: string;
      created_before?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{
    success: boolean;
    data: DonorProfile[];
    pagination: {
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      page: number;
      limit: number;
      totalCount: number;
    };
  }> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    const url = queryString
      ? `${DONATION_ENDPOINTS.donors}?${queryString}`
      : DONATION_ENDPOINTS.donors;

    return api.get(url);
  },

  /**
   * Get a single donor profile by user ID
   * GET /donors/:userId
   */
  getDonorById: async (
    userId: string
  ): Promise<{
    success: boolean;
    data: DonorProfile;
  }> => {
    return api.get(`${DONATION_ENDPOINTS.donors}/${userId}`);
  },

  /**
   * Get a single donor profile (alias for getDonorById)
   * GET /donors/:userId
   */
  getDonor: async (
    userId: string
  ): Promise<{
    success: boolean;
    data: DonorProfile;
  }> => {
    return api.get(`${DONATION_ENDPOINTS.donors}/${userId}`);
  },

  /**
   * Update donor profile
   * PUT /donors/:userId
   */
  updateDonorProfile: async (
    userId: string,
    profileData: Partial<DonorProfile>
  ): Promise<{
    success: boolean;
    data: DonorProfile;
    message: string;
  }> => {
    return api.put(`${DONATION_ENDPOINTS.donors}/${userId}`, profileData);
  },

  /**
   * Get donor statistics (admin only)
   * GET /donors/stats
   */
  getDonorStats: async (): Promise<DonorStatsResponse> => {
    return api.get<DonorStatsResponse>(DONATION_ENDPOINTS.donorStats);
  },

  // ==================== USER DONATION HISTORY ====================

  /**
   * Get current user's donation history
   * GET /donors/me/donations
   */
  getUserDonationHistory: async (
    filters: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<DonationListResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const queryString = params.toString();
    const url = queryString ? `/donors/me/donations?${queryString}` : '/donors/me/donations';

    if (import.meta.env.DEV) {
      console.log('🔍 Fetching user donation history from:', url);
    }

    return api.get<DonationListResponse>(url);
  },

  /**
   * Get current user's donor profile
   * GET /donors/me (or similar endpoint)
   */
  getCurrentUserDonorProfile: async (): Promise<{
    success: boolean;
    data: DonorProfile | null;
  }> => {
    try {
      if (import.meta.env.DEV) {
        console.log('🔍 Fetching current user donor profile from: /donors/me');
      }

      return api.get('/donors/me');
    } catch (error: any) {
      // If user doesn't have a donor profile yet, return null
      if (error.status === 404) {
        if (import.meta.env.DEV) {
          console.log('ℹ️ User does not have a donor profile yet');
        }
        return { success: true, data: null };
      }
      throw error;
    }
  },

  // ==================== CAMPAIGN DONATIONS ====================

  /**
   * Get donations for a specific campaign
   * GET /donations?campaign_id=:id
   */
  getCampaignDonations: async (
    campaignId: string,
    filters: DonationFilters = {}
  ): Promise<DonationListResponse> => {
    return donationApi.getDonations({
      ...filters,
      campaign_id: campaignId,
    });
  },

  /**
   * Get donation statistics for a specific campaign
   * GET /campaigns/:id/donations/stats (if available)
   */
  getCampaignDonationStats: async (
    campaignId: string
  ): Promise<{
    success: boolean;
    data: {
      total_donations: number;
      total_amount: string;
      average_donation: string;
      recent_donations: Donation[];
    };
  }> => {
    // This might need to be implemented in the backend or derived from getDonations
    const donations = await donationApi.getCampaignDonations(campaignId, { limit: 100 });

    if (!donations.success) {
      throw new Error('Failed to fetch campaign donations');
    }

    const totalDonations = donations.data.length;
    const totalAmount = donations.data.reduce(
      (sum, donation) => sum + parseFloat(donation.amount),
      0
    );
    const averageDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;

    return {
      success: true,
      data: {
        total_donations: totalDonations,
        total_amount: totalAmount.toFixed(2),
        average_donation: averageDonation.toFixed(2),
        recent_donations: donations.data.slice(0, 5),
      },
    };
  },

  // ==================== TIER MANAGEMENT ====================

  /**
   * Get tier statistics (admin only)
   * GET /donors/tier-stats
   */
  getTierStats: async () => {
    return api.get(DONATION_ENDPOINTS.tierStats);
  },

  /**
   * Bulk recalculate all donor tiers (admin only)
   * POST /donors/recalculate-tiers
   */
  bulkRecalculateTiers: async (options: { dryRun?: boolean; batchSize?: number } = {}) => {
    return api.post(DONATION_ENDPOINTS.recalculateTiers, options);
  },

  /**
   * Recalculate single donor tier (admin only)
   * POST /donors/:id/recalculate-tier
   */
  recalculateSingleTier: async (donorId: string) => {
    return api.post(DONATION_ENDPOINTS.recalculateSingleTier(donorId));
  },
};

export default donationApi;
