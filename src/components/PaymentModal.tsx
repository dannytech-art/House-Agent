import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, ShieldCheck, Smartphone, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { CreditBundle } from '../types';
import { apiClient } from '../lib/api-client';
import { useAuth } from '../hooks/useAuth';

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => { openIframe: () => void };
    };
  }
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  metadata?: Record<string, any>;
  callback: (response: { reference: string; status: string }) => void;
  onClose: () => void;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bundle: CreditBundle | null;
  onSuccess: (transactionId: string) => void;
}

// Paystack public key - in production, this should come from environment variables
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

export function PaymentModal({
  isOpen,
  onClose,
  bundle,
  onSuccess
}: PaymentModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'method' | 'processing' | 'verifying' | 'success' | 'error'>('method');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Load Paystack script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => setPaystackLoaded(true);
      document.body.appendChild(script);
    } else {
      setPaystackLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStep('method');
      setErrorMessage('');
      setPaymentReference(null);
    }
  }, [isOpen]);

  const handlePaystackPayment = useCallback(async () => {
    if (!bundle || !user) {
      setErrorMessage('Please login to make a purchase');
      setStep('error');
      return;
    }

    if (!paystackLoaded || !window.PaystackPop) {
      setErrorMessage('Payment gateway is still loading. Please try again.');
      return;
    }

    setStep('processing');

    try {
      // Initialize payment on backend - only bundleId and callback_url needed
      const initResponse = await apiClient.initializePayment({
        bundleId: bundle.id,
        callback_url: window.location.origin + '/payment/callback',
      });

      const reference = initResponse.reference;
      setPaymentReference(reference);

      // Open Paystack popup
      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: (initResponse.bundle?.price || bundle.price) * 100, // Paystack expects amount in kobo
        currency: 'NGN',
        ref: reference,
        metadata: {
          bundle_id: bundle.id,
          credits: initResponse.bundle?.totalCredits || bundle.credits,
          custom_fields: [
            {
              display_name: 'Credits',
              variable_name: 'credits',
              value: (initResponse.bundle?.totalCredits || bundle.credits).toString(),
            },
          ],
        },
        callback: async (response) => {
          // Payment completed on Paystack side
          setStep('verifying');
          
          try {
            // Verify payment on backend
            const verifyResponse = await apiClient.verifyPayment(response.reference);
            
            // API returns status: 'completed' | 'failed' | 'pending'
            if (verifyResponse.status === 'completed') {
              setStep('success');
              onSuccess(response.reference);
              
              // Auto close after showing success
              setTimeout(() => {
                onClose();
              }, 2500);
            } else {
              setErrorMessage('Payment verification failed. Status: ' + verifyResponse.status);
              setStep('error');
            }
          } catch (error: any) {
            console.error('Verification error:', error);
            setErrorMessage(error.message || 'Failed to verify payment. Please contact support.');
            setStep('error');
          }
        },
        onClose: () => {
          // User closed the popup without completing payment
          if (step !== 'success' && step !== 'verifying') {
            setStep('method');
          }
        },
      });

      handler.openIframe();
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      setErrorMessage(error.message || 'Failed to initialize payment. Please try again.');
      setStep('error');
    }
  }, [bundle, user, paystackLoaded, onSuccess, onClose, step]);

  const handleBankTransfer = async () => {
    if (!bundle || !user) {
      setErrorMessage('Please login to make a purchase');
      setStep('error');
      return;
    }

    setStep('processing');

    try {
      // Initialize payment for bank transfer
      const initResponse = await apiClient.initializePayment({
        bundleId: bundle.id,
        callback_url: window.location.origin + '/payment/callback',
      });

      // For bank transfer, redirect to Paystack's authorization URL
      window.open(initResponse.authorizationUrl, '_blank');
      
      setPaymentReference(initResponse.reference);
      
      // Show instructions
      setStep('method');
      setErrorMessage('');
    } catch (error: any) {
      console.error('Bank transfer initialization error:', error);
      setErrorMessage(error.message || 'Failed to generate bank transfer details. Please try again.');
      setStep('error');
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'card') {
      handlePaystackPayment();
    } else {
      handleBankTransfer();
    }
  };

  if (!bundle) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-bg-secondary w-full max-w-md rounded-2xl border border-primary/30 shadow-2xl overflow-hidden pointer-events-auto gold-glow">
              {/* Method Selection */}
              {step === 'method' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="font-display text-xl font-bold text-text-primary">
                        Secure Payment
                      </h2>
                      <p className="text-sm text-text-secondary">
                        Purchasing {bundle.credits.toLocaleString()} Credits
                        {bundle.bonus > 0 && (
                          <span className="text-success ml-1">+{bundle.bonus} bonus</span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-bg-tertiary rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-text-tertiary" />
                    </button>
                  </div>

                  {/* Amount Card */}
                  <div className="mb-6 p-4 bg-bg-primary rounded-xl border border-border-color">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-text-secondary">Amount to Pay</span>
                      <span className="text-2xl font-bold text-text-primary">
                        ₦{bundle.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-success bg-success/10 px-2 py-1 rounded w-fit">
                      <ShieldCheck className="w-3 h-3" />
                      Secured by Paystack
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-3 mb-6">
                    <p className="text-sm font-medium text-text-secondary">
                      Select Payment Method
                    </p>

                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-primary bg-primary/5'
                          : 'border-border-color hover:border-primary/50'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          paymentMethod === 'card'
                            ? 'bg-primary text-black'
                            : 'bg-bg-tertiary text-text-secondary'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-text-primary">Pay with Card</p>
                        <p className="text-xs text-text-tertiary">
                          Visa, Mastercard, Verve
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('transfer')}
                      className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                        paymentMethod === 'transfer'
                          ? 'border-primary bg-primary/5'
                          : 'border-border-color hover:border-primary/50'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          paymentMethod === 'transfer'
                            ? 'bg-primary text-black'
                            : 'bg-bg-tertiary text-text-secondary'
                        }`}
                      >
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-text-primary">Bank Transfer</p>
                        <p className="text-xs text-text-tertiary">
                          Pay via bank transfer or USSD
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={handlePayment}
                    disabled={!paystackLoaded}
                    className="w-full py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 gold-glow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4" />
                    {!paystackLoaded ? 'Loading...' : `Pay ₦${bundle.price.toLocaleString()}`}
                  </button>

                  {/* Security Note */}
                  <p className="text-xs text-text-tertiary text-center mt-4">
                    Your payment is processed securely by Paystack.
                    <br />
                    We never store your card details.
                  </p>
                </div>
              )}

              {/* Processing */}
              {step === 'processing' && (
                <div className="p-12 text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-bg-tertiary rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                    <Lock className="absolute inset-0 m-auto w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    Initializing Payment
                  </h3>
                  <p className="text-text-secondary">
                    Please wait while we connect you to Paystack...
                  </p>
                </div>
              )}

              {/* Verifying */}
              {step === 'verifying' && (
                <div className="p-12 text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-bg-tertiary rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-success rounded-full border-t-transparent animate-spin"></div>
                    <ShieldCheck className="absolute inset-0 m-auto w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    Verifying Payment
                  </h3>
                  <p className="text-text-secondary">
                    Almost done! Confirming your transaction...
                  </p>
                </div>
              )}

              {/* Success */}
              {step === 'success' && (
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="w-10 h-10 text-success" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    Payment Successful! 🎉
                  </h3>
                  <p className="text-text-secondary mb-2">
                    {bundle.credits.toLocaleString()} credits have been added to your wallet.
                  </p>
                  {bundle.bonus > 0 && (
                    <p className="text-sm text-success">
                      +{bundle.bonus} bonus credits included!
                    </p>
                  )}
                  {paymentReference && (
                    <p className="text-xs text-text-tertiary mt-4">
                      Reference: {paymentReference}
                    </p>
                  )}
                </div>
              )}

              {/* Error */}
              {step === 'error' && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-danger" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    Payment Failed
                  </h3>
                  <p className="text-text-secondary mb-4">
                    {errorMessage || 'Something went wrong with your payment.'}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 py-3 bg-bg-tertiary hover:bg-bg-primary text-text-primary font-medium rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setStep('method')}
                      className="flex-1 py-3 bg-primary hover:bg-primary/90 text-black font-bold rounded-xl transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                  {paymentReference && (
                    <p className="text-xs text-text-tertiary mt-4">
                      Reference: {paymentReference}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
