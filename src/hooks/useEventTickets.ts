// Event Ticket Hooks
// React Query hooks for event ticket-related operations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventTicketApi, eventTicketQueryKeys } from '../lib/eventTicketApi';
import { toast } from 'react-hot-toast';
import type {
  EventTicket,
  EventTicketPurchaseData,
  EventTicketCheckoutData,
  EventTicketValidationData,
  EventTicketCheckinData,
  EventTicketFilters,
  EventTicketManagementData,
  EventTicketBulkAction,
} from '../types/eventTicket';

// ==================== USER TICKET HOOKS ====================

/**
 * Hook for fetching user's tickets
 */
export const useMyEventTickets = (filters?: EventTicketFilters) => {
  return useQuery({
    queryKey: eventTicketQueryKeys.myTickets(filters),
    queryFn: () => eventTicketApi.getMyTickets(filters),
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
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook for fetching a single ticket
 */
export const useEventTicket = (ticketId: string) => {
  return useQuery({
    queryKey: eventTicketQueryKeys.detail(ticketId),
    queryFn: () => eventTicketApi.getTicketById(ticketId),
    select: data => (data.success ? data.data : null),
    enabled: !!ticketId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for purchasing event ticket
 */
export const usePurchaseEventTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: EventTicketPurchaseData }) =>
      eventTicketApi.purchaseTicket(eventId, data),
    onSuccess: (response, { eventId }) => {
      if (response.success) {
        // Invalidate user's tickets
        queryClient.invalidateQueries({
          queryKey: eventTicketQueryKeys.myTickets(),
        });
        // Invalidate event tickets
        queryClient.invalidateQueries({
          queryKey: eventTicketQueryKeys.eventTickets(eventId),
        });
        // Invalidate event details (to update registration count)
        queryClient.invalidateQueries({
          queryKey: ['events', 'detail', eventId],
        });
        toast.success('Ticket purchased successfully');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to purchase ticket');
    },
  });
};

/**
 * Hook for creating Stripe checkout session
 */
export const useCreateEventTicketCheckout = () => {
  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: EventTicketCheckoutData }) =>
      eventTicketApi.createCheckoutSession(eventId, data),
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

/**
 * Hook for downloading ticket PDF
 */
export const useDownloadEventTicket = () => {
  return useMutation({
    mutationFn: (ticketId: string) => eventTicketApi.downloadTicket(ticketId),
    onSuccess: (blob, ticketId) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket_${ticketId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Ticket downloaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to download ticket');
    },
  });
};

/**
 * Hook for getting ticket QR code
 */
export const useEventTicketQRCode = (ticketId: string) => {
  return useQuery({
    queryKey: [...eventTicketQueryKeys.detail(ticketId), 'qr-code'],
    queryFn: () => eventTicketApi.getTicketQRCode(ticketId),
    select: data => (data.success ? data.data.qr_code : null),
    enabled: !!ticketId,
    staleTime: 10 * 60 * 1000, // 10 minutes (QR codes don't change often)
  });
};

// ==================== TICKET VALIDATION & CHECK-IN HOOKS ====================

/**
 * Hook for validating a ticket
 */
export const useValidateEventTicket = () => {
  return useMutation({
    mutationFn: (data: EventTicketValidationData) => eventTicketApi.validateTicket(data),
    onSuccess: (response) => {
      if (response.success && response.data.valid) {
        toast.success(response.data.message || 'Ticket is valid');
      } else {
        toast.error(response.data.message || 'Ticket is invalid');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to validate ticket');
    },
  });
};

/**
 * Hook for checking in a ticket
 */
export const useCheckinEventTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EventTicketCheckinData) => eventTicketApi.checkinTicket(data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Update ticket in cache
        queryClient.setQueryData(
          eventTicketQueryKeys.detail(response.data.ticket.id),
          { success: true, data: response.data.ticket }
        );
        // Invalidate event tickets list
        queryClient.invalidateQueries({
          queryKey: eventTicketQueryKeys.eventTickets(variables.event_id),
        });
        toast.success('Ticket checked in successfully');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to check in ticket');
    },
  });
};

// ==================== EVENT TICKET MANAGEMENT HOOKS ====================

/**
 * Hook for fetching tickets for an event (Admin only)
 */
