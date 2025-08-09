// Event Volunteer Hooks
// React Query hooks for event volunteer-related operations
// Mirroring campaign volunteer patterns

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventVolunteerApi, eventVolunteerQueryKeys } from '../lib/eventVolunteerApi';
import { toast } from 'react-hot-toast';
import type {
  EventVolunteer,
  EventVolunteerApplicationRequest,
  EventVolunteerStatusUpdateData,
  EventVolunteerFilters,
  EventVolunteerBulkAction,
} from '../types/eventVolunteer';

// ==================== VOLUNTEER APPLICATION HOOKS ====================

/**
 * Hook for applying to volunteer for an event
 */
export const useApplyEventVolunteer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: EventVolunteerApplicationRequest }) =>
      eventVolunteerApi.applyForEvent(eventId, data),
    onSuccess: (response, { eventId }) => {
      if (response.success) {
        // Invalidate event volunteers
        queryClient.invalidateQueries({
          queryKey: eventVolunteerQueryKeys.list(eventId),
        });
        // Invalidate user's volunteer events
        queryClient.invalidateQueries({
          queryKey: eventVolunteerQueryKeys.myEvents(),
        });
        // Invalidate volunteer stats
        queryClient.invalidateQueries({
          queryKey: eventVolunteerQueryKeys.stats(),
        });
        // Invalidate event details to update volunteer count
        queryClient.invalidateQueries({
          queryKey: ['events', 'detail', eventId],
        });
        toast.success('Volunteer application submitted successfully');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit volunteer application');
    },
  });
};

/**
 * Hook for getting user's volunteer application for an event
 */
export const useEventVolunteerApplication = (eventId: string) => {
  return useQuery({
    queryKey: eventVolunteerQueryKeys.application(eventId),
    queryFn: () => eventVolunteerApi.getVolunteerApplication(eventId),
    select: data => (data.success ? data.data : null),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for withdrawing volunteer application
 */
export const useWithdrawEventVolunteerApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, reason }: { eventId: string; reason?: string }) =>
      eventVolunteerApi.withdrawApplication(eventId, reason),
    onSuccess: (response, { eventId }) => {
      if (response.success) {
        // Invalidate volunteer application
        queryClient.invalidateQueries({
          queryKey: eventVolunteerQueryKeys.application(eventId),
        });
        // Invalidate user's volunteer events
        queryClient.invalidateQueries({
          queryKey: eventVolunteerQueryKeys.myEvents(),
        });
        // Invalidate event volunteers
        queryClient.invalidateQueries({
          queryKey: eventVolunteerQueryKeys.list(eventId),
        });
        toast.success(response.message || 'Application withdrawn successfully');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to withdraw application');
    },
  });
};

/**
 * Hook for getting user's volunteer events
 */
export const useMyEventVolunteerEvents = (filters?: EventVolunteerFilters) => {
  return useQuery({
    queryKey: eventVolunteerQueryKeys.myEvents(filters),
    queryFn: () => eventVolunteerApi.getMyVolunteerEvents(filters),
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
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// ==================== EVENT VOLUNTEER MANAGEMENT HOOKS ====================

/**
 * Hook for getting volunteers for an event (Admin only)
 */
export const useEventVolunteers = (eventId: string, filters?: EventVolunteerFilters) => {
  return useQuery({
    queryKey: eventVolunteerQueryKeys.list(eventId, filters),
    queryFn: () => eventVolunteerApi.getEventVolunteers(eventId, filters),
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
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true, // For smooth pagination
  });
};

/**
 * Hook for updating volunteer status (Admin only)
 */
export const useUpdateEventVolunteerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      userId,
      data,
    }: {
      eventId: string;
      userId: string;
      data: EventVolunteerStatusUpdateData;
    }) => eventVolunteerApi.updateVolunteerStatus(eventId, userId, data),
    onSuccess: (response, { eventId, userId }) => {
      if (response.success) {
        // Update volunteer in cache
        queryClient.setQueryData(
          eventVolunteerQueryKeys.detail(eventId, userId),
          response
        );
        // Invalidate event volunteers
        queryClient.invalidateQueries({
          queryKey: eventVolunteerQueryKeys.list(eventId),
        });
        // Invalidate volunteer stats
        queryClient.invalidateQueries({
          queryKey: eventVolunteerQueryKeys.stats(),
        });
        // Invalidate event details to update volunteer count
        queryClient.invalidateQueries({
          queryKey: ['events', 'detail', eventId],
        });
        toast.success('Volunteer status updated successfully');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update volunteer status');
    },
  });
};

/**
 * Hook for removing volunteer from event (Admin only)
 */
export const useRemoveEventVolunteer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      userId,
      reason,
    }: {
      eventId: string;
      userId: string;
      reason?: string;
    }) => eventVolunteerApi.removeVolunteerFromEvent(eventId, userId, reason),
    onSuccess: (response, { eventId, userId }) => {
      if (response.success) {
        // Remove volunteer from cache
        queryClient.removeQueries({
          queryKey: eventVolunteerQueryKeys.detail(eventId, userId),
        });
        // Invalidate event volunteers
        queryClient.invalidateQueries({
          queryKey: eventVolunteerQueryKeys.list(eventId),
        });
        // Invalidate volunteer stats
        queryClient.invalidateQueries({
          queryKey: eventVolunteerQueryKeys.stats(),
        });
        // Invalidate event details
        queryClient.invalidateQueries({
          queryKey: ['events', 'detail', eventId],
        });
        toast.success(response.message || 'Volunteer removed successfully');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove volunteer');
    },
  });
};

