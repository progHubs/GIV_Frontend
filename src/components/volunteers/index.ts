// Volunteer Components Index
// Centralized exports for all volunteer-related components

// Core volunteer components
export { VolunteerCard } from './VolunteerCard';
export { default as VolunteerProfileComponent } from './VolunteerProfile';
export { default as VolunteerDashboard } from './VolunteerDashboard';
export { default as IntegratedVolunteerDashboard } from './IntegratedVolunteerDashboard';
export { default as VolunteerStatsCard } from './VolunteerStatsCard';

// Form components
export { default as VolunteerApplicationForm } from './VolunteerApplicationForm';
export { default as SimpleVolunteerApplicationForm } from './SimpleVolunteerApplicationForm';
export { default as VolunteerProfileCreationForm } from './VolunteerProfileCreationForm';
export { default as VolunteerProfileEditModal } from './VolunteerProfileEditModal';

// Admin management components (new)
export { VolunteerFilters } from './VolunteerFilters';
export { CampaignVolunteerManagement } from './CampaignVolunteerManagement';
export { VolunteerAnalytics } from './VolunteerAnalytics';

// Re-export types
export type {
  VolunteerProfile as VolunteerProfileType,
  VolunteerFilters as VolunteerFiltersType,
  CampaignVolunteer,
  CampaignVolunteerFilters,
  VolunteerApplicationRequest,
  VolunteerStats,
} from '../../types/volunteer';
