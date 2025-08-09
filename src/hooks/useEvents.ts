// Event Hooks
// React Query hooks for event-related operations
// Following campaign hook patterns

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventApi, eventQueryKeys } from '../lib/eventApi';
import { toast } from 'react-hot-toast';
import type {
  Event,
  EventFormData,
  EventFilters,
  EventRegistrationData,
} from '../types/event';

// ==================== EVENT DATA HOOKS ====================

/**
 * Hook for fetching events with filters
 */
export const useEvents = (filters: EventFilters = {}) => {
  return useQuery({
    queryKey: eventQueryKeys.list(filters),
    queryFn: () => eventApi.getEvents(filters),
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

/**
 * Hook for fetching event statistics
 */
export const useEventStats = () => {
  return useQuery({
    queryKey: eventQueryKeys.stats(),
    queryFn: () => eventApi.getEventStats(),
    select: data => (data.success ? data.data : null),
    // Performance optimizations for stats
    staleTime: 5 * 60 * 1000, // 5 minutes for stats (changes less frequently)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

/**
 * Hook for fetching a single event
 */
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: eventQueryKeys.detail(id),
    queryFn: () => eventApi.getEventById(id),
    select: data => (data.success ? data.data : null),
    enabled: !!id,
  });
};

/**
 * Hook for fetching featured events
 */
export const useFeaturedEvents = (filters?: Partial<EventFilters>) => {
  return useQuery({
    queryKey: eventQueryKeys.featured(),
    queryFn: () => eventApi.getFeaturedEvents(filters),
    select: data => (data.success ? data.data : []),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for fetching upcoming events
 */
export const useUpcomingEvents = (filters?: Partial<EventFilters>) => {
  return useQuery({
    queryKey: eventQueryKeys.upcoming(),
    queryFn: () => eventApi.getUpcomingEvents(filters),
    select: data => (data.success ? data.data : []),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for searching events
 */
export const useSearchEvents = (query: string, filters?: EventFilters) => {
  return useQuery({
    queryKey: eventQueryKeys.search(query, filters),
    queryFn: () => eventApi.searchEvents(query, filters),
    select: data => (data.success ? data.data : []),
    enabled: query.length > 0,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// ==================== EVENT REGISTRATION HOOKS ====================

/**
 * Hook for registering for an event
 */
export const useRegisterForEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: EventRegistrationData }) =>
      eventApi.registerForEvent(eventId, data),
    onSuccess: (response, { eventId }) => {
      if (response.success) {
        // Invalidate event details to update registration count
        queryClient.invalidateQueries({
          queryKey: eventQueryKeys.detail(eventId),
        });
        // Invalidate events list to update registration counts
        queryClient.invalidateQueries({
          queryKey: eventQueryKeys.lists(),
        });
        // Invalidate user's registration for this event
        queryClient.invalidateQueries({
          queryKey: eventQueryKeys.registration(eventId),
        });
        toast.success(response.message || 'Successfully registered for event');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to register for event');
    },
  });
};

/**
 * Hook for getting user's registration for an event
 */
export const useMyEventRegistration = (eventId: string) => {
  return useQuery({
    queryKey: eventQueryKeys.registration(eventId),
    queryFn: () => eventApi.getMyEventRegistration(eventId),
    select: data => (data.success ? data.data : null),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// ==================== EVENT TICKET HOOKS ====================

/**
 * Hook for purchasing event ticket
 */
export const usePurchaseEventTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: any }) =>
      eventApi.purchaseTicket(eventId, data),
    onSuccess: (response, { eventId }) => {
      if (response.success) {
        // Invalidate event details
        queryClient.invalidateQueries({
          queryKey: eventQueryKeys.detail(eventId),
        });
        // Invalidate events list
        queryClient.invalidateQueries({
          queryKey: eventQueryKeys.lists(),
        });
        toast.success(response.message || 'Ticket purchased successfully');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to purchase ticket');
    },
  });
};

/**
 * Hook for creating ticket checkout session
 */
export const useCreateTicketCheckoutSession = () => {
  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data?: any }) =>
      eventApi.createTicketCheckoutSession(eventId, data),
    onSuccess: (response) => {
      if (response.success && response.data.checkout_url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.checkout_url;
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create checkout session');
    },
  });
};

// ==================== ADMIN EVENT MANAGEMENT HOOKS ====================

/**
 * Hook for creating an event (Admin only)
 */
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EventFormData) => eventApi.createEvent(data),
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate events list
        queryClient.invalidateQueries({
          queryKey: eventQueryKeys.lists(),
        });
        // Invalidate event stats
        queryClient.invalidateQueries({
          queryKey: eventQueryKeys.stats(),
        });
        toast.success('Event created successfully');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create event');
    },
  });
};

