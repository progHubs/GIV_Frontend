// Donation Types and Interfaces
// Based on backend schema and API structure

import type { BaseEntity } from './api';
import type { User } from './auth';
import type { Campaign } from './campaign';

// Donation Types
export type DonationType = 'one_time' | 'recurring' | 'in_kind';
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type PaymentMethod = 'stripe' | 'paypal' | 'telebirr' | 'bank_transfer';
export type DonationTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type DonationFrequency = 'monthly' | 'quarterly' | 'yearly';

// Core Donation Interface (matches backend schema)
export interface Donation extends BaseEntity {
  donor_id: string;
  campaign_id: string;
  amount: string;
  currency: string;
  donation_type: DonationType;
  payment_method?: PaymentMethod;
  payment_status: PaymentStatus;
  transaction_id?: string;
  receipt_url?: string;
  is_acknowledged: boolean;
  is_tax_deductible: boolean;
  is_anonymous: boolean;
  notes?: string;
  donated_at: string;

  // Relationships (populated when needed)
  donor_profiles?: DonorProfile;
  campaigns?: Campaign;
}

// Donor Profile Interface (matches backend schema)
export interface DonorProfile {
  user_id: string;
  is_recurring_donor: boolean;
  preferred_payment_method?: PaymentMethod;
  total_donated: string;
  donation_frequency?: DonationFrequency;
  tax_receipt_email?: string;
  is_anonymous: boolean;
  last_donation_date?: string;
  donation_tier?: DonationTier;
  created_at: string;
  updated_at: string;

  // Relationships
  users: User;
  donations?: Donation[];
}

// Donation Request (for creating donations)
export interface DonationRequest {
  campaign_id: string;
  amount: number;
  donation_type: DonationType;
  payment_method?: PaymentMethod;
  notes?: string;
}

// Stripe Session Request
export interface StripeSessionRequest {
  campaign_id: string;
  amount?: number;
  tier?: DonationTier;
  recurring?: boolean;
}

// Stripe Session Response
export interface StripeSessionResponse {
  url: string;
}

// Donation Filters (for listing/searching)
export interface DonationFilters {
  search?: string;
  campaign_id?: string;
  donor_id?: string;
  donation_type?: DonationType;
  payment_status?: PaymentStatus;
  payment_method?: PaymentMethod;
  currency?: string;
  is_anonymous?: boolean;

  // Amount range filters
  min_amount?: number;
  max_amount?: number;
  amount_min?: number; // Keep for backward compatibility
  amount_max?: number; // Keep for backward compatibility

  // Date filters
  date_from?: string;
  date_to?: string;
  donated_after?: string; // Keep for backward compatibility
  donated_before?: string; // Keep for backward compatibility

  // Period filter
  period?:
    | 'today'
    | 'yesterday'
    | 'last_7_days'
    | 'last_30_days'
    | 'this_month'
    | 'last_month'
    | 'this_year'
    | 'last_year';

  // Pagination and sorting
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Advanced Donation Filters (for enhanced filtering)
export interface AdvancedDonationFilters {
  // Period-based filtering
  period?:
    | 'today'
    | 'yesterday'
    | 'last_7_days'
    | 'last_30_days'
    | 'this_month'
    | 'last_month'
    | 'this_year'
    | 'last_year';
  date_from?: string;
  date_to?: string;

  // Amount filtering
  min_amount?: number;
  max_amount?: number;
  amount_filters?: AmountFilter[];

  // Category filtering
  currencies?: string[];
  payment_methods?: string[];
  donation_types?: ('one_time' | 'recurring' | 'in_kind')[];
  payment_statuses?: ('pending' | 'completed' | 'failed')[];

  // Campaign filtering
  campaign_ids?: string[];
  campaign_type?: 'general' | 'campaign_specific';

  // Donor filtering
  anonymity_filter?: 'anonymous' | 'non_anonymous';
  donor_tiers?: ('bronze' | 'silver' | 'gold' | 'platinum')[];
  membership_statuses?: ('active' | 'canceled' | 'past_due' | 'trialing')[];

