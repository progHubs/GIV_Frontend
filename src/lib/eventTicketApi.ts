/**
 * Event Ticket API Service
 * Handles all event ticket-related API calls
 */

import { api } from './api';
import type {
  EventTicket,
  EventTicketPurchaseData,
  EventTicketCheckoutData,
  EventTicketValidationData,
  EventTicketCheckinData,
  EventTicketFilters,
  EventTicketManagementData,
  EventTicketBulkAction,
  EventTicketResponse,
  EventTicketsResponse,
  EventTicketStatsResponse,
  EventTicketCheckoutResponse,
  EventTicketValidationResponse,
  EventTicketCheckinResponse,
  EventTicketBulkResponse,
} from '../types/eventTicket';

// API endpoints
const ENDPOINTS = {
  // User ticket endpoints
  myTickets: '/tickets/my-tickets',
  ticketById: (ticketId: string) => `/tickets/${ticketId}`,
  
  // Event-specific ticket endpoints
  eventTickets: (eventId: string) => `/events/${eventId}/tickets`,
  purchaseTicket: (eventId: string) => `/events/${eventId}/purchase`,
  createCheckoutSession: (eventId: string) => `/events/${eventId}/purchase-ticket`,
  
  // Ticket validation and check-in
  validateTicket: '/tickets/validate',
  checkinTicket: '/tickets/checkin',
  
  // Admin ticket management
  ticketStats: '/tickets/stats',
  eventTicketStats: (eventId: string) => `/events/${eventId}/tickets/stats`,
  updateTicketStatus: (ticketId: string) => `/tickets/${ticketId}/status`,
  bulkTicketActions: '/tickets/bulk-actions',
  
  // Ticket download and QR code
  downloadTicket: (ticketId: string) => `/tickets/${ticketId}/download`,
  ticketQRCode: (ticketId: string) => `/tickets/${ticketId}/qr-code`,
} as const;

