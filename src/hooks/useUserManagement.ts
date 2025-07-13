// User Management React Query Hooks
// Provides hooks for all user management operations with caching and state management

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { userApi } from '../lib/userApi';
import type {
  UserFilters,
  UpdateUserRequest,
  DonorFilters,
  CreateDonorProfileRequest,
  UpdateDonorProfileRequest,
  VolunteerFilters,
  CreateVolunteerProfileRequest,
  UpdateVolunteerProfileRequest,
  UpdateBackgroundCheckRequest,
  AddVolunteerHoursRequest,
  SkillFilters,
  CreateSkillRequest,
  UpdateSkillRequest,
  AddSkillToVolunteerRequest,
  UpdateVolunteerSkillRequest,
  VerifyVolunteerSkillRequest,
} from '../types/user';

// Query keys for React Query
export const USER_QUERY_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_QUERY_KEYS.all, 'list'] as const,
  list: (filters: UserFilters) => [...USER_QUERY_KEYS.lists(), filters] as const,
  details: () => [...USER_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...USER_QUERY_KEYS.details(), id] as const,
  stats: () => [...USER_QUERY_KEYS.all, 'stats'] as const,
  search: (query: string, filters: UserFilters) =>
    [...USER_QUERY_KEYS.all, 'search', query, filters] as const,
  current: () => [...USER_QUERY_KEYS.all, 'current'] as const,
} as const;

export const DONOR_QUERY_KEYS = {
  all: ['donors'] as const,
  lists: () => [...DONOR_QUERY_KEYS.all, 'list'] as const,
  list: (filters: DonorFilters) => [...DONOR_QUERY_KEYS.lists(), filters] as const,
  details: () => [...DONOR_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...DONOR_QUERY_KEYS.details(), id] as const,
  stats: () => [...DONOR_QUERY_KEYS.all, 'stats'] as const,
  current: () => [...DONOR_QUERY_KEYS.all, 'current'] as const,
} as const;

export const VOLUNTEER_QUERY_KEYS = {
  all: ['volunteers'] as const,
  lists: () => [...VOLUNTEER_QUERY_KEYS.all, 'list'] as const,
  list: (filters: VolunteerFilters) => [...VOLUNTEER_QUERY_KEYS.lists(), filters] as const,
  details: () => [...VOLUNTEER_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...VOLUNTEER_QUERY_KEYS.details(), id] as const,
  stats: () => [...VOLUNTEER_QUERY_KEYS.all, 'stats'] as const,
  current: () => [...VOLUNTEER_QUERY_KEYS.all, 'current'] as const,
} as const;

export const SKILL_QUERY_KEYS = {
  all: ['skills'] as const,
  lists: () => [...SKILL_QUERY_KEYS.all, 'list'] as const,
  list: (filters: SkillFilters) => [...SKILL_QUERY_KEYS.lists(), filters] as const,
  details: () => [...SKILL_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SKILL_QUERY_KEYS.details(), id] as const,
  stats: () => [...SKILL_QUERY_KEYS.all, 'stats'] as const,
  categories: () => [...SKILL_QUERY_KEYS.all, 'categories'] as const,
  volunteerSkills: (volunteerId: string) =>
    [...SKILL_QUERY_KEYS.all, 'volunteer', volunteerId] as const,
} as const;

// ==================== USER HOOKS ====================

/**
 * Hook to fetch users with filtering and pagination
 */
