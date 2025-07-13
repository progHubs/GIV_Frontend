/**
 * Donation Cancelled Page
 * Displays message when user cancels payment
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider } from '../../theme';
import ModernNavigation from '../../components/navigation/ModernNavigation';
import Footer from '../../components/layout/Footer';
import { usePaymentParams } from '../../hooks/useStripe';
import { useCampaign } from '../../hooks/useCampaigns';

const DonationCancelled: React.FC = () => {
  const navigate = useNavigate();
  const { campaignId, isCancelled } = usePaymentParams();
  
  // Fetch campaign data if available
  const { data: campaign } = useCampaign(campaignId || '');

  // Redirect if not a cancelled page
  React.useEffect(() => {
    if (!isCancelled) {
      navigate('/campaigns', { replace: true });
    }
  }, [isCancelled, navigate]);

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
              {/* Cancelled Icon */}
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              {/* Cancelled Message */}
              <h1 className="text-3xl font-bold text-theme-primary mb-4">
                Donation Cancelled
              </h1>
              <p className="text-lg text-theme-muted mb-8">
                Your payment was cancelled. No charges were made to your account.
              </p>
            </motion.div>

            {/* Campaign Info */}
            {campaign && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme mb-8"
              >
                <div className="flex items-center space-x-4">
                  {campaign.image_url && (
                    <img
                      src={campaign.image_url}
                      alt={campaign.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-theme-primary mb-1">
                      {campaign.title}
                    </h3>
                    <p className="text-theme-muted text-sm line-clamp-2">
                      {campaign.description}
                    </p>
                  </div>
                </div>

                {/* Campaign Progress */}
                <div className="mt-4 pt-4 border-t border-theme">
                  <div className="flex justify-between text-sm text-theme-muted mb-2">
                    <span>Progress</span>
                    <span>{campaign.progress_percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(campaign.progress_percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-theme-muted">
                      ${parseFloat(campaign.current_amount).toLocaleString()} raised
                    </span>
                    <span className="text-theme-muted">
                      ${parseFloat(campaign.goal_amount).toLocaleString()} goal
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reasons and Encouragement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-50 rounded-2xl p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                We Understand
              </h3>
              <p className="text-blue-800 mb-4">
                Sometimes things don't go as planned. Whether you had second thoughts, 
                encountered a technical issue, or simply need more time to decide, 
                we completely understand.
              </p>
              <div className="space-y-2 text-blue-700">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">No charges were made</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Your information is secure</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">You can try again anytime</span>
                </div>
              </div>
            </motion.div>

            {/* Alternative Ways to Help */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme mb-8"
            >
              <h3 className="text-lg font-semibold text-theme-primary mb-4">
                Other Ways to Help
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-theme-background rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span className="font-medium text-theme-primary">Share</span>
                  </div>
                  <p className="text-sm text-theme-muted">
                    Help spread awareness by sharing this campaign with friends and family.
                  </p>
                </div>
                <div className="p-4 bg-theme-background rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium text-theme-primary">Volunteer</span>
                  </div>
                  <p className="text-sm text-theme-muted">
                    Consider volunteering your time and skills to support our mission.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {campaign && (
                <Link
                  to={`/campaigns/${campaign.id}`}
                  className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium text-center"
                >
                  Try Donating Again
                </Link>
              )}
              <Link
                to="/campaigns"
                className="bg-theme-surface text-theme-primary py-3 px-6 rounded-lg hover:bg-theme-hover transition-colors font-medium text-center border border-theme"
              >
                Explore Other Campaigns
              </Link>
              <Link
                to="/"
                className="bg-theme-surface text-theme-primary py-3 px-6 rounded-lg hover:bg-theme-hover transition-colors font-medium text-center border border-theme"
              >
                Back to Home
              </Link>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-center mt-8"
            >
              <p className="text-theme-muted mb-2">
                Encountered a technical issue?
              </p>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Contact Support
              </button>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default DonationCancelled;
