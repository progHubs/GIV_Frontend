// Campaign Types and Interfaces

import type { BaseEntity } from './api';
import type { CampaignPartner } from './campaignPartner';

// Default Volunteer Roles for Campaigns
export const DEFAULT_VOLUNTEER_ROLES = [
  'Dermatologist',
  'Gynecologist',
  'Data Collectors',
  'Internists',
  'Ophthalmologist',
  'ENT Specialist',
  'Pediatrician',
  'Public Health',
  'Medical Student',
  'General Practitioners',
  'Pharmacist',
  'Laboratory professionals',
  'Intern',
  'Nurse',
  'Social worker',
  'Other volunteers',
] as const;

export type VolunteerRole = (typeof DEFAULT_VOLUNTEER_ROLES)[number];

// Campaign Categories
export type CampaignCategory =
  | 'medical_outreach'
  | 'education'
  | 'community_development'
  | 'emergency_relief'
  | 'youth_development'
  | 'mental_health'
  | 'disease_prevention'
  | 'environmental'
  | 'other';

// Campaign Status
export type CampaignStatus = 'active' | 'inactive' | 'completed' | 'paused';

// Success Story Interface
export interface SuccessStory {
  title: string;
  description: string;
  image_url?: string;
  date: string;
}

// Campaign Entity
export interface Campaign extends BaseEntity {
  title: string;
  slug: string;
  description: string;
  goal_amount: string | null;
  current_amount: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_featured: boolean;
  is_completed: boolean;
  category: CampaignCategory;
  progress_bar_color: string;
  image_url?: string;
  video_url?: string;
  donor_count: number;
  // success_stories?: SuccessStory[];
  volunteer_roles?: string | string[];
  volunteer_count?: number;
  volunteer_hours_total?: number;
  language: string;
  translation_group_id: string;
  progress_percentage: number | null;
  created_by: string;
  users?: {
    id: string;
    full_name: string;
    email: string;
  };
  campaign_partners?: CampaignPartner[];
}

// Campaign Creation/Update Data
export interface CampaignFormData {
  title: string;
  description: string;
  goal_amount?: number | null;
  start_date: string;
  end_date: string;
  category: CampaignCategory;
  progress_bar_color?: string;
  image_url?: string;
  video_url?: string;
  // success_stories?: SuccessStory[];
  volunteer_roles?: string | string[];
  language?: string;
  is_active?: boolean;
  is_featured?: boolean;
  is_completed?: boolean;
}

// Campaign Filters
export interface CampaignFilters {
  search?: string;
  category?: CampaignCategory;
  language?: string;
  is_active?: boolean;
  is_featured?: boolean;
  is_completed?: boolean;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Campaign Statistics (matching backend response structure)
export interface CampaignStats {
  total_campaigns: number;
  active_campaigns: number;
  featured_campaigns: number;
  completed_campaigns: number;
  total_goal_amount: string;
  total_current_amount: string;
  overall_progress_percentage: number;
  category_breakdown: Array<{
    category: CampaignCategory;
    count: number;
    goal_amount: string;
    current_amount: string;
    progress_percentage: number;
  }>;
}

// Campaign Translation
export interface CampaignTranslation {
  id: string;
  title: string;
  description?: string;
  language: string;
  translation_group_id: string;
}

// Campaign Card Props (for UI components)
export interface CampaignCardProps {
  campaign: Campaign;
  showDonateButton?: boolean;
  showProgress?: boolean;
  className?: string;
  onClick?: (campaign: Campaign) => void;
}

// Campaign Hero Section Data
export interface CampaignHeroData {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage?: string;
  stats: {
    totalCampaigns: number;
    totalRaised: string;
    totalDonors: number;
    activeCampaigns: number;
  };
}

// Campaign Impact Data
export interface CampaignImpact {
  title: string;
  description: string;
  metrics: Array<{
    label: string;
    value: string;
    icon: string;
  }>;
}

// Campaign Partners
export interface CampaignPartner {
  id: string;
  name: string;
  logo: string;
  website?: string;
  description?: string;
}