// ==================== STATISTICS AND REPORTING HOOKS ====================

/**
 * Hook for getting volunteer statistics (Admin only)
 */
export const useEventVolunteerStats = (eventId?: string) => {
  return useQuery({
    queryKey: eventId ? eventVolunteerQueryKeys.eventStats(eventId) : eventVolunteerQueryKeys.stats(),
    queryFn: () => 
      eventId 
        ? eventVolunteerApi.getEventVolunteerStats(eventId)
        : eventVolunteerApi.getVolunteerStats(),
    select: data => (data.success ? data.data : null),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

// ==================== BULK OPERATIONS HOOKS ====================

/**
 * Hook for bulk volunteer actions (Admin only)
 */
export const useBulkEventVolunteerActions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EventVolunteerBulkAction) => eventVolunteerApi.bulkVolunteerActions(data),
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate all volunteer queries
        queryClient.invalidateQueries({
          queryKey: eventVolunteerQueryKeys.all,
        });
        // Invalidate event details for affected events
        queryClient.invalidateQueries({
          queryKey: ['events'],
        });
        toast.success(`Successfully processed ${response.processed} volunteers`);
        if (response.failed > 0) {
          toast.error(`Failed to process ${response.failed} volunteers`);
        }
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to perform bulk action');
    },
  });
};

// ==================== CERTIFICATE MANAGEMENT HOOKS ====================

/**
 * Hook for downloading volunteer certificate
 */
export const useDownloadEventVolunteerCertificate = () => {
  return useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      eventVolunteerApi.downloadCertificate(eventId, userId),
    onSuccess: (blob, { eventId, userId }) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `volunteer_certificate_${eventId}_${userId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Certificate downloaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to download certificate');
    },
  });
};

/**
 * Hook for generating volunteer certificate (Admin only)
 */
export const useGenerateEventVolunteerCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      eventVolunteerApi.generateCertificate(eventId, userId),
    onSuccess: (response, { eventId, userId }) => {
      if (response.success) {
        // Update volunteer in cache with certificate URL
        queryClient.setQueryData(
          eventVolunteerQueryKeys.detail(eventId, userId),
          (old: any) => {
            if (old?.success) {
              return {
                ...old,
                data: {
                  ...old.data,
                  certificate_url: response.data.certificate_url,
                },
              };
            }
            return old;
          }
        );
        // Invalidate event volunteers to refresh the list
        queryClient.invalidateQueries({
          queryKey: eventVolunteerQueryKeys.list(eventId),
        });
        toast.success('Certificate generated successfully');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to generate certificate');
    },
  });
};

// ==================== UTILITY HOOKS ====================

/**
 * Hook to check if user has applied to volunteer for an event
 */
export const useHasAppliedToEventVolunteer = (eventId: string) => {
  const { data: application } = useEventVolunteerApplication(eventId);
  return !!application;
};

/**
 * Hook to get user's application status for an event
 */
export const useEventVolunteerApplicationStatus = (eventId: string) => {
  const { data: application } = useEventVolunteerApplication(eventId);
  return application?.status || null;
};

/**
 * Hook to check if user can apply to volunteer for an event
 */
export const useCanApplyToEventVolunteer = (eventId: string) => {
  const hasApplied = useHasAppliedToEventVolunteer(eventId);
  const applicationStatus = useEventVolunteerApplicationStatus(eventId);

  // User can apply if they haven't applied or if their application was rejected
  return !hasApplied || applicationStatus === 'rejected';
};

/**
 * Hook to check if volunteer application can be withdrawn
 */
export const useCanWithdrawEventVolunteerApplication = (eventId: string) => {
  const applicationStatus = useEventVolunteerApplicationStatus(eventId);
  return applicationStatus === 'waiting' || applicationStatus === 'approved';
};

/**
 * Hook to get user's active volunteer events count
 */
export const useActiveEventVolunteerCount = () => {
  const { data: volunteerEvents } = useMyEventVolunteerEvents({ status: 'approved' });
  return volunteerEvents?.data?.length || 0;
};

/**
 * Hook to check if user is an active event volunteer
 */
export const useIsActiveEventVolunteer = () => {
  const activeCount = useActiveEventVolunteerCount();
  return activeCount > 0;
};

/**
 * Hook to get user's completed volunteer events
 */
export const useCompletedEventVolunteerEvents = () => {
  const { data: volunteerEvents } = useMyEventVolunteerEvents({ status: 'completed' });
  return volunteerEvents?.data || [];
};

/**
 * Hook to get user's total volunteer hours for events
 */
export const useEventVolunteerTotalHours = () => {
  const completedEvents = useCompletedEventVolunteerEvents();
  return completedEvents.reduce((total, volunteer) => total + volunteer.hours_completed, 0);
};

// Export query keys for external use
export { eventVolunteerQueryKeys };
