// User Management Types and Interfaces
// Based on the backend API documentation

import type { BaseEntity, ApiResponse, PaginationInfo, PaginationParams } from './api';

// ==================== CORE USER TYPES ====================

export type UserRole = 'admin' | 'user';
export type LanguagePreference = 'en' | 'am';

// Enhanced User interface based on backend schema
export interface User extends BaseEntity {
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profile_image_url?: string;
  language_preference: LanguagePreference;
  email_verified: boolean;
  is_donor: boolean;
  is_volunteer: boolean;
  deleted_at?: string;

  // Related profiles (optional, included based on query parameters)
  donor_profiles?: DonorProfile;
  volunteer_profiles?: VolunteerProfile;
}

// ==================== DONOR PROFILE TYPES ====================

export type DonationFrequency = 'monthly' | 'quarterly' | 'yearly';
export type DonationTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface DonorProfile {
  user_id: string;
  is_recurring_donor: boolean;
  preferred_payment_method?: string;
  total_donated: string; // Decimal as string
  donation_count?: number; // Number of donations made
  donation_frequency?: DonationFrequency;
  tax_receipt_email?: string;
  is_anonymous: boolean;
  last_donation_date?: string; // ISO 8601
  donation_tier: DonationTier;
  created_at: string;
  updated_at: string;
  users: User;
}

// ==================== VOLUNTEER PROFILE TYPES ====================

export type BackgroundCheckStatus = 'pending' | 'approved' | 'rejected';

export interface VolunteerProfile {
  user_id: string;
  area_of_expertise?: string;
  location?: string;
  availability?: string; // JSON string
  motivation?: string;
  total_hours: number;
  certificate_url?: string;
  registered_events_count: number;
  training_completed: boolean;
  background_check_status: BackgroundCheckStatus;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  rating: string; // Decimal as string
  created_at: string;
  updated_at: string;
  users: User;
  volunteer_skills?: VolunteerSkill[];
}

// Availability JSON schema
export interface AvailabilitySchema {
  weekdays?: string[];
  weekends?: string[];
  hours?: string;
  timezone?: string;
  notes?: string;
  flexible?: boolean;
}

// ==================== SKILLS TYPES ====================

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'expert';

export interface Skill extends BaseEntity {
  name: string;
  category?: string;
  description?: string;
  volunteer_skills?: VolunteerSkill[];
}

export interface VolunteerSkill {
  volunteer_id: string;
  skill_id: string;
  proficiency_level: ProficiencyLevel;
  is_verified: boolean;
  created_at: string;
  volunteer_profiles: VolunteerProfile;
  skills: Skill;
}

// ==================== API REQUEST/RESPONSE TYPES ====================

// User filters for API requests
export interface UserFilters extends PaginationParams {
  search?: string;
  role?: UserRole;
  email_verified?: boolean;
  language_preference?: LanguagePreference;
  is_donor?: boolean;
  is_volunteer?: boolean;
  has_profile_image?: boolean;
  phone?: string;
  created_after?: string;
  created_before?: string;
  updated_after?: string;
  updated_before?: string;
}

// User API responses
export interface UserListResponse extends ApiResponse<User[]> {
  pagination: PaginationInfo;
}

export interface UserResponse extends ApiResponse<User> {}

export interface UserStatsResponse extends ApiResponse<UserStatistics> {}

// User creation/update requests
export interface CreateUserRequest {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
  language_preference?: LanguagePreference;
  profile_image_url?: string;
}

export interface UpdateUserRequest {
  full_name?: string;
  phone?: string;
  role?: UserRole;
  language_preference?: LanguagePreference;
  profile_image_url?: string;
}

// ==================== DONOR PROFILE API TYPES ====================

export interface DonorFilters extends PaginationParams {
  search?: string;
  donation_tier?: DonationTier;
  is_recurring_donor?: boolean;
  donation_frequency?: DonationFrequency;
  created_after?: string;
  created_before?: string;
}

export interface CreateDonorProfileRequest {
  is_recurring_donor?: boolean;
  preferred_payment_method?: string;
  donation_frequency?: DonationFrequency;
  tax_receipt_email?: string;
  is_anonymous?: boolean;
}

export interface UpdateDonorProfileRequest extends Partial<CreateDonorProfileRequest> {}

export interface DonorListResponse extends ApiResponse<DonorProfile[]> {
  pagination: PaginationInfo;
}

export interface DonorResponse extends ApiResponse<DonorProfile> {}

export interface DonorStatsResponse extends ApiResponse<DonorStatistics> {}

// ==================== VOLUNTEER PROFILE API TYPES ====================

