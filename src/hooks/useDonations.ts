// Donation Hooks
// React Query hooks for donation-related operations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { donationApi } from '../lib/donationApi';
import type {
  DonationRequest,
  DonationFilters,
  DonationUpdateRequest,
  DonorProfile,
} from '../types/donation';

// Query Keys for React Query
export const donationQueryKeys = {
  all: ['donations'] as const,
  lists: () => [...donationQueryKeys.all, 'list'] as const,
  list: (filters: DonationFilters) => [...donationQueryKeys.lists(), filters] as const,
  details: () => [...donationQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...donationQueryKeys.details(), id] as const,
  stats: () => [...donationQueryKeys.all, 'stats'] as const,
  userHistory: () => [...donationQueryKeys.all, 'userHistory'] as const,
  campaignDonations: (campaignId: string) =>
    [...donationQueryKeys.all, 'campaign', campaignId] as const,

  // Donor-related keys
  donors: {
    all: ['donors'] as const,
    lists: () => [...donationQueryKeys.donors.all, 'list'] as const,
    list: (filters: any) => [...donationQueryKeys.donors.lists(), filters] as const,
    details: () => [...donationQueryKeys.donors.all, 'detail'] as const,
    detail: (id: string) => [...donationQueryKeys.donors.details(), id] as const,
    stats: () => [...donationQueryKeys.donors.all, 'stats'] as const,
    current: () => [...donationQueryKeys.donors.all, 'current'] as const,
  },
};

// ==================== DONATION HOOKS ====================

/**
 * Hook for fetching donations with filters
 */
export const useDonations = (
  filters: DonationFilters = {},
  options: { enabled?: boolean } = {}
) => {
  return useQuery({
    queryKey: donationQueryKeys.list(filters),
    queryFn: () => donationApi.getDonations(filters),
    enabled: options.enabled !== false,
    select: data => {
      if (data.success) {
        return data;
      }
      return {
        success: true,
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          page: 1,
          limit: 10,
          totalCount: 0,
        },
      };
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook for fetching a single donation
 */
export const useDonation = (donationId: string) => {
  return useQuery({
    queryKey: donationQueryKeys.detail(donationId),
    queryFn: () => donationApi.getDonationById(donationId),
    select: data => (data.success ? data.data : null),
    enabled: !!donationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching donation statistics (admin)
 */
export const useDonationStats = () => {
  return useQuery({
    queryKey: donationQueryKeys.stats(),
    queryFn: () => donationApi.getDonationStats(),
    select: data => (data.success ? data.data : null),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook for creating a donation
 */
export const useCreateDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (donationData: DonationRequest) => donationApi.createDonation(donationData),
    onSuccess: (_, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: donationQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: donationQueryKeys.donors.all });

      // Invalidate campaign-specific donations
      if (variables.campaign_id) {
        queryClient.invalidateQueries({
          queryKey: donationQueryKeys.campaignDonations(variables.campaign_id),
        });
      }

      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: donationQueryKeys.stats() });
      queryClient.invalidateQueries({ queryKey: donationQueryKeys.donors.stats() });
    },
  });
};

/**
 * Hook for updating donation status (admin)
 */
export const useUpdateDonationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      donationId,
      updateData,
    }: {
      donationId: string;
      updateData: DonationUpdateRequest;
    }) => donationApi.updateDonationStatus(donationId, updateData),
    onSuccess: (data, variables) => {
      // Update the specific donation in cache
      queryClient.setQueryData(donationQueryKeys.detail(variables.donationId), {
        success: true,
        data: data.data,
      });

      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: donationQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: donationQueryKeys.stats() });
    },
  });
};

/**
 * Hook for deleting a donation (admin)
 */
export const useDeleteDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (donationId: string) => donationApi.deleteDonation(donationId),
    onSuccess: (_, donationId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: donationQueryKeys.detail(donationId) });

      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: donationQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: donationQueryKeys.stats() });
      queryClient.invalidateQueries({ queryKey: donationQueryKeys.donors.stats() });
    },
  });
};

/**
 * Hook for searching donations
 */
