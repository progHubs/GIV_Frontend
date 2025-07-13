// User Form Component
// Comprehensive form for creating and editing users with validation

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiGlobe,
  FiShield,
  FiSave,
  FiX,
  FiUpload,
  FiLock,
} from 'react-icons/fi';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

import { FileUpload } from '../ui/FileUpload';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { useCreateUser, useUpdateUser, useUpdateCurrentUser } from '../../hooks/useUserManagement';
import type { User, UpdateUserRequest, CreateUserRequest } from '../../types/user';

// Validation schema
const userSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  phone: z
    .string()
    .optional()
    .refine(val => !val || /^\+?[\d\s\-\(\)]+$/.test(val), 'Please enter a valid phone number'),
  role: z.enum(['admin', 'user']).optional(),
  language_preference: z.enum(['en', 'am']),
  profile_image_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: User) => void;
  mode: 'create' | 'edit' | 'profile';
  title?: string;
}

export function UserForm({
  user,
  isOpen,
  onClose,
  onSuccess,
  mode = 'edit',
  title,
}: UserFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Hooks
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const updateCurrentUserMutation = useUpdateCurrentUser();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      role: 'user',
      language_preference: 'en',
      profile_image_url: '',
    },
  });

  const watchedImageUrl = watch('profile_image_url');

  // Reset form when user changes
  useEffect(() => {
    setSubmitError(null); // Clear any previous errors

    if (user) {
      reset({
        full_name: user.full_name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        language_preference: user.language_preference,
        profile_image_url: user.profile_image_url || '',
      });
      setImagePreview(user.profile_image_url || null);
    } else {
      reset({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        role: 'user',
        language_preference: 'en',
        profile_image_url: '',
      });
      setImagePreview(null);
    }
  }, [user, reset]);

  // Update image preview when URL changes
  useEffect(() => {
    if (watchedImageUrl && watchedImageUrl !== imagePreview) {
      setImagePreview(watchedImageUrl);
    }
  }, [watchedImageUrl, imagePreview]);

  // Handle form submission
  const onSubmit = async (data: UserFormData) => {
    try {
      setSubmitError(null);
      console.log('🔄 Submitting user form:', { mode, userId: user?.id, data });

      const updateData: UpdateUserRequest = {
        full_name: data.full_name,
        phone: data.phone || undefined,
        language_preference: data.language_preference,
        profile_image_url: data.profile_image_url || undefined,
        ...(mode !== 'profile' && data.role && { role: data.role }), // Include role only for admin updates
      };

      let updatedUser: User;

      if (mode === 'create') {
        // Create new user
        console.log('📝 Creating new user...');
        const createData: CreateUserRequest = {
          full_name: data.full_name,
          email: data.email,
          password: data.password || 'defaultPassword123', // Require password for create
          phone: data.phone || undefined,
          role: data.role || 'user',
          language_preference: data.language_preference,
          profile_image_url: data.profile_image_url || undefined,
        };
        const response = await createUserMutation.mutateAsync(createData);
        updatedUser = response.data;
      } else if (mode === 'profile') {
        // Update current user profile
        console.log('📝 Updating current user profile...');
        const response = await updateCurrentUserMutation.mutateAsync(updateData);
        updatedUser = response.data;
      } else if (user) {
        // Update existing user (admin)
        console.log('📝 Updating user by admin...', user.id);
        const response = await updateUserMutation.mutateAsync({
          userId: user.id,
          userData: updateData,
        });
        updatedUser = response.data;
      } else {
        throw new Error('Invalid form mode: no user provided for edit mode');
      }

      console.log('✅ User updated successfully:', updatedUser);

      // Only close modal and call success callback if everything succeeded
      onSuccess?.(updatedUser);
      onClose();
    } catch (error: any) {
      console.error('❌ Failed to save user:', error);
      setSubmitError(error?.response?.data?.error || error?.message || 'Failed to save user');
      // Don't close the modal on error - let the user try again
    }
  };

  // Handle image upload
  const handleImageUpload = async (files: File | File[]) => {
    const file = Array.isArray(files) ? files[0] : files;
    if (!file) return;
    setIsUploading(true);
    try {
      // In a real app, you would upload to your file storage service
      // For now, we'll create a mock URL
      const mockUrl = URL.createObjectURL(file);
      setValue('profile_image_url', mockUrl);
      setImagePreview(mockUrl);
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Role options
  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
  ];

  // Language options
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'am', label: 'Amharic' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FiUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title ||
                  (mode === 'create'
                    ? 'Create User'
                    : mode === 'profile'
                      ? 'Edit Profile'
                      : 'Edit User')}
              </h2>
              {user && <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <FiX className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Error Message */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiX className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800 dark:text-red-400">{submitError}</p>
                  </div>
                </div>
              </div>
            )}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="profile">Profile & Settings</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6 mt-6">
                {/* Profile Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <FiUser className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        {...register('profile_image_url')}
                        placeholder="Enter image URL or upload file"
                        error={errors.profile_image_url?.message}
                      />
                      <div className="mt-2">
                        <FileUpload
                          accept="image/*"
                          onFileSelect={handleImageUpload}
                          disabled={isUploading}
                          className="text-sm"
                        >
                          <Button type="button" variant="outline" size="sm" disabled={isUploading}>
                            {isUploading ? (
                              <LoadingSpinner size="sm" className="mr-2" />
                            ) : (
                              <FiUpload className="w-4 h-4 mr-2" />
                            )}
                            Upload Image
                          </Button>
                        </FileUpload>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <Input
                    {...register('full_name')}
                    placeholder="Enter full name"
                    error={errors.full_name?.message}
                    icon={FiUser}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="Enter email address"
                    error={errors.email?.message}
                    icon={FiMail}
                    disabled={mode === 'edit'} // Email cannot be changed after creation
                  />
                  {mode === 'edit' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Email address cannot be changed after account creation
                    </p>
                  )}
                </div>

                {/* Password - only for create mode */}
                {mode === 'create' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password *
                    </label>
                    <Input
                      {...register('password')}
                      type="password"
                      placeholder="Enter password (min 6 characters)"
                      error={errors.password?.message}
                      icon={FiLock}
                    />
                  </div>
                )}

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <Input
                    {...register('phone')}
                    type="tel"
                    placeholder="Enter phone number"
                    error={errors.phone?.message}
                    icon={FiPhone}
                  />
                </div>
              </TabsContent>

              {/* Profile & Settings Tab */}
              <TabsContent value="profile" className="space-y-6 mt-6">
                {/* Role (Admin only) */}
                {mode !== 'profile' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      User Role
                    </label>
                    <Select
                      {...register('role')}
                      options={roleOptions}
                      error={errors.role?.message}
                      icon={FiShield}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Admin users have access to the admin dashboard and can manage other users
                    </p>
                  </div>
                )}

                {/* Language Preference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Language Preference
                  </label>
                  <Select
                    {...register('language_preference')}
                    options={languageOptions}
                    error={errors.language_preference?.message}
                    icon={FiGlobe}
                  />
                </div>

                {/* User Status (if editing) */}
                {user && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Account Status
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email Verification
                        </div>
                        <Badge
                          variant={user.email_verified ? 'success' : 'warning'}
                          className="mt-1"
                        >
                          {user.email_verified ? 'Verified' : 'Unverified'}
                        </Badge>
                      </div>

                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Account Type
                        </div>
                        <div className="flex gap-1 mt-1">
                          {user.is_donor && (
                            <Badge variant="info" className="text-xs">
                              Donor
                            </Badge>
                          )}
                          {user.is_volunteer && (
                            <Badge variant="success" className="text-xs">
                              Volunteer
                            </Badge>
                          )}
                          {!user.is_donor && !user.is_volunteer && (
                            <Badge variant="secondary" className="text-xs">
                              Basic User
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Account Information
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                        <div>User ID: {user.id}</div>
                        <div>Created: {new Date(user.created_at).toLocaleDateString()}</div>
                        <div>Last Updated: {new Date(user.updated_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
              {isSubmitting ? <LoadingSpinner size="sm" /> : <FiSave className="w-4 h-4" />}
              {mode === 'create' ? 'Create User' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
