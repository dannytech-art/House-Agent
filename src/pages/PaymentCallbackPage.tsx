import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { apiClient } from '../lib/api-client';

export function PaymentCallbackPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');
  const [newBalance, setNewBalance] = useState<number | null>(null);
  const [creditsAdded, setCreditsAdded] = useState<number | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const reference = urlParams.get('reference') || urlParams.get('trxref');
      
      if (!reference) {
        setStatus('error');
        setMessage('No payment reference found. Please try again.');
        return;
      }

      try {
        const result = await apiClient.verifyPayment(reference);
        
        if (result.status === 'completed') {
          setStatus('success');
          setMessage('Payment successful!');
          setNewBalance(result.newBalance);
          setCreditsAdded(result.credits);
        } else {
          setStatus('error');
          setMessage(`Payment ${result.status}. Please try again or contact support.`);
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to verify payment. Please contact support.');
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4 pb-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-bg-primary rounded-2xl border border-border-color shadow-lg p-8 max-w-md w-full text-center"
      >
        {status === 'loading' && (
          <>
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-bg-tertiary rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">
              Verifying Payment
            </h2>
            <p className="text-text-secondary">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-success" />
            </motion.div>
            <h2 className="text-xl font-bold text-text-primary mb-2">
              {message} 🎉
            </h2>
            {creditsAdded && (
              <p className="text-lg text-success font-bold mb-2">
                +{creditsAdded} credits added
              </p>
            )}
            {newBalance !== null && (
              <p className="text-text-secondary mb-6">
                New balance: <span className="font-bold text-text-primary">{newBalance} credits</span>
              </p>
            )}
            <button
              onClick={() => onNavigate('wallet')}
              className="w-full py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all"
            >
              Go to Wallet
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-danger" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">
              Payment Failed
            </h2>
            <p className="text-text-secondary mb-6">{message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => onNavigate('wallet')}
                className="flex-1 py-3 bg-bg-tertiary hover:bg-bg-primary text-text-primary font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
              <button
                onClick={() => onNavigate('wallet')}
                className="flex-1 py-3 bg-primary hover:bg-primary/90 text-black font-bold rounded-xl transition-colors"
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

