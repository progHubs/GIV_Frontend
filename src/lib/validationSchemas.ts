import { z } from 'zod';

// Password validation schema based on backend requirements
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character')
  .refine((password) => {
    // Check for common weak passwords
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ];
    return !commonPasswords.includes(password.toLowerCase());
  }, 'Password is too common. Please choose a more secure password')
  .refine((password) => {
    // Check for repeated characters
    return !/(.)\1{2,}/.test(password);
  }, 'Password should not contain repeated characters')
  .refine((password) => {
    // Check for keyboard sequences
    const keyboardSequences = ['qwerty', 'asdfgh', 'zxcvbn', '123456'];
    const passwordLower = password.toLowerCase();
    return !keyboardSequences.some(sequence => passwordLower.includes(sequence));
  }, 'Password should not contain keyboard sequences');

// Email validation schema
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(255, 'Email must not exceed 255 characters');

// Name validation schema based on backend requirements
const nameSchema = z
  .string()
  .min(1, 'Full name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must not exceed 100 characters')
  .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name must contain only letters, spaces, hyphens, and apostrophes')
  .transform((name) => name.trim().replace(/\s+/g, ' ')); // Normalize whitespace

// Phone validation schema (optional, international format)
const phoneSchema = z
  .string()
  .optional()
  .refine((phone) => {
    if (!phone || phone.trim() === '') return true; // Optional field
    // Remove spaces, dashes, and parentheses for validation
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return /^\+?[1-9]\d{1,14}$/.test(cleanPhone);
  }, 'Invalid phone number format. Please use international format (e.g., +1234567890)');

// Language preference schema
const languageSchema = z
  .enum(['en', 'am'], {
    errorMap: () => ({ message: 'Invalid language preference. Must be "en" or "am"' })
  })
  .optional()
  .default('en');

// Registration form validation schema
export const registerSchema = z.object({
  full_name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  phone: phoneSchema,
  language_preference: languageSchema,
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// Login form validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema
});

// Reset password schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your new password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword']
});

// Profile update schema
export const updateProfileSchema = z.object({
  full_name: nameSchema,
  phone: phoneSchema,
  language_preference: languageSchema
});

// ===================================
// CONTENT MANAGEMENT SCHEMAS
// ===================================

// Slug validation schema
const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(255, 'Slug must not exceed 255 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
  .refine((slug) => !slug.startsWith('-') && !slug.endsWith('-'), 'Slug cannot start or end with a hyphen');

// Post title validation schema
const postTitleSchema = z
  .string()
  .min(1, 'Title is required')
  .min(3, 'Title must be at least 3 characters')
  .max(255, 'Title must not exceed 255 characters')
  .transform((title) => title.trim());

// Post content validation schema
const postContentSchema = z
  .string()
  .optional()
  .transform((content) => content?.trim() || undefined);

// Content blocks validation schema
const contentBlocksSchema = z
  .object({
    version: z.string().min(1, 'Content blocks version is required'),
    blocks: z.array(z.object({
      id: z.string().min(1, 'Block ID is required'),
      type: z.enum([
        'header', 'paragraph', 'list', 'image', 'video', 'quote',
        'table', 'code', 'delimiter', 'warning', 'embed', 'checklist', 'attaches'
      ], { errorMap: () => ({ message: 'Invalid block type' }) }),
      data: z.record(z.any())
    }))
  })
  .optional();

// Post type validation schema
const postTypeSchema = z
  .enum(['blog', 'news', 'press_release'], {
    errorMap: () => ({ message: 'Invalid post type. Must be blog, news, or press_release' })
  });

// Language validation schema
const contentLanguageSchema = z
  .enum(['en', 'am'], {
    errorMap: () => ({ message: 'Invalid language. Must be "en" or "am"' })
  })
  .optional()
  .default('en');

// Tags validation schema
const tagsSchema = z
  .string()
  .optional()
  .transform((tags) => {
    if (!tags || tags.trim() === '') return undefined;
    // Split by comma, trim each tag, remove empty tags, and rejoin
    const tagArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    return tagArray.length > 0 ? tagArray.join(',') : undefined;
  })
  .refine((tags) => {
    if (!tags) return true;
    const tagArray = tags.split(',');
    return tagArray.every(tag => tag.length >= 2 && tag.length <= 50);
  }, 'Each tag must be between 2 and 50 characters');

// URL validation schema
const urlSchema = z
  .string()
  .optional()
  .refine((url) => {
    if (!url || url.trim() === '') return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }, 'Invalid URL format');

// Post creation schema
export const createPostSchema = z.object({
  title: postTitleSchema,
  slug: slugSchema,
  content: postContentSchema,
  content_blocks: contentBlocksSchema,
  post_type: postTypeSchema,
  feature_image: urlSchema,
  video_url: urlSchema,
  is_featured: z.boolean().optional().default(false),
  tags: tagsSchema,
  language: contentLanguageSchema
});

// Post update schema
export const updatePostSchema = z.object({
  title: postTitleSchema.optional(),
  slug: slugSchema.optional(),
  content: postContentSchema,
  content_blocks: contentBlocksSchema,
  post_type: postTypeSchema.optional(),
  feature_image: urlSchema,
  video_url: urlSchema,
  is_featured: z.boolean().optional(),
  tags: tagsSchema,
  language: contentLanguageSchema
});

// Comment validation schema
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment content is required')
    .min(3, 'Comment must be at least 3 characters')
    .max(1000, 'Comment must not exceed 1000 characters')
    .transform((content) => content.trim())
});

// Comment update schema
export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment content is required')
    .min(3, 'Comment must be at least 3 characters')
    .max(1000, 'Comment must not exceed 1000 characters')
    .transform((content) => content.trim())
});

// Post query schema
export const postQuerySchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
  post_type: postTypeSchema.optional(),
  language: contentLanguageSchema,
  title_search: z.string().optional(),
  content_search: z.string().optional(),
  slug_search: z.string().optional(),
  created_after: z.string().optional(),
  created_before: z.string().optional(),
  updated_after: z.string().optional(),
  updated_before: z.string().optional(),
  author_id: z.string().optional(),
  author_name: z.string().optional(),
  sort_by: z.enum(['created_at', 'updated_at', 'title', 'views', 'likes']).optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
  has_image: z.boolean().optional(),
  content_length_min: z.number().min(0).optional(),
  content_length_max: z.number().min(0).optional(),
  is_featured: z.boolean().optional(),
  tags: z.string().optional(),
  exclude_id: z.string().optional()
});

// Type exports for TypeScript
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

// Content management type exports
export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type UpdatePostFormData = z.infer<typeof updatePostSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type UpdateCommentFormData = z.infer<typeof updateCommentSchema>;
export type PostQueryFormData = z.infer<typeof postQuerySchema>;
