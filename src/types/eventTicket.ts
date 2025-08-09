/**
 * Event Ticket Types and Interfaces
 * Type definitions for event ticket data structures
 */

import type { BaseEntity } from './api';
import type { Event } from './event';

// Event Ticket Payment Status
export type EventTicketPaymentStatus = 'pending' | 'paid' | 'refunded';

// Event Ticket Status
export type EventTicketStatus = 'active' | 'used' | 'cancelled';

// Event Ticket Entity
export interface EventTicket extends BaseEntity {
  event_id: string;
  user_id: string;
  ticket_code: string;
  payment_status: EventTicketPaymentStatus;
  amount_paid: number;
  status: EventTicketStatus;
  check_in_time?: string;
  
  // Relationships
  events?: Event;
  users?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
  };
}

// Event Ticket Purchase Data
export interface EventTicketPurchaseData {
  event_id: string;
  quantity?: number;
  special_requirements?: string;
  guest_info?: {
    name: string;
    email: string;
    phone?: string;
  }[];
}

// Event Ticket Checkout Session Data
export interface EventTicketCheckoutData {
  event_id: string;
  quantity?: number;
  success_url?: string;
  cancel_url?: string;
}

// Event Ticket Validation Data
export interface EventTicketValidationData {
  ticket_code: string;
  event_id: string;
}

// Event Ticket Check-in Data
export interface EventTicketCheckinData {
  ticket_code: string;
  event_id: string;
  check_in_time?: string;
}

// Event Ticket Filters
export interface EventTicketFilters {
  event_id?: string;
  user_id?: string;
  payment_status?: EventTicketPaymentStatus;
  status?: EventTicketStatus;
  ticket_code?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Event Ticket Statistics
export interface EventTicketStats {
  total_tickets: number;
  active_tickets: number;
  used_tickets: number;
  cancelled_tickets: number;
  pending_payments: number;
  paid_tickets: number;
  refunded_tickets: number;
  total_revenue: number;
  average_ticket_price: number;
  check_in_rate: number;
}

// Event Ticket API Response Types
export interface EventTicketResponse {
  success: boolean;
  data: EventTicket;
  message?: string;
}

export interface EventTicketsResponse {
  success: boolean;
  data: EventTicket[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    page: number;
    limit: number;
    totalCount: number;
  };
}

export interface EventTicketStatsResponse {
  success: boolean;
  data: EventTicketStats;
}

export interface EventTicketCheckoutResponse {
  success: boolean;
  data: {
    checkout_url: string;
    session_id: string;
  };
  message?: string;
}

export interface EventTicketValidationResponse {
  success: boolean;
  data: {
    valid: boolean;
    ticket?: EventTicket;
    event?: Event;
    message: string;
  };
}

export interface EventTicketCheckinResponse {
  success: boolean;
  data: {
    ticket: EventTicket;
    check_in_time: string;
  };
  message?: string;
}

// Event Ticket Form Validation
export interface EventTicketFormErrors {
  event_id?: string;
  quantity?: string;
  guest_info?: string;
  special_requirements?: string;
  general?: string;
}

// Event Ticket Purchase Form Data
export interface EventTicketPurchaseFormData {
  quantity: number;
  special_requirements?: string;
  guest_info?: {
    name: string;
    email: string;
    phone?: string;
  }[];
}

// Event Ticket Management Data (Admin)
export interface EventTicketManagementData {
  ticket_id: string;
  status?: EventTicketStatus;
  payment_status?: EventTicketPaymentStatus;
  notes?: string;
}

// Event Ticket Bulk Operations
export interface EventTicketBulkAction {
  action: 'cancel' | 'refund' | 'activate';
  ticket_ids: string[];
  reason?: string;
}

export interface EventTicketBulkResponse {
  success: boolean;
  processed: number;
  failed: number;
  errors?: string[];
}

// Event Ticket QR Code Data
export interface EventTicketQRData {
  ticket_code: string;
  event_id: string;
  user_id: string;
  timestamp: string;
}

// Default values and constants
export const DEFAULT_TICKET_PURCHASE: Partial<EventTicketPurchaseFormData> = {
  quantity: 1,
  special_requirements: '',
  guest_info: [],
};

export const TICKET_PAYMENT_STATUSES: { value: EventTicketPaymentStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'refunded', label: 'Refunded' },
];

export const TICKET_STATUSES: { value: EventTicketStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'used', label: 'Used' },
  { value: 'cancelled', label: 'Cancelled' },
];

// Utility functions for ticket operations
export const eventTicketUtils = {
  /**
   * Generate ticket display code (shorter version for UI)
   */
  formatTicketCode: (ticketCode: string): string => {
    return ticketCode.toUpperCase().replace(/(.{4})/g, '$1-').slice(0, -1);
  },

  /**
   * Check if ticket is valid for check-in
   */
  isTicketValidForCheckin: (ticket: EventTicket): boolean => {
    return ticket.status === 'active' && 
           ticket.payment_status === 'paid' && 
           !ticket.check_in_time;
  },

  /**
   * Check if ticket can be refunded
   */
  canRefundTicket: (ticket: EventTicket): boolean => {
    return ticket.payment_status === 'paid' && 
           ticket.status !== 'used' && 
           !ticket.check_in_time;
  },

  /**
   * Calculate total ticket price including fees
   */
  calculateTotalPrice: (basePrice: number, quantity: number, fees: number = 0): number => {
    return (basePrice * quantity) + fees;
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
