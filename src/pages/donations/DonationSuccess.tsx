/**
 * Donation Success Page
 * Displays success message after successful payment
 */

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider } from '../../theme';
import ModernNavigation from '../../components/navigation/ModernNavigation';
import Footer from '../../components/layout/Footer';
import { usePaymentSuccess, usePaymentParams, useStripeUtils } from '../../hooks/useStripe';
import { useCampaign } from '../../hooks/useCampaigns';
import { useAuth } from '../../hooks/useAuth';

const DonationSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId, campaignId, isSuccess } = usePaymentParams();
  const { processPaymentSuccess, paymentData, isProcessing, error } = usePaymentSuccess();
  const { formatCurrency } = useStripeUtils();
  const { isAuthenticated } = useAuth();

  // Fetch campaign data if available
  const { data: campaign } = useCampaign(campaignId || '');

  useEffect(() => {
    // Redirect if not a success page or missing session ID
    if (!isSuccess || !sessionId) {
      navigate('/campaigns', { replace: true });
      return;
    }

    // Process payment success
    processPaymentSuccess(sessionId);
  }, [isSuccess, sessionId, processPaymentSuccess, navigate]);

  // Loading state
  if (isProcessing) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-theme-background">
          <ModernNavigation />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-theme-primary mb-2">
                Processing your donation...
              </h2>
              <p className="text-theme-muted">Please wait while we confirm your payment.</p>
            </div>
          </div>
          <Footer />
        </div>
      </ThemeProvider>
    );
  }

  // Error state
  if (error) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-theme-background">
          <ModernNavigation />
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-6"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-red-800 mb-2">Payment Processing Error</h1>
                <p className="text-red-600 mb-6">{error}</p>
                <div className="space-y-3">
                  <Link
                    to="/campaigns"
                    className="block w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Back to Campaigns
                  </Link>
                  <button
                    onClick={() => window.location.reload()}
                    className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
          <Footer />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-theme-background">
        <ModernNavigation />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Success Message */}
              <h1 className="text-3xl font-bold text-theme-primary mb-4">
                Thank You for Your Donation! 🎉
              </h1>
              <p className="text-lg text-theme-muted mb-8">
                Your generous contribution makes a real difference in our mission.
              </p>
            </motion.div>

            {/* Donation Details */}
            {paymentData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme mb-8"
              >
                <h2 className="text-xl font-semibold text-theme-primary mb-4">Donation Details</h2>

                <div className="space-y-3">
                  {/* Amount */}
                  <div className="flex justify-between items-center">
                    <span className="text-theme-muted">Amount:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {paymentData.amount && parseFloat(paymentData.amount) > 0
                        ? formatCurrency(parseFloat(paymentData.amount), paymentData.currency)
                        : 'Processing...'}
                    </span>
                  </div>

                  {/* Show note if amount is not available */}
                  {(!paymentData.amount || parseFloat(paymentData.amount) === 0) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                      <p className="text-yellow-800 text-sm">
                        <strong>Note:</strong> Your payment was successful! The donation amount is
                        being processed and will appear in your donation history shortly.
                      </p>
                    </div>
                  )}

                  {/* Campaign */}
                  {campaign && (
                    <div className="flex justify-between items-center">
                      <span className="text-theme-muted">Campaign:</span>
                      <span className="text-theme-primary font-medium">{campaign.title}</span>
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex justify-between items-center">
                    <span className="text-theme-muted">Status:</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {paymentData.payment_status.charAt(0).toUpperCase() +
                        paymentData.payment_status.slice(1)}
                    </span>
                  </div>

                  {/* Session ID */}
                  <div className="flex justify-between items-center">
                    <span className="text-theme-muted">Transaction:</span>
                    <span className="text-theme-primary font-mono text-sm">
                      {paymentData.session_id.slice(-12)}
                    </span>
                  </div>

                  {/* Receipt */}
                  {paymentData.receipt_url && (
                    <div className="pt-3 border-t border-theme">
                      <a
                        href={paymentData.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download Receipt
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Impact Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-50 rounded-2xl p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Your Impact</h3>
              <p className="text-blue-800 mb-4">
                Your donation will help us continue our important work and make a lasting impact in
                the community. We'll keep you updated on how your contribution is making a
                difference.
              </p>
              <div className="flex items-center text-blue-700">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                Thank you for being part of our mission!
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {campaign && (
                <Link
                  to={`/campaigns/${campaign.id}`}
                  className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium text-center"
                >
                  View Campaign
                </Link>
              )}
              <Link
                to="/campaigns"
                className="bg-theme-surface text-theme-primary py-3 px-6 rounded-lg hover:bg-theme-hover transition-colors font-medium text-center border border-theme"
              >
                Explore More Campaigns
              </Link>
              {isAuthenticated && (
                <Link
                  to="/profile"
                  className="bg-theme-surface text-theme-primary py-3 px-6 rounded-lg hover:bg-theme-hover transition-colors font-medium text-center border border-theme"
                >
                  View My Donations
                </Link>
              )}
            </motion.div>

            {/* Social Sharing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-8"
            >
              <p className="text-theme-muted mb-4">
                Help us spread the word about this important cause
              </p>
              <div className="flex justify-center space-x-4">
                <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </button>
                <button className="bg-blue-800 text-white p-2 rounded-full hover:bg-blue-900 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default DonationSuccess;
