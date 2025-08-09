/**
 * Event Volunteer API Service
 * Handles all event volunteer-related API calls
 * Mirrors campaign volunteer patterns
 */

import { api } from './api';
import type {
  EventVolunteer,
  EventVolunteerApplicationData,
  EventVolunteerApplicationRequest,
  EventVolunteerStatusUpdateData,
  EventVolunteerFilters,
  EventVolunteerManagementData,
  EventVolunteerBulkAction,
  EventVolunteerResponse,
  EventVolunteersResponse,
  EventVolunteerStatsResponse,
  EventVolunteerBulkResponse,
} from '../types/eventVolunteer';

// API endpoints
const ENDPOINTS = {
  // Event volunteer endpoints
  eventVolunteers: (eventId: string) => `/events/${eventId}/volunteers`,
  applyVolunteer: (eventId: string) => `/events/${eventId}/volunteers/apply`,
  updateVolunteerStatus: (eventId: string, userId: string) =>
    `/events/${eventId}/volunteers/${userId}`,
  removeVolunteer: (eventId: string, userId: string) =>
    `/events/${eventId}/volunteers/${userId}`,
  
  // User volunteer endpoints
  myVolunteerEvents: '/volunteers/my-events',
  volunteerApplication: (eventId: string) => `/volunteers/events/${eventId}/application`,
  withdrawApplication: (eventId: string) => `/volunteers/events/${eventId}/withdraw`,
  
  // Admin volunteer management
  volunteerStats: '/volunteers/events/stats',
  eventVolunteerStats: (eventId: string) => `/events/${eventId}/volunteers/stats`,
  bulkVolunteerActions: '/volunteers/events/bulk-actions',
  
  // Certificate management
  downloadCertificate: (eventId: string, userId: string) =>
    `/events/${eventId}/volunteers/${userId}/certificate`,
  generateCertificate: (eventId: string, userId: string) =>
    `/events/${eventId}/volunteers/${userId}/generate-certificate`,
} as const;