export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.list(filters),
    queryFn: () => userApi.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch current user profile
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: USER_QUERY_KEYS.current(),
    queryFn: () => userApi.getCurrentUser(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch user by ID
 */
export function useUser(userId: string, includeProfiles = false) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(userId),
    queryFn: () => userApi.getUserById(userId, includeProfiles),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to search users
 */
export function useUserSearch(searchQuery: string, filters: UserFilters = {}) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.search(searchQuery, filters),
    queryFn: () => userApi.searchUsers(searchQuery, filters),
    enabled: searchQuery.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch user statistics
 */
export function useUserStats() {
  return useQuery({
    queryKey: USER_QUERY_KEYS.stats(),
    queryFn: () => userApi.getUserStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes for stats
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to create a new user (admin)
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      // Invalidate and refetch user lists and stats
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.stats() });

      toast.success('User created successfully');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || error?.message || 'Failed to create user';
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook to fetch a single user by ID
 */
export function useUserById(userId: string) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(userId),
    queryFn: () => userApi.getUserById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch donor profile by user ID
 */
export function useDonorById(userId: string) {
  return useQuery({
    queryKey: DONOR_QUERY_KEYS.detail(userId),
    queryFn: () => userApi.getDonorById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      // Don't retry if profile doesn't exist
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

/**
 * Hook to fetch volunteer profile by user ID (alias for existing useVolunteer)
 */
export function useVolunteerById(userId: string) {
  return useVolunteer(userId);
}

/**
 * Hook to update current user profile
 */
export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UpdateUserRequest) => userApi.updateCurrentUser(userData),
    onSuccess: data => {
      // Update current user cache
      queryClient.setQueryData(USER_QUERY_KEYS.current(), data);
      // Invalidate user lists to refresh data
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    },
  });
}

/**
 * Hook to update user by ID (admin)
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: UpdateUserRequest }) =>
      userApi.updateUser(userId, userData),
    onSuccess: (_data, variables) => {
      // Update specific user cache
      queryClient.setQueryData(USER_QUERY_KEYS.detail(variables.userId), _data);
      // Invalidate user lists
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update user');
    },
  });
}

/**
 * Hook to delete user (admin)
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userApi.deleteUser(userId),
    onSuccess: (_, userId) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.detail(userId) });
      // Invalidate user lists and stats
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.stats() });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete user');
    },
  });
}

/**
 * Hook for bulk user operations (admin)
 */
export function useBulkDeleteUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userIds: string[]) => userApi.bulkDeleteUsers(userIds),
    onSuccess: data => {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
      toast.success(`${data.deletedCount} users deleted successfully`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete users');
    },
  });
}

/**
 * Hook for bulk role updates (admin)
 */
export function useBulkUpdateUserRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userIds, role }: { userIds: string[]; role: string }) =>
      userApi.bulkUpdateUserRoles(userIds, role),
    onSuccess: data => {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
      toast.success(`${data.updatedCount} user roles updated successfully`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update user roles');
    },
  });
}

// ==================== DONOR PROFILE HOOKS ====================

/**
 * Hook to fetch donors with filtering and pagination
 */
export function useDonors(filters: DonorFilters = {}) {
  return useQuery({
    queryKey: DONOR_QUERY_KEYS.list(filters),
    queryFn: () => userApi.getDonors(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch current user's donor profile
 */
export function useCurrentDonorProfile() {
  return useQuery({
    queryKey: DONOR_QUERY_KEYS.current(),
    queryFn: () => userApi.getCurrentDonorProfile(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      // Don't retry if profile doesn't exist
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

/**
 * Hook to fetch donor by ID
 */
export function useDonor(userId: string) {
  return useQuery({
    queryKey: DONOR_QUERY_KEYS.detail(userId),
    queryFn: () => userApi.getDonorById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch donor statistics
 */
export function useDonorStats() {
  return useQuery({
    queryKey: DONOR_QUERY_KEYS.stats(),
    queryFn: () => userApi.getDonorStats(),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to create donor profile
 */
export function useCreateDonorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: CreateDonorProfileRequest) => userApi.createDonorProfile(profileData),
    onSuccess: data => {
      // Update current donor profile cache
      queryClient.setQueryData(DONOR_QUERY_KEYS.current(), data);
      // Invalidate donor lists and stats
      queryClient.invalidateQueries({ queryKey: DONOR_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DONOR_QUERY_KEYS.stats() });
      // Update current user to reflect is_donor status
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.current() });
      toast.success('Donor profile created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create donor profile');
    },
  });
}

/**
 * Hook to update current user's donor profile
 */
export function useUpdateCurrentDonorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: UpdateDonorProfileRequest) =>
      userApi.updateCurrentDonorProfile(profileData),
    onSuccess: data => {
      // Update current donor profile cache
      queryClient.setQueryData(DONOR_QUERY_KEYS.current(), data);
      // Invalidate donor lists
      queryClient.invalidateQueries({ queryKey: DONOR_QUERY_KEYS.lists() });
      toast.success('Donor profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update donor profile');
    },
  });
}

/**
 * Hook to update donor profile by ID (admin)
 */
export function useUpdateDonorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      profileData,
    }: {
      userId: string;
      profileData: UpdateDonorProfileRequest;
    }) => userApi.updateDonorProfile(userId, profileData),
    onSuccess: (data, variables) => {
      // Update specific donor cache
      queryClient.setQueryData(DONOR_QUERY_KEYS.detail(variables.userId), data);
      // Invalidate donor lists
      queryClient.invalidateQueries({ queryKey: DONOR_QUERY_KEYS.lists() });
      toast.success('Donor profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update donor profile');
    },
  });
}

