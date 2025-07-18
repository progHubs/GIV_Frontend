// Advanced Filtering Types and Interfaces
// Based on backend advanced filtering system

import type { BaseEntity } from './api';
import type { DonationType, PaymentStatus, PaymentMethod, DonationTier } from './donation';
import type { MembershipTier, MembershipStatus, BillingCycle } from './membership';

// Period Types
export type FilterPeriod = 
  | 'today' 
  | 'yesterday' 
  | 'last_7_days' 
  | 'last_30_days' 
  | 'this_month' 
  | 'last_month' 
  | 'this_year' 
  | 'last_year'
  | 'custom';

// Advanced Donation Filters
export interface AdvancedDonationFilters {
  // Period filters
  period?: FilterPeriod;
  date_from?: string;
  date_to?: string;
  
  // Amount filters
  min_amount?: number;
  max_amount?: number;
  amount_filters?: Array<{
    currency: string;
    min_amount?: number;
    max_amount?: number;
  }>;
  
  // Basic filters
  currencies?: string[];
  payment_methods?: PaymentMethod[];
  donation_types?: DonationType[];
  payment_statuses?: PaymentStatus[];
  
  // Campaign filters
  campaign_ids?: string[];
  campaign_type?: 'general' | 'campaign_specific';
  
  // Donor filters
  anonymity_filter?: 'anonymous' | 'non_anonymous';
  donor_tiers?: DonationTier[];
  membership_statuses?: MembershipStatus[];
  
  // Search and pagination
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Advanced Campaign Filters
export interface AdvancedCampaignFilters {
  // Basic filters
  search?: string;
  category?: string[];
  status?: string[];
  
  // Funding filters
  funding_status?: 'needs_funding' | 'partially_funded' | 'fully_funded' | 'overfunded';
  min_goal?: number;
  max_goal?: number;
  
  // Date filters
  period?: FilterPeriod;
  start_date_from?: string;
  start_date_to?: string;
  end_date_from?: string;
  end_date_to?: string;
  
  // Location filters
  location?: string;
  
  // Volunteer filters
  volunteer_status?: 'accepting_volunteers' | 'volunteer_full' | 'my_applications' | 'my_approved';
  required_skills?: string[];
  
  // Pagination
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Saved Filter Interface
export interface SavedFilter extends BaseEntity {
  user_id: string;
  filter_name: string;
  filter_type: 'donation' | 'campaign' | 'volunteer';
  filter_criteria: Record<string, any>;
  is_default: boolean;
  is_public: boolean;
}

// Saved Filter Request
export interface SavedFilterRequest {
  filter_name: string;
  filter_type: 'donation' | 'campaign' | 'volunteer';
  filter_criteria: Record<string, any>;
  is_default?: boolean;
  is_public?: boolean;
}

// Filter Options Response
export interface FilterOptionsResponse {
  success: boolean;
  data: {
    periods: FilterPeriod[];
    currencies: string[];
    payment_methods: PaymentMethod[];
    donation_types: DonationType[];
    payment_statuses: PaymentStatus[];
    donor_tiers: DonationTier[];
    membership_tiers: MembershipTier[];
    membership_statuses: MembershipStatus[];
    billing_cycles: BillingCycle[];
    campaigns: Array<{
      id: string;
      title: string;
      slug: string;
    }>;
    categories: string[];
    locations: string[];
    available_skills: string[];
    medical_specializations: string[];
  };
}

// Analytics Data Types
export interface DonationAnalytics {
  daily_totals: Array<{
    date: string;
    total_amount: number;
    donation_count: number;
    currency: string;
  }>;
  period_comparison: {
    current_period: {
      total_amount: number;
      donation_count: number;
      average_donation: number;
    };
    previous_period: {
      total_amount: number;
      donation_count: number;
      average_donation: number;
    };
    percentage_change: number;
  };
  top_campaigns: Array<{
    campaign_id: string;
    campaign_title: string;
    total_amount: number;
    donation_count: number;
  }>;
  donor_breakdown: {
    by_tier: Array<{
      tier: DonationTier;
      count: number;
      total_amount: number;
    }>;
    by_type: Array<{
      type: 'new' | 'returning';
      count: number;
      total_amount: number;
    }>;
  };
}

// Campaign Analytics
export interface CampaignAnalytics {
  performance_metrics: {
    total_campaigns: number;
    active_campaigns: number;
    completed_campaigns: number;
    success_rate: number;
    average_completion_time: number;
  };
  funding_analytics: {
    total_raised: number;
    average_goal: number;
    average_raised: number;
    funding_distribution: Array<{
      range: string;
      count: number;
    }>;
  };
  volunteer_analytics: {
    total_applications: number;
    approved_applications: number;
    total_volunteer_hours: number;
    campaigns_with_volunteers: number;
  };
}

// Pagination Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// API Response Types
export interface SavedFiltersResponse {
  success: boolean;
  data: SavedFilter[];
}

export interface SavedFilterResponse {
  success: boolean;
  data: SavedFilter;
}

export interface DonationAnalyticsResponse {
  success: boolean;
  data: DonationAnalytics;
}

export interface CampaignAnalyticsResponse {
  success: boolean;
  data: CampaignAnalytics;
}

// Component Props Types
export interface FilterPanelProps {
  filters: AdvancedDonationFilters | AdvancedCampaignFilters;
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
  onSaveFilter?: (filterName: string) => void;
  savedFilters?: SavedFilter[];
  className?: string;
}

export interface SavedFilterDropdownProps {
  savedFilters: SavedFilter[];
  onApplyFilter: (filter: SavedFilter) => void;
  onDeleteFilter: (filterId: string) => void;
  className?: string;
}

// Predefined filter configurations
export const FILTER_PERIODS: Record<FilterPeriod, { label: string; description: string }> = {
  today: {
    label: 'Today',
    description: 'Current day',
  },
  yesterday: {
    label: 'Yesterday',
    description: 'Previous day',
  },
  last_7_days: {
    label: 'Last 7 days',
    description: 'Last 7 days including today',
  },
  last_30_days: {
    label: 'Last 30 days',
    description: 'Last 30 days including today',
  },
  this_month: {
    label: 'This month',
    description: 'Current calendar month',
  },
  last_month: {
    label: 'Last month',
    description: 'Previous calendar month',
  },
  this_year: {
    label: 'This year',
    description: 'Current calendar year',
  },
  last_year: {
    label: 'Last year',
    description: 'Previous calendar year',
  },
  custom: {
    label: 'Custom range',
    description: 'Custom date range',
  },
};

export const FUNDING_STATUS_OPTIONS = [
  { value: 'needs_funding', label: 'Needs Funding' },
  { value: 'partially_funded', label: 'Partially Funded' },
  { value: 'fully_funded', label: 'Fully Funded' },
  { value: 'overfunded', label: 'Overfunded' },
];

export const VOLUNTEER_STATUS_OPTIONS = [
  { value: 'accepting_volunteers', label: 'Accepting Volunteers' },
  { value: 'volunteer_full', label: 'Volunteer Positions Full' },
  { value: 'my_applications', label: 'My Applications' },
  { value: 'my_approved', label: 'My Approved Applications' },
];
