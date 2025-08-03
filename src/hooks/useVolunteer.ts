// Volunteer Hooks
// React Query hooks for volunteer-related operations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignApi } from '../lib/campaignApi';
import { userApi } from '../lib/userApi';
import { api } from '../lib/api';
import { toast } from 'react-hot-toast';
import type {
  VolunteerApplicationRequest,
  VolunteerProfileUpdateRequest,
  VolunteerHoursRequest,
  VolunteerFilters,
  CampaignVolunteerFilters,
  VolunteerProfile,
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
  volunteers: (filters: VolunteerFilters) => [...volunteerQueryKeys.all, 'volunteers', filters] as const,
  search: (query: string, filters: VolunteerFilters) => [...volunteerQueryKeys.all, 'search', query, filters] as const,
};

// ==================== VOLUNTEER PROFILE HOOKS ====================

/**
 * Hook to fetch all volunteers (admin only)
 */
export const useAllVolunteers = (filters: VolunteerFilters = {}, options?: any) => {
  return useQuery({
    queryKey: volunteerQueryKeys.volunteers(filters),
    queryFn: () => userApi.getVolunteers(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true,
    ...options,
  });
};

/**
 * Hook to search volunteers (admin only)
 */
export const useSearchVolunteers = (searchParams: { query: string } & VolunteerFilters, options?: any) => {
  return useQuery({
    queryKey: volunteerQueryKeys.search(searchParams.query, searchParams),
    queryFn: () => userApi.searchVolunteers(searchParams.query, searchParams),
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
};

/**
 * Hook to get volunteer statistics (admin only)
 */
export const useVolunteerStats = () => {
  return useQuery({
    queryKey: volunteerQueryKeys.stats(),
    queryFn: () => userApi.getVolunteerStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to update volunteer profile (admin or owner)
 */
export const useUpdateVolunteerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, profileData }: { userId: string; profileData: Partial<VolunteerProfile> & { files?: File[] } }) => {
      return userApi.updateVolunteerProfile(userId, profileData);
    },
    onSuccess: (_, variables) => {
      // Invalidate volunteer queries
      queryClient.invalidateQueries({ queryKey: volunteerQueryKeys.all });
      // Invalidate specific volunteer profile
      queryClient.invalidateQueries({ 
        queryKey: volunteerQueryKeys.profile(variables.userId) 
      });
      toast.success('Volunteer profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update volunteer profile');
    },
  });
};

/**
 * Hook to delete volunteer profile (admin only)
 */
export const useDeleteVolunteer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => {
      return userApi.deleteVolunteerProfile(userId);
    },
    onSuccess: () => {
      // Invalidate all volunteer queries
      queryClient.invalidateQueries({ queryKey: volunteerQueryKeys.all });
      toast.success('Volunteer profile deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete volunteer profile');
    },
  });
};

// ==================== VOLUNTEER APPLICATION HOOKS ====================

/**
 * Hook for applying to volunteer for a campaign
 */
export const useApplyCampaignVolunteer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, files }: { data: VolunteerApplicationRequest; files?: File[] }) => {
      // Create FormData if files are provided
      if (files && files.length > 0) {
        const formData = new FormData();

        // Add form data
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });

        // Add files
        files.forEach((file, index) => {
          formData.append(`documents`, file);
        });

        return api.post(`/campaigns/${data.campaign_id}/volunteers/apply`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        return campaignApi.applyCampaignVolunteer(data.campaign_id, data);
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate campaign volunteers
      queryClient.invalidateQueries({
        queryKey: [...volunteerQueryKeys.all, 'campaign', variables.data.campaign_id],
      });
      // Invalidate user's volunteer campaigns
      queryClient.invalidateQueries({ queryKey: volunteerQueryKeys.userCampaigns() });
      // Invalidate volunteer stats
      queryClient.invalidateQueries({ queryKey: volunteerQueryKeys.stats() });
      toast.success('Application submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit application');
    },
  });
};

/**
 * Hook for getting campaign volunteers
 */
