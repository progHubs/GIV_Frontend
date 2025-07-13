/**
 * Donation Form Component
 * Main donation form with amount selection, payment options, and Stripe integration
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useDonationForm, useStripeUtils } from '../../hooks/useStripe';
import { DONATION_AMOUNTS, DONATION_TIERS } from '../../types/donation';
import type { Campaign, DonationTier } from '../../types';

interface DonationFormProps {
  campaign: Campaign;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

const DonationForm: React.FC<DonationFormProps> = ({
  campaign,
  onSuccess,
  onError,
  className = '',
}) => {
  const {
    formData,
    updateFormData,
    getFinalAmount,
    validateForm,
    submitDonation,
    isLoading,
    error,
  } = useDonationForm(campaign.id);

  const { formatCurrency } = useStripeUtils();

  // Handle amount selection
  const handleAmountSelect = (amount: number) => {
    updateFormData({
      amount,
      customAmount: '',
      selectedTier: null,
    });
  };

  // Handle custom amount change
  const handleCustomAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    updateFormData({
      customAmount: value,
      amount: numValue > 0 ? numValue : null,
      selectedTier: null,
    });
  };

  // Handle tier selection (for recurring donations)
  const handleTierSelect = (tier: DonationTier) => {
    const tierConfig = DONATION_TIERS[tier];
    updateFormData({
      selectedTier: tier,
      amount: tierConfig.amount,
      customAmount: '',
    });
  };

  // Handle donation type change
  const handleDonationTypeChange = (type: 'one_time' | 'recurring') => {
    updateFormData({
      donationType: type,
      selectedTier: type === 'recurring' ? 'bronze' : null,
      amount: type === 'recurring' ? DONATION_TIERS.bronze.amount : null,
      customAmount: '',
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitDonation();
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to process donation';
      onError?.(errorMessage);
    }
  };

  const finalAmount = getFinalAmount();
  const validation = validateForm();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme ${className}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-theme-primary mb-2">Support This Campaign</h3>
          <p className="text-theme-muted text-sm">Your donation helps make a real difference</p>
        </div>

        {/* Donation Type Selection */}
        <div>
          <label className="block text-sm font-medium text-theme-primary mb-3">Donation Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleDonationTypeChange('one_time')}
              className={`px-4 py-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                formData.donationType === 'one_time'
                  ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                  : 'bg-theme-background text-theme-primary border-theme hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              One-time
            </button>
            <button
              type="button"
              onClick={() => handleDonationTypeChange('recurring')}
              className={`px-4 py-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                formData.donationType === 'recurring'
                  ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                  : 'bg-theme-background text-theme-primary border-theme hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Tier Selection (for recurring donations) */}
        {formData.donationType === 'recurring' && (
          <div>
            <label className="block text-sm font-medium text-theme-primary mb-3">
              Support Tier
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(DONATION_TIERS).map(([tierKey, tierConfig]) => (
                <button
                  key={tierKey}
                  type="button"
                  onClick={() => handleTierSelect(tierKey as DonationTier)}
                  className={`p-3 text-left rounded-lg border transition-all duration-200 ${
                    formData.selectedTier === tierKey
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-theme bg-theme-background hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-xs font-medium px-2 py-1 rounded"
                      style={{
                        backgroundColor: tierConfig.color + '20',
                        color: tierConfig.color,
                      }}
                    >
                      {tierConfig.name}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-theme-primary">
                    {formatCurrency(tierConfig.amount)}/mo
                  </div>
                  <div className="text-xs text-theme-muted mt-1">{tierConfig.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Amount Selection (for one-time donations) */}
        {formData.donationType === 'one_time' && (
          <div>
            <label className="block text-sm font-medium text-theme-primary mb-3">
              Donation Amount
            </label>

            {/* Predefined amounts */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {DONATION_AMOUNTS.map(amount => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleAmountSelect(amount)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                    formData.amount === amount && !formData.customAmount
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-theme-background text-theme-primary border-theme hover:border-blue-300'
                  }`}
                >
                  {formatCurrency(amount)}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-muted">
                $
              </span>
              <input
                type="number"
                placeholder="Custom amount"
                value={formData.customAmount}
                onChange={e => handleCustomAmountChange(e.target.value)}
                className="w-full pl-8 pr-3 py-3 border border-theme rounded-lg bg-theme-background text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                step="0.01"
              />
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-theme-primary mb-2">
            Message (Optional)
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={e => updateFormData({ notes: e.target.value })}
            placeholder="Add a message of support..."
            rows={3}
            className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Error display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Validation error */}
        {!validation.isValid && finalAmount > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-600">{validation.error}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={!validation.isValid || isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            validation.isValid && !isLoading
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            `Donate ${finalAmount > 0 ? formatCurrency(finalAmount) : ''} ${
              formData.donationType === 'recurring' ? '/month' : ''
            }`
          )}
        </button>

        {/* Security notice */}
        <div className="text-center">
          <p className="text-xs text-theme-muted">🔒 Secure payment powered by Stripe</p>
        </div>
      </form>
    </motion.div>
  );
};

export default DonationForm;
