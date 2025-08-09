// Event Types and Interfaces
// Based on backend schema and following campaign patterns

import type { BaseEntity } from './api';
import type { EventPartner } from './eventPartner';

// Default Volunteer Roles for Events (based on user preferences)
export const DEFAULT_EVENT_VOLUNTEER_ROLES = [
  'Ophthalmologist',
  'ENT Specialist',
  'Pediatrician',
  'Other volunteers', // Triggers custom text input
] as const;

export type EventVolunteerRole = (typeof DEFAULT_EVENT_VOLUNTEER_ROLES)[number];

// Event Categories
export type EventCategory =
  | 'medical_conference'
  | 'health_screening'
  | 'community_outreach'
  | 'training_workshop'
  | 'awareness_campaign'
  | 'fundraising'
  | 'networking'
  | 'educational'
  | 'other';

// Event Status
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

// Event Language
export type EventLanguage = 'en' | 'am';

// Event Entity
export interface Event extends BaseEntity {
  title: string;
  slug: string;
  description?: string;
  event_date: string; // Date string
  event_time: string; // Time string
  timezone: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  category?: EventCategory;
  capacity?: number;
  registered_count: number;
  volunteer_count: number;
  volunteer_hours_total: number;
  volunteer_roles?: string; // Comma-separated roles or JSON string
  status: EventStatus;
  registration_deadline?: string;
  agenda?: string;
  speaker_info?: any; // JSON data for speakers
  requirements?: string;
  price: number;
  is_free: boolean;
  is_featured: boolean;
  created_by?: string;
  language: EventLanguage;
  translation_group_id?: string;
  
  // Relationships
  users?: {
    id: string;
    full_name: string;
    email: string;
  };
  event_partners?: EventPartner[];
}

// Event Creation/Update Data
export interface EventFormData {
  title: string;
  description?: string;
  event_date: string;
  event_time: string;
  timezone?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  category?: EventCategory;
  capacity?: number;
  registration_deadline?: string;
  agenda?: string;
  speaker_info?: any;
  requirements?: string;
  price?: number;
  is_free?: boolean;
  is_featured?: boolean;
  volunteer_roles?: string | string[];
  language?: EventLanguage;
  status?: EventStatus;
}

// Event Filters
export interface EventFilters {
  search?: string;
  category?: EventCategory;
  language?: EventLanguage;
  status?: EventStatus;
  is_featured?: boolean;
  is_free?: boolean;
  location?: string;
  event_date_from?: string;
  event_date_to?: string;
  price_min?: number;
  price_max?: number;
  has_capacity?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Event Statistics
export interface EventStats {
  total_events: number;
  upcoming_events: number;
  ongoing_events: number;
  completed_events: number;
  cancelled_events: number;
  total_registrations: number;
  total_volunteers: number;
  total_volunteer_hours: number;
  featured_events: number;
  free_events: number;
  paid_events: number;
  average_capacity: number;
  average_registration_rate: number;
}

// Event Registration Data
export interface EventRegistrationData {
  event_id: string;
  user_id?: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  special_requirements?: string;
}

// Event Card Props (for UI components)
export interface EventCardProps {
  event: Event;
  showRegisterButton?: boolean;
  showVolunteerButton?: boolean;
  showCapacity?: boolean;
  className?: string;
  onClick?: (event: Event) => void;
}

// Event Hero Section Data
export interface EventHeroData {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage?: string;
  stats: {
    totalEvents: number;
    upcomingEvents: number;
    totalRegistrations: number;
    totalVolunteers: number;
  };
}

// Event Impact Data
export interface EventImpact {
  title: string;
  description: string;
  metrics: Array<{
    label: string;
    value: string;
    icon: string;
  }>;
}

// Event Translation
export interface EventTranslation extends BaseEntity {
  event_id: string;
  language: EventLanguage;
  title: string;
  description?: string;
  location?: string;
  agenda?: string;
  requirements?: string;
}

// Event API Response Types
export interface EventResponse {
  success: boolean;
  data: Event;
  message?: string;
}

export interface EventsResponse {
  success: boolean;
  data: Event[];
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

export interface EventStatsResponse {
  success: boolean;
  data: EventStats;
}

export interface EventTranslationsResponse {
  success: boolean;
  data: EventTranslation[];
}

// Event Form Validation
export interface EventFormErrors {
  title?: string;
  description?: string;
  event_date?: string;
  event_time?: string;
  location?: string;
  category?: string;
  capacity?: string;
  price?: string;
  volunteer_roles?: string;
  general?: string;
}

// Default values and constants
export const DEFAULT_EVENT: Partial<EventFormData> = {
  title: '',
  description: '',
  timezone: 'UTC',
  category: 'other',
  price: 0,
  is_free: true,
  is_featured: false,
  language: 'en',
  status: 'upcoming',
  volunteer_roles: DEFAULT_EVENT_VOLUNTEER_ROLES.slice(0, -1).join(', '), // Exclude "Other volunteers"
};

export const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'medical_conference', label: 'Medical Conference' },
  { value: 'health_screening', label: 'Health Screening' },
  { value: 'community_outreach', label: 'Community Outreach' },
  { value: 'training_workshop', label: 'Training Workshop' },
  { value: 'awareness_campaign', label: 'Awareness Campaign' },
  { value: 'fundraising', label: 'Fundraising' },
  { value: 'networking', label: 'Networking' },
  { value: 'educational', label: 'Educational' },
  { value: 'other', label: 'Other' },
];

export const EVENT_STATUSES: { value: EventStatus; label: string }[] = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const EVENT_LANGUAGES: { value: EventLanguage; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'am', label: 'Amharic' },
];
