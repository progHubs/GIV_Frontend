/**
 * Campaign React Query Hooks
 * Centralized campaign data fetching with automatic caching and deduplication
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignApi } from '../lib/campaignApi';
import { queryKeys } from '../lib/queryClient';
import type { CampaignFilters } from '../types';

// Hook for fetching campaigns with filters
export const useCampaigns = (filters: CampaignFilters) => {
  return useQuery({
    queryKey: queryKeys.campaigns.list(filters),
    queryFn: () => campaignApi.getCampaigns(filters),
    select: data => {
      if (data.success) {
        return data;
      }
      // Return a properly typed fallback object
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
    // Balanced cache settings for pagination
    staleTime: 1000, // 1 second stale time
    gcTime: 5 * 60 * 1000, // 5 minutes cache time
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

// Hook for fetching campaign statistics
export const useCampaignStats = () => {
  return useQuery({
    queryKey: queryKeys.campaigns.stats(),
    queryFn: () => campaignApi.getCampaignStats(),
    select: data => (data.success ? data.data : null),
    // Performance optimizations for stats
    staleTime: 5 * 60 * 1000, // 5 minutes for stats (changes less frequently)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

// Hook for fetching a single campaign
export const useCampaign = (id: string) => {
  return useQuery({
    queryKey: queryKeys.campaigns.detail(id),
    queryFn: () => campaignApi.getCampaignById(id),
    select: data => (data.success ? data.data : null),
    enabled: !!id,
  });
};

// Mutation hooks for admin operations
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => campaignApi.admin.createCampaign(data),
    onSuccess: () => {
      // Invalidate and refetch campaigns and stats
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      campaignApi.admin.updateCampaign(id, data),
    onSuccess: () => {
      // Invalidate and refetch campaigns and stats
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => campaignApi.admin.deleteCampaign(id),
    onSuccess: () => {
      // Invalidate and refetch campaigns and stats
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
    },
  });
};
