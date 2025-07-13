// Stripe Hooks
// React hooks for Stripe payment integration

import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stripeApi, stripeUtils } from '../lib/stripeApi';
import { donationQueryKeys } from './useDonations';
import type { StripeSessionRequest, DonationTier, PaymentSuccessData } from '../types/donation';

// ==================== STRIPE PAYMENT HOOKS ====================

/**
 * Hook for creating Stripe checkout sessions
 */
export const useStripeCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = useMutation({
    mutationFn: (sessionData: StripeSessionRequest) => stripeApi.createCheckoutSession(sessionData),
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: response => {
      setIsLoading(false);
      // Redirect to Stripe Checkout
      if (response.url) {
        window.location.href = response.url;
      }
    },
    onError: (error: any) => {
      setIsLoading(false);
      setError(error.message || 'Failed to create payment session');
    },
  });

  const redirectToCheckout = useCallback(
    async (sessionData: StripeSessionRequest) => {
      try {
        await createSession.mutateAsync(sessionData);
      } catch (error) {
        console.error('Stripe checkout error:', error);
      }
    },
    [createSession]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    redirectToCheckout,
    isLoading: isLoading || createSession.isPending,
    error: error || createSession.error?.message,
    clearError,
  };
};

/**
 * Hook for one-time donations
 */
export const useOneTimeDonation = () => {
  const { redirectToCheckout, isLoading, error, clearError } = useStripeCheckout();

  const donate = useCallback(
    async (campaignId: string, amount: number) => {
      // Validate amount
      const validation = stripeUtils.validateDonationAmount(amount);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      await redirectToCheckout({
        campaign_id: campaignId,
        amount,
        recurring: false,
      });
    },
    [redirectToCheckout]
  );

  return {
    donate,
    isLoading,
    error,
    clearError,
  };
};

/**
 * Hook for recurring donations with tiers
 */
export const useRecurringDonation = () => {
  const { redirectToCheckout, isLoading, error, clearError } = useStripeCheckout();

  const donateWithTier = useCallback(
    async (campaignId: string, tier: DonationTier) => {
      await redirectToCheckout({
        campaign_id: campaignId,
        tier,
        recurring: true,
      });
    },
    [redirectToCheckout]
  );

  const donateWithAmount = useCallback(
    async (campaignId: string, amount: number) => {
      // Validate amount
      const validation = stripeUtils.validateDonationAmount(amount);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      await redirectToCheckout({
        campaign_id: campaignId,
        amount,
        recurring: true,
      });
    },
    [redirectToCheckout]
  );

  return {
    donateWithTier,
    donateWithAmount,
    isLoading,
    error,
    clearError,
  };
};

/**
 * Hook for handling payment success
 */
export const usePaymentSuccess = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentSuccessData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const processPaymentSuccess = useCallback(
    async (sessionId: string) => {
      if (!stripeApi.isValidSessionId(sessionId)) {
        setError('Invalid payment session ID');
        return;
      }

      setIsProcessing(true);
      setError(null);

      try {
        const data = await stripeApi.handlePaymentSuccess(sessionId);
        setPaymentData(data);

        // Invalidate relevant queries to refresh data
        queryClient.invalidateQueries({ queryKey: donationQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: donationQueryKeys.donors.all });

        // Invalidate campaign-specific data if available
        if (data.campaign_id) {
          queryClient.invalidateQueries({
            queryKey: donationQueryKeys.campaignDonations(data.campaign_id),
          });
        }
      } catch (error: any) {
        setError(error.message || 'Failed to process payment success');
      } finally {
        setIsProcessing(false);
      }
    },
    [queryClient]
  );

  const clearData = useCallback(() => {
    setPaymentData(null);
    setError(null);
  }, []);

  return {
    processPaymentSuccess,
    paymentData,
    isProcessing,
    error,
    clearData,
  };
};

/**
 * Hook for donation form state management
 */
export const useDonationForm = (campaignId: string) => {
  const [formData, setFormData] = useState({
    amount: null as number | null,
    customAmount: '',
    donationType: 'one_time' as 'one_time' | 'recurring',
    selectedTier: null as DonationTier | null,
    notes: '',
  });

  const {
    donate: oneTimeDonate,
    isLoading: oneTimeLoading,
    error: oneTimeError,
  } = useOneTimeDonation();
  const {
    donateWithTier,
    donateWithAmount,
    isLoading: recurringLoading,
    error: recurringError,
  } = useRecurringDonation();

  const updateFormData = useCallback((updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const getFinalAmount = useCallback((): number => {
    if (formData.selectedTier && formData.donationType === 'recurring') {
      return stripeUtils.getTierAmount(formData.selectedTier);
    }
    if (formData.amount) {
      return formData.amount;
    }
    if (formData.customAmount) {
      return parseFloat(formData.customAmount);
    }
    return 0;
  }, [formData]);

  const validateForm = useCallback((): { isValid: boolean; error?: string } => {
    const amount = getFinalAmount();

    if (amount <= 0) {
      return { isValid: false, error: 'Please enter a valid donation amount' };
    }

    return stripeUtils.validateDonationAmount(amount);
  }, [getFinalAmount]);

  const submitDonation = useCallback(async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const amount = getFinalAmount();

    if (formData.donationType === 'one_time') {
      await oneTimeDonate(campaignId, amount);
    } else {
      // For recurring donations, prefer tier if selected
      if (formData.selectedTier) {
        await donateWithTier(campaignId, formData.selectedTier);
      } else {
        await donateWithAmount(campaignId, amount);
      }
    }
  }, [
    validateForm,
    getFinalAmount,
    formData.donationType,
    formData.selectedTier,
    campaignId,
    oneTimeDonate,
    donateWithTier,
    donateWithAmount,
  ]);

  const resetForm = useCallback(() => {
    setFormData({
      amount: null,
      customAmount: '',
      donationType: 'one_time',
      selectedTier: null,
      notes: '',
    });
  }, []);

  const isLoading = oneTimeLoading || recurringLoading;
  const error = oneTimeError || recurringError;

  return {
    formData,
    updateFormData,
    getFinalAmount,
    validateForm,
    submitDonation,
    resetForm,
    isLoading,
    error,
  };
};

/**
 * Hook for URL parameter parsing (payment success/failure pages)
 */
export const usePaymentParams = () => {
  const params = stripeUtils.parsePaymentParams();

  return {
    sessionId: params.sessionId,
    campaignId: params.campaignId,
    isSuccess: params.success,
    isCancelled: params.cancelled,
    hasParams: !!(params.sessionId || params.campaignId),
  };
};

/**
 * Hook for Stripe utilities
 */
export const useStripeUtils = () => {
  return {
    formatCurrency: stripeUtils.formatCurrency,
    getTierColor: stripeUtils.getTierColor,
    getTierAmount: stripeUtils.getTierAmount,
    validateDonationAmount: stripeUtils.validateDonationAmount,
    formatAmountForStripe: stripeUtils.formatAmountForStripe,
    formatAmountFromStripe: stripeUtils.formatAmountFromStripe,
  };
};