// Event Volunteer API Service
export const eventVolunteerApi = {
  // ==================== VOLUNTEER APPLICATION OPERATIONS ====================

  /**
   * Apply to volunteer for an event
   */
  applyForEvent: async (
    eventId: string,
    data: EventVolunteerApplicationRequest
  ): Promise<EventVolunteerResponse> => {
    // Create FormData if files are provided
    if (data.documents && data.documents.length > 0) {
      const formData = new FormData();

      // Add form data
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'documents' && value !== undefined && value !== null) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Add files
      data.documents.forEach((file, index) => {
        formData.append('documents', file);
      });

      return api.post<EventVolunteerResponse>(
        ENDPOINTS.applyVolunteer(eventId),
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
    } else {
      // Send as JSON if no files
      const { documents, ...jsonData } = data;
      return api.post<EventVolunteerResponse>(
        ENDPOINTS.applyVolunteer(eventId),
        jsonData
      );
    }
  },

  /**
   * Get user's volunteer application for an event
   */
  getVolunteerApplication: async (eventId: string): Promise<EventVolunteerResponse> => {
    return api.get<EventVolunteerResponse>(ENDPOINTS.volunteerApplication(eventId));
  },

  /**
   * Withdraw volunteer application
   */
  withdrawApplication: async (
    eventId: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> => {
    return api.post<{ success: boolean; message: string }>(
      ENDPOINTS.withdrawApplication(eventId),
      { reason }
    );
  },

  /**
   * Get user's volunteer events
   */
  getMyVolunteerEvents: async (
    filters?: EventVolunteerFilters
  ): Promise<EventVolunteersResponse> => {
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
      ? `${ENDPOINTS.myVolunteerEvents}?${queryString}` 
      : ENDPOINTS.myVolunteerEvents;

    return api.get<EventVolunteersResponse>(url);
  },

  // ==================== EVENT VOLUNTEER MANAGEMENT ====================

  /**
   * Get volunteers for an event (Admin only)
   */
  getEventVolunteers: async (
    eventId: string,
    filters?: EventVolunteerFilters
  ): Promise<EventVolunteersResponse> => {
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
      ? `${ENDPOINTS.eventVolunteers(eventId)}?${queryString}` 
      : ENDPOINTS.eventVolunteers(eventId);

    return api.get<EventVolunteersResponse>(url);
  },

  /**
   * Update volunteer status (Admin only)
   */
  updateVolunteerStatus: async (
    eventId: string,
    userId: string,
    data: EventVolunteerStatusUpdateData
  ): Promise<EventVolunteerResponse> => {
    // Create FormData if certificate file is provided
    if (data.certificate) {
      const formData = new FormData();

      // Add form data
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'certificate' && value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Add certificate file
      formData.append('certificate', data.certificate);

      return api.put<EventVolunteerResponse>(
        ENDPOINTS.updateVolunteerStatus(eventId, userId),
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
    } else {
      // Send as JSON if no file
      const { certificate, ...jsonData } = data;
      return api.put<EventVolunteerResponse>(
        ENDPOINTS.updateVolunteerStatus(eventId, userId),
        jsonData
      );
    }
  },

  /**
   * Remove volunteer from event (Admin only)
   */
  removeVolunteerFromEvent: async (
    eventId: string,
    userId: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> => {
    return api.delete<{ success: boolean; message: string }>(
      ENDPOINTS.removeVolunteer(eventId, userId),
      { data: { reason } }
    );
  },

  // ==================== STATISTICS AND REPORTING ====================

  /**
   * Get overall volunteer statistics (Admin only)
   */
  getVolunteerStats: async (): Promise<EventVolunteerStatsResponse> => {
    return api.get<EventVolunteerStatsResponse>(ENDPOINTS.volunteerStats);
  },

  /**
   * Get volunteer statistics for an event (Admin only)
   */
  getEventVolunteerStats: async (eventId: string): Promise<EventVolunteerStatsResponse> => {
    return api.get<EventVolunteerStatsResponse>(ENDPOINTS.eventVolunteerStats(eventId));
  },

  // ==================== BULK OPERATIONS ====================

  /**
   * Bulk volunteer actions (Admin only)
   */
  bulkVolunteerActions: async (
    data: EventVolunteerBulkAction
  ): Promise<EventVolunteerBulkResponse> => {
    return api.post<EventVolunteerBulkResponse>(ENDPOINTS.bulkVolunteerActions, data);
  },

  // ==================== CERTIFICATE MANAGEMENT ====================

  /**
   * Download volunteer certificate
   */
  downloadCertificate: async (eventId: string, userId: string): Promise<Blob> => {
    const response = await api.get(ENDPOINTS.downloadCertificate(eventId, userId), {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Generate volunteer certificate (Admin only)
   */
  generateCertificate: async (
    eventId: string,
    userId: string
  ): Promise<{ success: boolean; data: { certificate_url: string } }> => {
    return api.post<{ success: boolean; data: { certificate_url: string } }>(
      ENDPOINTS.generateCertificate(eventId, userId)
    );
  },
};

// Helper functions for volunteer operations
export const eventVolunteerHelpers = {
  /**
   * Validate volunteer application data
   */
  validateApplicationData: (data: EventVolunteerApplicationData): string[] => {
    const errors: string[] = [];

    if (!data.event_id) {
      errors.push('Event ID is required');
    }

    if (data.hours_committed && (data.hours_committed < 1 || data.hours_committed > 100)) {
      errors.push('Hours committed must be between 1 and 100');
    }

    if (data.volunteer_roles && data.volunteer_roles.length === 0) {
      errors.push('At least one volunteer role must be selected');
    }

    if (data.volunteer_roles?.includes('Other volunteers') && !data.custom_roles?.trim()) {
      errors.push('Custom roles must be specified when "Other volunteers" is selected');
    }

    if (data.emergency_contact) {
      const { name, phone, relationship } = data.emergency_contact;
      if (!name?.trim()) errors.push('Emergency contact name is required');
      if (!phone?.trim()) errors.push('Emergency contact phone is required');
      if (!relationship?.trim()) errors.push('Emergency contact relationship is required');
    }

    return errors;
  },

  /**
   * Format volunteer roles for submission
   */
  formatVolunteerRoles: (roles: string[], customRoles?: string): string => {
    let allRoles = [...roles];
    
    if (roles.includes('Other volunteers') && customRoles?.trim()) {
      // Remove "Other volunteers" and add custom roles
      allRoles = allRoles.filter(role => role !== 'Other volunteers');
      const customRolesList = customRoles.split(',').map(role => role.trim()).filter(Boolean);
      allRoles.push(...customRolesList);
    }

    return allRoles.join(', ');
  },

  /**
   * Parse volunteer roles from string
   */
  parseVolunteerRoles: (rolesString: string): { roles: string[]; customRoles: string } => {
    const allRoles = rolesString.split(',').map(role => role.trim()).filter(Boolean);
    const standardRoles = ['Ophthalmologist', 'ENT Specialist', 'Pediatrician'];
    
    const roles: string[] = [];
    const customRoles: string[] = [];

    allRoles.forEach(role => {
      if (standardRoles.includes(role)) {
        roles.push(role);
      } else {
        customRoles.push(role);
      }
    });

    if (customRoles.length > 0) {
      roles.push('Other volunteers');
    }

    return {
      roles,
      customRoles: customRoles.join(', '),
    };
  },

  /**
   * Calculate volunteer progress
   */
  calculateVolunteerProgress: (volunteer: EventVolunteer): number => {
    if (volunteer.hours_committed === 0) return 0;
    return Math.min((volunteer.hours_completed / volunteer.hours_committed) * 100, 100);
  },

  /**
   * Get volunteer status badge color
   */
  getStatusBadgeColor: (status: string): string => {
    switch (status) {
      case 'waiting': return 'yellow';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'completed': return 'blue';
      default: return 'gray';
    }
  },

  /**
   * Format volunteer certificate filename
   */
  formatCertificateFilename: (volunteer: EventVolunteer): string => {
    const eventTitle = volunteer.events?.title || 'Event';
    const volunteerName = volunteer.users?.full_name || 'Volunteer';
    return `${eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate_${volunteerName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  },
};

// Export query keys for React Query
export const eventVolunteerQueryKeys = {
  all: ['eventVolunteers'] as const,
  lists: () => [...eventVolunteerQueryKeys.all, 'list'] as const,
  list: (eventId: string, filters?: EventVolunteerFilters) => 
    [...eventVolunteerQueryKeys.lists(), eventId, filters] as const,
  details: () => [...eventVolunteerQueryKeys.all, 'detail'] as const,
  detail: (eventId: string, userId: string) => 
    [...eventVolunteerQueryKeys.details(), eventId, userId] as const,
  myEvents: (filters?: EventVolunteerFilters) => 
    [...eventVolunteerQueryKeys.all, 'myEvents', filters] as const,
  application: (eventId: string) => 
    [...eventVolunteerQueryKeys.all, 'application', eventId] as const,
  stats: () => [...eventVolunteerQueryKeys.all, 'stats'] as const,
  eventStats: (eventId: string) => [...eventVolunteerQueryKeys.stats(), eventId] as const,
};