export interface VolunteerFilters extends PaginationParams {
  search?: string;
  location?: string;
  area_of_expertise?: string;
  background_check_status?: BackgroundCheckStatus;
  training_completed?: boolean;
  availability?: string;
  created_after?: string;
  created_before?: string;
}

export interface CreateVolunteerProfileRequest {
  area_of_expertise?: string;
  location?: string;
  availability?: AvailabilitySchema;
  motivation?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface UpdateVolunteerProfileRequest extends Partial<CreateVolunteerProfileRequest> {}

export interface UpdateBackgroundCheckRequest {
  status: BackgroundCheckStatus;
}

export interface AddVolunteerHoursRequest {
  hours: number;
}

export interface VolunteerListResponse extends ApiResponse<VolunteerProfile[]> {
  pagination: PaginationInfo;
}

export interface VolunteerResponse extends ApiResponse<VolunteerProfile> {}

export interface VolunteerStatsResponse extends ApiResponse<VolunteerStatistics> {}

// ==================== SKILLS API TYPES ====================

export interface SkillFilters extends PaginationParams {
  category?: string;
}

export interface CreateSkillRequest {
  name: string;
  category?: string;
  description?: string;
}

export interface UpdateSkillRequest extends Partial<CreateSkillRequest> {}

export interface AddSkillToVolunteerRequest {
  skill_id: string;
  proficiency_level: ProficiencyLevel;
}

export interface UpdateVolunteerSkillRequest {
  proficiency_level: ProficiencyLevel;
}

export interface VerifyVolunteerSkillRequest {
  is_verified: boolean;
}

export interface SkillListResponse extends ApiResponse<Skill[]> {
  pagination: PaginationInfo;
}

export interface SkillResponse extends ApiResponse<Skill> {}

export interface VolunteerSkillListResponse extends ApiResponse<VolunteerSkill[]> {}

export interface SkillCategoriesResponse
  extends ApiResponse<Array<{ category: string; count: number }>> {}

export interface SkillStatsResponse extends ApiResponse<SkillStatistics> {}

// ==================== STATISTICS TYPES ====================

export interface UserStatistics {
  totalUsers: number;
  totalAdmins: number;
  totalRegularUsers: number;
  emailVerifiedUsers: number;
  emailUnverifiedUsers: number;
  usersWithDonorProfiles: number;
  usersWithVolunteerProfiles: number;
  usersWithBothProfiles: number;
  usersByLanguage: {
    en: number;
    am: number;
  };
  recentRegistrations: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  userGrowth: Array<{
    month: string;
    count: number;
  }>;
}

export interface DonorStatistics {
  totalDonors: number;
  recurringDonors: number;
  oneTimeDonors: number;
  totalDonated: string;
  averageDonation: string;
  donorsByTier: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
  };
  donorsByFrequency: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  recentDonors: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  donorGrowth: Array<{
    month: string;
    count: number;
    amount: string;
  }>;
}

export interface VolunteerStatistics {
  totalVolunteers: number;
  activeVolunteers: number;
  totalHours: number;
  averageHours: number;
  backgroundCheckStatus: {
    pending: number;
    approved: number;
    rejected: number;
  };
  trainingCompleted: number;
  trainingPending: number;
  volunteersByLocation: Record<string, number>;
  volunteersByExpertise: Record<string, number>;
  recentVolunteers: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  volunteerGrowth: Array<{
    month: string;
    count: number;
    hours: number;
  }>;
}

export interface SkillStatistics {
  totalSkills: number;
  totalCategories: number;
  skillsByCategory: Record<string, number>;
  mostPopularSkills: Array<{
    id: string;
    name: string;
    category: string;
    volunteerCount: number;
  }>;
  skillsWithoutVolunteers: number;
  averageSkillsPerVolunteer: number;
}

// ==================== FORM VALIDATION TYPES ====================

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface FormErrors {
  [key: string]: string;
}

// ==================== UI STATE TYPES ====================

export interface UserManagementState {
  selectedUsers: string[];
  filters: UserFilters;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  searchQuery: string;
  showFilters: boolean;
  selectedUser?: User;
  isCreating: boolean;
  isEditing: boolean;
}

// ==================== ACTION TYPES ====================

export interface BulkUserAction {
  action: 'delete' | 'activate' | 'deactivate' | 'verify_email' | 'change_role';
  userIds: string[];
  data?: any;
}

// ==================== EXPORT TYPES ====================

export interface UserExportOptions {
  format: 'csv' | 'xlsx' | 'json';
  fields: string[];
  filters?: UserFilters;
  includeProfiles?: boolean;
}
