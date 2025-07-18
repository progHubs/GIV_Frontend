import { api } from './api';

const MEMBERSHIP_ENDPOINTS = {
  plans: '/membership/plans',
  subscribe: '/membership/subscribe',
  myMembership: '/membership/my-membership',
  changePlan: '/membership/change-plan',
  cancel: '/membership/cancel',
  reactivate: '/membership/reactivate',
  admin: {
    stats: '/membership/admin/stats',
    memberships: '/membership/admin/memberships'
  }
};

// Utility function to build query parameters
const buildQueryParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          searchParams.append(key, value.join(','));
        }
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  return searchParams.toString();
};

export const membershipApi = {
  // ==================== PUBLIC ENDPOINTS ====================

  /**
   * Get all available membership plans
   * GET /membership/plans
   */
  getMembershipPlans: async () => {
    return api.get(MEMBERSHIP_ENDPOINTS.plans);
  },

  // ==================== USER ENDPOINTS ====================

  /**
   * Subscribe to a membership plan
   * POST /membership/subscribe
   */
  subscribeMembership: async (subscriptionData: {
    plan_id: string;
    payment_method_id: string;
  }) => {
    return api.post(MEMBERSHIP_ENDPOINTS.subscribe, subscriptionData);
  },

  /**
   * Get current user's membership
   * GET /membership/my-membership
   */
  getUserMembership: async () => {
    return api.get(MEMBERSHIP_ENDPOINTS.myMembership);
  },

  /**
   * Change membership plan
   * PUT /membership/change-plan
   */
  changeMembershipPlan: async (planData: {
    new_plan_id: string;
  }) => {
    return api.put(MEMBERSHIP_ENDPOINTS.changePlan, planData);
  },

  /**
   * Cancel membership
   * POST /membership/cancel
   */
  cancelMembership: async (cancellationData: {
    reason?: string;
    cancel_at_period_end?: boolean;
  }) => {
    return api.post(MEMBERSHIP_ENDPOINTS.cancel, cancellationData);
  },

  /**
   * Reactivate membership
   * POST /membership/reactivate
   */
  reactivateMembership: async () => {
    return api.post(MEMBERSHIP_ENDPOINTS.reactivate);
  },

  // ==================== ADMIN ENDPOINTS ====================

  /**
   * Get membership statistics (admin only)
   * GET /membership/admin/stats
   */
  getMembershipStats: async () => {
    return api.get(MEMBERSHIP_ENDPOINTS.admin.stats);
  },

  /**
   * Get all memberships with filtering (admin only)
   * GET /membership/admin/memberships
   */
  getAllMemberships: async (filters: {
    status?: string[];
    tier?: string[];
    billing_cycle?: string[];
    search?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    const params = buildQueryParams(filters);
    const url = params ? `${MEMBERSHIP_ENDPOINTS.admin.memberships}?${params}` : MEMBERSHIP_ENDPOINTS.admin.memberships;
    return api.get(url);
  },

  /**
   * Update membership status (admin only)
   * PUT /membership/admin/memberships/:id/status
   */
  updateMembershipStatus: async (membershipId: string, statusData: {
    status: string;
    notes?: string;
  }) => {
    return api.put(`${MEMBERSHIP_ENDPOINTS.admin.memberships}/${membershipId}/status`, statusData);
  },

  /**
   * Cancel membership (admin only)
   * POST /membership/admin/memberships/:id/cancel
   */
  adminCancelMembership: async (membershipId: string, cancellationData: {
    reason: string;
    cancel_at_period_end?: boolean;
  }) => {
    return api.post(`${MEMBERSHIP_ENDPOINTS.admin.memberships}/${membershipId}/cancel`, cancellationData);
  },

  /**
   * Reactivate membership (admin only)
   * POST /membership/admin/memberships/:id/reactivate
   */
  adminReactivateMembership: async (membershipId: string) => {
    return api.post(`${MEMBERSHIP_ENDPOINTS.admin.memberships}/${membershipId}/reactivate`);
  }
};

export default membershipApi;
