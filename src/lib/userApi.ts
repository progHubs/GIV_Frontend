// User Management API Service
// Handles all user-related API calls including profiles and skills

import { api } from './api';
import type {
  UserFilters,
  UserListResponse,
  UserResponse,
  UserStatsResponse,
  CreateUserRequest,
  UpdateUserRequest,
  DonorFilters,
  DonorListResponse,
  DonorResponse,
  DonorStatsResponse,
  CreateDonorProfileRequest,
  UpdateDonorProfileRequest,
  VolunteerFilters,
  VolunteerListResponse,
  VolunteerResponse,
  VolunteerStatsResponse,
  CreateVolunteerProfileRequest,
  UpdateVolunteerProfileRequest,
  UpdateBackgroundCheckRequest,
  AddVolunteerHoursRequest,
  SkillFilters,
  SkillListResponse,
  SkillResponse,
  SkillStatsResponse,
  SkillCategoriesResponse,
  CreateSkillRequest,
  UpdateSkillRequest,
  AddSkillToVolunteerRequest,
  UpdateVolunteerSkillRequest,
  VerifyVolunteerSkillRequest,
  VolunteerSkillListResponse,
} from '../types/user';

// API endpoints
const USER_ENDPOINTS = {
  users: '/users',
  userStats: '/users/stats',
  userSearch: '/users/search',
  currentUser: '/users/me',
  donors: '/donors',
  donorStats: '/donors/stats',
  donorSearch: '/donors/search',
  volunteers: '/volunteers',
  volunteerStats: '/volunteers/stats',
  volunteerSearch: '/volunteers/search',
  skills: '/skills',
  skillStats: '/skills/stats',
  skillCategories: '/skills/categories',
} as const;

/**
 * User Management API Service
 * Provides methods for all user-related operations
 */
