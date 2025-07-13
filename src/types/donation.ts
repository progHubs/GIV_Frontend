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
  amount_min?: number;
  amount_max?: number;
  donated_after?: string;
  donated_before?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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