  // Search
  search?: string;
}

export interface AmountFilter {
  currency: string;
  min_amount?: number;
  max_amount?: number;
}

// Statistics and analytics interfaces
export interface DonationStatisticsFilters {
  period?: string;
  date_from?: string;
  date_to?: string;
  currencies?: string[];
  campaign_ids?: string[];
}

export interface DonationStatistics {
  total_donations: number;
  total_amount: number;
  currency: string;
  unique_donors: number;
  average_donation: number;
  period_comparison?: {
    previous_period_total: number;
    percentage_change: number;
  };
}

export interface DonationAnalyticsFilters {
  period?: string;
  currency?: string;
  campaign_ids?: string[];
}

export interface DonationAnalytics {
  daily_totals: DailyDonationTotal[];
  top_campaigns: CampaignDonationSummary[];
  donor_distribution: DonorTierDistribution[];
  payment_method_breakdown: PaymentMethodBreakdown[];
}

export interface DailyDonationTotal {
  date: string;
  total_donations: number;
  total_amount: number;
  unique_donors: number;
}

export interface CampaignDonationSummary {
  campaign_id: string;
  campaign_title: string;
  total_amount: number;
  donation_count: number;
}

export interface DonorTierDistribution {
  tier: string;
  count: number;
  percentage: number;
}

export interface PaymentMethodBreakdown {
  payment_method: string;
  count: number;
  total_amount: number;
  percentage: number;
}

// Donation Statistics (admin dashboard)
export interface DonationStats {
  total_donations: number;
  total_amount: string;
  completed_amount: string;
  completed_donations: number;
  pending_donations: number;
  failed_donations: number;
  one_time_donations: number;
  recurring_donations: number;
  in_kind_donations: number;
  anonymous_donations: number;
  non_anonymous_donations: number;
  stripe_donations: number;
  telebirr_donations: number;
  bank_transfer_donations: number;
  average_donation?: string;
  top_campaigns?: Array<{
    campaign_id: string;
    campaign_title: string;
    total_amount: string;
    donation_count: number;
  }>;
  donation_trends?: Array<{
    date: string;
    amount: string;
    count: number;
  }>;
}

// Donor Statistics
export interface DonorStats {
  totalDonors: number;
  recurringDonors: number;
  anonymousDonors: number;
  totalDonated: number;
  averageDonation: number;
  recentDonors: number;
  donorsByTier: Array<{
    tier: DonationTier;
    count: number;
  }>;
  donorsByFrequency: Array<{
    frequency: string;
    count: number;
  }>;
  recurringRate: string;
  anonymousRate: string;
}

// Donation Form Data (UI state)
export interface DonationFormData {
  amount: number | null;
  customAmount: string;
  donationType: DonationType;
  notes: string;
  selectedTier?: DonationTier;
  paymentMethod?: PaymentMethod;
}

// Donation History Item (for user profile)
export interface DonationHistoryItem {
  id: string;
  campaign_title: string;
  campaign_slug: string;
  amount: string;
  currency: string;
  donation_type: DonationType;
  payment_status: PaymentStatus;
  donated_at: string;
  receipt_url?: string;
  is_anonymous: boolean;
}

// Donation Update Request (admin)
export interface DonationUpdateRequest {
  payment_status?: PaymentStatus;
  is_acknowledged?: boolean;
  notes?: string;
}

// Tier Configuration
export interface TierConfig {
  tier: DonationTier;
  amount: number;
  name: string;
  description: string;
  benefits: string[];
  color: string;
}

// Payment Success Data (from Stripe)
export interface PaymentSuccessData {
  session_id: string;
  donation_id?: string;
  campaign_id: string;
  amount: string;
  currency: string;
  payment_status: PaymentStatus;
  receipt_url?: string;
}

// API Response Types
export interface DonationListResponse {
  success: boolean;
  data: Donation[];
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

export interface DonationResponse {
  success: boolean;
  data: Donation;
  message?: string;
}

export interface DonationStatsResponse {
  success: boolean;
  data: DonationStats;
}

export interface DonorStatsResponse {
  success: boolean;
  data: DonorStats;
}

// Advanced filtering API response types
export interface FilterOptionsResponse {
  success: boolean;
  data: {
    periods: string[];
    currencies: string[];
    payment_methods: string[];
    donation_types: string[];
    payment_statuses: string[];
    campaigns: { id: string; title: string }[];
    donor_tiers: string[];
    membership_statuses: string[];
  };
}

export interface DonationStatisticsResponse {
  success: boolean;
  data: DonationStatistics;
}

export interface DonationAnalyticsResponse {
  success: boolean;
  data: DonationAnalytics;
}

// Component Props Types
export interface DonationFormProps {
  campaign: Campaign;
  onSuccess?: (donation: Donation) => void;
  onError?: (error: string) => void;
  className?: string;
}

export interface DonationCardProps {
  donation: Donation;
  showCampaign?: boolean;
  showDonor?: boolean;
  showActions?: boolean;
  onUpdate?: (donation: Donation) => void;
  className?: string;
}

export interface DonationHistoryProps {
  donations: DonationHistoryItem[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  className?: string;
}

// Predefined donation amounts and tiers
export const DONATION_AMOUNTS = [25, 50, 100, 250, 500, 1000];

export const DONATION_TIERS: Record<DonationTier, TierConfig> = {
  bronze: {
    tier: 'bronze',
    amount: 10,
    name: 'Bronze Supporter',
    description: 'Monthly support that makes a difference',
    benefits: ['Monthly newsletter', 'Impact updates'],
    color: '#CD7F32',
  },
  silver: {
    tier: 'silver',
    amount: 50,
    name: 'Silver Champion',
    description: 'Significant monthly contribution',
    benefits: ['Monthly newsletter', 'Impact updates', 'Quarterly reports'],
    color: '#C0C0C0',
  },
  gold: {
    tier: 'gold',
    amount: 100,
    name: 'Gold Advocate',
    description: 'Major monthly support',
    benefits: [
      'Monthly newsletter',
      'Impact updates',
      'Quarterly reports',
      'Annual event invitation',
    ],
    color: '#FFD700',
  },
  platinum: {
    tier: 'platinum',
    amount: 250,
    name: 'Platinum Partner',
    description: 'Premium monthly partnership',
    benefits: ['All Gold benefits', 'Direct impact reports', 'VIP event access', 'Recognition'],
    color: '#E5E4E2',
  },
};
