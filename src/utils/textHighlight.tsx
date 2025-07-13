/**
 * Text Highlighting Utilities
 * Utilities for highlighting search terms in text
 */

import React from 'react';

/**
 * Highlights search terms in text
 * @param text - The text to highlight
 * @param searchTerm - The term to highlight
 * @param className - CSS class for highlighted text
 * @returns JSX element with highlighted text
 */
export const highlightText = (
  text: string,
  searchTerm: string,
  className: string = 'bg-yellow-200 text-yellow-900 px-1 rounded'
): React.ReactNode => {
  if (!searchTerm || !text) {
    return text;
  }

  // Escape special regex characters
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create regex for case-insensitive matching
  const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
  
  // Split text by search term
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, index) => {
        // Check if this part matches the search term (case-insensitive)
        if (part.toLowerCase() === searchTerm.toLowerCase()) {
          return (
            <span key={index} className={className}>
              {part}
            </span>
          );
        }
        return part;
      })}
    </>
  );
};

/**
 * Component for highlighting text
 */
interface HighlightTextProps {
  text: string;
  searchTerm: string;
  className?: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  searchTerm,
  className = 'bg-yellow-200 text-yellow-900 px-1 rounded'
}) => {
  return <>{highlightText(text, searchTerm, className)}</>;
};

/**
 * Checks if text contains search term (case-insensitive)
 * @param text - Text to search in
 * @param searchTerm - Term to search for
 * @returns boolean indicating if text contains search term
 */
export const containsSearchTerm = (text: string, searchTerm: string): boolean => {
  if (!searchTerm || !text) return false;
  return text.toLowerCase().includes(searchTerm.toLowerCase());
};

/**
 * Gets the field that matched the search term
 * @param donation - Donation object
 * @param searchTerm - Search term
 * @returns string indicating which field matched
 */
export const getMatchedField = (donation: any, searchTerm: string): string | null => {
  if (!searchTerm) return null;

  const searchLower = searchTerm.toLowerCase();

  // Check donor name
  if (donation.donor_profiles?.users?.full_name && 
      donation.donor_profiles.users.full_name.toLowerCase().includes(searchLower)) {
    return 'donor';
  }

  // Check campaign title
  if (donation.campaigns?.title && 
      donation.campaigns.title.toLowerCase().includes(searchLower)) {
    return 'campaign';
  }

  // Check transaction ID
  if (donation.transaction_id && 
      donation.transaction_id.toLowerCase().includes(searchLower)) {
    return 'transaction';
  }

  // Check notes
  if (donation.notes && 
      donation.notes.toLowerCase().includes(searchLower)) {
    return 'notes';
  }

  // Check currency
  if (donation.currency && 
      donation.currency.toLowerCase().includes(searchLower)) {
    return 'currency';
  }

  return null;
};
