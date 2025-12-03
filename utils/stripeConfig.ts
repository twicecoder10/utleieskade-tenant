// Stripe configuration utilities
// This file will be used when Stripe SDK is integrated

export interface StripeConfig {
  publishableKey: string;
  merchantIdentifier?: string; // For Apple Pay
}

// Get Stripe publishable key from environment
export const getStripeConfig = (): StripeConfig => {
  const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
  
  if (!publishableKey) {
    console.warn("Stripe publishable key not found in environment variables");
  }

  return {
    publishableKey,
    merchantIdentifier: process.env.EXPO_PUBLIC_APPLE_MERCHANT_IDENTIFIER,
  };
};

// Payment intent creation payload
export interface PaymentIntentPayload {
  amount: number; // Amount in smallest currency unit (øre for NOK)
  currency: string; // "nok"
  caseId?: string;
  metadata?: {
    assessmentLevel?: string;
    isUrgent?: boolean;
    roomCount?: number;
  };
}

// Payment confirmation payload
export interface PaymentConfirmationPayload {
  paymentIntentId: string;
  caseData: any;
}

// Example usage (when Stripe SDK is installed):
/*
import { initStripe, useStripe } from '@stripe/stripe-react-native';

// Initialize Stripe
const stripeConfig = getStripeConfig();
await initStripe({
  publishableKey: stripeConfig.publishableKey,
  merchantIdentifier: stripeConfig.merchantIdentifier,
});

// Use in component
const { initPaymentSheet, presentPaymentSheet } = useStripe();
*/

