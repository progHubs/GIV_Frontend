/**
 * Event Volunteer Types and Interfaces
 * Type definitions for event volunteer data structures
 */

import type { BaseEntity } from './api';
import type { Event } from './event';
import type { User, VolunteerProfile } from './volunteer';

// Event Volunteer Application Status
export type EventVolunteerApplicationStatus = 'waiting' | 'rejected' | 'approved' | 'completed';

// Event Volunteer Entity
export interface EventVolunteer extends BaseEntity {
  event_id: string;
  user_id: string;
  status: EventVolunteerApplicationStatus;
  hours_committed: number;
  hours_completed: number;
  application_date: string;
  approval_date?: string;
  approved_by?: string;
  notes?: string;
  certificate_url?: string;
  
  // Relationships
  events?: Event;
  users?: User;
  volunteer_profiles?: VolunteerProfile;
  approved_by_user?: {
    id: string;
    full_name: string;
    email: string;
  };
}

// Event Volunteer Application Data
export interface EventVolunteerApplicationData {
  event_id: string;
  hours_committed?: number;
  application_notes?: string;
  volunteer_roles?: string[]; // Selected roles
  custom_roles?: string; // Custom roles if "Other volunteers" selected
  availability?: string;
  experience?: string;
  motivation?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Event Volunteer Application Request (with files)
export interface EventVolunteerApplicationRequest extends EventVolunteerApplicationData {
  documents?: File[]; // Supporting documents
}

// Event Volunteer Status Update Data
export interface EventVolunteerStatusUpdateData {
  status: EventVolunteerApplicationStatus;
  notes?: string;
  hours_committed?: number;
  certificate?: File; // Certificate file for completed volunteers
}

// Event Volunteer Filters
export interface EventVolunteerFilters {
  event_id?: string;
  user_id?: string;
  status?: EventVolunteerApplicationStatus;
  approved_by?: string;
  application_date_from?: string;
  application_date_to?: string;
  hours_committed_min?: number;
  hours_committed_max?: number;
  has_certificate?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Event Volunteer Statistics
export interface EventVolunteerStats {
  total_applications: number;
  waiting_applications: number;
  approved_applications: number;
  rejected_applications: number;
  completed_applications: number;
  total_hours_committed: number;
  total_hours_completed: number;
  average_hours_per_volunteer: number;
  completion_rate: number;
  approval_rate: number;
}

// Event Volunteer API Response Types
export interface EventVolunteerResponse {
  success: boolean;
  data: EventVolunteer;
  message?: string;
}

export interface EventVolunteersResponse {
  success: boolean;
  data: EventVolunteer[];
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

export interface EventVolunteerStatsResponse {
  success: boolean;
  data: EventVolunteerStats;
}

// Event Volunteer Form Validation
export interface EventVolunteerFormErrors {
  event_id?: string;
  hours_committed?: string;
  application_notes?: string;
  volunteer_roles?: string;
  custom_roles?: string;
  availability?: string;
  experience?: string;
  motivation?: string;
  emergency_contact?: string;
  documents?: string;
  general?: string;
}

// Event Volunteer Application Form Data
export interface EventVolunteerApplicationFormData {
  hours_committed: number;
  application_notes?: string;
  volunteer_roles: string[];
  custom_roles?: string;
  availability?: string;
  experience?: string;
  motivation?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  documents?: File[];
}

// Event Volunteer Management Data (Admin)
export interface EventVolunteerManagementData {
  volunteer_id: string;
  status?: EventVolunteerApplicationStatus;
  notes?: string;
  hours_committed?: number;
  certificate?: File;
}

// Event Volunteer Bulk Operations
export interface EventVolunteerBulkAction {
  action: 'approve' | 'reject' | 'complete';
  volunteer_ids: string[];
  notes?: string;
}

export interface EventVolunteerBulkResponse {
  success: boolean;
  processed: number;
  failed: number;
  errors?: string[];
}

// Event Volunteer Certificate Data
export interface EventVolunteerCertificateData {
  volunteer_id: string;
  event_id: string;
  volunteer_name: string;
  event_title: string;
  hours_completed: number;
  completion_date: string;
  certificate_url?: string;
}

// Default values and constants
export const DEFAULT_VOLUNTEER_APPLICATION: Partial<EventVolunteerApplicationFormData> = {
  hours_committed: 8,
  application_notes: '',
  volunteer_roles: [],
  custom_roles: '',
  availability: '',
  experience: '',
  motivation: '',
  emergency_contact: {
    name: '',
    phone: '',
    relationship: '',
  },
  documents: [],
};

export const VOLUNTEER_APPLICATION_STATUSES: { value: EventVolunteerApplicationStatus; label: string }[] = [
  { value: 'waiting', label: 'Waiting' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'completed', label: 'Completed' },
];

// Utility functions for volunteer operations
export const eventVolunteerUtils = {
  /**
   * Check if volunteer application can be withdrawn
   */
  canWithdrawApplication: (volunteer: EventVolunteer): boolean => {
    return volunteer.status === 'waiting' || volunteer.status === 'approved';
  },

  /**
   * Check if volunteer can receive certificate
   */
  canReceiveCertificate: (volunteer: EventVolunteer): boolean => {
    return volunteer.status === 'completed' && volunteer.hours_completed > 0;
  },

  /**
   * Calculate volunteer completion rate
   */
  calculateCompletionRate: (hoursCommitted: number, hoursCompleted: number): number => {
    if (hoursCommitted === 0) return 0;
    return Math.min((hoursCompleted / hoursCommitted) * 100, 100);
  },

  /**
   * Format volunteer hours for display
   */
  formatVolunteerHours: (hours: number): string => {
    if (hours === 1) return '1 hour';
    return `${hours} hours`;
  },

  /**
   * Get status color for UI
   */
  getStatusColor: (status: EventVolunteerApplicationStatus): string => {
    switch (status) {
      case 'waiting': return 'yellow';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'completed': return 'blue';
      default: return 'gray';
    }
  },

  /**
   * Parse volunteer roles from string
   */
  parseVolunteerRoles: (roles: string | string[]): string[] => {
    if (Array.isArray(roles)) return roles;
    if (typeof roles === 'string') {
      return roles.split(',').map(role => role.trim()).filter(role => role.length > 0);
    }
    return [];
  },

  /**
   * Format volunteer roles for display
   */
  formatVolunteerRoles: (roles: string | string[]): string => {
    const roleArray = eventVolunteerUtils.parseVolunteerRoles(roles);
    if (roleArray.length === 0) return 'No roles specified';
    if (roleArray.length === 1) return roleArray[0];
    if (roleArray.length === 2) return roleArray.join(' and ');
    return `${roleArray.slice(0, -1).join(', ')}, and ${roleArray[roleArray.length - 1]}`;
  },
};