export const useCampaignVolunteers = (
  campaignId: string,
  filters: CampaignVolunteerFilters = {},
  options?: any
) => {
  return useQuery({
    queryKey: volunteerQueryKeys.campaignVolunteers(campaignId, filters),
    queryFn: () => campaignApi.getCampaignVolunteers(campaignId, filters),
    select: data => (data.success ? data : { success: true, data: [], pagination: {} }),
    enabled: !!campaignId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true, // For smooth pagination
    ...options,
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
      status,
      notes,
    }: {
      campaignId: string;
      userId: string;
      status: string;
      notes?: string;
    }) => {
      return campaignApi.updateVolunteerStatus(campaignId, userId, { status, notes });
    },
    onSuccess: (_, variables) => {
      // Invalidate campaign volunteers
      queryClient.invalidateQueries({
        queryKey: [...volunteerQueryKeys.all, 'campaign', variables.campaignId],
      });
      // Invalidate volunteer stats
      queryClient.invalidateQueries({ queryKey: volunteerQueryKeys.stats() });
      toast.success('Volunteer status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update volunteer status');
    },
  });
};

/**
 * Hook for logging volunteer hours
 */
export const useLogVolunteerHours = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VolunteerHoursRequest) => {
      return campaignApi.logVolunteerHours(data.campaign_volunteer_id, data);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: volunteerQueryKeys.campaigns() });
      queryClient.invalidateQueries({ queryKey: volunteerQueryKeys.stats() });
      toast.success('Hours logged successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to log hours');
    },
  });
};

/**
 * Hook for getting user's volunteer campaigns
 */
export const useUserVolunteerCampaigns = (filters: any = {}) => {
  return useQuery({
    queryKey: volunteerQueryKeys.userCampaigns(),
    queryFn: () => campaignApi.getUserVolunteerCampaigns(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for getting campaign applications for a specific volunteer (Admin only)
 */
export const useVolunteerCampaignApplications = (
  userId: string,
  filters: any = {},
  options?: any
) => {
  return useQuery({
    queryKey: ['volunteer', 'campaignApplications', userId, filters],
    queryFn: () => campaignApi.getVolunteerCampaignApplications(userId, filters),
    select: data => (data.success ? data : { success: true, data: [], pagination: {} }),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

/**
 * Hook for getting volunteer profile by ID
 */
export const useVolunteerProfile = (userId?: string) => {
  return useQuery({
    queryKey: volunteerQueryKeys.profile(userId),
    queryFn: () => {
      if (!userId) return userApi.getCurrentVolunteerProfile();
      return userApi.getVolunteerById(userId);
    },
    enabled: !!userId || userId === undefined, // Enable for current user or specific user
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// ==================== VOLUNTEER PROFILE MANAGEMENT HOOKS ====================

/**
 * Hook for creating volunteer profile
 */
export const useCreateVolunteerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: any) => {
      return userApi.createVolunteerProfile(profileData);
    },
    onSuccess: () => {
      // Invalidate volunteer queries
      queryClient.invalidateQueries({ queryKey: volunteerQueryKeys.all });
      toast.success('Volunteer profile created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create volunteer profile');
    },
  });
};

/**
 * Hook for updating current user's volunteer profile
 */
export const useUpdateCurrentVolunteerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: VolunteerProfileUpdateRequest & { files?: File[] }) => {
      return userApi.updateCurrentVolunteerProfile(profileData);
    },
    onSuccess: () => {
      // Invalidate current volunteer profile
      queryClient.invalidateQueries({ queryKey: volunteerQueryKeys.profile() });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

// ==================== UTILITY HOOKS ====================

/**
 * Hook to check if user has applied to a specific campaign
 */
export const useHasAppliedToCampaign = (campaignId: string) => {
  const { data: userCampaigns } = useUserVolunteerCampaigns();

  return userCampaigns?.some((campaign: any) => campaign.campaign_id === campaignId) || false;
};

/**
 * Hook to get user's application status for a campaign
 */
export const useCampaignApplicationStatus = (campaignId: string) => {
  const { data: userCampaigns } = useUserVolunteerCampaigns();

  const application = userCampaigns?.find((campaign: any) => campaign.campaign_id === campaignId);

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

  return (
    userCampaigns?.filter((campaign: any) => campaign.application_status === 'approved').length || 0
  );
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

/**
 * Hook for getting volunteer applications
 */
export const useVolunteerApplications = (enabled: boolean = true) => {
  return useQuery({
    queryKey: volunteerQueryKeys.userCampaigns(),
    queryFn: () => api.get('/volunteers/my-campaigns'),
    select: data => (data.success ? data : { success: true, data: [] }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled,
  });
};