// Event Ticket API Service
export const eventTicketApi = {
  // ==================== USER TICKET OPERATIONS ====================

  /**
   * Get user's tickets
   */
  getMyTickets: async (filters?: EventTicketFilters): Promise<EventTicketsResponse> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `${ENDPOINTS.myTickets}?${queryString}` : ENDPOINTS.myTickets;

    return api.get<EventTicketsResponse>(url);
  },

  /**
   * Get a single ticket by ID
   */
  getTicketById: async (ticketId: string): Promise<EventTicketResponse> => {
    return api.get<EventTicketResponse>(ENDPOINTS.ticketById(ticketId));
  },

  /**
   * Purchase ticket for an event
   */
  purchaseTicket: async (
    eventId: string,
    data: EventTicketPurchaseData
  ): Promise<EventTicketResponse> => {
    return api.post<EventTicketResponse>(ENDPOINTS.purchaseTicket(eventId), data);
  },

  /**
   * Create Stripe checkout session for ticket purchase
   */
  createCheckoutSession: async (
    eventId: string,
    data: EventTicketCheckoutData
  ): Promise<EventTicketCheckoutResponse> => {
    return api.post<EventTicketCheckoutResponse>(
      ENDPOINTS.createCheckoutSession(eventId),
      data
    );
  },

  /**
   * Download ticket PDF
   */
  downloadTicket: async (ticketId: string): Promise<Blob> => {
    const response = await api.get(ENDPOINTS.downloadTicket(ticketId), {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get ticket QR code
   */
  getTicketQRCode: async (ticketId: string): Promise<{ success: boolean; data: { qr_code: string } }> => {
    return api.get<{ success: boolean; data: { qr_code: string } }>(
      ENDPOINTS.ticketQRCode(ticketId)
    );
  },

  // ==================== TICKET VALIDATION & CHECK-IN ====================

  /**
   * Validate a ticket
   */
  validateTicket: async (data: EventTicketValidationData): Promise<EventTicketValidationResponse> => {
    return api.post<EventTicketValidationResponse>(ENDPOINTS.validateTicket, data);
  },

  /**
   * Check-in a ticket
   */
  checkinTicket: async (data: EventTicketCheckinData): Promise<EventTicketCheckinResponse> => {
    return api.post<EventTicketCheckinResponse>(ENDPOINTS.checkinTicket, data);
  },

  // ==================== EVENT TICKET MANAGEMENT ====================

  /**
   * Get all tickets for an event (Admin only)
   */
  getEventTickets: async (
    eventId: string,
    filters?: EventTicketFilters
  ): Promise<EventTicketsResponse> => {
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
      ? `${ENDPOINTS.eventTickets(eventId)}?${queryString}` 
      : ENDPOINTS.eventTickets(eventId);

    return api.get<EventTicketsResponse>(url);
  },

  /**
   * Get ticket statistics for an event (Admin only)
   */
  getEventTicketStats: async (eventId: string): Promise<EventTicketStatsResponse> => {
    return api.get<EventTicketStatsResponse>(ENDPOINTS.eventTicketStats(eventId));
  },

  // ==================== ADMIN TICKET MANAGEMENT ====================

  /**
   * Get overall ticket statistics (Admin only)
   */
  getTicketStats: async (): Promise<EventTicketStatsResponse> => {
    return api.get<EventTicketStatsResponse>(ENDPOINTS.ticketStats);
  },

  /**
   * Update ticket status (Admin only)
   */
  updateTicketStatus: async (
    ticketId: string,
    data: EventTicketManagementData
  ): Promise<EventTicketResponse> => {
    return api.put<EventTicketResponse>(ENDPOINTS.updateTicketStatus(ticketId), data);
  },

  /**
   * Bulk ticket actions (Admin only)
   */
  bulkTicketActions: async (data: EventTicketBulkAction): Promise<EventTicketBulkResponse> => {
    return api.post<EventTicketBulkResponse>(ENDPOINTS.bulkTicketActions, data);
  },

  /**
   * Cancel ticket (Admin or owner)
   */
  cancelTicket: async (
    ticketId: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> => {
    return api.put<{ success: boolean; message: string }>(
      ENDPOINTS.updateTicketStatus(ticketId),
      { status: 'cancelled', notes: reason }
    );
  },

  /**
   * Refund ticket (Admin only)
   */
  refundTicket: async (
    ticketId: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> => {
    return api.put<{ success: boolean; message: string }>(
      ENDPOINTS.updateTicketStatus(ticketId),
      { payment_status: 'refunded', notes: reason }
    );
  },
};

// Helper functions for ticket operations
export const eventTicketHelpers = {
  /**
   * Validate ticket purchase data
   */
  validateTicketPurchaseData: (data: EventTicketPurchaseData): string[] => {
    const errors: string[] = [];

    if (!data.event_id) {
      errors.push('Event ID is required');
    }

    if (data.quantity && (data.quantity < 1 || data.quantity > 10)) {
      errors.push('Quantity must be between 1 and 10');
    }

    if (data.guest_info) {
      data.guest_info.forEach((guest, index) => {
        if (!guest.name || guest.name.trim().length < 2) {
          errors.push(`Guest ${index + 1} name is required and must be at least 2 characters`);
        }
        if (!guest.email || !isValidEmail(guest.email)) {
          errors.push(`Guest ${index + 1} must have a valid email address`);
        }
      });
    }

    return errors;
  },

  /**
   * Format ticket code for display
   */
  formatTicketCode: (ticketCode: string): string => {
    return ticketCode.toUpperCase().replace(/(.{4})/g, '$1-').slice(0, -1);
  },

  /**
   * Generate ticket download filename
   */
  generateTicketFilename: (ticket: EventTicket): string => {
    const eventTitle = ticket.events?.title || 'Event';
    const ticketCode = ticket.ticket_code;
    return `${eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Ticket_${ticketCode}.pdf`;
  },

  /**
   * Check if ticket is refundable
   */
  isTicketRefundable: (ticket: EventTicket): boolean => {
    return ticket.payment_status === 'paid' && 
           ticket.status !== 'used' && 
           !ticket.check_in_time;
  },

  /**
   * Calculate refund amount (could include fees)
   */
  calculateRefundAmount: (ticket: EventTicket, refundFeePercentage: number = 0): number => {
    const refundFee = ticket.amount_paid * (refundFeePercentage / 100);
    return Math.max(0, ticket.amount_paid - refundFee);
  },

  /**
   * Get ticket status color for UI
   */
  getTicketStatusColor: (ticket: EventTicket): string => {
    if (ticket.status === 'used') return 'green';
    if (ticket.status === 'cancelled') return 'red';
    if (ticket.payment_status === 'pending') return 'yellow';
    if (ticket.payment_status === 'refunded') return 'orange';
    return 'blue'; // active and paid
  },

  /**
   * Format ticket price for display
   */
  formatTicketPrice: (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  },
};

// Utility functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Export query keys for React Query
export const eventTicketQueryKeys = {
  all: ['eventTickets'] as const,
  lists: () => [...eventTicketQueryKeys.all, 'list'] as const,
  list: (filters?: EventTicketFilters) => [...eventTicketQueryKeys.lists(), filters] as const,
  details: () => [...eventTicketQueryKeys.all, 'detail'] as const,
  detail: (ticketId: string) => [...eventTicketQueryKeys.details(), ticketId] as const,
  myTickets: (filters?: EventTicketFilters) => 
    [...eventTicketQueryKeys.all, 'myTickets', filters] as const,
  eventTickets: (eventId: string, filters?: EventTicketFilters) => 
    [...eventTicketQueryKeys.all, 'eventTickets', eventId, filters] as const,
  stats: () => [...eventTicketQueryKeys.all, 'stats'] as const,
  eventStats: (eventId: string) => [...eventTicketQueryKeys.stats(), eventId] as const,
  validation: (ticketCode: string, eventId: string) => 
    [...eventTicketQueryKeys.all, 'validation', ticketCode, eventId] as const,
};