export const useSearchDonations = (searchQuery: string, filters: DonationFilters = {}) => {
  return useQuery({
    queryKey: [...donationQueryKeys.all, 'search', searchQuery, filters],
    queryFn: () => donationApi.searchDonations(searchQuery, filters),
    select: data => (data.success ? data : { success: true, data: [], pagination: {} }),
    enabled: !!searchQuery && searchQuery.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// ==================== USER DONATION HOOKS ====================

/**
 * Hook for fetching current user's donation history
 */
export const useUserDonationHistory = (
  filters: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
) => {
  return useQuery({
    queryKey: [...donationQueryKeys.userHistory(), filters],
    queryFn: () => donationApi.getUserDonationHistory(filters),
    select: data => (data.success ? data : { success: true, data: [], pagination: {} }),
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook for fetching current user's donor profile
 */
export const useCurrentUserDonorProfile = () => {
  return useQuery({
    queryKey: donationQueryKeys.donors.current(),
    queryFn: () => donationApi.getCurrentUserDonorProfile(),
    select: data => (data.success ? data.data : null),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ==================== CAMPAIGN DONATION HOOKS ====================

/**
 * Hook for fetching donations for a specific campaign
 */
export const useCampaignDonations = (campaignId: string, filters: DonationFilters = {}) => {
  return useQuery({
    queryKey: donationQueryKeys.campaignDonations(campaignId),
    queryFn: () => donationApi.getCampaignDonations(campaignId, filters),
    select: data => (data.success ? data : { success: true, data: [], pagination: {} }),
    enabled: !!campaignId,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook for fetching campaign donation statistics
 */
export const useCampaignDonationStats = (campaignId: string) => {
  return useQuery({
    queryKey: [...donationQueryKeys.campaignDonations(campaignId), 'stats'],
    queryFn: () => donationApi.getCampaignDonationStats(campaignId),
    select: data => (data.success ? data.data : null),
    enabled: !!campaignId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ==================== DONOR HOOKS ====================

/**
 * Hook for fetching donors (admin)
 */
export const useDonors = (filters: any = {}) => {
  return useQuery({
    queryKey: donationQueryKeys.donors.list(filters),
    queryFn: () => donationApi.getDonors(filters),
    select: data => (data.success ? data : { success: true, data: [], pagination: {} }),
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook for fetching donor statistics (admin)
 */
export const useDonorStats = () => {
  return useQuery({
    queryKey: donationQueryKeys.donors.stats(),
    queryFn: () => donationApi.getDonorStats(),
    select: data => (data.success ? data.data : null),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching a single donor profile (admin)
 */
export const useDonor = (userId: string) => {
  return useQuery({
    queryKey: donationQueryKeys.donors.detail(userId),
    queryFn: () => donationApi.getDonorById(userId),
    select: data => (data.success ? data.data : null),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching a donor profile (alias for useDonor)
 */
export const useDonorProfile = (donorId?: string) => {
  return useQuery({
    queryKey: donationQueryKeys.donors.detail(donorId || ''),
    queryFn: () => donationApi.getDonor(donorId || ''),
    select: data => (data.success ? data.data : null),
    enabled: !!donorId,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook for updating donor profile
 */
export const useUpdateDonorProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, profileData }: { userId: string; profileData: Partial<DonorProfile> }) =>
      donationApi.updateDonorProfile(userId, profileData),
    onSuccess: (data, variables) => {
      // Update the specific donor in cache
      queryClient.setQueryData(donationQueryKeys.donors.detail(variables.userId), data.data);

      // Invalidate lists and current user profile
      queryClient.invalidateQueries({ queryKey: donationQueryKeys.donors.lists() });
      queryClient.invalidateQueries({ queryKey: donationQueryKeys.donors.current() });
    },
  });
};

// ==================== TIER MANAGEMENT HOOKS ====================

/**
 * Hook for fetching tier statistics (admin)
 */
export const useTierStats = () => {
  return useQuery({
    queryKey: ['tierStats'],
    queryFn: () => donationApi.getTierStats(),
    select: data => (data.success ? data.data : null),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for bulk tier recalculation (admin)
 */
export const useBulkRecalculateTiers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: { dryRun?: boolean; batchSize?: number }) =>
      donationApi.bulkRecalculateTiers(options),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: donationQueryKeys.donors.all });
      queryClient.invalidateQueries({ queryKey: ['tierStats'] });
    },
  });
};

/**
 * Hook for single donor tier recalculation (admin)
 */
export const useRecalculateSingleTier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (donorId: string) => donationApi.recalculateSingleTier(donorId),
    onSuccess: (_, donorId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: donationQueryKeys.donors.all });
      queryClient.invalidateQueries({ queryKey: donationQueryKeys.donors.detail(donorId) });
      queryClient.invalidateQueries({ queryKey: ['tierStats'] });
    },
  });
};

// ==================== ADVANCED FILTERING HOOKS ====================

/**
 * Hook for fetching filter options
 */
export const useDonationFilterOptions = () => {
  return useQuery({
    queryKey: ['donation-filter-options'],
    queryFn: () => donationApi.getFilterOptions(),
    select: data => (data.success ? data.data : null),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook for advanced donation filtering
 */
export const useAdvancedDonationFiltering = (
  filters: any,
  pagination: any = {},
  options: { enabled?: boolean } = {}
) => {
  return useQuery({
    queryKey: ['donations-advanced', filters, pagination],
    queryFn: () => donationApi.getAdvancedFilteredDonations(filters, pagination),
    select: data => (data.success ? data : { success: true, data: [], pagination: {} }),
    enabled: options.enabled !== false && Object.keys(filters).length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true, // For smooth pagination
  });
};

/**
 * Hook for donation statistics with filters
 */
export const useDonationStatistics = (filters: any) => {
  return useQuery({
    queryKey: ['donation-statistics', filters],
    queryFn: () => donationApi.getDonationStatistics(filters),
    select: data => {
      if (!data.success || !data.data) return null;

      const stats = data.data;
      // Map backend response to frontend expected format
      return {
        totalDonations: stats.total_donations || 0,
        totalAmount: `$${(stats.total_amount || 0).toLocaleString()}`,
        averageDonation: `$${(stats.average_amount || 0).toLocaleString()}`,
        uniqueDonors: stats.unique_donors || 0,

        // Payment method breakdown
        paymentMethods:
          stats.payment_method_breakdown?.map((method: any) => ({
            method: method.payment_method,
            count: method._count.id,
            amount: method._sum.amount,
          })) || [],

        // Donation type breakdown
        donationTypes:
          stats.donation_type_breakdown?.map((type: any) => ({
            type: type.donation_type,
            count: type._count.id,
            amount: type._sum.amount,
          })) || [],

        // Currency breakdown
        currencies:
          stats.currency_breakdown?.map((currency: any) => ({
            currency: currency.currency,
            count: currency._count.id,
            amount: currency._sum.amount,
          })) || [],

        // Campaign breakdown
        campaigns:
          stats.campaign_breakdown?.map((campaign: any) => ({
            campaign_id: campaign.campaign_id,
            count: campaign._count.id,
            amount: campaign._sum.amount,
          })) || [],
      };
    },
    enabled: Object.keys(filters).length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
