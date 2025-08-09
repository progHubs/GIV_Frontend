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

// Date validation schema
const dateSchema = z
  .string()
  .min(1, 'Date is required')
  .refine((date) => {
    // Check if it's a valid date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;

    // Check if it's a valid date
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) && parsedDate.toISOString().split('T')[0] === date;
  }, 'Invalid date format. Please use YYYY-MM-DD format')
  .refine((date) => {
    // Check if date is not in the past (for events)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(date);
    return eventDate >= today;
  }, 'Event date cannot be in the past');

// Time validation schema
const timeSchema = z
  .string()
  .min(1, 'Time is required')
  .refine((time) => {
    // Check if it's a valid time format (HH:MM or HH:MM:SS)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    return timeRegex.test(time);
  }, 'Invalid time format. Please use HH:MM format');

// Positive integer validation schema (base)
const positiveIntegerSchema = z
  .number()
  .int('Must be a whole number')
  .positive('Must be a positive number')
  .or(
    z.string()
      .min(1, 'Value is required')
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number.isInteger(Number(val)),
        'Must be a positive whole number')
      .transform((val) => Number(val))
  );

// Specific schemas for different use cases
const capacitySchema = z
  .number()
  .int('Capacity must be a whole number')
  .positive('Capacity must be a positive number')
  .optional()
  .or(
    z.string()
      .optional()
      .refine((val) => {
        if (!val || val.trim() === '') return true;
        const num = Number(val);
        return !isNaN(num) && num > 0 && Number.isInteger(num);
      }, 'Capacity must be a positive whole number')
      .transform((val) => val && val.trim() !== '' ? Number(val) : undefined)
  );

const quantitySchema = z
  .number()
  .int('Quantity must be a whole number')
  .min(1, 'Quantity must be at least 1')
  .max(10, 'Quantity cannot exceed 10')
  .default(1)
  .or(
    z.string()
      .min(1, 'Quantity is required')
      .refine((val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 1 && num <= 10 && Number.isInteger(num);
      }, 'Quantity must be a whole number between 1 and 10')
      .transform((val) => Number(val))
  );

const hoursCommittedSchema = z
  .number()
  .int('Hours must be a whole number')
  .min(1, 'Hours committed must be at least 1')
  .max(100, 'Hours committed cannot exceed 100')
  .default(8)
  .or(
    z.string()
      .min(1, 'Hours committed is required')
      .refine((val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 1 && num <= 100 && Number.isInteger(num);
      }, 'Hours committed must be a whole number between 1 and 100')
      .transform((val) => Number(val))
  );

// Currency validation schema
const currencySchema = z
  .number()
  .min(0, 'Amount cannot be negative')
  .max(1000000, 'Amount cannot exceed 1,000,000')
  .or(
    z.string()
      .refine((val) => {
        if (!val || val.trim() === '') return true; // Allow empty for optional fields
        const num = Number(val);
        return !isNaN(num) && num >= 0 && num <= 1000000;
      }, 'Invalid amount. Must be between 0 and 1,000,000')
      .transform((val) => val ? Number(val) : 0)
  );

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

// Event validation schemas
export const eventSchema = z.object({
  title: z
    .string()
    .min(1, 'Event title is required')
    .min(3, 'Event title must be at least 3 characters')
    .max(255, 'Event title must not exceed 255 characters')
    .transform((title) => title.trim()),

  description: z
    .string()
    .optional()
    .refine((desc) => !desc || desc.trim().length >= 10, 'Description must be at least 10 characters if provided')
    .transform((desc) => desc?.trim()),

  event_date: dateSchema,
  event_time: timeSchema,

  timezone: z
    .string()
    .min(1, 'Timezone is required')
    .default('UTC'),

  location: z
    .string()
    .optional()
    .refine((loc) => !loc || loc.trim().length >= 3, 'Location must be at least 3 characters if provided')
    .transform((loc) => loc?.trim()),

  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .optional(),

  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .optional(),

  category: z
    .enum(['medical_conference', 'health_screening', 'community_outreach', 'training_workshop', 'awareness_campaign', 'fundraising', 'networking', 'educational', 'other'])
    .optional(),

  capacity: capacitySchema,

  registration_deadline: z
    .string()
    .datetime()
    .optional(),

  agenda: z
    .string()
    .optional()
    .transform((agenda) => agenda?.trim()),

  speaker_info: z
    .any()
    .optional(),

  requirements: z
    .string()
    .optional()
    .transform((req) => req?.trim()),

  price: currencySchema.default(0),

  is_free: z
    .boolean()
    .default(true),

  is_featured: z
    .boolean()
    .default(false),

  volunteer_roles: z
    .string()
    .optional()
    .transform((roles) => roles?.trim()),

  language: z
    .enum(['en', 'am'])
    .default('en'),

  status: z
    .enum(['upcoming', 'ongoing', 'completed', 'cancelled'])
    .default('upcoming'),
});

