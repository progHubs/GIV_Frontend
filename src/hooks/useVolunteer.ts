// Volunteer Hooks
// React Query hooks for volunteer-related operations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignApi } from '../lib/campaignApi';
import type {
  VolunteerApplicationRequest,
  VolunteerProfileUpdateRequest,
  VolunteerHoursRequest,
  VolunteerFilters,
  CampaignVolunteerFilters,
} from '../types/volunteer';

// Query Keys for React Query
export const volunteerQueryKeys = {
  all: ['volunteer'] as const,
  profile: (userId?: string) => [...volunteerQueryKeys.all, 'profile', userId] as const,
  campaigns: () => [...volunteerQueryKeys.all, 'campaigns'] as const,
  campaignVolunteers: (campaignId: string, filters: CampaignVolunteerFilters) => 
    [...volunteerQueryKeys.all, 'campaign', campaignId, filters] as const,
  stats: (userId?: string) => [...volunteerQueryKeys.all, 'stats', userId] as const,
  userCampaigns: () => [...volunteerQueryKeys.all, 'userCampaigns'] as const,
};

// ==================== VOLUNTEER APPLICATION HOOKS ====================

/**
 * Hook for applying to volunteer for a campaign
 */
export const useApplyCampaignVolunteer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      campaignId,
      applicationData,
    }: {
      campaignId: string;
      applicationData: VolunteerApplicationRequest;
    }) => campaignApi.applyCampaignVolunteer(campaignId, applicationData),
    onSuccess: (_, variables) => {
      // Invalidate campaign volunteers
      queryClient.invalidateQueries({
        queryKey: [...volunteerQueryKeys.all, 'campaign', variables.campaignId],
      });
      // Invalidate user's volunteer campaigns
      queryClient.invalidateQueries({ queryKey: volunteerQueryKeys.userCampaigns() });
      // Invalidate volunteer stats
      queryClient.invalidateQueries({ queryKey: volunteerQueryKeys.stats() });
    },
  });
};

/**
 * Hook for getting campaign volunteers
 */
export const useCampaignVolunteers = (
  campaignId: string,
  filters: CampaignVolunteerFilters = {}
) => {
  return useQuery({
    queryKey: volunteerQueryKeys.campaignVolunteers(campaignId, filters),
    queryFn: () => campaignApi.getCampaignVolunteers(campaignId, filters),
    select: data => (data.success ? data : { success: true, data: [], pagination: {} }),
    enabled: !!campaignId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true, // For smooth pagination
  });
};

/**
 * Hook for updating volunteer status (admin only)
 */
export const useUpdateVolunteerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      campaignId,
      userId,
      statusData,
    }: {
      campaignId: string;
      userId: string;
      statusData: any;
    }) => campaignApi.updateVolunteerStatus(campaignId, userId, statusData),
    onSuccess: (_, variables) => {
      // Invalidate campaign volunteers
      queryClient.invalidateQueries({
        queryKey: [...volunteerQueryKeys.all, 'campaign', variables.campaignId],
      });
      // Invalidate volunteer stats
      queryClient.invalidateQueries({ queryKey: volunteerQueryKeys.stats() });
    },
  });
};

// ==================== VOLUNTEER HOURS HOOKS ====================

/**
 * Hook for logging volunteer hours
 */
export const useLogVolunteerHours = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      campaignVolunteerId,
      hoursData,
    }: {
      campaignVolunteerId: string;
      hoursData: VolunteerHoursRequest;
    }) => campaignApi.logVolunteerHours(campaignVolunteerId, hoursData),
    onSuccess: () => {
      // Invalidate user's volunteer campaigns
      queryClient.invalidateQueries({ queryKey: volunteerQueryKeys.userCampaigns() });
      // Invalidate volunteer stats
      queryClient.invalidateQueries({ queryKey: volunteerQueryKeys.stats() });
    },
  });
};

// ==================== VOLUNTEER STATISTICS HOOKS ====================

/**
 * Hook for fetching volunteer statistics
 */
export const useVolunteerStats = (userId?: string) => {
  return useQuery({
    queryKey: volunteerQueryKeys.stats(userId),
    queryFn: () => campaignApi.getVolunteerStats(userId),
    select: data => (data.success ? data.data : null),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching user's volunteer campaigns
 */
export const useUserVolunteerCampaigns = () => {
  return useQuery({
    queryKey: volunteerQueryKeys.userCampaigns(),
    queryFn: () => campaignApi.getUserVolunteerCampaigns(),
    select: data => (data.success ? data.data : []),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// ==================== UTILITY HOOKS ====================

/**
 * Hook to check if user has applied to a specific campaign
 */
export const useHasAppliedToCampaign = (campaignId: string) => {
  const { data: userCampaigns } = useUserVolunteerCampaigns();
  
  return userCampaigns?.some(
    (campaign: any) => campaign.campaign_id === campaignId
  ) || false;
};

/**
 * Hook to get user's application status for a campaign
 */
export const useCampaignApplicationStatus = (campaignId: string) => {
  const { data: userCampaigns } = useUserVolunteerCampaigns();
  
  const application = userCampaigns?.find(
    (campaign: any) => campaign.campaign_id === campaignId
  );
  
  return application?.application_status || null;
};

/**
 * Hook to check if user can apply to volunteer
 */
export const useCanApplyToVolunteer = (campaignId: string) => {
  const hasApplied = useHasAppliedToCampaign(campaignId);
  const applicationStatus = useCampaignApplicationStatus(campaignId);
  
  // User can apply if they haven't applied or if their application was rejected
  return !hasApplied || applicationStatus === 'rejected';
};

/**
 * Hook to get user's total volunteer hours
 */
export const useUserTotalVolunteerHours = () => {
  const { data: stats } = useVolunteerStats();
  return stats?.total_hours_logged || 0;
};

/**
 * Hook to get user's active volunteer campaigns count
 */
export const useActiveVolunteerCampaignsCount = () => {
  const { data: userCampaigns } = useUserVolunteerCampaigns();
  
  return userCampaigns?.filter(
    (campaign: any) => campaign.application_status === 'approved'
  ).length || 0;
};

/**
 * Hook to check if user is an active volunteer
 */
export const useIsActiveVolunteer = () => {
  const activeCount = useActiveVolunteerCampaignsCount();
  return activeCount > 0;
};

// ==================== CAMPAIGN VOLUNTEER MANAGEMENT HOOKS ====================

/**
 * Hook for withdrawing from a volunteer campaign
 */
export const useWithdrawFromCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaignId: string) => {
      // This would need to be implemented in the API
      // For now, we'll use a placeholder
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      // Invalidate user's volunteer campaigns
      queryClient.invalidateQueries({ queryKey: volunteerQueryKeys.userCampaigns() });
      // Invalidate volunteer stats
      queryClient.invalidateQueries({ queryKey: volunteerQueryKeys.stats() });
    },
  });
};

/**
 * Hook for getting pending volunteer applications (admin)
 */
export const usePendingVolunteerApplications = () => {
  return useQuery({
    queryKey: [...volunteerQueryKeys.all, 'pending'],
    queryFn: () => {
      // This would need to be implemented in the API
      // For now, we'll return empty data
      return Promise.resolve({ success: true, data: [] });
    },
    select: data => (data.success ? data.data : []),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
