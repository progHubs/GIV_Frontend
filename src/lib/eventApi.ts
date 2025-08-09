// Event API Service
// Following the same patterns as campaignApi.ts

import { api } from './api';
import type {
  Event,
  EventFormData,
  EventFilters,
  EventStats,
  EventTranslation,
  EventRegistrationData,
  EventResponse,
  EventsResponse,
  EventStatsResponse,
  EventTranslationsResponse,
  ApiResponse,
  PaginationInfo,
} from '../types';

// API endpoints
const ENDPOINTS = {
  events: '/events',
  eventById: (id: string) => `/events/${id}`,
  eventTranslations: (id: string) => `/events/${id}/translations`,
  eventTranslationByLanguage: (id: string, language: string) =>
    `/events/${id}/translations/${language}`,
  featuredEvents: '/events/featured',
  upcomingEvents: '/events/upcoming',
  eventStats: '/events/stats',
  searchEvents: '/events/search',
  // Registration endpoints
  registerForEvent: (id: string) => `/events/${id}/register`,
  myEventRegistration: (id: string) => `/events/${id}/my-registration`,
  eventParticipants: (id: string) => `/events/${id}/participants`,
  // Ticket endpoints
  purchaseTicket: (id: string) => `/events/${id}/purchase`,
  createTicketCheckoutSession: (id: string) => `/events/${id}/purchase-ticket`,
  eventTickets: (id: string) => `/events/${id}/tickets`,
  // Filter options
  filterOptions: '/events/filter-options',
} as const;