/**
 * Hook to delete current user's donor profile
 */
export function useDeleteCurrentDonorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userApi.deleteCurrentDonorProfile(),
    onSuccess: () => {
      // Remove current donor profile from cache
      queryClient.removeQueries({ queryKey: DONOR_QUERY_KEYS.current() });
      // Invalidate donor lists and stats
      queryClient.invalidateQueries({ queryKey: DONOR_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DONOR_QUERY_KEYS.stats() });
      // Update current user to reflect is_donor status
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.current() });
      toast.success('Donor profile deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete donor profile');
    },
  });
}

// ==================== VOLUNTEER PROFILE HOOKS ====================

/**
 * Hook to fetch volunteers with filtering and pagination
 */
export function useVolunteers(filters: VolunteerFilters = {}) {
  return useQuery({
    queryKey: VOLUNTEER_QUERY_KEYS.list(filters),
    queryFn: () => userApi.getVolunteers(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch current user's volunteer profile
 */
export function useCurrentVolunteerProfile() {
  return useQuery({
    queryKey: VOLUNTEER_QUERY_KEYS.current(),
    queryFn: () => userApi.getCurrentVolunteerProfile(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      // Don't retry if profile doesn't exist
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

/**
 * Hook to fetch volunteer by ID
 */
export function useVolunteer(userId: string) {
  return useQuery({
    queryKey: VOLUNTEER_QUERY_KEYS.detail(userId),
    queryFn: () => userApi.getVolunteerById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch volunteer statistics
 */
export function useVolunteerStats() {
  return useQuery({
    queryKey: VOLUNTEER_QUERY_KEYS.stats(),
    queryFn: () => userApi.getVolunteerStats(),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to create volunteer profile
 */
export function useCreateVolunteerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: CreateVolunteerProfileRequest) =>
      userApi.createVolunteerProfile(profileData),
    onSuccess: data => {
      // Update current volunteer profile cache
      queryClient.setQueryData(VOLUNTEER_QUERY_KEYS.current(), data);
      // Invalidate volunteer lists and stats
      queryClient.invalidateQueries({ queryKey: VOLUNTEER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: VOLUNTEER_QUERY_KEYS.stats() });
      // Update current user to reflect is_volunteer status
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.current() });
      toast.success('Volunteer profile created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create volunteer profile');
    },
  });
}

/**
 * Hook to update current user's volunteer profile
 */
export function useUpdateCurrentVolunteerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: UpdateVolunteerProfileRequest) =>
      userApi.updateCurrentVolunteerProfile(profileData),
    onSuccess: data => {
      // Update current volunteer profile cache
      queryClient.setQueryData(VOLUNTEER_QUERY_KEYS.current(), data);
      // Invalidate volunteer lists
      queryClient.invalidateQueries({ queryKey: VOLUNTEER_QUERY_KEYS.lists() });
      toast.success('Volunteer profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update volunteer profile');
    },
  });
}

/**
 * Hook to update volunteer profile by ID (admin)
 */
export function useUpdateVolunteerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      profileData,
    }: {
      userId: string;
      profileData: UpdateVolunteerProfileRequest;
    }) => userApi.updateVolunteerProfile(userId, profileData),
    onSuccess: (data, variables) => {
      // Update specific volunteer cache
      queryClient.setQueryData(VOLUNTEER_QUERY_KEYS.detail(variables.userId), data);
      // Invalidate volunteer lists
      queryClient.invalidateQueries({ queryKey: VOLUNTEER_QUERY_KEYS.lists() });
      toast.success('Volunteer profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update volunteer profile');
    },
  });
}

