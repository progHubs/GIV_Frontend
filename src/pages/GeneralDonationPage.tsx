/**
 * General Donation Page
 * Page for making one-time donations to general fund
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CreditCardIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useDonationForm, useStripeUtils } from '../hooks/useStripe';
import { DONATION_AMOUNTS } from '../types/donation';
import ModernNavigation from '../components/navigation/ModernNavigation';

const GeneralDonationPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');

  const {
    formData,
    updateFormData,
    getFinalAmount,
    validateForm,
    submitDonation,
    isLoading,
    error,
  } = useDonationForm(null); // null for general donations

  const { formatCurrency } = useStripeUtils();

  // Handle amount selection
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    updateFormData({
      amount,
      customAmount: '',
    });
  };

  // Handle custom amount change
  const handleCustomAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setCustomAmount(value);
    setSelectedAmount(null);
    updateFormData({
      customAmount: value,
      amount: numValue > 0 ? numValue : null,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalAmount = getFinalAmount();
    if (!finalAmount || finalAmount <= 0) {
      return;
    }

    try {
      await submitDonation();
      // navigate('/donation-success');
    } catch (error) {
      console.error('Donation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* <ModernNavigation /> */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/membership')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-200"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                {/* Back to Membership */}
              </motion.button>
            </div>

            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-6"
              >
                <CreditCardIcon className="h-8 w-8 text-white" />
              </motion.div>

              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Make a Donation
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Support our mission with a one-time donation to our general fund.
              </p>
            </div>
          </div>

          {/* General Donation Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Donation Amount
                </label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {DONATION_AMOUNTS.map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountSelect(amount)}
                      className={`py-3 px-4 border rounded-lg text-center font-medium transition-colors ${
                        selectedAmount === amount
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={e => handleCustomAmountChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Donate Button */}
              <button
                type="submit"
                disabled={isLoading || (!selectedAmount && !customAmount)}
                className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  `Donate ${getFinalAmount() ? formatCurrency(getFinalAmount()) : ''}`
                )}
              </button>
            </form>

            {/* Campaign Link */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Want to support a specific campaign instead?
              </p>
              <button
                onClick={() => navigate('/campaigns')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm underline"
              >
                Browse our campaigns →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GeneralDonationPage;
