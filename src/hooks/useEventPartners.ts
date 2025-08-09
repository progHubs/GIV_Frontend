/**
 * Event Partner React Query Hooks
 * Centralized event partner data fetching with automatic caching and deduplication
 * Following campaign partner patterns
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventPartnerApi, eventPartnerQueryKeys } from '../lib/eventPartnerApi';
import { toast } from 'react-hot-toast';
import type {
  EventPartner,
  EventPartnerFormData,
  EventPartnerUpdateData,
  EventPartnerFilters,
} from '../types/eventPartner';

/**
 * Hook for fetching event partners
 */
export const useEventPartners = (
  eventId: string,
  filters?: EventPartnerFilters
) => {
  return useQuery({
    queryKey: eventPartnerQueryKeys.list(eventId, filters),
    queryFn: () => eventPartnerApi.getEventPartners(eventId, filters),
    select: data => {
      if (data.success) {
        return data.data;
      }
      return [];
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for fetching a single event partner
 */
export const useEventPartner = (eventId: string, partnerId: string) => {
  return useQuery({
    queryKey: eventPartnerQueryKeys.detail(eventId, partnerId),
    queryFn: () => eventPartnerApi.getEventPartner(eventId, partnerId),
    select: data => {
      if (data.success) {
        return data.data;
      }
      return null;
    },
    enabled: !!eventId && !!partnerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for creating an event partner
 */
export const useCreateEventPartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: EventPartnerFormData }) =>
      eventPartnerApi.createEventPartner(eventId, data),
    onSuccess: (response, { eventId }) => {
      if (response.success) {
        // Invalidate and refetch event partners list
        queryClient.invalidateQueries({
          queryKey: eventPartnerQueryKeys.lists(),
        });

        // Invalidate event data to update partner count
        queryClient.invalidateQueries({
          queryKey: ['events', 'detail', eventId],
        });

        // Add the new partner to the cache
        queryClient.setQueryData(
          eventPartnerQueryKeys.detail(eventId, response.data.id),
          response
        );

        toast.success('Event partner created successfully');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create event partner');
    },
  });
};

/**
 * Hook for updating an event partner
 */
export const useUpdateEventPartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      partnerId,
      data,
    }: {
      eventId: string;
      partnerId: string;
      data: EventPartnerUpdateData;
    }) => eventPartnerApi.updateEventPartner(eventId, partnerId, data),
    onMutate: async ({ eventId, partnerId, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: eventPartnerQueryKeys.detail(eventId, partnerId),
      });

      // Snapshot the previous value
      const previousPartner = queryClient.getQueryData(
        eventPartnerQueryKeys.detail(eventId, partnerId)
      );

      // Optimistically update the cache
      queryClient.setQueryData(
        eventPartnerQueryKeys.detail(eventId, partnerId),
        (old: EventPartner | undefined) => {
          if (old) {
            return { ...old, ...data };
          }
          return old;
        }
      );

      // Return a context object with the snapshotted value
      return { previousPartner };
    },
    onError: (error: any, { eventId, partnerId }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPartner) {
        queryClient.setQueryData(
          eventPartnerQueryKeys.detail(eventId, partnerId),
          context.previousPartner
        );
      }
      toast.error(error.message || 'Failed to update event partner');
    },
    onSuccess: (response, { eventId, partnerId }) => {
      if (response.success) {
        toast.success('Event partner updated successfully');
      }
    },
    onSettled: (response, error, { eventId, partnerId }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: eventPartnerQueryKeys.detail(eventId, partnerId),
      });
      queryClient.invalidateQueries({
        queryKey: eventPartnerQueryKeys.lists(),
      });
    },
  });
};

/**
 * Hook for deleting an event partner
 */
export const useDeleteEventPartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, partnerId }: { eventId: string; partnerId: string }) =>
      eventPartnerApi.deleteEventPartner(eventId, partnerId),
    onMutate: async ({ eventId, partnerId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: eventPartnerQueryKeys.lists(),
      });

      // Snapshot the previous value
      const previousPartners = queryClient.getQueryData(
        eventPartnerQueryKeys.list(eventId)
      );

      // Optimistically remove the partner from the cache
      queryClient.setQueryData(
        eventPartnerQueryKeys.list(eventId),
        (old: EventPartner[] | undefined) => {
          if (old) {
            return old.filter(partner => partner.id !== partnerId);
          }
          return old;
        }
      );

      // Return a context object with the snapshotted value
      return { previousPartners };
    },
    onError: (error: any, { eventId }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPartners) {
        queryClient.setQueryData(
          eventPartnerQueryKeys.list(eventId),
          context.previousPartners
        );
      }
      toast.error(error.message || 'Failed to delete event partner');
    },
    onSuccess: (response, { eventId, partnerId }) => {
      if (response.success) {
        // Remove the partner from detail cache
        queryClient.removeQueries({
          queryKey: eventPartnerQueryKeys.detail(eventId, partnerId),
        });

        // Invalidate event data to update partner count
        queryClient.invalidateQueries({
          queryKey: ['events', 'detail', eventId],
        });

        toast.success(response.message || 'Event partner deleted successfully');
      }
    },
    onSettled: (response, error, { eventId }) => {
      // Always refetch the list after error or success
      queryClient.invalidateQueries({
        queryKey: eventPartnerQueryKeys.lists(),
      });
    },
  });
};

