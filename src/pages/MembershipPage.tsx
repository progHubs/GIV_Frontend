/**
 * Membership Page
 * Dedicated page for membership selection and subscription
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  HeartIcon,
  CreditCardIcon,
  UserIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { MembershipTiers } from '../components/membership';
import ModernNavigation from '../components/navigation/ModernNavigation';
import Footer from '../components/layout/Footer';
import { useAuth } from '../features/auth/context/AuthContext';
import { useUserMembership } from '../hooks/useMembership';
import type { MembershipPlan } from '../types/membership';
import { api } from '../lib/api';

const MembershipPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showOneTimeDonation, setShowOneTimeDonation] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showPlanSwitchModal, setShowPlanSwitchModal] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<MembershipPlan | null>(null);

  const { data: userMembership } = useUserMembership();

  // Helper function to safely parse amount (handles Decimal objects from backend)
  const safeParseAmount = (amount: any): number => {
    if (amount === null || amount === undefined) return 0;

    // Handle Decimal objects with structure {s, e, d}
    if (
      typeof amount === 'object' &&
      amount.s !== undefined &&
      amount.e !== undefined &&
      amount.d !== undefined
    ) {
      // Convert Decimal object to number
      const sign = amount.s;
      const digits = amount.d;

      if (!Array.isArray(digits) || digits.length === 0) return 0;

      // For our membership amounts, the digits array already contains the complete number
      // Bronze: digits[0] = 20, Silver: digits[0] = 50, Gold: digits[0] = 100, Platinum: digits[0] = 200
      // No need for complex reconstruction - just use the first element directly
      const result = digits[0] * sign;
      return isNaN(result) ? 0 : result;
    }

    // Handle Decimal objects that have toString method
    if (typeof amount === 'object' && typeof amount.toString === 'function') {
      return parseFloat(amount.toString());
    }
    const parsed = parseFloat(String(amount));
    return isNaN(parsed) ? 0 : parsed;
  };

  // Restore selected plan after login
  useEffect(() => {
    if (isAuthenticated) {
      const savedPlan = sessionStorage.getItem('selectedMembershipPlan');
      if (savedPlan) {
        try {
          const plan = JSON.parse(savedPlan);
          setSelectedPlan(plan);
          sessionStorage.removeItem('selectedMembershipPlan');
          toast.success('Welcome back! Your selected plan has been restored.');
        } catch (error) {
          console.error('Error parsing saved plan:', error);
        }
      }
    }
  }, [isAuthenticated]);

  const handlePlanSelect = (plan: MembershipPlan) => {
    if (!isAuthenticated) {
      toast.error('Please log in to select a membership plan');
      // Store the intended destination and selected plan
      sessionStorage.setItem('redirectAfterLogin', '/membership');
      sessionStorage.setItem('selectedMembershipPlan', JSON.stringify(plan));
      navigate('/auth/login');
      return;
    }
    setSelectedPlan(plan);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    if (!isAuthenticated) {
      toast.error('Please log in to subscribe to a membership plan');
      sessionStorage.setItem('redirectAfterLogin', '/membership');
      sessionStorage.setItem('selectedMembershipPlan', JSON.stringify(selectedPlan));
      navigate('/auth/login');
      return;
    }

    // Check if user has an active membership that is not cancelled or waiting for cancellation
    if (
      userMembership &&
      userMembership.status === 'active' &&
      !userMembership.cancel_at_period_end
    ) {
      console.log('=== ACTIVE MEMBERSHIP DETECTED ===');
      console.log('Current membership:', userMembership.membership_plans?.name);
      console.log('Selected plan:', selectedPlan.name);
      console.log('Current plan ID:', userMembership.membership_plan_id);
      console.log('Selected plan ID:', selectedPlan.id);

      // Check if user is trying to subscribe to the same plan
      if (userMembership.membership_plan_id === selectedPlan.id) {
        toast.error('You are already subscribed to this plan.');
        return;
      }

      // Show confirmation modal before proceeding with plan switch
      console.log('Showing plan switch confirmation modal');
      setPendingPlan(selectedPlan);
      setShowPlanSwitchModal(true);
      return;
    }

    let loadingToast: string | undefined;

    try {
      console.log('=== MEMBERSHIP SUBSCRIPTION START ===');
      console.log('Selected plan:', selectedPlan);
      console.log('Plan ID:', selectedPlan.id);
      console.log('User authenticated:', isAuthenticated);

      // Set loading state immediately
      setIsSubscribing(true);

      // Add loading toast
      loadingToast = toast.loading('Creating your membership subscription...');

      // Create a Stripe Checkout session for the subscription
      const subscriptionData = {
        plan_id: selectedPlan.id,
        success_url: `${window.location.origin}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/membership`,
      };

      console.log('Subscription data:', subscriptionData);

      // Use Stripe Checkout instead of direct subscription
      const result = await api.post('/payments/stripe/membership-session', subscriptionData);
      console.log('=== CHECKOUT SESSION RESULT ===');
      console.log('Full result:', result);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (result?.url) {
        toast.success('Redirecting to secure payment...');
        // Redirect to Stripe Checkout
        window.location.href = result.url;
      } else {
        throw new Error('Failed to create payment session');
      }
    } catch (error: any) {
      console.error('=== MEMBERSHIP SUBSCRIPTION ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);

      // Reset loading state
      setIsSubscribing(false);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Handle specific error cases
      const errorMessage = error.response?.data?.error || error.message;
      const errorCode = error.response?.data?.code;

      if (errorCode === 'ALREADY_SUBSCRIBED_TO_PLAN') {
        toast.error('You are already subscribed to this plan.');
      } else if (
        errorMessage?.includes('already has an active membership') ||
        errorCode === 'ALREADY_SUBSCRIBED'
      ) {
        // This should now be handled proactively, but keep as fallback
        toast.error(
          'You already have an active membership. Please cancel it first or contact support.'
        );
      } else if (errorMessage?.includes('Plan not found')) {
        toast.error('Selected membership plan is not available. Please try another plan.');
      } else if (errorMessage?.includes('payment')) {
        toast.error('Payment processing failed. Please check your payment method and try again.');
      } else if (errorMessage?.includes('Stripe')) {
        toast.error('Payment service is currently unavailable. Please try again later.');
      } else {
        toast.error(errorMessage || 'Failed to subscribe to membership. Please try again.');
      }
    }
  };

  const handlePlanSwitch = async () => {
    if (!pendingPlan) return;

    setShowPlanSwitchModal(false);
    setIsSubscribing(true);

    let loadingToast: string | undefined;

    try {
      // Add loading toast
      loadingToast = toast.loading('Switching your membership plan...');

      // Create a Stripe Checkout session for the new subscription
      const subscriptionData = {
        plan_id: pendingPlan.id,
        success_url: `${window.location.origin}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/membership`,
      };

      // Force plan switch by bypassing the existing membership check
      const result = await api.post('/payments/stripe/membership-session', subscriptionData);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (result?.url) {
        toast.success('Redirecting to secure payment...');
        // Redirect to Stripe Checkout
        window.location.href = result.url;
      } else {
        throw new Error('Failed to create payment session');
      }
    } catch (error: any) {
      console.error('Plan switch error:', error);

      // Reset loading state
      setIsSubscribing(false);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      const errorMessage = error.response?.data?.error || error.message;
      toast.error(errorMessage || 'Failed to switch membership plan. Please try again.');
    }
  };

  const handleOneTimeDonation = () => {
    navigate('/donate');
  };

  // Remove authentication loading check - let everyone see the page

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ModernNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="my-12">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6"
              >
                <HeartIcon className="h-8 w-8 text-white" />
              </motion.div>

              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Become a Donor
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Join our community of dedicated supporters and make a lasting impact through
                recurring donations. Your membership helps us plan and execute our mission more
                effectively.
              </p>
            </div>
          </div>

          {/* Authentication Notice for Unauthenticated Users */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
            >
              <div className="flex items-center gap-3">
                <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                    Ready to Become a Member?
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400">
                    Browse our membership tiers below. You'll need to log in when you're ready to
                    subscribe.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Current Membership Status - Only show for authenticated users */}
          {isAuthenticated && userMembership && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6"
            >
              <div className="flex items-center gap-3">
                <UserIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                    Current Member
                  </h3>
                  <p className="text-green-600 dark:text-green-400">
                    You are currently a {userMembership.membership_plans.tier} member. You can
                    change your plan below.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Membership Options Toggle */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowOneTimeDonation(false)}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                  !showOneTimeDonation
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <HeartIcon className="inline h-4 w-4 mr-2" />
                Become a Member
              </button>
              <button
                onClick={() => setShowOneTimeDonation(true)}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                  showOneTimeDonation
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <CreditCardIcon className="inline h-4 w-4 mr-2" />
                One-Time Donation
              </button>
            </div>
          </div>

          {/* Content */}
          {!showOneTimeDonation ? (
            <>
              {/* Membership Tiers */}
              <MembershipTiers
                onSelectPlan={handlePlanSelect}
                selectedPlanId={selectedPlan?.id}
                billingCycle={billingCycle}
                onBillingCycleChange={setBillingCycle}
                className="mb-8"
              />

              {/* Subscribe Button */}
              {selectedPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <button
                    onClick={handleSubscribe}
                    disabled={isSubscribing}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubscribing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <HeartIcon className="h-5 w-5" />
                        {isAuthenticated
                          ? `Subscribe to ${selectedPlan.tier} - $${safeParseAmount(selectedPlan.amount).toFixed(0)}/${billingCycle === 'monthly' ? 'month' : 'year'}`
                          : `Continue with ${selectedPlan.tier} - $${safeParseAmount(selectedPlan.amount).toFixed(0)}/${billingCycle === 'monthly' ? 'month' : 'year'}`}
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            /* One-Time Donation Option */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <CreditCardIcon className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Make a One-Time Donation
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Prefer to make a single donation? You can support our mission with a one-time
                  contribution to our general fund or choose a specific campaign to support.
                </p>
                <button
                  onClick={handleOneTimeDonation}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CreditCardIcon className="h-5 w-5" />
                  Continue to Donation Form
                </button>
              </div>
            </motion.div>
          )}

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Why Become a Member?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-4">
                  <HeartIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Predictable Impact
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Your recurring donations help us plan and execute long-term programs more
                  effectively.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg mb-4">
                  <UserIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Community
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Join a community of dedicated supporters working together to make a difference.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-4">
                  <CreditCardIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Flexibility
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Change or cancel your membership anytime. No long-term commitments required.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Plan Switch Modal */}
      {showPlanSwitchModal && pendingPlan && userMembership && userMembership.membership_plans && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl"
          >
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Switch Membership Plan
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You currently have an active{' '}
                <strong className="text-gray-900 dark:text-white">
                  {userMembership.membership_plans?.name}
                </strong>{' '}
                membership.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Switching to{' '}
                <strong className="text-blue-600 dark:text-blue-400">{pendingPlan.name}</strong>{' '}
                will:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>
                  <strong>Deactivate</strong> your current {userMembership.membership_plans?.name}{' '}
                  membership immediately
                </li>
                <li>
                  <strong>Start</strong> your new {pendingPlan.name} membership right away
                </li>
                <li>
                  <strong>Charge</strong> you for the new plan today (prorated if applicable)
                </li>
                <li>
                  <strong>Update</strong> your billing cycle to the new plan's schedule
                </li>
              </ul>
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> This action cannot be undone. Your current membership
                  benefits will be replaced immediately.
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowPlanSwitchModal(false);
                  setPendingPlan(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePlanSwitch}
                disabled={isSubscribing}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubscribing ? 'Processing...' : 'Switch Plan'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MembershipPage;
