// Stripe API Service
// Handles Stripe payment integration for donations

import { api } from './api';
import type {
  StripeSessionRequest,
  StripeSessionResponse,
  PaymentSuccessData,
  DonationTier,
} from '../types/donation';

// Stripe API endpoints
const STRIPE_ENDPOINTS = {
  createSession: '/payments/stripe/session',
  webhook: '/payments/stripe/webhook', // Not used by frontend
} as const;

/**
 * Stripe API Service
 * Provides methods for Stripe payment integration
 */
export const stripeApi = {
  /**
   * Create a Stripe Checkout Session for donation
   * POST /payments/stripe/session
   */
  createCheckoutSession: async (
    sessionData: StripeSessionRequest
  ): Promise<StripeSessionResponse> => {
    try {
      const response = await api.post<StripeSessionResponse>(
        STRIPE_ENDPOINTS.createSession,
        sessionData
      );

      return response;
    } catch (error: any) {
      // Enhanced error handling for Stripe-specific errors
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to create payment session. Please try again.');
    }
  },

  /**
   * Create one-time donation session
   */
  createOneTimeDonation: async (
    campaignId: string,
    amount: number
  ): Promise<StripeSessionResponse> => {
    return stripeApi.createCheckoutSession({
      campaign_id: campaignId,
      amount,
      recurring: false,
    });
  },

  /**
   * Create recurring donation session with tier
   */
  createRecurringDonation: async (
    campaignId: string,
    tier: DonationTier
  ): Promise<StripeSessionResponse> => {
    return stripeApi.createCheckoutSession({
      campaign_id: campaignId,
      tier,
      recurring: true,
    });
  },

  /**
   * Create recurring donation session with custom amount
   * Note: This might not be supported by backend if only predefined tiers are allowed
   */
  createRecurringDonationCustom: async (
    campaignId: string,
    amount: number
  ): Promise<StripeSessionResponse> => {
    return stripeApi.createCheckoutSession({
      campaign_id: campaignId,
      amount,
      recurring: true,
    });
  },

  /**
   * Redirect to Stripe Checkout
   * This function creates a session and redirects the user
   */
  redirectToCheckout: async (sessionData: StripeSessionRequest): Promise<void> => {
    try {
      const response = await stripeApi.createCheckoutSession(sessionData);

      if (response.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.url;
      } else {
        throw new Error('No checkout URL received from Stripe');
      }
    } catch (error: any) {
      console.error('Stripe checkout error:', error);
      throw error;
    }
  },

  /**
   * Handle successful payment redirect
   * Retrieves payment session details from backend
   */
  handlePaymentSuccess: async (sessionId: string): Promise<PaymentSuccessData> => {
    try {
      // Call backend endpoint to get session details
      const response = await api.get<{
        success: boolean;
        data: {
          session_id: string;
          donation_id?: string;
          campaign_id: string;
          amount: string;
          currency: string;
          payment_status: string;
          receipt_url?: string;
        };
      }>(`/payments/stripe/session/${sessionId}`);

      if (response.success && response.data) {
        return {
          session_id: response.data.session_id,
          donation_id: response.data.donation_id,
          campaign_id: response.data.campaign_id,
          amount: response.data.amount,
          currency: response.data.currency,
          payment_status: response.data.payment_status as any,
          receipt_url: response.data.receipt_url,
        };
      } else {
        throw new Error('Invalid response from payment session endpoint');
      }
    } catch (error: any) {
      console.error('Payment success handling error:', error);

      // Fallback: try to extract basic info from URL if backend call fails
      const urlParams = new URLSearchParams(window.location.search);
      return {
        session_id: sessionId,
        campaign_id: urlParams.get('campaign_id') || '',
        amount: '0', // Will show 0 if we can't get the real amount
        currency: 'USD',
        payment_status: 'completed',
      };
    }
  },

  /**
   * Validate Stripe session ID format
   */
  isValidSessionId: (sessionId: string): boolean => {
    // Stripe session IDs start with 'cs_' for checkout sessions
    return typeof sessionId === 'string' && sessionId.startsWith('cs_');
  },

  /**
   * Get Stripe public key from environment
   */
  getPublicKey: (): string => {
    const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    if (!publicKey) {
      throw new Error('Stripe public key not configured');
    }
    return publicKey;
  },
};

/**
 * Stripe Utilities
 * Helper functions for Stripe integration
 */
export const stripeUtils = {
  /**
   * Format amount for Stripe (convert to cents)
   */
  formatAmountForStripe: (amount: number): number => {
    return Math.round(amount * 100);
  },

  /**
   * Format amount from Stripe (convert from cents)
   */
  formatAmountFromStripe: (amount: number): number => {
    return amount / 100;
  },

  /**
   * Format currency for display
   */
  formatCurrency: (amount: number | string, currency: string = 'USD'): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount);
  },

  /**
   * Get tier color for UI
   */
  getTierColor: (tier: DonationTier): string => {
    const colors = {
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#FFD700',
      platinum: '#E5E4E2',
    };
    return colors[tier] || '#6B7280';
  },

  /**
   * Get tier amount
   */
  getTierAmount: (tier: DonationTier): number => {
    const amounts = {
      bronze: 10,
      silver: 50,
      gold: 100,
      platinum: 250,
    };
    return amounts[tier] || 0;
  },

  /**
   * Validate donation amount
   */
  validateDonationAmount: (amount: number): { isValid: boolean; error?: string } => {
    if (!amount || amount <= 0) {
      return { isValid: false, error: 'Amount must be greater than 0' };
    }

    if (amount < 1) {
      return { isValid: false, error: 'Minimum donation amount is $1' };
    }

    if (amount > 100000) {
      return { isValid: false, error: 'Maximum donation amount is $100,000' };
    }

    return { isValid: true };
  },

  /**
   * Parse URL parameters for payment success/failure
   */
  parsePaymentParams: (): {
    sessionId?: string;
    campaignId?: string;
    success?: boolean;
    cancelled?: boolean;
  } => {
    const urlParams = new URLSearchParams(window.location.search);

    return {
      sessionId: urlParams.get('session_id') || undefined,
      campaignId: urlParams.get('campaign_id') || undefined,
      success: urlParams.has('success') || window.location.pathname.includes('success'),
      cancelled: urlParams.has('cancelled') || window.location.pathname.includes('cancelled'),
    };
  },
};

export default stripeApi;