/**
 * Hook for getting active event partners only
 */
export const useActiveEventPartners = (eventId: string) => {
  return useEventPartners(eventId, { is_active: true });
};

/**
 * Utility hook for event partner operations
 */
export const useEventPartnerUtils = () => {
  const queryClient = useQueryClient();

  return {
    /**
     * Prefetch event partners for an event
     */
    prefetchEventPartners: (eventId: string, filters?: EventPartnerFilters) => {
      return queryClient.prefetchQuery({
        queryKey: eventPartnerQueryKeys.list(eventId, filters),
        queryFn: () => eventPartnerApi.getEventPartners(eventId, filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    },

    /**
     * Invalidate all event partner queries
     */
    invalidateAllEventPartners: () => {
      return queryClient.invalidateQueries({
        queryKey: eventPartnerQueryKeys.all,
      });
    },

    /**
     * Invalidate event partners for a specific event
     */
    invalidateEventPartners: (eventId: string) => {
      return queryClient.invalidateQueries({
        queryKey: eventPartnerQueryKeys.list(eventId),
      });
    },

    /**
     * Get cached event partners
     */
    getCachedEventPartners: (eventId: string, filters?: EventPartnerFilters) => {
      return queryClient.getQueryData(
        eventPartnerQueryKeys.list(eventId, filters)
      ) as EventPartner[] | undefined;
    },

    /**
     * Set event partners in cache
     */
    setEventPartnersCache: (eventId: string, partners: EventPartner[], filters?: EventPartnerFilters) => {
      queryClient.setQueryData(
        eventPartnerQueryKeys.list(eventId, filters),
        partners
      );
    },

    /**
     * Update a single partner in cache
     */
    updatePartnerInCache: (eventId: string, partnerId: string, updates: Partial<EventPartner>) => {
      // Update in detail cache
      queryClient.setQueryData(
        eventPartnerQueryKeys.detail(eventId, partnerId),
        (old: EventPartner | undefined) => {
          if (old) {
            return { ...old, ...updates };
          }
          return old;
        }
      );

      // Update in list cache
      queryClient.setQueryData(
        eventPartnerQueryKeys.list(eventId),
        (old: EventPartner[] | undefined) => {
          if (old) {
            return old.map(partner => 
              partner.id === partnerId ? { ...partner, ...updates } : partner
            );
          }
          return old;
        }
      );
    },

    /**
     * Remove partner from cache
     */
    removePartnerFromCache: (eventId: string, partnerId: string) => {
      // Remove from detail cache
      queryClient.removeQueries({
        queryKey: eventPartnerQueryKeys.detail(eventId, partnerId),
      });

      // Remove from list cache
      queryClient.setQueryData(
        eventPartnerQueryKeys.list(eventId),
        (old: EventPartner[] | undefined) => {
          if (old) {
            return old.filter(partner => partner.id !== partnerId);
          }
          return old;
        }
      );
    },
  };
};

/**
 * Hook for getting event partner statistics
 */
export const useEventPartnerStats = (eventId: string) => {
  const partners = useEventPartners(eventId);
  
  if (!partners) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
      withLogos: 0,
      withWebsites: 0,
      withDescriptions: 0,
    };
  }

  return {
    total: partners.length,
    active: partners.filter(p => p.is_active).length,
    inactive: partners.filter(p => !p.is_active).length,
    withLogos: partners.filter(p => p.logo_url).length,
    withWebsites: partners.filter(p => p.website).length,
    withDescriptions: partners.filter(p => p.description).length,
  };
};

/**
 * Hook to check if event has partners
 */
export const useEventHasPartners = (eventId: string) => {
  const partners = useEventPartners(eventId);
  return partners && partners.length > 0;
};

/**
 * Hook to check if event has active partners
 */
export const useEventHasActivePartners = (eventId: string) => {
  const activePartners = useActiveEventPartners(eventId);
  return activePartners && activePartners.length > 0;
};

// Export query keys for external use
export { eventPartnerQueryKeys };