/**
 * Hook to update background check status (admin)
 */
export function useUpdateBackgroundCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      statusData,
    }: {
      userId: string;
      statusData: UpdateBackgroundCheckRequest;
    }) => userApi.updateBackgroundCheck(userId, statusData),
    onSuccess: (data, variables) => {
      // Update specific volunteer cache
      queryClient.setQueryData(VOLUNTEER_QUERY_KEYS.detail(variables.userId), data);
      // Invalidate volunteer lists and stats
      queryClient.invalidateQueries({ queryKey: VOLUNTEER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: VOLUNTEER_QUERY_KEYS.stats() });
      toast.success('Background check status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update background check status');
    },
  });
}

/**
 * Hook to add volunteer hours (admin)
 */
export function useAddVolunteerHours() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, hoursData }: { userId: string; hoursData: AddVolunteerHoursRequest }) =>
      userApi.addVolunteerHours(userId, hoursData),
    onSuccess: (data, variables) => {
      // Update specific volunteer cache
      queryClient.setQueryData(VOLUNTEER_QUERY_KEYS.detail(variables.userId), data);
      // Invalidate volunteer lists and stats
      queryClient.invalidateQueries({ queryKey: VOLUNTEER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: VOLUNTEER_QUERY_KEYS.stats() });
      toast.success(`Added ${variables.hoursData.hours} hours to volunteer`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to add volunteer hours');
    },
  });
}

// ==================== SKILLS HOOKS ====================

/**
 * Hook to fetch skills with filtering and pagination
 */
export function useSkills(filters: SkillFilters = {}) {
  return useQuery({
    queryKey: SKILL_QUERY_KEYS.list(filters),
    queryFn: () => userApi.getSkills(filters),
    staleTime: 10 * 60 * 1000, // Skills change less frequently
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to fetch skill categories
 */
export function useSkillCategories() {
  return useQuery({
    queryKey: SKILL_QUERY_KEYS.categories(),
    queryFn: () => userApi.getSkillCategories(),
    staleTime: 30 * 60 * 1000, // Categories change very rarely
    gcTime: 60 * 60 * 1000,
  });
}

/**
 * Hook to fetch skills statistics
 */
export function useSkillStats() {
  return useQuery({
    queryKey: SKILL_QUERY_KEYS.stats(),
    queryFn: () => userApi.getSkillStats(),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to fetch volunteer skills
 */
export function useVolunteerSkills(volunteerId: string) {
  return useQuery({
    queryKey: SKILL_QUERY_KEYS.volunteerSkills(volunteerId),
    queryFn: () => userApi.getVolunteerSkills(volunteerId),
    enabled: !!volunteerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch skill by ID
 */
export function useSkill(skillId: string) {
  return useQuery({
    queryKey: SKILL_QUERY_KEYS.detail(skillId),
    queryFn: () => userApi.getSkillById(skillId),
    enabled: !!skillId,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to create skill (admin)
 */
export function useCreateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skillData: CreateSkillRequest) => userApi.createSkill(skillData),
    onSuccess: () => {
      // Invalidate skills lists, categories, and stats
      queryClient.invalidateQueries({ queryKey: SKILL_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SKILL_QUERY_KEYS.categories() });
      queryClient.invalidateQueries({ queryKey: SKILL_QUERY_KEYS.stats() });
      toast.success('Skill created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create skill');
    },
  });
}

/**
 * Hook to update skill (admin)
 */
export function useUpdateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ skillId, skillData }: { skillId: string; skillData: UpdateSkillRequest }) =>
      userApi.updateSkill(skillId, skillData),
    onSuccess: (data, variables) => {
      // Update specific skill cache
      queryClient.setQueryData(SKILL_QUERY_KEYS.detail(variables.skillId), data);
      // Invalidate skills lists and categories
      queryClient.invalidateQueries({ queryKey: SKILL_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SKILL_QUERY_KEYS.categories() });
      toast.success('Skill updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update skill');
    },
  });
}

/**
 * Hook to delete skill (admin)
 */
export function useDeleteSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skillId: string) => userApi.deleteSkill(skillId),
    onSuccess: (_, skillId) => {
      // Remove skill from cache
      queryClient.removeQueries({ queryKey: SKILL_QUERY_KEYS.detail(skillId) });
      // Invalidate skills lists, categories, and stats
      queryClient.invalidateQueries({ queryKey: SKILL_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SKILL_QUERY_KEYS.categories() });
      queryClient.invalidateQueries({ queryKey: SKILL_QUERY_KEYS.stats() });
      toast.success('Skill deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete skill');
    },
  });
}