// Event API Service
export const eventApi = {
  // Get all events with filtering and pagination
  getEvents: async (filters?: EventFilters): Promise<EventsResponse> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `${ENDPOINTS.events}?${queryString}` : ENDPOINTS.events;

    return api.get<EventsResponse>(url);
  },

  // Search events
  searchEvents: async (query: string, filters?: EventFilters): Promise<EventsResponse> => {
    const params = new URLSearchParams({ q: query });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    return api.get<EventsResponse>(`${ENDPOINTS.searchEvents}?${params.toString()}`);
  },

  // Get featured events
  getFeaturedEvents: async (filters?: Partial<EventFilters>): Promise<EventsResponse> => {
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
      ? `${ENDPOINTS.featuredEvents}?${queryString}`
      : ENDPOINTS.featuredEvents;

    return api.get<EventsResponse>(url);
  },

  // Get upcoming events
  getUpcomingEvents: async (filters?: Partial<EventFilters>): Promise<EventsResponse> => {
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
      ? `${ENDPOINTS.upcomingEvents}?${queryString}`
      : ENDPOINTS.upcomingEvents;

    return api.get<EventsResponse>(url);
  },

  // Get event by ID
  getEventById: async (id: string): Promise<EventResponse> => {
    return api.get<EventResponse>(ENDPOINTS.eventById(id));
  },

  // Get event statistics
  getEventStats: async (): Promise<EventStatsResponse> => {
    return api.get<EventStatsResponse>(ENDPOINTS.eventStats);
  },

  // Get event translations
  getEventTranslations: async (id: string): Promise<EventTranslationsResponse> => {
    return api.get<EventTranslationsResponse>(ENDPOINTS.eventTranslations(id));
  },

  // Get event translation by language
  getEventTranslationByLanguage: async (
    id: string,
    language: string
  ): Promise<{ success: boolean; data: EventTranslation }> => {
    return api.get<{ success: boolean; data: EventTranslation }>(
      ENDPOINTS.eventTranslationByLanguage(id, language)
    );
  },

  // ==================== REGISTRATION ENDPOINTS ====================

  // Register for an event
  registerForEvent: async (
    eventId: string,
    data: EventRegistrationData
  ): Promise<{ success: boolean; message: string; data?: any }> => {
    return api.post<{ success: boolean; message: string; data?: any }>(
      ENDPOINTS.registerForEvent(eventId),
      data
    );
  },

  // Get user's registration for an event
  getMyEventRegistration: async (
    eventId: string
  ): Promise<{ success: boolean; data: any }> => {
    return api.get<{ success: boolean; data: any }>(
      ENDPOINTS.myEventRegistration(eventId)
    );
  },

  // Get event participants (Admin only)
  getEventParticipants: async (
    eventId: string,
    filters?: any
  ): Promise<{ success: boolean; data: any[]; pagination: PaginationInfo }> => {
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
      ? `${ENDPOINTS.eventParticipants(eventId)}?${queryString}`
      : ENDPOINTS.eventParticipants(eventId);

    return api.get<{ success: boolean; data: any[]; pagination: PaginationInfo }>(url);
  },

  // ==================== TICKET ENDPOINTS ====================

  // Purchase ticket for an event
  purchaseTicket: async (
    eventId: string,
    data: any
  ): Promise<{ success: boolean; message: string; data?: any }> => {
    return api.post<{ success: boolean; message: string; data?: any }>(
      ENDPOINTS.purchaseTicket(eventId),
      data
    );
  },

  // Create ticket checkout session (Stripe)
  createTicketCheckoutSession: async (
    eventId: string,
    data?: any
  ): Promise<{ success: boolean; data: { checkout_url: string; session_id: string } }> => {
    return api.post<{ success: boolean; data: { checkout_url: string; session_id: string } }>(
      ENDPOINTS.createTicketCheckoutSession(eventId),
      data || {}
    );
  },

  // Get event tickets (Admin only)
  getEventTickets: async (
    eventId: string,
    filters?: any
  ): Promise<{ success: boolean; data: any[]; pagination: PaginationInfo }> => {
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

    return api.get<{ success: boolean; data: any[]; pagination: PaginationInfo }>(url);
  },

  // ==================== ADMIN ENDPOINTS ====================

  // Create event (Admin only)
  createEvent: async (data: EventFormData): Promise<EventResponse> => {
    return api.post<EventResponse>(ENDPOINTS.events, data);
  },

  // Update event (Admin only)
  updateEvent: async (id: string, data: Partial<EventFormData>): Promise<EventResponse> => {
    return api.put<EventResponse>(ENDPOINTS.eventById(id), data);
  },

  // Delete event (Admin only)
  deleteEvent: async (id: string): Promise<{ success: boolean; message: string }> => {
    return api.delete<{ success: boolean; message: string }>(ENDPOINTS.eventById(id));
  },

  // ==================== UTILITY ENDPOINTS ====================

  // Get filter options for events
  getEventFilterOptions: async (): Promise<{
    success: boolean;
    data: {
      categories: { value: string; label: string }[];
      languages: { value: string; label: string }[];
      statuses: { value: string; label: string }[];
    };
  }> => {
    return api.get<{
      success: boolean;
      data: {
        categories: { value: string; label: string }[];
        languages: { value: string; label: string }[];
        statuses: { value: string; label: string }[];
      };
    }>(ENDPOINTS.filterOptions);
  },
};

// Export query keys for React Query
export const eventQueryKeys = {
  all: ['events'] as const,
  lists: () => [...eventQueryKeys.all, 'list'] as const,
  list: (filters: EventFilters) => [...eventQueryKeys.lists(), filters] as const,
  details: () => [...eventQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventQueryKeys.details(), id] as const,
  stats: () => [...eventQueryKeys.all, 'stats'] as const,
  featured: () => [...eventQueryKeys.all, 'featured'] as const,
  upcoming: () => [...eventQueryKeys.all, 'upcoming'] as const,
  search: (query: string, filters?: EventFilters) => 
    [...eventQueryKeys.all, 'search', query, filters] as const,
  translations: (id: string) => [...eventQueryKeys.all, 'translations', id] as const,
  translation: (id: string, language: string) => 
    [...eventQueryKeys.translations(id), language] as const,
  registration: (eventId: string) => [...eventQueryKeys.all, 'registration', eventId] as const,
  participants: (eventId: string, filters?: any) => 
    [...eventQueryKeys.all, 'participants', eventId, filters] as const,
  tickets: (eventId: string, filters?: any) => 
    [...eventQueryKeys.all, 'tickets', eventId, filters] as const,
  filterOptions: () => [...eventQueryKeys.all, 'filterOptions'] as const,
};
