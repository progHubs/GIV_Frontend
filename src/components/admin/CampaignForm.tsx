/**
 * Campaign Form Component
 * Form for creating and editing campaigns
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import type { Campaign, CampaignFormData, CampaignCategory } from '../../types';
import { DEFAULT_VOLUNTEER_ROLES } from '../../types/campaign';
import { FileUpload } from '../ui/FileUpload';
import { validateFile } from '../../lib/uploadApi';

interface CampaignFormProps {
  mode: 'create' | 'edit';
  campaign?: Campaign;
  onSubmit: (data: CampaignFormData, files?: { image?: File; video?: File }) => Promise<void>;
  onCancel: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ mode, campaign, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(campaign?.image_url || null);
  const [videoPreview, setVideoPreview] = useState<string | null>(campaign?.video_url || null);
  const [fileErrors, setFileErrors] = useState<{ image?: string; video?: string }>({});
  // Helper function to safely parse success stories
  // const parseSuccessStories = (stories: any): SuccessStory[] => {
  //   if (!stories) return [];
  //   if (Array.isArray(stories)) return stories;
  //   if (typeof stories === 'string') {
  //     try {
  //       const parsed = JSON.parse(stories);
  //       return Array.isArray(parsed) ? parsed : [];
  //     } catch {
  //       return [];
  //     }
  //   }
  //   return [];
  // };

  // const [successStories, setSuccessStories] = useState<SuccessStory[]>(
  //   parseSuccessStories(campaign?.success_stories)
  // );

  // Helper function to safely parse volunteer roles
  const parseVolunteerRoles = (roles: any): string[] => {
    if (!roles) return DEFAULT_VOLUNTEER_ROLES.slice();
    if (Array.isArray(roles)) return roles;
    if (typeof roles === 'string') {
      return roles
        .split(',')
        .map(role => role.trim())
        .filter(role => role.length > 0);
    }
    return DEFAULT_VOLUNTEER_ROLES.slice();
  };

  const [selectedVolunteerRoles, setSelectedVolunteerRoles] = useState<string[]>(
    parseVolunteerRoles(campaign?.volunteer_roles)
  );

  // Helper function to safely format date for input
  const formatDateForInput = (dateInput: any): string => {
    // Handle null, undefined, empty string, or empty object
    if (
      !dateInput ||
      dateInput === 'null' ||
      dateInput === 'undefined' ||
      dateInput === '' ||
      (typeof dateInput === 'object' && Object.keys(dateInput).length === 0)
    ) {
      return '';
    }

    try {
      // Handle different date formats and ensure valid date
      let date;

      // If it's already in YYYY-MM-DD format, use it directly
      if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        return dateInput;
      }

      // Only process strings and Date objects
      if (typeof dateInput === 'string' || dateInput instanceof Date) {
        // Try to parse the date
        date = new Date(dateInput);
      } else {
        console.warn('Unexpected date type for input:', typeof dateInput, dateInput);
        return '';
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date provided:', dateInput);
        return '';
      }

      // Return in YYYY-MM-DD format for date input
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error, 'Input:', dateInput);
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
          // success_stories: parseSuccessStories(campaign.success_stories),
        }
      : {
          language: 'en',
          is_active: true,
          is_featured: false,
          progress_bar_color: '#3B82F6',
          // success_stories: [],
        },
  });

  const categories: { value: CampaignCategory; label: string }[] = [
    { value: 'medical_outreach', label: 'Medical Outreach' },
    { value: 'education', label: 'Education' },
    { value: 'community_development', label: 'Community Development' },
    { value: 'emergency_relief', label: 'Emergency Relief' },
    { value: 'youth_development', label: 'Youth Development' },
    { value: 'mental_health', label: 'Mental Health' },
    { value: 'disease_prevention', label: 'Disease Prevention' },
    { value: 'environmental', label: 'Environmental' },
    { value: 'other', label: 'Other' },
  ];

  // Success Stories Management
  // const addSuccessStory = () => {
  //   setSuccessStories([
  //     ...successStories,
  //     {
  //       title: '',
  //       description: '',
  //       image_url: '',
  //       date: new Date().toISOString().split('T')[0],
  //     },
  //   ]);
  // };

  // const updateSuccessStory = (index: number, field: keyof SuccessStory, value: string) => {
  //   if (Array.isArray(successStories) && successStories[index]) {
  //     const updated = [...successStories];
  //     updated[index] = { ...updated[index], [field]: value };
  //     setSuccessStories(updated);
  //   }
  // };

  // const removeSuccessStory = (index: number) => {
  //   if (Array.isArray(successStories)) {
  //     setSuccessStories(successStories.filter((_, i) => i !== index));
  //   }
  // };

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

      // Include success stories and volunteer roles in the form data
      const formDataWithStories = {
        ...data,
        // success_stories: Array.isArray(successStories)
        //   ? successStories.filter(story => story.title.trim() && story.description.trim())
        //   : [],
        volunteer_roles: selectedVolunteerRoles.join(','),
      };

      // Prepare files for upload
      const files: { image?: File; video?: File } = {};
      if (selectedImage) files.image = selectedImage;
      if (selectedVideo) files.video = selectedVideo;

      await onSubmit(formDataWithStories, Object.keys(files).length > 0 ? files : undefined);
    } catch (err: any) {
      setError(err.message || 'Failed to save campaign');
    } finally {
      setLoading(false);
    }
  };

  const selectedColor = watch('progress_bar_color');

  // File handling functions
  const handleImageSelect = (files: File | File[]) => {
    const file = Array.isArray(files) ? files[0] : files;
    const error = validateFile.image(file);
    if (error) {
      setFileErrors(prev => ({ ...prev, image: error }));
      return;
    }

    setFileErrors(prev => ({ ...prev, image: undefined }));
    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = e => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleVideoSelect = (files: File | File[]) => {
    const file = Array.isArray(files) ? files[0] : files;
    const error = validateFile.video(file);
    if (error) {
      setFileErrors(prev => ({ ...prev, video: error }));
      return;
    }

    setFileErrors(prev => ({ ...prev, video: undefined }));
    setSelectedVideo(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = e => setVideoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(campaign?.image_url || null);
    setFileErrors(prev => ({ ...prev, image: undefined }));
  };

  const clearVideo = () => {
    setSelectedVideo(null);
    setVideoPreview(campaign?.video_url || null);
    setFileErrors(prev => ({ ...prev, video: undefined }));
  };

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

            {/* Campaign Image */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">
                Campaign Image
              </label>
              <div className="space-y-3">
                <FileUpload
                  accept="image/*"
                  onFileSelect={handleImageSelect}
                  maxSize={5}
                  showPreview={false}
                  placeholder="Click to upload campaign image"
                  error={fileErrors.image}
                />

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Campaign preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Fallback URL Input */}
                <div>
                  <label className="block text-xs text-theme-secondary mb-1">
                    Or enter image URL
                  </label>
                  <input
                    type="url"
                    {...register('image_url')}
                    className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Campaign Video */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">
                Campaign Video
              </label>
              <div className="space-y-3">
                <FileUpload
                  accept="video/*"
                  onFileSelect={handleVideoSelect}
                  maxSize={50}
                  showPreview={false}
                  placeholder="Click to upload campaign video"
                  error={fileErrors.video}
                />

                {/* Video Preview */}
                {videoPreview && (
                  <div className="relative">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={clearVideo}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Fallback URL Input */}
                <div>
                  <label className="block text-xs text-theme-secondary mb-1">
                    Or enter video URL
                  </label>
                  <input
                    type="url"
                    {...register('video_url')}
                    className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
              </div>
            </div>

            {/* Volunteer Roles */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-theme-primary mb-2">
                Required Volunteer Roles
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-theme rounded-lg p-3 bg-theme-background">
                {DEFAULT_VOLUNTEER_ROLES.map(role => (
                  <label key={role} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedVolunteerRoles.includes(role)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedVolunteerRoles([...selectedVolunteerRoles, role]);
                        } else {
                          setSelectedVolunteerRoles(selectedVolunteerRoles.filter(r => r !== role));
                        }
                      }}
                      className="rounded border-theme text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-theme-primary">{role}</span>
                  </label>
                ))}
              </div>
              <div className="mt-2 text-sm text-theme-muted">
                Selected: {selectedVolunteerRoles.length} role(s)
              </div>
            </div>

            {/* Success Stories */}
            {/* <div className="col-span-2">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-theme-primary">
                  Success Stories
                </label>
                <button
                  type="button"
                  onClick={addSuccessStory}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Add Story
                </button>
              </div>

              {!Array.isArray(successStories) || successStories.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-theme rounded-lg">
                  <div className="text-4xl mb-2">🌟</div>
                  <p className="text-theme-muted">No success stories yet</p>
                  <p className="text-sm text-theme-muted">
                    Click "Add Story" to create your first success story
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.isArray(successStories) &&
                    successStories.map((story, index) => (
                      <div
                        key={index}
                        className="border border-theme rounded-lg p-4 bg-theme-background"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-theme-primary">
                            Success Story {index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeSuccessStory(index)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-theme-primary mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={story.title}
                              onChange={e => updateSuccessStory(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-surface text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Success story title"
                            />
                          </div> */}

            {/* <div>
                            <label className="block text-sm font-medium text-theme-primary mb-1">
                              Date
                            </label>
                            <input
                              type="date"
                              value={story.date}
                              onChange={e => updateSuccessStory(index, 'date', e.target.value)}
                              className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-surface text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-theme-primary mb-1">
                              Description
                            </label>
                            <textarea
                              value={story.description}
                              onChange={e =>
                                updateSuccessStory(index, 'description', e.target.value)
                              }
                              rows={3}
                              className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-surface text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Describe the success story..."
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-theme-primary mb-1">
                              Image URL (Optional)
                            </label>
                            <input
                              type="url"
                              value={story.image_url || ''}
                              onChange={e => updateSuccessStory(index, 'image_url', e.target.value)}
                              className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-surface text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="https://example.com/success-image.jpg"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div> */}

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