/**
 * Hook to add skill to volunteer (admin)
 */
export function useAddSkillToVolunteer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      volunteerId,
      skillData,
    }: {
      volunteerId: string;
      skillData: AddSkillToVolunteerRequest;
    }) => userApi.addSkillToVolunteer(volunteerId, skillData),
    onSuccess: (_data, variables) => {
      // Invalidate volunteer skills cache
      queryClient.invalidateQueries({
        queryKey: SKILL_QUERY_KEYS.volunteerSkills(variables.volunteerId),
      });
      // Update volunteer profile cache
      queryClient.invalidateQueries({
        queryKey: VOLUNTEER_QUERY_KEYS.detail(variables.volunteerId),
      });
      toast.success('Skill added to volunteer successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to add skill to volunteer');
    },
  });
}

/**
 * Hook to update volunteer skill (admin)
 */
export function useUpdateVolunteerSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      volunteerId,
      skillId,
      skillData,
    }: {
      volunteerId: string;
      skillId: string;
      skillData: UpdateVolunteerSkillRequest;
    }) => userApi.updateVolunteerSkill(volunteerId, skillId, skillData),
    onSuccess: (_data, variables) => {
      // Invalidate volunteer skills cache
      queryClient.invalidateQueries({
        queryKey: SKILL_QUERY_KEYS.volunteerSkills(variables.volunteerId),
      });
      toast.success('Volunteer skill updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update volunteer skill');
    },
  });
}

/**
 * Hook to remove skill from volunteer (admin)
 */
export function useRemoveSkillFromVolunteer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ volunteerId, skillId }: { volunteerId: string; skillId: string }) =>
      userApi.removeSkillFromVolunteer(volunteerId, skillId),
    onSuccess: (_data, variables) => {
      // Invalidate volunteer skills cache
      queryClient.invalidateQueries({
        queryKey: SKILL_QUERY_KEYS.volunteerSkills(variables.volunteerId),
      });
      // Update volunteer profile cache
      queryClient.invalidateQueries({
        queryKey: VOLUNTEER_QUERY_KEYS.detail(variables.volunteerId),
      });
      toast.success('Skill removed from volunteer successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to remove skill from volunteer');
    },
  });
}

/**
 * Hook to verify volunteer skill (admin)
 */
export function useVerifyVolunteerSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      volunteerId,
      skillId,
      verificationData,
    }: {
      volunteerId: string;
      skillId: string;
      verificationData: VerifyVolunteerSkillRequest;
    }) => userApi.verifyVolunteerSkill(volunteerId, skillId, verificationData),
    onSuccess: (_data, variables) => {
      // Invalidate volunteer skills cache
      queryClient.invalidateQueries({
        queryKey: SKILL_QUERY_KEYS.volunteerSkills(variables.volunteerId),
      });
      toast.success(
        `Skill ${variables.verificationData.is_verified ? 'verified' : 'unverified'} successfully`
      );
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update skill verification');
    },
  });
}
