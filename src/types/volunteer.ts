// Volunteer Types and Interfaces
// Based on backend volunteer profile enhancement system

import type { BaseEntity } from './api';
import type { User } from './auth';
import type { Campaign } from './campaign';

// Volunteer Types
export type VolunteerStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';
export type VolunteerRole = 'general' | 'medical' | 'coordinator' | 'specialist';
export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

// Volunteer Profile Interface
export interface VolunteerProfile extends BaseEntity {
  user_id: string;
  phone_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_conditions?: string;
  skills: string[];
  availability: string[];
  preferred_roles: VolunteerRole[];
  background_check_status: 'pending' | 'approved' | 'rejected';
  background_check_date?: string;
  is_active: boolean;
  
  // Medical specialization fields
  is_medical_professional: boolean;
  medical_license_number?: string;
  medical_specialization?: string;
  license_expiry_date?: string;
  medical_credentials?: string[];
  
  // Relationships
  users?: User;
  campaign_volunteers?: CampaignVolunteer[];
}

// Campaign Volunteer Interface
export interface CampaignVolunteer extends BaseEntity {
  campaign_id: string;
  user_id: string;
  volunteer_role: VolunteerRole;
  application_status: ApplicationStatus;
  application_notes?: string;
  admin_notes?: string;
  hours_committed?: number;
  hours_completed?: number;
  start_date?: string;
  end_date?: string;
  
  // Relationships
  campaigns?: Campaign;
  users?: User;
  volunteer_profiles?: VolunteerProfile;
  volunteer_hours?: VolunteerHours[];
}

// Volunteer Hours Interface
export interface VolunteerHours extends BaseEntity {
  campaign_volunteer_id: string;
  hours: number;
  date: string;
  description?: string;
  verified_by?: string;
  verified_at?: string;
  
  // Relationships
  campaign_volunteers?: CampaignVolunteer;
}

// Medical Specialization Interface
export interface MedicalSpecialization extends BaseEntity {
  name: string;
  category: string;
  description?: string;
  is_active: boolean;
}

// Volunteer Application Request
export interface VolunteerApplicationRequest {
  campaign_id: string;
  volunteer_role: VolunteerRole;
  application_notes?: string;
  hours_committed?: number;
  start_date?: string;
  end_date?: string;
}

// Volunteer Profile Update Request
export interface VolunteerProfileUpdateRequest {
  phone_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_conditions?: string;
  skills?: string[];
  availability?: string[];
  preferred_roles?: VolunteerRole[];
  is_medical_professional?: boolean;
  medical_license_number?: string;
  medical_specialization?: string;
  license_expiry_date?: string;
  medical_credentials?: string[];
}

// Volunteer Hours Log Request
export interface VolunteerHoursRequest {
  campaign_volunteer_id: string;
  hours: number;
  date: string;
  description?: string;
}

// Volunteer Statistics
export interface VolunteerStats {
  total_volunteers: number;
  active_volunteers: number;
  pending_applications: number;
  approved_applications: number;
  total_hours_logged: number;
  average_hours_per_volunteer: number;
  volunteers_by_role: Array<{
    role: VolunteerRole;
    count: number;
  }>;
  volunteers_by_specialization: Array<{
    specialization: string;
    count: number;
  }>;
  recent_applications: CampaignVolunteer[];
  top_volunteers: Array<{
    user: User;
    total_hours: number;
    campaigns_count: number;
  }>;
}

// Volunteer Filters
export interface VolunteerFilters {
  status?: VolunteerStatus[];
  role?: VolunteerRole[];
  specialization?: string[];
  skills?: string[];
  availability?: string[];
  background_check_status?: string[];
  is_medical_professional?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Campaign Volunteer Filters
export interface CampaignVolunteerFilters {
  campaign_id?: string;
  application_status?: ApplicationStatus[];
  volunteer_role?: VolunteerRole[];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API Response Types
export interface VolunteerProfileResponse {
  success: boolean;
  data: VolunteerProfile;
}

export interface VolunteerProfilesResponse {
  success: boolean;
  data: VolunteerProfile[];
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

export interface CampaignVolunteersResponse {
  success: boolean;
  data: CampaignVolunteer[];
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

export interface VolunteerStatsResponse {
  success: boolean;
  data: VolunteerStats;
}

export interface MedicalSpecializationsResponse {
  success: boolean;
  data: MedicalSpecialization[];
}

// Component Props Types
export interface VolunteerApplicationFormProps {
  campaign: Campaign;
  onSubmit: (application: VolunteerApplicationRequest) => void;
  onCancel: () => void;
  className?: string;
}

export interface VolunteerStatusCardProps {
  volunteer: CampaignVolunteer;
  onUpdateStatus?: (status: ApplicationStatus) => void;
  onLogHours?: () => void;
  className?: string;
}

// Predefined configurations
export const VOLUNTEER_ROLES: Record<VolunteerRole, { name: string; description: string; color: string }> = {
  general: {
    name: 'General Volunteer',
    description: 'General support and assistance',
    color: 'blue',
  },
  medical: {
    name: 'Medical Professional',
    description: 'Medical care and health services',
    color: 'red',
  },
  coordinator: {
    name: 'Coordinator',
    description: 'Team coordination and management',
    color: 'purple',
  },
  specialist: {
    name: 'Specialist',
    description: 'Specialized skills and expertise',
    color: 'green',
  },
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, { label: string; color: string }> = {
  draft: {
    label: 'Draft',
    color: 'gray',
  },
  submitted: {
    label: 'Submitted',
    color: 'blue',
  },
  under_review: {
    label: 'Under Review',
    color: 'yellow',
  },
  approved: {
    label: 'Approved',
    color: 'green',
  },
  rejected: {
    label: 'Rejected',
    color: 'red',
  },
};
