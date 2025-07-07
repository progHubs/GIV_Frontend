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

// Type exports for TypeScript
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