export const userApi = {
  // ==================== USER OPERATIONS ====================

  /**
   * Create a new user (admin only)
   * POST /auth/register
   */
  createUser: async (userData: CreateUserRequest): Promise<UserResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Get all users (admin only)
   * GET /users
   */
  getUsers: async (filters: UserFilters = {}): Promise<UserListResponse> => {
    const params = new URLSearchParams();

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    const url = queryString ? `${USER_ENDPOINTS.users}?${queryString}` : USER_ENDPOINTS.users;

    return api.get<UserListResponse>(url);
  },

  /**
   * Get current user profile
   * GET /users/me
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    return api.get<UserResponse>(USER_ENDPOINTS.currentUser);
  },

  /**
   * Get user by ID (admin only)
   * GET /users/:id
   */
  getUserById: async (userId: string, includeProfiles = false): Promise<UserResponse> => {
    const params = includeProfiles ? '?includeProfiles=true' : '';
    return api.get<UserResponse>(`${USER_ENDPOINTS.users}/${userId}${params}`);
  },

  /**
   * Update current user profile
   * PUT /users/me
   */
  updateCurrentUser: async (userData: UpdateUserRequest): Promise<UserResponse> => {
    return api.put<UserResponse>(USER_ENDPOINTS.currentUser, userData);
  },

  /**
   * Update user by ID (admin or own profile)
   * PUT /users/:id
   */
  updateUser: async (userId: string, userData: UpdateUserRequest): Promise<UserResponse> => {
    return api.put<UserResponse>(`${USER_ENDPOINTS.users}/${userId}`, userData);
  },

  /**
   * Delete user (admin only)
   * DELETE /users/:id
   */
  deleteUser: async (userId: string): Promise<{ success: boolean; message: string }> => {
    return api.delete<{ success: boolean; message: string }>(`${USER_ENDPOINTS.users}/${userId}`);
  },

  /**
   * Search users (admin only)
   * GET /users/search
   */
  searchUsers: async (
    searchQuery: string,
    filters: Omit<UserFilters, 'search'> = {}
  ): Promise<UserListResponse> => {
    const params = new URLSearchParams({ q: searchQuery });

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return api.get<UserListResponse>(`${USER_ENDPOINTS.userSearch}?${params.toString()}`);
  },

  /**
   * Get user statistics (admin only)
   * GET /users/stats
   */
  getUserStats: async (): Promise<UserStatsResponse> => {
    return api.get<UserStatsResponse>(USER_ENDPOINTS.userStats);
  },

  // ==================== DONOR PROFILE OPERATIONS ====================

  /**
   * Get all donors (admin only)
   * GET /donors
   */
  getDonors: async (filters: DonorFilters = {}): Promise<DonorListResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    const url = queryString ? `${USER_ENDPOINTS.donors}?${queryString}` : USER_ENDPOINTS.donors;

    return api.get<DonorListResponse>(url);
  },

  /**
   * Get current user's donor profile
   * GET /donors/me
   */
  getCurrentDonorProfile: async (): Promise<DonorResponse> => {
    return api.get<DonorResponse>(`${USER_ENDPOINTS.donors}/me`);
  },

  /**
   * Create donor profile
   * POST /donors
   */
  createDonorProfile: async (profileData: CreateDonorProfileRequest): Promise<DonorResponse> => {
    return api.post<DonorResponse>(USER_ENDPOINTS.donors, profileData);
  },

  /**
   * Get donor by ID (admin or own profile)
   * GET /donors/:id
   */
  getDonorById: async (userId: string): Promise<DonorResponse> => {
    return api.get<DonorResponse>(`${USER_ENDPOINTS.donors}/${userId}`);
  },

  /**
   * Update current user's donor profile
   * PUT /donors/me
   */
  updateCurrentDonorProfile: async (
    profileData: UpdateDonorProfileRequest
  ): Promise<DonorResponse> => {
    return api.put<DonorResponse>(`${USER_ENDPOINTS.donors}/me`, profileData);
  },

  /**
   * Update donor profile by ID (admin or own profile)
   * PUT /donors/:id
   */
  updateDonorProfile: async (
    userId: string,
    profileData: UpdateDonorProfileRequest
  ): Promise<DonorResponse> => {
    return api.put<DonorResponse>(`${USER_ENDPOINTS.donors}/${userId}`, profileData);
  },

  /**
   * Search donors (admin only)
   * GET /donors/search
   */
  searchDonors: async (
    searchQuery: string,
    filters: Omit<DonorFilters, 'search'> = {}
  ): Promise<DonorListResponse> => {
    const params = new URLSearchParams({ q: searchQuery });

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return api.get<DonorListResponse>(`${USER_ENDPOINTS.donorSearch}?${params.toString()}`);
  },

  /**
   * Get donor statistics (admin only)
   * GET /donors/stats
   */
  getDonorStats: async (): Promise<DonorStatsResponse> => {
    return api.get<DonorStatsResponse>(USER_ENDPOINTS.donorStats);
  },

  /**
   * Update donation tier (admin only)
   * PUT /donors/:id/tier
   */
  updateDonationTier: async (userId: string, tier: string): Promise<DonorResponse> => {
    return api.put<DonorResponse>(`${USER_ENDPOINTS.donors}/${userId}/tier`, { tier });
  },

  /**
   * Generate tax receipt (admin or own profile)
   * GET /donors/:id/tax-receipt/:year
   */
  generateTaxReceipt: async (userId: string, year: number): Promise<any> => {
    return api.get<any>(`${USER_ENDPOINTS.donors}/${userId}/tax-receipt/${year}`);
  },

  /**
   * Get donation history (admin or own profile)
   * GET /donors/:id/donations
   */
  getDonationHistory: async (userId: string, params: any = {}): Promise<any> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `${USER_ENDPOINTS.donors}/${userId}/donations?${queryString}`
      : `${USER_ENDPOINTS.donors}/${userId}/donations`;

    return api.get<any>(url);
  },

  /**
   * Delete current user's donor profile
   * DELETE /donors/me
   */
  deleteCurrentDonorProfile: async (): Promise<{ success: boolean; message: string }> => {
    return api.delete<{ success: boolean; message: string }>(`${USER_ENDPOINTS.donors}/me`);
  },

  /**
   * Delete donor profile by ID (admin or own profile)
   * DELETE /donors/:id
   */
  deleteDonorProfile: async (userId: string): Promise<{ success: boolean; message: string }> => {
    return api.delete<{ success: boolean; message: string }>(`${USER_ENDPOINTS.donors}/${userId}`);
  },

  // ==================== VOLUNTEER PROFILE OPERATIONS ====================

  /**
   * Get all volunteers (admin only)
   * GET /volunteers
   */
  getVolunteers: async (filters: VolunteerFilters = {}): Promise<VolunteerListResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    const url = queryString
      ? `${USER_ENDPOINTS.volunteers}?${queryString}`
      : USER_ENDPOINTS.volunteers;

    return api.get<VolunteerListResponse>(url);
  },

  /**
   * Get current user's volunteer profile
   * GET /volunteers/me
   */
  getCurrentVolunteerProfile: async (): Promise<VolunteerResponse> => {
    return api.get<VolunteerResponse>(`${USER_ENDPOINTS.volunteers}/me`);
  },

  /**
   * Create volunteer profile
   * POST /volunteers
   */
  createVolunteerProfile: async (
    profileData: CreateVolunteerProfileRequest & { files?: File[] }
  ): Promise<VolunteerResponse> => {
    // Create FormData for file uploads
    const formData = new FormData();

    // Add all text fields to FormData
    Object.entries(profileData).forEach(([key, value]) => {
      if (key !== 'files' && value !== undefined && value !== null) {
        if (key === 'availability' && typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'volunteer_roles' && Array.isArray(value)) {
          // Don't JSON stringify volunteer_roles - send as comma-separated string
          formData.append(key, value.join(','));
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Add files if provided
    if (profileData.files && profileData.files.length > 0) {
      profileData.files.forEach((file, index) => {
        formData.append('volunteer_documents', file);
      });
    }

    // Debug logging
    console.log('Creating volunteer profile with FormData:');
    console.log('Profile data:', profileData);
    console.log('Files count:', profileData.files?.length || 0);
    
    // Log FormData contents (for debugging)
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`FormData entry: ${key} = File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`FormData entry: ${key} = ${value}`);
      }
    }

    // Log the request details
    console.log('Sending request to:', USER_ENDPOINTS.volunteers);
    console.log('FormData has entries:', Array.from(formData.entries()).length);
    console.log('FormData size estimate:', Array.from(formData.entries()).reduce((size, [key, value]) => {
      if (value instanceof File) {
        return size + value.size;
      }
      return size + String(value).length;
    }, 0), 'bytes');

    // Test FormData creation
    console.log('=== FormData Test ===');
    const testFormData = new FormData();
    testFormData.append('test_field', 'test_value');
    if (profileData.files && profileData.files.length > 0) {
      testFormData.append('test_file', profileData.files[0]);
    }
    console.log('Test FormData entries:');
    for (let [key, value] of testFormData.entries()) {
      if (value instanceof File) {
        console.log(`  Test: ${key} = File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  Test: ${key} = ${value}`);
      }
    }

    return api.post<VolunteerResponse>(USER_ENDPOINTS.volunteers, formData);
  },

  /**
   * Get volunteer by ID (admin or own profile)
   * GET /volunteers/:id
   */
  getVolunteerById: async (userId: string): Promise<VolunteerResponse> => {
    return api.get<VolunteerResponse>(`${USER_ENDPOINTS.volunteers}/${userId}`);
  },

  /**
   * Update current user's volunteer profile
   * PUT /volunteers/me
   */
  updateCurrentVolunteerProfile: async (
    profileData: UpdateVolunteerProfileRequest & { files?: File[] }
  ): Promise<VolunteerResponse> => {
    // Check if files are provided
    if (profileData.files && profileData.files.length > 0) {
      // Use FormData for file uploads
      const formData = new FormData();

      // Add all text fields to FormData
      Object.entries(profileData).forEach(([key, value]) => {
        if (key !== 'files' && value !== undefined && value !== null) {
          if (key === 'availability' && typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else if (key === 'volunteer_roles' && Array.isArray(value)) {
            // Don't JSON stringify volunteer_roles - send as comma-separated string
            formData.append(key, value.join(','));
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Add files if provided
      if (profileData.files && profileData.files.length > 0) {
        profileData.files.forEach((file, index) => {
          formData.append('volunteer_documents', file);
        });
      }

      return api.put<VolunteerResponse>(`${USER_ENDPOINTS.volunteers}/me`, formData);
    } else {
      // Use JSON for text-only updates
      const requestData = {
        ...profileData,
        availability: profileData.availability ? JSON.stringify(profileData.availability) : undefined,
        // Handle volunteer_roles consistently
        volunteer_roles: (profileData as any).volunteer_roles && Array.isArray((profileData as any).volunteer_roles) 
          ? (profileData as any).volunteer_roles.join(',') 
          : (profileData as any).volunteer_roles,
      };

      return api.put<VolunteerResponse>(`${USER_ENDPOINTS.volunteers}/me`, requestData);
    }
  },

  /**
   * Update volunteer profile by ID (admin or own profile)
   * PUT /volunteers/:id
   */
  updateVolunteerProfile: async (
    userId: string,
    profileData: UpdateVolunteerProfileRequest & { files?: File[] }
  ): Promise<VolunteerResponse> => {
    // Check if files are provided
    if (profileData.files && profileData.files.length > 0) {
      // Use FormData for file uploads
      const formData = new FormData();

      // Add all text fields to FormData
      Object.entries(profileData).forEach(([key, value]) => {
        if (key !== 'files' && value !== undefined && value !== null) {
          if (key === 'availability' && typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else if (key === 'volunteer_roles' && Array.isArray(value)) {
            // Don't JSON stringify volunteer_roles - send as comma-separated string
            formData.append(key, value.join(','));
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Add files if provided
      if (profileData.files && profileData.files.length > 0) {
        profileData.files.forEach((file, index) => {
          formData.append('volunteer_documents', file);
        });
      }

      return api.put<VolunteerResponse>(`${USER_ENDPOINTS.volunteers}/${userId}`, formData);
    } else {
      // Use JSON for text-only updates
      const requestData = {
        ...profileData,
        availability: profileData.availability ? JSON.stringify(profileData.availability) : undefined,
        // Handle volunteer_roles consistently
        volunteer_roles: (profileData as any).volunteer_roles && Array.isArray((profileData as any).volunteer_roles) 
          ? (profileData as any).volunteer_roles.join(',') 
          : (profileData as any).volunteer_roles,
      };

      return api.put<VolunteerResponse>(`${USER_ENDPOINTS.volunteers}/${userId}`, requestData);
    }
  },

  /**
   * Search volunteers (admin only)
   * GET /volunteers/search
   */
  searchVolunteers: async (
    searchQuery: string,
    filters: Omit<VolunteerFilters, 'search'> = {}
  ): Promise<VolunteerListResponse> => {
    const params = new URLSearchParams({ q: searchQuery });

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return api.get<VolunteerListResponse>(`${USER_ENDPOINTS.volunteerSearch}?${params.toString()}`);
  },

  /**
   * Get volunteer statistics (admin only)
   * GET /volunteers/stats
   */
  getVolunteerStats: async (): Promise<VolunteerStatsResponse> => {
    return api.get<VolunteerStatsResponse>(USER_ENDPOINTS.volunteerStats);
  },

  /**
   * Update background check status (admin only)
   * PUT /volunteers/:id/background-check
   */
  updateBackgroundCheck: async (
    userId: string,
    statusData: UpdateBackgroundCheckRequest
  ): Promise<VolunteerResponse> => {
    return api.put<VolunteerResponse>(
      `${USER_ENDPOINTS.volunteers}/${userId}/background-check`,
      statusData
    );
  },

  /**
   * Add volunteer hours (admin only)
   * POST /volunteers/:id/hours
   */
  addVolunteerHours: async (
    userId: string,
    hoursData: AddVolunteerHoursRequest
  ): Promise<VolunteerResponse> => {
    return api.post<VolunteerResponse>(`${USER_ENDPOINTS.volunteers}/${userId}/hours`, hoursData);
  },

  /**
   * Delete current user's volunteer profile
   * DELETE /volunteers/me
   */
  deleteCurrentVolunteerProfile: async (): Promise<{ success: boolean; message: string }> => {
    return api.delete<{ success: boolean; message: string }>(`${USER_ENDPOINTS.volunteers}/me`);
  },

  /**
   * Delete volunteer profile by ID (admin or own profile)
   * DELETE /volunteers/:id
   */
  deleteVolunteerProfile: async (
    userId: string
  ): Promise<{ success: boolean; message: string }> => {
    return api.delete<{ success: boolean; message: string }>(
      `${USER_ENDPOINTS.volunteers}/${userId}`
    );
  },

  // ==================== SKILLS OPERATIONS ====================

  /**
   * Get all skills
   * GET /skills
   */
  getSkills: async (filters: SkillFilters = {}): Promise<SkillListResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    const url = queryString ? `${USER_ENDPOINTS.skills}?${queryString}` : USER_ENDPOINTS.skills;

    return api.get<SkillListResponse>(url);
  },

  /**
   * Get skill categories
   * GET /skills/categories
   */
  getSkillCategories: async (): Promise<SkillCategoriesResponse> => {
    return api.get<SkillCategoriesResponse>(USER_ENDPOINTS.skillCategories);
  },

  /**
   * Get skills statistics (admin only)
   * GET /skills/stats
   */
  getSkillStats: async (): Promise<SkillStatsResponse> => {
    return api.get<SkillStatsResponse>(USER_ENDPOINTS.skillStats);
  },

  /**
   * Get volunteer skills
   * GET /skills/volunteers/:volunteerId
   */
  getVolunteerSkills: async (volunteerId: string): Promise<VolunteerSkillListResponse> => {
    return api.get<VolunteerSkillListResponse>(
      `${USER_ENDPOINTS.skills}/volunteers/${volunteerId}`
    );
  },

  /**
   * Add skill to volunteer (admin only)
   * POST /skills/volunteers/:volunteerId
   */
  addSkillToVolunteer: async (
    volunteerId: string,
    skillData: AddSkillToVolunteerRequest
  ): Promise<any> => {
    return api.post<any>(`${USER_ENDPOINTS.skills}/volunteers/${volunteerId}`, skillData);
  },

  /**
   * Update volunteer skill (admin only)
   * PUT /skills/volunteers/:volunteerId/:skillId
   */
  updateVolunteerSkill: async (
    volunteerId: string,
    skillId: string,
    skillData: UpdateVolunteerSkillRequest
  ): Promise<any> => {
    return api.put<any>(`${USER_ENDPOINTS.skills}/volunteers/${volunteerId}/${skillId}`, skillData);
  },

  /**
   * Remove skill from volunteer (admin only)
   * DELETE /skills/volunteers/:volunteerId/:skillId
   */
  removeSkillFromVolunteer: async (
    volunteerId: string,
    skillId: string
  ): Promise<{ success: boolean; message: string }> => {
    return api.delete<{ success: boolean; message: string }>(
      `${USER_ENDPOINTS.skills}/volunteers/${volunteerId}/${skillId}`
    );
  },

  /**
   * Verify volunteer skill (admin only)
   * PUT /skills/volunteers/:volunteerId/:skillId/verify
   */
  verifyVolunteerSkill: async (
    volunteerId: string,
    skillId: string,
    verificationData: VerifyVolunteerSkillRequest
  ): Promise<any> => {
    return api.put<any>(
      `${USER_ENDPOINTS.skills}/volunteers/${volunteerId}/${skillId}/verify`,
      verificationData
    );
  },

  /**
   * Get skill by ID
   * GET /skills/:id
   */
  getSkillById: async (skillId: string): Promise<SkillResponse> => {
    return api.get<SkillResponse>(`${USER_ENDPOINTS.skills}/${skillId}`);
  },

  /**
   * Create skill (admin only)
   * POST /skills
   */
  createSkill: async (skillData: CreateSkillRequest): Promise<SkillResponse> => {
    return api.post<SkillResponse>(USER_ENDPOINTS.skills, skillData);
  },

  /**
   * Update skill (admin only)
   * PUT /skills/:id
   */
  updateSkill: async (skillId: string, skillData: UpdateSkillRequest): Promise<SkillResponse> => {
    return api.put<SkillResponse>(`${USER_ENDPOINTS.skills}/${skillId}`, skillData);
  },

  /**
   * Delete skill (admin only)
   * DELETE /skills/:id
   */
  deleteSkill: async (skillId: string): Promise<{ success: boolean; message: string }> => {
    return api.delete<{ success: boolean; message: string }>(`${USER_ENDPOINTS.skills}/${skillId}`);
  },

  // ==================== BULK OPERATIONS ====================

  /**
   * Bulk delete users (admin only)
   * DELETE /users/bulk
   */
  bulkDeleteUsers: async (
    userIds: string[]
  ): Promise<{ success: boolean; message: string; deletedCount: number }> => {
    return api.delete<{ success: boolean; message: string; deletedCount: number }>(
      `${USER_ENDPOINTS.users}/bulk`,
      {
        data: { userIds },
      }
    );
  },

  /**
   * Bulk update user roles (admin only)
   * PUT /users/bulk/role
   */
  bulkUpdateUserRoles: async (
    userIds: string[],
    role: string
  ): Promise<{ success: boolean; message: string; updatedCount: number }> => {
    return api.put<{ success: boolean; message: string; updatedCount: number }>(
      `${USER_ENDPOINTS.users}/bulk/role`,
      {
        userIds,
        role,
      }
    );
  },

  /**
   * Export users data (admin only)
   * GET /users/export
   */
  exportUsers: async (
    filters: UserFilters = {},
    format: 'csv' | 'xlsx' | 'json' = 'csv'
  ): Promise<Blob> => {
    const params = new URLSearchParams({ format });

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await fetch(`${USER_ENDPOINTS.users}/export?${params.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  },
};
