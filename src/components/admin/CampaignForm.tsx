/**
 * Campaign Form Component
 * Form for creating and editing campaigns
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import type { Campaign, CampaignFormData, CampaignCategory } from '../../types';

interface CampaignFormProps {
  mode: 'create' | 'edit';
  campaign?: Campaign;
  onSubmit: (data: CampaignFormData) => Promise<void>;
  onCancel: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ mode, campaign, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to safely format date for input
  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      // Handle different date formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CampaignFormData>({
    defaultValues: campaign
      ? {
          title: campaign.title,
          description: campaign.description,
          goal_amount: parseFloat(campaign.goal_amount),
          start_date: formatDateForInput(campaign.start_date),
          end_date: formatDateForInput(campaign.end_date),
          category: campaign.category,
          progress_bar_color: campaign.progress_bar_color || '#3B82F6',
          image_url: campaign.image_url || '',
          video_url: campaign.video_url || '',
          language: campaign.language || 'en',
          is_active: campaign.is_active,
          is_featured: campaign.is_featured,
        }
      : {
          language: 'en',
          is_active: true,
          is_featured: false,
          progress_bar_color: '#3B82F6',
        },
  });

  const categories: { value: CampaignCategory; label: string }[] = [
    { value: 'health', label: 'Health' },
    { value: 'education', label: 'Education' },
    { value: 'environment', label: 'Environment' },
    { value: 'community', label: 'Community' },
  ];

  const colorOptions = [
    { value: '#3B82F6', label: 'Blue', color: 'bg-blue-500' },
    { value: '#10B981', label: 'Green', color: 'bg-green-500' },
    { value: '#F59E0B', label: 'Yellow', color: 'bg-yellow-500' },
    { value: '#EF4444', label: 'Red', color: 'bg-red-500' },
    { value: '#8B5CF6', label: 'Purple', color: 'bg-purple-500' },
    { value: '#F97316', label: 'Orange', color: 'bg-orange-500' },
  ];

  const onFormSubmit = async (data: CampaignFormData) => {
    try {
      setLoading(true);
      setError(null);
      await onSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Failed to save campaign');
    } finally {
      setLoading(false);
    }
  };

  const selectedColor = watch('progress_bar_color');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-theme-surface rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-theme">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-theme-primary">
              {mode === 'create' ? 'Create Campaign' : 'Edit Campaign'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="text-theme-muted hover:text-theme-primary"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-theme-primary mb-2">
                Campaign Title *
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter campaign title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-theme-primary mb-2">
                Description *
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the campaign goals and impact"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Goal Amount */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">
                Goal Amount (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                {...register('goal_amount', {
                  required: 'Goal amount is required',
                  min: { value: 1, message: 'Goal amount must be at least $1' },
                })}
                className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="50000"
              />
              {errors.goal_amount && (
                <p className="mt-1 text-sm text-red-600">{errors.goal_amount.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">
                Category *
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">
                Start Date *
              </label>
              <input
                type="date"
                {...register('start_date', { required: 'Start date is required' })}
                className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">
                End Date *
              </label>
              <input
                type="date"
                {...register('end_date', { required: 'End date is required' })}
                className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>
              )}
            </div>

            {/* Progress Bar Color */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-theme-primary mb-2">
                Progress Bar Color
              </label>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map(color => (
                  <label key={color.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value={color.value}
                      {...register('progress_bar_color')}
                      className="sr-only"
                    />
                    <div
                      className={`w-8 h-8 rounded-full ${color.color} border-2 ${
                        selectedColor === color.value
                          ? 'border-gray-800 dark:border-white'
                          : 'border-gray-300'
                      }`}
                    />
                    <span className="ml-2 text-sm text-theme-primary">{color.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">Image URL</label>
              <input
                type="url"
                {...register('image_url')}
                className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">Video URL</label>
              <input
                type="url"
                {...register('video_url')}
                className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/video.mp4"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">Language</label>
              <select
                {...register('language')}
                className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="am">Amharic</option>
              </select>
            </div>

            {/* Status Checkboxes */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">Status</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('is_active')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-theme-primary">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('is_featured')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-theme-primary">Featured</span>
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-theme">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="px-6 py-2 border border-theme rounded-lg text-theme-primary hover:bg-theme-background transition-colors duration-200"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </div>
              ) : mode === 'create' ? (
                'Create Campaign'
              ) : (
                'Update Campaign'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CampaignForm;
