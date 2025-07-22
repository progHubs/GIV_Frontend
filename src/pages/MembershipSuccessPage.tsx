/**
 * Membership Success Page
 * Shown after successful membership subscription
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';
import { ThemeProvider } from '../theme';
import ModernNavigation from '../components/navigation/ModernNavigation';
import Footer from '../components/layout/Footer';
import { toast } from 'react-hot-toast';
import { api } from '../lib/api';
import { membershipQueryKeys } from '../hooks/useMembership';

const MembershipSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [membershipData, setMembershipData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const processPaymentSuccess = async () => {
      console.log('🔍 Session ID from URL:', sessionId);
      console.log('🔍 All URL params:', Object.fromEntries(searchParams.entries()));

      if (!sessionId) {
        setError('Invalid payment session');
        setIsProcessing(false);
        return;
      }

      try {
        console.log(
          '🔍 Calling verification endpoint:',
          `/payments/stripe/membership-session/${sessionId}`
        );
        // Verify the membership payment with backend
        const data = await api.get(`/payments/stripe/membership-session/${sessionId}`);

        if (data.success) {
          setMembershipData(data.data);
          toast.success('Welcome to your new membership!');

          // Invalidate membership queries to refresh user data
          queryClient.invalidateQueries({ queryKey: membershipQueryKeys.userMembership() });
          queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        } else {
          throw new Error(data.error || 'Failed to verify payment');
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);
        console.error('Error response:', error.response);
        console.error('Error data:', error.response?.data);
        const errorMessage =
          error.response?.data?.error || error.message || 'Failed to verify payment';
        setError(errorMessage);
        toast.error('There was an issue verifying your payment. Please contact support.');
      } finally {
        setIsProcessing(false);
      }
    };

    processPaymentSuccess();
  }, [sessionId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  if (isProcessing) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-theme-background">
          <ModernNavigation />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-primary mx-auto mb-4"></div>
              <p className="text-theme-muted">Processing your membership...</p>
            </div>
          </div>
          <Footer />
        </div>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-theme-background">
          <ModernNavigation />
          <div className="max-w-2xl mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
              <h1 className="text-3xl font-bold text-theme-primary mb-4">
                Payment Verification Failed
              </h1>
              <p className="text-theme-muted mb-8">{error}</p>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/membership')}
                  className="w-full bg-theme-primary text-white py-3 px-6 rounded-lg hover:bg-theme-primary/90 transition-colors"
                >
                  Back to Membership
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full bg-theme-surface text-theme-primary py-3 px-6 rounded-lg border border-theme hover:bg-theme-surface/80 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </motion.div>
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

        <div className="max-w-4xl mx-auto px-4 py-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Success Icon */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-theme-primary mb-4">
                Welcome to Your Membership!
              </h1>
              <p className="text-xl text-theme-muted">
                Your subscription has been successfully activated
              </p>
            </motion.div>

            {/* Membership Details */}
            {membershipData && (
              <motion.div
                variants={itemVariants}
                className="bg-theme-surface rounded-2xl p-8 mb-8 shadow-lg border border-theme"
              >
                <div className="flex items-center justify-center mb-6">
                  <SparklesIcon className="w-8 h-8 text-yellow-500 mr-3" />
                  <h2 className="text-2xl font-bold text-theme-primary">
                    {membershipData.membership?.tier?.toUpperCase() || 'NEW'} Member
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h3 className="font-semibold text-theme-primary mb-2">Membership Details</h3>
                    <ul className="space-y-2 text-theme-muted">
                      <li>
                        <strong>Plan:</strong> {membershipData.membership?.plan_name || 'N/A'}
                      </li>
                      <li>
                        <strong>Tier:</strong> {membershipData.membership?.tier || 'N/A'}
                      </li>
                      <li>
                        <strong>Status:</strong> {membershipData.membership?.status || 'Active'}
                      </li>
                      <li>
                        <strong>Payment:</strong> {membershipData.payment_status || 'Completed'}
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-theme-primary mb-2">Next Steps</h3>
                    <ul className="space-y-2 text-theme-muted">
                      <li>✓ Check your email for confirmation</li>
                      <li>✓ Access your member dashboard</li>
                      <li>✓ Explore exclusive benefits</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center"
            >
              <button
                onClick={() => navigate('/profile')}
                className="w-full sm:w-auto bg-theme-primary text-white py-3 px-8 rounded-lg hover:bg-theme-primary/90 transition-colors font-semibold"
              >
                View My Profile
              </button>
              <button
                onClick={() => navigate('/campaigns')}
                className="w-full sm:w-auto bg-theme-surface text-theme-primary py-3 px-8 rounded-lg border border-theme hover:bg-theme-surface/80 transition-colors font-semibold"
              >
                Explore Campaigns
              </button>
            </motion.div>

            {/* Thank You Message */}
            <motion.div
              variants={itemVariants}
              className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
            >
              <h3 className="text-lg font-semibold text-theme-primary mb-2">
                Thank You for Your Support!
              </h3>
              <p className="text-theme-muted">
                Your membership helps us continue our mission to provide healthcare, education, and
                emergency aid to Ethiopian communities. Together, we're making a real difference.
              </p>
            </motion.div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default MembershipSuccessPage;
