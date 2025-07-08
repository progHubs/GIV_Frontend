// Validation utility functions

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate email address
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common weak patterns
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain repeated characters');
  }

  // Check for keyboard sequences
  const keyboardSequences = [
    'qwerty', 'asdf', 'zxcv', '1234', 'abcd', 'password', 'admin', 'user'
  ];
  
  const lowerPassword = password.toLowerCase();
  for (const sequence of keyboardSequences) {
    if (lowerPassword.includes(sequence)) {
      errors.push('Password cannot contain common patterns or words');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate full name
 */
export const validateFullName = (name: string): ValidationResult => {
  const errors: string[] = [];

  if (!name || !name.trim()) {
    errors.push('Full name is required');
    return { isValid: false, errors };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    errors.push('Full name must be at least 2 characters long');
  }

  if (trimmedName.length > 100) {
    errors.push('Full name must be less than 100 characters');
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
    errors.push('Full name can only contain letters, spaces, hyphens, and apostrophes');
  }

  // Check for at least one letter
  if (!/[a-zA-Z]/.test(trimmedName)) {
    errors.push('Full name must contain at least one letter');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate phone number
 */
export const validatePhoneNumber = (phone: string): ValidationResult => {
  const errors: string[] = [];

  if (!phone || !phone.trim()) {
    // Phone is optional, so empty is valid
    return { isValid: true, errors: [] };
  }

  const trimmedPhone = phone.trim();

  // Remove common formatting characters
  const cleanPhone = trimmedPhone.replace(/[\s\-\(\)\+]/g, '');

  // Check if it's all digits after cleaning
  if (!/^\d+$/.test(cleanPhone)) {
    errors.push('Phone number can only contain digits, spaces, hyphens, parentheses, and plus sign');
  }

  // Check length (international format can be 7-15 digits)
  if (cleanPhone.length < 7 || cleanPhone.length > 15) {
    errors.push('Phone number must be between 7 and 15 digits');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate that two passwords match
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): ValidationResult => {
  const errors: string[] = [];

  if (!confirmPassword) {
    errors.push('Please confirm your password');
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate terms acceptance
 */
export const validateTermsAcceptance = (accepted: boolean): ValidationResult => {
  const errors: string[] = [];

  if (!accepted) {
    errors.push('You must agree to the Terms of Service and Privacy Policy');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get password strength score (0-100)
 */
export const getPasswordStrength = (password: string): {
  score: number;
  level: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  suggestions: string[];
} => {
  let score = 0;
  const suggestions: string[] = [];

  if (!password) {
    return { score: 0, level: 'Very Weak', suggestions: ['Enter a password'] };
  }

  // Length scoring
  if (password.length >= 8) score += 20;
  else suggestions.push('Use at least 8 characters');

  if (password.length >= 12) score += 10;
  else if (password.length >= 8) suggestions.push('Consider using 12+ characters for better security');

  // Character variety scoring
  if (/[a-z]/.test(password)) score += 15;
  else suggestions.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score += 15;
  else suggestions.push('Add uppercase letters');

  if (/\d/.test(password)) score += 15;
  else suggestions.push('Add numbers');

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;
  else suggestions.push('Add special characters');

  // Bonus points for good practices
  if (password.length >= 16) score += 10;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 5;

  // Penalties for bad practices
  if (/(.)\1{2,}/.test(password)) score -= 20;
  if (/123|abc|qwe|asd|zxc/i.test(password)) score -= 15;

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  // Determine level
  let level: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  if (score < 20) level = 'Very Weak';
  else if (score < 40) level = 'Weak';
  else if (score < 60) level = 'Fair';
  else if (score < 80) level = 'Good';
  else if (score < 95) level = 'Strong';
  else level = 'Very Strong';

  return { score, level, suggestions };
};
