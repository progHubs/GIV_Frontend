/**
 * Date Utilities for GIV Society Frontend
 * Handles various date formats and provides consistent formatting
 */

import { format, parseISO, isValid, formatDistanceToNow } from 'date-fns';

/**
 * Safely formats a date input to a readable string
 * Handles ISO strings, Date objects, timestamps, and various edge cases
 * 
 * @param dateInput - The date input (string, Date, number, or any)
 * @param formatString - The format string (default: 'MMM dd, yyyy')
 * @returns Formatted date string or fallback message
 */
export function formatDate(dateInput: any, formatString: string = 'MMM dd, yyyy'): string {
  // Handle null, undefined, or empty values
  if (!dateInput || dateInput === 'null' || dateInput === 'undefined' || dateInput === '') {
    return 'Not provided';
  }

  // Handle empty objects or arrays
  if (typeof dateInput === 'object' && !Array.isArray(dateInput) && !(dateInput instanceof Date)) {
    if (Object.keys(dateInput).length === 0) {
      return 'Not provided';
    }
    // If it's an object with properties, it's likely invalid
    console.warn('Invalid date object received:', dateInput);
    return 'Invalid date';
  }

  // Handle arrays (shouldn't happen but just in case)
  if (Array.isArray(dateInput)) {
    return 'Not provided';
  }

  try {
    let date: Date;

    if (dateInput instanceof Date) {
      // Already a Date object
      date = dateInput;
    } else if (typeof dateInput === 'string') {
      // Handle string representations of null/undefined
      if (dateInput === '0000-00-00' || dateInput === '0000-00-00 00:00:00') {
        return 'Not provided';
      }

      // Try to parse ISO string first (most common from backend)
      if (dateInput.includes('T') || dateInput.includes('Z') || dateInput.match(/^\d{4}-\d{2}-\d{2}/)) {
        date = parseISO(dateInput);
      } else {
        // Fallback to Date constructor
        date = new Date(dateInput);
      }
    } else if (typeof dateInput === 'number') {
      // Handle timestamps
      // Check if it's in seconds (Unix timestamp) or milliseconds
      const timestamp = dateInput > 1000000000000 ? dateInput : dateInput * 1000;
      date = new Date(timestamp);
    } else {
      // Convert to string and try parsing
      const dateString = String(dateInput);
      if (dateString.includes('T') || dateString.includes('Z') || dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
        date = parseISO(dateString);
      } else {
        date = new Date(dateString);
      }
    }

    // Check if date is valid
    if (!isValid(date)) {
      console.warn('Invalid date input:', dateInput);
      return 'Invalid date';
    }

    // Check if date is reasonable (not too far in past or future)
    const now = new Date();
    const minDate = new Date('1900-01-01');
    const maxDate = new Date(now.getFullYear() + 50, 11, 31);

    if (date < minDate || date > maxDate) {
      console.warn('Date out of reasonable range:', dateInput, date);
      return 'Invalid date';
    }

    const formattedDate = format(date, formatString);
    return formattedDate;
  } catch (error) {
    console.error('Date formatting error:', error, 'Input:', dateInput);
    return 'Invalid date';
  }
}

/**
 * Formats a date as relative time (e.g., "2 hours ago", "3 days ago")
 * 
 * @param dateInput - The date input
 * @returns Relative time string or fallback message
 */
export function formatRelativeDate(dateInput: any): string {
  if (!dateInput || dateInput === 'null' || dateInput === 'undefined' || dateInput === '') {
    return 'Not provided';
  }

  try {
    let date: Date;

    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === 'string') {
      if (dateInput.includes('T') || dateInput.includes('Z') || dateInput.match(/^\d{4}-\d{2}-\d{2}/)) {
        date = parseISO(dateInput);
      } else {
        date = new Date(dateInput);
      }
    } else if (typeof dateInput === 'number') {
      const timestamp = dateInput > 1000000000000 ? dateInput : dateInput * 1000;
      date = new Date(timestamp);
    } else {
      const dateString = String(dateInput);
      date = parseISO(dateString);
    }

    if (!isValid(date)) {
      return 'Invalid date';
    }

    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Relative date formatting error:', error, 'Input:', dateInput);
    return 'Invalid date';
  }
}

/**
 * Formats a date for form inputs (YYYY-MM-DD)
 * 
 * @param dateInput - The date input
 * @returns Date string in YYYY-MM-DD format or empty string
 */
export function formatDateForInput(dateInput: any): string {
  if (!dateInput || dateInput === 'null' || dateInput === 'undefined' || dateInput === '') {
    return '';
  }

  try {
    let date: Date;

    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === 'string') {
      if (dateInput.includes('T') || dateInput.includes('Z') || dateInput.match(/^\d{4}-\d{2}-\d{2}/)) {
        date = parseISO(dateInput);
      } else {
        date = new Date(dateInput);
      }
    } else if (typeof dateInput === 'number') {
      const timestamp = dateInput > 1000000000000 ? dateInput : dateInput * 1000;
      date = new Date(timestamp);
    } else {
      return '';
    }

    if (!isValid(date)) {
      return '';
    }

    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Date input formatting error:', error, 'Input:', dateInput);
    return '';
  }
}

/**
 * Formats a date with time (e.g., "Jan 15, 2024 at 2:30 PM")
 * 
 * @param dateInput - The date input
 * @returns Formatted date with time string or fallback message
 */
export function formatDateTime(dateInput: any): string {
  return formatDate(dateInput, 'MMM dd, yyyy \'at\' h:mm a');
}

/**
 * Formats a date as a short string (e.g., "Jan 15, 2024")
 * 
 * @param dateInput - The date input
 * @returns Short formatted date string or fallback message
 */
export function formatDateShort(dateInput: any): string {
  return formatDate(dateInput, 'MMM dd, yyyy');
}

/**
 * Formats a date as a long string (e.g., "January 15, 2024")
 * 
 * @param dateInput - The date input
 * @returns Long formatted date string or fallback message
 */
export function formatDateLong(dateInput: any): string {
  return formatDate(dateInput, 'MMMM dd, yyyy');
}

/**
 * Checks if a date input is valid
 * 
 * @param dateInput - The date input
 * @returns True if the date is valid, false otherwise
 */
export function isValidDate(dateInput: any): boolean {
  if (!dateInput || dateInput === 'null' || dateInput === 'undefined' || dateInput === '') {
    return false;
  }

  try {
    let date: Date;

    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === 'string') {
      if (dateInput.includes('T') || dateInput.includes('Z') || dateInput.match(/^\d{4}-\d{2}-\d{2}/)) {
        date = parseISO(dateInput);
      } else {
        date = new Date(dateInput);
      }
    } else if (typeof dateInput === 'number') {
      const timestamp = dateInput > 1000000000000 ? dateInput : dateInput * 1000;
      date = new Date(timestamp);
    } else {
      return false;
    }

    return isValid(date);
  } catch (error) {
    return false;
  }
}