export const eventUpdateSchema = eventSchema.partial();

// Event registration schema
export const eventRegistrationSchema = z.object({
  event_id: z.string().min(1, 'Event ID is required'),
  user_id: z.string().optional(),
  guest_name: nameSchema.optional(),
  guest_email: emailSchema.optional(),
  guest_phone: phoneSchema.optional(),
  special_requirements: z
    .string()
    .optional()
    .transform((req) => req?.trim()),
});

// Event ticket purchase schema
export const eventTicketPurchaseSchema = z.object({
  event_id: z.string().min(1, 'Event ID is required'),
  quantity: quantitySchema,
  special_requirements: z
    .string()
    .optional()
    .transform((req) => req?.trim()),
  guest_info: z
    .array(z.object({
      name: nameSchema,
      email: emailSchema,
      phone: phoneSchema.optional(),
    }))
    .optional(),
});

// Event volunteer application schema
export const eventVolunteerApplicationSchema = z.object({
  event_id: z.string().min(1, 'Event ID is required'),
  hours_committed: hoursCommittedSchema,
  application_notes: z
    .string()
    .optional()
    .transform((notes) => notes?.trim()),
  volunteer_roles: z
    .array(z.string())
    .min(1, 'At least one volunteer role must be selected'),
  custom_roles: z
    .string()
    .optional()
    .transform((roles) => roles?.trim()),
  availability: z
    .string()
    .optional()
    .transform((avail) => avail?.trim()),
  experience: z
    .string()
    .optional()
    .transform((exp) => exp?.trim()),
  motivation: z
    .string()
    .optional()
    .transform((mot) => mot?.trim()),
  emergency_contact: z
    .object({
      name: nameSchema,
      phone: z.string().min(1, 'Emergency contact phone is required'),
      relationship: z.string().min(1, 'Emergency contact relationship is required'),
    })
    .optional(),
});

// Event partner schema
export const eventPartnerSchema = z.object({
  name: z
    .string()
    .min(1, 'Partner name is required')
    .min(2, 'Partner name must be at least 2 characters')
    .max(255, 'Partner name must not exceed 255 characters')
    .transform((name) => name.trim()),

  website: urlSchema.optional(),

  description: z
    .string()
    .optional()
    .refine((desc) => !desc || desc.length <= 1000, 'Description must not exceed 1000 characters')
    .transform((desc) => desc?.trim()),

  is_active: z
    .boolean()
    .default(true),
});

export const eventPartnerUpdateSchema = eventPartnerSchema.partial();

// Event type exports
export type EventFormData = z.infer<typeof eventSchema>;
export type EventUpdateFormData = z.infer<typeof eventUpdateSchema>;
export type EventRegistrationFormData = z.infer<typeof eventRegistrationSchema>;
export type EventTicketPurchaseFormData = z.infer<typeof eventTicketPurchaseSchema>;
export type EventVolunteerApplicationFormData = z.infer<typeof eventVolunteerApplicationSchema>;
export type EventPartnerFormData = z.infer<typeof eventPartnerSchema>;
export type EventPartnerUpdateFormData = z.infer<typeof eventPartnerUpdateSchema>;
