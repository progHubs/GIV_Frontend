// Membership Types and Interfaces
// Based on backend membership tier system

import type { BaseEntity } from './api';
import type { User } from './auth';

// Membership Types
export type MembershipTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type BillingCycle = 'monthly' | 'annual';
export type MembershipStatus = 'active' | 'cancelled' | 'past_due' | 'unpaid' | 'incomplete';

// Membership Plan Interface
export interface MembershipPlan extends BaseEntity {
  name: string;
  tier: MembershipTier;
  billing_cycle: BillingCycle;
  amount: string;
  currency: string;
  stripe_price_id?: string;
  benefits: string[];
  is_active: boolean;
  description?: string;
}

// User Membership Interface
export interface UserMembership extends BaseEntity {
  user_id: string;
  membership_plan_id: string;
  stripe_subscription_id?: string;
  status: MembershipStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  cancelled_at?: string;
  
  // Relationships
  membership_plans?: MembershipPlan;
  users?: User;
}

// Membership Subscription Request
export interface MembershipSubscriptionRequest {
  plan_id: string;
  payment_method_id: string;
}

// Membership Plan Change Request
export interface MembershipPlanChangeRequest {
  new_plan_id: string;
}

// Membership Cancellation Request
export interface MembershipCancellationRequest {
  reason?: string;
  cancel_at_period_end?: boolean;
}

// Membership Statistics
export interface MembershipStats {
  total_members: number;
  active_members: number;
  cancelled_members: number;
  monthly_revenue: number;
  annual_revenue: number;
  tier_distribution: Array<{
    tier: MembershipTier;
    count: number;
    percentage: number;
  }>;
  billing_cycle_distribution: Array<{
    cycle: BillingCycle;
    count: number;
    percentage: number;
  }>;
  recent_subscriptions: UserMembership[];
  churn_rate: number;
  growth_rate: number;
}

// Membership Filters
export interface MembershipFilters {
  status?: MembershipStatus[];
  tier?: MembershipTier[];
  billing_cycle?: BillingCycle[];
  search?: string;
  created_after?: string;
  created_before?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API Response Types
export interface MembershipPlansResponse {
  success: boolean;
  data: MembershipPlan[];
}

export interface MembershipPlanResponse {
  success: boolean;
  data: MembershipPlan;
}

export interface UserMembershipResponse {
  success: boolean;
  data: UserMembership | null;
}

export interface MembershipStatsResponse {
  success: boolean;
  data: MembershipStats;
}

export interface MembershipsListResponse {
  success: boolean;
  data: UserMembership[];
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

// Component Props Types
export interface MembershipPlanCardProps {
  plan: MembershipPlan;
  isCurrentPlan?: boolean;
  onSubscribe?: (plan: MembershipPlan) => void;
  onChangePlan?: (plan: MembershipPlan) => void;
  className?: string;
}

export interface MembershipStatusProps {
  membership: UserMembership;
  onCancel?: () => void;
  onReactivate?: () => void;
  onChangePlan?: () => void;
  className?: string;
}

// Predefined membership configurations
export const MEMBERSHIP_TIERS: Record<MembershipTier, { name: string; color: string; priority: number }> = {
  bronze: {
    name: 'Bronze',
    color: '#CD7F32',
    priority: 1,
  },
  silver: {
    name: 'Silver',
    color: '#C0C0C0',
    priority: 2,
  },
  gold: {
    name: 'Gold',
    color: '#FFD700',
    priority: 3,
  },
  platinum: {
    name: 'Platinum',
    color: '#E5E4E2',
    priority: 4,
  },
};

export const BILLING_CYCLES: Record<BillingCycle, { name: string; description: string }> = {
  monthly: {
    name: 'Monthly',
    description: 'Billed every month',
  },
  annual: {
    name: 'Annual',
    description: 'Billed once per year',
  },
};

export const MEMBERSHIP_STATUS_LABELS: Record<MembershipStatus, { label: string; color: string }> = {
  active: {
    label: 'Active',
    color: 'green',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'red',
  },
  past_due: {
    label: 'Past Due',
    color: 'orange',
  },
  unpaid: {
    label: 'Unpaid',
    color: 'red',
  },
  incomplete: {
    label: 'Incomplete',
    color: 'yellow',
  },
};
