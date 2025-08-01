// Volunteer Components Exports
// Centralized exports for all volunteer-related components

export { default as VolunteerApplicationForm } from './VolunteerApplicationForm';
export { default as VolunteerProfileComponent } from './VolunteerProfile';
export { default as VolunteerDashboard } from './VolunteerDashboard';
export { default as VolunteerStatsCard } from './VolunteerStatsCard';
export { default as IntegratedVolunteerDashboard } from './IntegratedVolunteerDashboard';
export { default as SimpleVolunteerApplicationForm } from './SimpleVolunteerApplicationForm';
export { default as VolunteerProfileCreationForm } from './VolunteerProfileCreationForm';
export { default as VolunteerProfileEditModal } from './VolunteerProfileEditModal';

// Re-export types for convenience
export type {
  VolunteerProfile as VolunteerProfileType,
  VolunteerApplicationRequest,
  VolunteerProfileUpdateRequest,
  CampaignVolunteer,
  VolunteerStats,
  VolunteerRole,
  ApplicationStatus,
} from '../../types/volunteer';
