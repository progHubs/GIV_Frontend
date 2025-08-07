/**
 * Campaign Partner Types and Interfaces
 * Type definitions for campaign-specific partner data structures
 */

import type { BaseEntity } from './api';

// Campaign Partner Entity
export interface CampaignPartner extends BaseEntity {
  campaign_id: string;
  name: string;
  logo_url?: string | null;
  website?: string | null;
  description?: string | null;
  sort_order: number;
  is_active: boolean;
}

// Campaign Partner Creation/Update Data
export interface CampaignPartnerFormData {
  name: string;
  website?: string;
  description?: string;
  is_active?: boolean;
  logo?: File; // For file upload
}

// Campaign Partner Update Data (all fields optional except validation)
export interface CampaignPartnerUpdateData {
  name?: string;
  website?: string;
  description?: string;
  is_active?: boolean;
  logo?: File; // For file upload
}

// Campaign Partner Filters
export interface CampaignPartnerFilters {
  is_active?: boolean;
}

// Campaign Partner API Response Types
export interface CampaignPartnerResponse {
  success: boolean;
  data: CampaignPartner;
  message?: string;
}

export interface CampaignPartnersResponse {
  success: boolean;
  data: CampaignPartner[];
}

// Campaign Partner Form Validation
export interface CampaignPartnerFormErrors {
  name?: string;
  website?: string;
  description?: string;
  sort_order?: string;
  logo?: string;
  general?: string;
}

// Campaign Partner Table Props
export interface CampaignPartnerTableProps {
  campaignId: string;
  partners: CampaignPartner[];
  loading: boolean;
  error: string | null;
  onEdit: (partner: CampaignPartner) => void;
  onDelete: (partnerId: string) => Promise<void>;
  onRetry: () => void;
}

// Campaign Partner Form Props
export interface CampaignPartnerFormProps {
  mode: 'create' | 'edit';
  campaignId: string;
  partner?: CampaignPartner;
  onSubmit: (data: CampaignPartnerFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

// Campaign Partner Card Props
export interface CampaignPartnerCardProps {
  partner: CampaignPartner;
  showActions?: boolean;
  onEdit?: (partner: CampaignPartner) => void;
  onDelete?: (partnerId: string) => void;
  className?: string;
}

// Campaign Partner Display Options
export interface CampaignPartnerDisplayOptions {
  showDescription?: boolean;
  showWebsite?: boolean;
  showLogo?: boolean;
  maxDescriptionLength?: number;
  layout?: 'grid' | 'list' | 'carousel';
}

// Campaign Partner Sort Options
export type CampaignPartnerSortField = 'name' | 'sort_order' | 'created_at';
export type CampaignPartnerSortOrder = 'asc' | 'desc';

export interface CampaignPartnerSortOptions {
  field: CampaignPartnerSortField;
  order: CampaignPartnerSortOrder;
}

// Campaign Partner Statistics
export interface CampaignPartnerStats {
  total: number;
  active: number;
  inactive: number;
  withLogos: number;
  withWebsites: number;
}

// File Upload Types for Campaign Partners
export interface CampaignPartnerFileUpload {
  logo?: File;
}

export interface CampaignPartnerUploadResponse {
  success: boolean;
  logo_url?: string;
  error?: string;
}

// Campaign Partner Bulk Operations
export interface CampaignPartnerBulkAction {
  action: 'activate' | 'deactivate' | 'delete';
  partnerIds: string[];
}

export interface CampaignPartnerBulkResponse {
  success: boolean;
  processed: number;
  failed: number;
  errors?: string[];
}

// Export all types for easy importing
export type {
  BaseEntity,
};

// Default values and constants
export const DEFAULT_CAMPAIGN_PARTNER: Partial<CampaignPartnerFormData> = {
  name: '',
  website: '',
  description: '',
  sort_order: 0,
  is_active: true,
};

export const CAMPAIGN_PARTNER_VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  website: {
    required: false,
    maxLength: 512,
    pattern: /^https?:\/\/.+/,
  },
  description: {
    required: false,
    maxLength: 1000,
  },
  sort_order: {
    required: false,
    min: 0,
    max: 999,
  },
  logo: {
    required: false,
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  },
} as const;

// Campaign Partner Display Constants
export const CAMPAIGN_PARTNER_DISPLAY_LIMITS = {
  maxDescriptionLength: 150,
  maxNameLength: 50,
  maxPartnersPerRow: 5,
  maxPartnersInCarousel: 10,
} as const;