export const useEventTicketsForEvent = (eventId: string, filters?: EventTicketFilters) => {
  return useQuery({
    queryKey: eventTicketQueryKeys.eventTickets(eventId, filters),
    queryFn: () => eventTicketApi.getEventTickets(eventId, filters),
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
 * Hook for fetching event ticket statistics (Admin only)
 */
export const useEventTicketStats = (eventId?: string) => {
  return useQuery({
    queryKey: eventId ? eventTicketQueryKeys.eventStats(eventId) : eventTicketQueryKeys.stats(),
    queryFn: () => 
      eventId 
        ? eventTicketApi.getEventTicketStats(eventId)
        : eventTicketApi.getTicketStats(),
    select: data => (data.success ? data.data : null),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

// ==================== ADMIN TICKET MANAGEMENT HOOKS ====================

/**
 * Hook for updating ticket status (Admin only)
 */
export const useUpdateEventTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: EventTicketManagementData }) =>
      eventTicketApi.updateTicketStatus(ticketId, data),
    onSuccess: (response, { ticketId }) => {
      if (response.success) {
        // Update ticket in cache
        queryClient.setQueryData(
          eventTicketQueryKeys.detail(ticketId),
          response
        );
        // Invalidate tickets lists
        queryClient.invalidateQueries({
          queryKey: eventTicketQueryKeys.lists(),
        });
        // Invalidate ticket stats
        queryClient.invalidateQueries({
          queryKey: eventTicketQueryKeys.stats(),
        });
        toast.success('Ticket status updated successfully');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update ticket status');
    },
  });
};

/**
 * Hook for bulk ticket actions (Admin only)
 */
export const useBulkEventTicketActions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EventTicketBulkAction) => eventTicketApi.bulkTicketActions(data),
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate all ticket queries
        queryClient.invalidateQueries({
          queryKey: eventTicketQueryKeys.all,
        });
        toast.success(`Successfully processed ${response.processed} tickets`);
        if (response.failed > 0) {
          toast.error(`Failed to process ${response.failed} tickets`);
        }
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to perform bulk action');
    },
  });
};

/**
 * Hook for canceling a ticket
 */
export const useCancelEventTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, reason }: { ticketId: string; reason?: string }) =>
      eventTicketApi.cancelTicket(ticketId, reason),
    onSuccess: (response, { ticketId }) => {
      if (response.success) {
        // Invalidate ticket queries
        queryClient.invalidateQueries({
          queryKey: eventTicketQueryKeys.detail(ticketId),
        });
        queryClient.invalidateQueries({
          queryKey: eventTicketQueryKeys.lists(),
        });
        toast.success(response.message || 'Ticket cancelled successfully');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel ticket');
    },
  });
};

/**
 * Hook for refunding a ticket (Admin only)
 */
export const useRefundEventTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, reason }: { ticketId: string; reason?: string }) =>
      eventTicketApi.refundTicket(ticketId, reason),
    onSuccess: (response, { ticketId }) => {
      if (response.success) {
        // Invalidate ticket queries
        queryClient.invalidateQueries({
          queryKey: eventTicketQueryKeys.detail(ticketId),
        });
        queryClient.invalidateQueries({
          queryKey: eventTicketQueryKeys.lists(),
        });
        toast.success(response.message || 'Ticket refunded successfully');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to refund ticket');
    },
  });
};

// ==================== UTILITY HOOKS ====================

/**
 * Hook to check if user has tickets for an event
 */
export const useHasEventTickets = (eventId: string) => {
  const { data: tickets } = useMyEventTickets({ event_id: eventId });
  return tickets?.data?.length > 0;
};

/**
 * Hook to get user's active tickets for an event
 */
export const useActiveEventTickets = (eventId: string) => {
  const { data: tickets } = useMyEventTickets({ 
    event_id: eventId, 
    status: 'active',
    payment_status: 'paid'
  });
  return tickets?.data || [];
};

/**
 * Hook to check if ticket can be refunded
 */
export const useCanRefundTicket = (ticket: EventTicket | null) => {
  if (!ticket) return false;
  return ticket.payment_status === 'paid' && 
         ticket.status !== 'used' && 
         !ticket.check_in_time;
};

/**
 * Hook to check if ticket is valid for check-in
 */
export const useCanCheckinTicket = (ticket: EventTicket | null) => {
  if (!ticket) return false;
  return ticket.status === 'active' && 
         ticket.payment_status === 'paid' && 
         !ticket.check_in_time;
};

// Export query keys for external use
export { eventTicketQueryKeys };