/**
 * Hook for updating an event (Admin only)
 */
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EventFormData> }) =>
      eventApi.updateEvent(id, data),
    onSuccess: (response, { id }) => {
      if (response.success) {
        // Update the event in cache
        queryClient.setQueryData(eventQueryKeys.detail(id), response);
        // Invalidate events list
        queryClient.invalidateQueries({
          queryKey: eventQueryKeys.lists(),
        });
        // Invalidate event stats
        queryClient.invalidateQueries({
          queryKey: eventQueryKeys.stats(),
        });
        toast.success('Event updated successfully');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update event');
    },
  });
};

/**
 * Hook for deleting an event (Admin only)
 */
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventApi.deleteEvent(id),
    onSuccess: (response, id) => {
      if (response.success) {
        // Remove event from cache
        queryClient.removeQueries({
          queryKey: eventQueryKeys.detail(id),
        });
        // Invalidate events list
        queryClient.invalidateQueries({
          queryKey: eventQueryKeys.lists(),
        });
        // Invalidate event stats
        queryClient.invalidateQueries({
          queryKey: eventQueryKeys.stats(),
        });
        toast.success(response.message || 'Event deleted successfully');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete event');
    },
  });
};

/**
 * Hook for getting event participants (Admin only)
 */
export const useEventParticipants = (eventId: string, filters?: any) => {
  return useQuery({
    queryKey: eventQueryKeys.participants(eventId, filters),
    queryFn: () => eventApi.getEventParticipants(eventId, filters),
    select: data => (data.success ? data : { success: true, data: [], pagination: {} }),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true, // For smooth pagination
  });
};

/**
 * Hook for getting event tickets (Admin only)
 */
export const useEventTickets = (eventId: string, filters?: any) => {
  return useQuery({
    queryKey: eventQueryKeys.tickets(eventId, filters),
    queryFn: () => eventApi.getEventTickets(eventId, filters),
    select: data => (data.success ? data : { success: true, data: [], pagination: {} }),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true, // For smooth pagination
  });
};

// ==================== UTILITY HOOKS ====================

/**
 * Hook for getting event filter options
 */
export const useEventFilterOptions = () => {
  return useQuery({
    queryKey: eventQueryKeys.filterOptions(),
    queryFn: () => eventApi.getEventFilterOptions(),
    select: data => (data.success ? data.data : null),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to check if user is registered for an event
 */
export const useIsRegisteredForEvent = (eventId: string) => {
  const { data: registration } = useMyEventRegistration(eventId);
  return !!registration;
};

/**
 * Hook to check if event registration is open
 */
export const useIsEventRegistrationOpen = (event: Event | null) => {
  if (!event) return false;
  
  const now = new Date();
  const eventDate = new Date(event.event_date);
  const registrationDeadline = event.registration_deadline 
    ? new Date(event.registration_deadline) 
    : eventDate;
  
  return (
    event.status === 'upcoming' &&
    now < registrationDeadline &&
    (!event.capacity || event.registered_count < event.capacity)
  );
};

/**
 * Hook to check if event has available capacity
 */
export const useEventHasCapacity = (event: Event | null) => {
  if (!event || !event.capacity) return true; // No capacity limit
  return event.registered_count < event.capacity;
};

// Export query keys for external use
export { eventQueryKeys };
