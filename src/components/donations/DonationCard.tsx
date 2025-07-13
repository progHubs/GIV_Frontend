/**
 * Donation Card Component
 * Displays donation information in a card format
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useStripeUtils } from '../../hooks/useStripe';
import { HighlightText, getMatchedField } from '../../utils/textHighlight';
import type { Donation } from '../../types/donation';

interface DonationCardProps {
  donation: Donation;
  showCampaign?: boolean;
  showDonor?: boolean;
  showActions?: boolean;
  onUpdate?: (donation: Donation) => void;
  className?: string;
  searchTerm?: string;
}

const DonationCard: React.FC<DonationCardProps> = ({
  donation,
  showCampaign = true,
  showDonor = false,
  showActions = false,
  onUpdate,
  className = '',
  searchTerm = '',
}) => {
  const { formatCurrency } = useStripeUtils();

  // Get which field matched the search
  const matchedField = getMatchedField(donation, searchTerm);

  // Helper function to safely parse amount
  const safeParseAmount = (amount: any): number => {
    if (amount === null || amount === undefined) return 0;
    const parsed = parseFloat(String(amount));
    return isNaN(parsed) ? 0 : parsed;
  };

  // Format date safely
  const formatDate = (dateString: any) => {
    if (!dateString) return 'Invalid Date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get donation type badge
  const getDonationTypeBadge = (type: string) => {
    switch (type) {
      case 'recurring':
        return 'text-blue-600 bg-blue-100';
      case 'one_time':
        return 'text-purple-600 bg-purple-100';
      case 'in_kind':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-theme-surface rounded-lg p-4 shadow-sm border border-theme hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {/* Amount */}
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xl font-bold text-theme-primary">
              {formatCurrency(safeParseAmount(donation.amount), donation.currency)}
            </span>
            {donation.donation_type === 'recurring' && (
              <span className="text-sm text-theme-muted">/month</span>
            )}
          </div>

          {/* Campaign info */}
          {showCampaign && donation.campaigns && (
            <div className="text-sm text-theme-muted mb-1">
              to{' '}
              <span className="font-medium text-theme-primary">
                <HighlightText
                  text={donation.campaigns.title}
                  searchTerm={searchTerm}
                  className="bg-blue-200 text-blue-900 px-1 rounded"
                />
              </span>
              {matchedField === 'campaign' && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  Campaign Match
                </span>
              )}
            </div>
          )}

          {/* Donor info */}
          {showDonor && !donation.is_anonymous && donation.donor_profiles?.users && (
            <div className="text-sm text-theme-muted mb-1">
              by{' '}
              <span className="font-medium text-theme-primary">
                <HighlightText
                  text={donation.donor_profiles.users.full_name}
                  searchTerm={searchTerm}
                  className="bg-green-200 text-green-900 px-1 rounded"
                />
              </span>
              {matchedField === 'donor' && (
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Donor Match
                </span>
              )}
            </div>
          )}

          {/* Anonymous indicator */}
          {donation.is_anonymous && (
            <div className="text-sm text-theme-muted mb-1">
              by <span className="italic">Anonymous Donor</span>
            </div>
          )}
        </div>

        {/* Status badges */}
        <div className="flex flex-col items-end space-y-1">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(donation.payment_status)}`}
          >
            {donation.payment_status.charAt(0).toUpperCase() + donation.payment_status.slice(1)}
          </span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getDonationTypeBadge(donation.donation_type)}`}
          >
            {donation.donation_type === 'one_time'
              ? 'One-time'
              : donation.donation_type === 'recurring'
                ? 'Monthly'
                : 'In-kind'}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        {/* Date */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-theme-muted">Donated:</span>
          <span className="text-theme-primary">{formatDate(donation.donated_at)}</span>
        </div>

        {/* Transaction ID */}
        {donation.transaction_id && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-theme-muted">Transaction:</span>
            <div className="flex items-center space-x-2">
              <span className="text-theme-primary font-mono text-xs">
                <HighlightText
                  text={donation.transaction_id.slice(-8)}
                  searchTerm={searchTerm}
                  className="bg-purple-200 text-purple-900 px-1 rounded"
                />
              </span>
              {matchedField === 'transaction' && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  Transaction Match
                </span>
              )}
            </div>
          </div>
        )}

        {/* Payment method */}
        {donation.payment_method && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-theme-muted">Method:</span>
            <span className="text-theme-primary capitalize">{donation.payment_method}</span>
          </div>
        )}

        {/* Tax deductible */}
        {donation.is_tax_deductible && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-theme-muted">Tax deductible:</span>
            <span className="text-green-600">✓ Yes</span>
          </div>
        )}

        {/* Notes */}
        {donation.notes && (
          <div className="mt-3 p-2 bg-theme-background rounded text-sm">
            <span className="text-theme-muted">Message: </span>
            <span className="text-theme-primary italic">
              "
              <HighlightText
                text={donation.notes}
                searchTerm={searchTerm}
                className="bg-orange-200 text-orange-900 px-1 rounded"
              />
              "
            </span>
            {matchedField === 'notes' && (
              <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                Notes Match
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="mt-4 pt-3 border-t border-theme">
          <div className="flex items-center justify-between">
            {/* Receipt link */}
            {donation.receipt_url && (
              <a
                href={donation.receipt_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View Receipt
              </a>
            )}

            {/* Admin actions */}
            {onUpdate && (
              <div className="flex items-center space-x-2">
                {donation.payment_status === 'pending' && (
                  <button
                    onClick={() => onUpdate(donation)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Update Status
                  </button>
                )}
                {/* <button
                  onClick={() => onUpdate(donation)}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                >
                  Edit
                </button> */}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Acknowledgment indicator */}
      {donation.is_acknowledged && (
        <div className="mt-3 flex items-center text-sm text-green-600">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Acknowledged
        </div>
      )}
    </motion.div>
  );
};

export default DonationCard;
