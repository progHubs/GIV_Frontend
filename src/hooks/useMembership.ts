// Membership Hooks
// React Query hooks for membership-related operations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membershipApi } from '../lib/membershipApi';
import type {
  MembershipSubscriptionRequest,
  MembershipPlanChangeRequest,
  MembershipCancellationRequest,
  MembershipFilters,
} from '../types/membership';

// Query Keys for React Query
export const membershipQueryKeys = {
  all: ['membership'] as const,
  plans: () => [...membershipQueryKeys.all, 'plans'] as const,
  userMembership: () => [...membershipQueryKeys.all, 'user'] as const,
  stats: () => [...membershipQueryKeys.all, 'stats'] as const,
  adminMemberships: (filters: MembershipFilters) =>
    [...membershipQueryKeys.all, 'admin', filters] as const,
};

// ==================== PUBLIC HOOKS ====================

/**
 * Hook for fetching membership plans
 */
export const useMembershipPlans = () => {
  return useQuery({
    queryKey: membershipQueryKeys.plans(),
    queryFn: () => membershipApi.getMembershipPlans(),
    select: data => (data.success ? data.data : []),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// ==================== USER HOOKS ====================

/**
 * Hook for fetching current user's membership
 */
export const useUserMembership = () => {
  return useQuery({
    queryKey: membershipQueryKeys.userMembership(),
    queryFn: () => membershipApi.getUserMembership(),
    select: data => (data.success ? data.data : null),
    staleTime: 2 * 60 * 1000, // 2 minutes (reduced for better refresh)
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (no membership found)
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
};

/**
 * Hook for subscribing to a membership plan
 */
export const useSubscribeMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionData: MembershipSubscriptionRequest) =>
      membershipApi.subscribeMembership(subscriptionData),
    onSuccess: () => {
      // Invalidate user membership query
      queryClient.invalidateQueries({ queryKey: membershipQueryKeys.userMembership() });
      queryClient.invalidateQueries({ queryKey: membershipQueryKeys.stats() });
    },
  });
};

/**
 * Hook for changing membership plan
 */
export const useChangeMembershipPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planData: MembershipPlanChangeRequest) =>
      membershipApi.changeMembershipPlan(planData),
    onSuccess: () => {
      // Invalidate user membership query
      queryClient.invalidateQueries({ queryKey: membershipQueryKeys.userMembership() });
    },
  });
};

/**
 * Hook for cancelling membership
 */
export const useCancelMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cancellationData: MembershipCancellationRequest) =>
      membershipApi.cancelMembership(cancellationData),
    onSuccess: () => {
      // Invalidate user membership query
      queryClient.invalidateQueries({ queryKey: membershipQueryKeys.userMembership() });
    },
  });
};

/**
 * Hook for reactivating membership
 */
export const useReactivateMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => membershipApi.reactivateMembership(),
    onSuccess: () => {
      // Invalidate user membership query
      queryClient.invalidateQueries({ queryKey: membershipQueryKeys.userMembership() });
    },
  });
};

// ==================== ADMIN HOOKS ====================

/**
 * Hook for fetching membership statistics (admin only)
 */
export const useMembershipStats = () => {
  return useQuery({
    queryKey: membershipQueryKeys.stats(),
    queryFn: () => membershipApi.getMembershipStats(),
    select: data => (data.success ? data.data : null),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching all memberships with filtering (admin only)
 */
export const useAllMemberships = (filters: MembershipFilters = {}) => {
  return useQuery({
    queryKey: membershipQueryKeys.adminMemberships(filters),
    queryFn: () => membershipApi.getAllMemberships(filters),
    select: data => (data.success ? data : { success: true, data: [], pagination: {} }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true, // For smooth pagination
  });
};

/**
 * Hook for fetching all memberships (admin only)
 */
export const useAdminMemberships = (filters: MembershipFilters = {}) => {
  return useQuery({
    queryKey: membershipQueryKeys.adminMemberships(filters),
    queryFn: () => membershipApi.getAllMemberships(filters),
    select: data => (data.success ? data.data : null),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for updating membership status (admin only)
 */
export const useUpdateMembershipStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      membershipId,
      statusData,
    }: {
      membershipId: string;
      statusData: { status: string; notes?: string };
    }) => membershipApi.updateMembershipStatus(membershipId, statusData),
    onSuccess: () => {
      // Invalidate admin memberships queries
      queryClient.invalidateQueries({ queryKey: [...membershipQueryKeys.all, 'admin'] });
      queryClient.invalidateQueries({ queryKey: membershipQueryKeys.stats() });
    },
  });
};

/**
 * Hook for admin cancelling membership
 */
export const useAdminCancelMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (membershipId: string) =>
      membershipApi.adminCancelMembership(membershipId, { reason: 'Admin cancellation' }),
    onSuccess: () => {
      // Invalidate admin memberships queries
      queryClient.invalidateQueries({ queryKey: [...membershipQueryKeys.all, 'admin'] });
      queryClient.invalidateQueries({ queryKey: membershipQueryKeys.stats() });
    },
  });
};

/**
 * Hook for admin reactivating membership
 */
export const useAdminReactivateMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (membershipId: string) => membershipApi.adminReactivateMembership(membershipId),
    onSuccess: () => {
      // Invalidate admin memberships queries
      queryClient.invalidateQueries({ queryKey: [...membershipQueryKeys.all, 'admin'] });
      queryClient.invalidateQueries({ queryKey: membershipQueryKeys.stats() });
    },
  });
};

// ==================== UTILITY HOOKS ====================

/**
 * Hook to check if user has active membership
 */
export const useHasActiveMembership = () => {
  const membership = useUserMembership();
  return membership?.status === 'active';
};

/**
 * Hook to get user's membership tier
 */
export const useUserMembershipTier = () => {
  const membership = useUserMembership();
  return membership?.membership_plans?.tier || null;
};

/**
 * Hook to check if user can upgrade membership
 */
export const useCanUpgradeMembership = () => {
  const membership = useUserMembership();
  const { data: plans } = useMembershipPlans();

  if (!membership || !plans) return false;

  const currentTier = membership.membership_plans?.tier;
  const availableTiers = ['bronze', 'silver', 'gold', 'platinum'];
  const currentIndex = availableTiers.indexOf(currentTier || '');

  return currentIndex < availableTiers.length - 1;
};
