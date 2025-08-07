/**
 * Campaign Partner React Query Hooks
 * Centralized campaign partner data fetching with automatic caching and deduplication
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignPartnerApi, campaignPartnerQueryKeys } from '../lib/campaignPartnerApi';
import type {
  CampaignPartner,
  CampaignPartnerFormData,
  CampaignPartnerUpdateData,
  CampaignPartnerFilters,
} from '../types/campaignPartner';

/**
 * Hook for fetching campaign partners
 */
export const useCampaignPartners = (
  campaignId: string,
  filters?: CampaignPartnerFilters
) => {
  return useQuery({
    queryKey: campaignPartnerQueryKeys.list(campaignId, filters),
    queryFn: () => campaignPartnerApi.getCampaignPartners(campaignId, filters),
    select: data => {
      if (data.success) {
        return data.data;
      }
      return [];
    },
    enabled: !!campaignId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for fetching a single campaign partner
 */
export const useCampaignPartner = (campaignId: string, partnerId: string) => {
  return useQuery({
    queryKey: campaignPartnerQueryKeys.detail(campaignId, partnerId),
    queryFn: () => campaignPartnerApi.getCampaignPartner(campaignId, partnerId),
    select: data => {
      if (data.success) {
        return data.data;
      }
      return null;
    },
    enabled: !!campaignId && !!partnerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for creating a campaign partner
 */
export const useCreateCampaignPartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ campaignId, data }: { campaignId: string; data: CampaignPartnerFormData }) =>
      campaignPartnerApi.createCampaignPartner(campaignId, data),
    onSuccess: (response, { campaignId }) => {
      if (response.success) {
        // Invalidate and refetch campaign partners list
        queryClient.invalidateQueries({
          queryKey: campaignPartnerQueryKeys.lists(),
        });

        // Invalidate campaign data to update partner count
        queryClient.invalidateQueries({
          queryKey: ['campaigns', 'detail', campaignId],
        });

        // Add the new partner to the cache
        queryClient.setQueryData(
          campaignPartnerQueryKeys.detail(campaignId, response.data.id),
          response
        );
      }
    },
    onError: (error) => {
      console.error('Failed to create campaign partner:', error);
    },
  });
};

/**
 * Hook for updating a campaign partner
 */
export const useUpdateCampaignPartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      campaignId,
      partnerId,
      data,
    }: {
      campaignId: string;
      partnerId: string;
      data: CampaignPartnerUpdateData;
    }) => campaignPartnerApi.updateCampaignPartner(campaignId, partnerId, data),
    onMutate: async ({ campaignId, partnerId, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: campaignPartnerQueryKeys.detail(campaignId, partnerId),
      });

      // Snapshot the previous value
      const previousPartner = queryClient.getQueryData(
        campaignPartnerQueryKeys.detail(campaignId, partnerId)
      );

      // Optimistically update the cache
      queryClient.setQueryData(
        campaignPartnerQueryKeys.detail(campaignId, partnerId),
        (old: any) => {
          if (old?.success) {
            return {
              ...old,
              data: { ...old.data, ...data },
            };
          }
          return old;
        }
      );

      // Return a context object with the snapshotted value
      return { previousPartner };
    },
    onError: (error, { campaignId, partnerId }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPartner) {
        queryClient.setQueryData(
          campaignPartnerQueryKeys.detail(campaignId, partnerId),
          context.previousPartner
        );
      }
      console.error('Failed to update campaign partner:', error);
    },
    onSettled: (response, error, { campaignId, partnerId }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: campaignPartnerQueryKeys.detail(campaignId, partnerId),
      });
      queryClient.invalidateQueries({
        queryKey: campaignPartnerQueryKeys.lists(),
      });
    },
  });
};

/**
 * Hook for deleting a campaign partner
 */
export const useDeleteCampaignPartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ campaignId, partnerId }: { campaignId: string; partnerId: string }) =>
      campaignPartnerApi.deleteCampaignPartner(campaignId, partnerId),
    onMutate: async ({ campaignId, partnerId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: campaignPartnerQueryKeys.lists(),
      });

      // Snapshot the previous value
      const previousPartners = queryClient.getQueryData(
        campaignPartnerQueryKeys.list(campaignId)
      );

      // Optimistically remove the partner from the cache
      queryClient.setQueryData(
        campaignPartnerQueryKeys.list(campaignId),
        (old: CampaignPartner[] | undefined) => {
          if (old) {
            return old.filter(partner => partner.id !== partnerId);
          }
          return old;
        }
      );

      // Return a context object with the snapshotted value
      return { previousPartners };
    },
    onError: (error, { campaignId }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPartners) {
        queryClient.setQueryData(
          campaignPartnerQueryKeys.list(campaignId),
          context.previousPartners
        );
      }
      console.error('Failed to delete campaign partner:', error);
    },
    onSuccess: (response, { campaignId, partnerId }) => {
      if (response.success) {
        // Remove the partner from detail cache
        queryClient.removeQueries({
          queryKey: campaignPartnerQueryKeys.detail(campaignId, partnerId),
        });

        // Invalidate campaign data to update partner count
        queryClient.invalidateQueries({
          queryKey: ['campaigns', 'detail', campaignId],
        });
      }
    },
    onSettled: (response, error, { campaignId }) => {
      // Always refetch the list after error or success
      queryClient.invalidateQueries({
        queryKey: campaignPartnerQueryKeys.lists(),
      });
    },
  });
};

/**
 * Hook for getting active campaign partners only
 */
export const useActiveCampaignPartners = (campaignId: string) => {
  return useCampaignPartners(campaignId, { is_active: true });
};

/**
 * Utility hook for campaign partner operations
 */
export const useCampaignPartnerUtils = () => {
  const queryClient = useQueryClient();

  return {
    /**
     * Prefetch campaign partners for a campaign
     */
    prefetchCampaignPartners: (campaignId: string, filters?: CampaignPartnerFilters) => {
      return queryClient.prefetchQuery({
        queryKey: campaignPartnerQueryKeys.list(campaignId, filters),
        queryFn: () => campaignPartnerApi.getCampaignPartners(campaignId, filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    },

    /**
     * Invalidate all campaign partner queries
     */
    invalidateAllCampaignPartners: () => {
      return queryClient.invalidateQueries({
        queryKey: campaignPartnerQueryKeys.all,
      });
    },

    /**
     * Invalidate campaign partners for a specific campaign
     */
    invalidateCampaignPartners: (campaignId: string) => {
      return queryClient.invalidateQueries({
        queryKey: campaignPartnerQueryKeys.list(campaignId),
      });
    },

    /**
     * Get cached campaign partners
     */
    getCachedCampaignPartners: (campaignId: string, filters?: CampaignPartnerFilters) => {
      return queryClient.getQueryData(
        campaignPartnerQueryKeys.list(campaignId, filters)
      ) as CampaignPartner[] | undefined;
    },
  };
};

// Export query keys for external use
export { campaignPartnerQueryKeys };
