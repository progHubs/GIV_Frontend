/**
 * Campaign Partner Form Component
 * Form for creating and editing campaign partners
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import type { CampaignPartner, CampaignPartnerFormData } from '../../types/campaignPartner';
import { CAMPAIGN_PARTNER_VALIDATION_RULES } from '../../types/campaignPartner';
import { FileUpload } from '../ui/FileUpload';
import { validateFile } from '../../lib/uploadApi';

interface CampaignPartnerFormProps {
  mode: 'create' | 'edit';
  campaignId: string;
  partner?: CampaignPartner;
  onSubmit: (data: CampaignPartnerFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const CampaignPartnerForm: React.FC<CampaignPartnerFormProps> = ({
  mode,
  campaignId,
  partner,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CampaignPartnerFormData>({
    defaultValues: partner
      ? {
          name: partner.name,
          website: partner.website || '',
          description: partner.description || '',
          is_active: partner.is_active,
        }
      : {
          name: '',
          website: '',
          description: '',
          is_active: true,
        },
  });

  const onFormSubmit = async (data: CampaignPartnerFormData) => {
    try {
      setError(null);

      // Include logo file if selected
      const formDataWithLogo = {
        ...data,
        logo: selectedLogo || undefined,
      };

      await onSubmit(formDataWithLogo);
    } catch (err: any) {
      setError(err.message || 'Failed to save campaign partner');
    }
  };

  const handleLogoSelect = (file: File) => {
    // Use the image validation from uploadApi
    const validationError = validateFile.image(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    // Additional size check for campaign partner logos (2MB limit)
    if (file.size > CAMPAIGN_PARTNER_VALIDATION_RULES.logo.maxSize) {
      setError('Logo file size must be less than 2MB');
      return;
    }

    setSelectedLogo(file);
    setError(null);
  };

  const handleLogoRemove = () => {
    setSelectedLogo(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-theme-surface rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-theme">
          <h2 className="text-2xl font-bold text-theme-primary">
            {mode === 'create' ? 'Add Campaign Partner' : 'Edit Campaign Partner'}
          </h2>
          <button
            onClick={onCancel}
            className="text-theme-muted hover:text-theme-primary transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Partner Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-theme-primary mb-2">
                Partner Name *
              </label>
              <input
                type="text"
                {...register('name', {
                  required: 'Partner name is required',
                  minLength: {
                    value: CAMPAIGN_PARTNER_VALIDATION_RULES.name.minLength,
                    message: `Name must be at least ${CAMPAIGN_PARTNER_VALIDATION_RULES.name.minLength} characters`,
                  },
                  maxLength: {
                    value: CAMPAIGN_PARTNER_VALIDATION_RULES.name.maxLength,
                    message: `Name cannot exceed ${CAMPAIGN_PARTNER_VALIDATION_RULES.name.maxLength} characters`,
                  },
                })}
                className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="World Health Organization"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">
                Website
              </label>
              <input
                type="url"
                {...register('website', {
                  pattern: {
                    value: CAMPAIGN_PARTNER_VALIDATION_RULES.website.pattern,
                    message: 'Please enter a valid URL (starting with http:// or https://)',
                  },
                  maxLength: {
                    value: CAMPAIGN_PARTNER_VALIDATION_RULES.website.maxLength,
                    message: `Website URL cannot exceed ${CAMPAIGN_PARTNER_VALIDATION_RULES.website.maxLength} characters`,
                  },
                })}
                className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.who.int"
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
              )}
            </div>



            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-theme-primary mb-2">
                Description
              </label>
              <textarea
                rows={3}
                {...register('description', {
                  maxLength: {
                    value: CAMPAIGN_PARTNER_VALIDATION_RULES.description.maxLength,
                    message: `Description cannot exceed ${CAMPAIGN_PARTNER_VALIDATION_RULES.description.maxLength} characters`,
                  },
                })}
                className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Brief description of the partner organization..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Logo Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-theme-primary mb-2">
                Partner Logo
              </label>
              <FileUpload
                onFileSelect={handleLogoSelect}
                onFileRemove={handleLogoRemove}
                selectedFile={selectedLogo}
                existingFileUrl={partner?.logo_url}
                accept="image/*"
                maxSize={CAMPAIGN_PARTNER_VALIDATION_RULES.logo.maxSize}
                className="w-full"
              />
              <p className="mt-1 text-xs text-theme-muted">
                Recommended: PNG or JPG, max 2MB. Optimal size: 200x100px
              </p>
            </div>

            {/* Active Status */}
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('is_active')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-theme-primary">
                  Active (visible to users)
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-theme">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-theme rounded-lg text-theme-muted hover:text-theme-primary hover:border-theme-primary transition-colors duration-200"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </div>
              ) : (
                mode === 'create' ? 'Add Partner' : 'Update Partner'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CampaignPartnerForm;
