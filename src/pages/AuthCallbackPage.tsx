import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import apiClient from '../lib/api-client';
import { useToast } from '../contexts/ToastContext';

interface AuthCallbackPageProps {
  onNavigate: (page: string) => void;
  onAuthSuccess: (user: any, token: string) => void;
}

export function AuthCallbackPage({ onNavigate, onAuthSuccess }: AuthCallbackPageProps) {
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Prevent infinite loops - only process once
  const hasProcessed = useRef(false);

  useEffect(() => {
    // If already processed, don't do anything
    if (hasProcessed.current) {
      return;
    }

    const handleCallback = async () => {
      // Mark as processed immediately
      hasProcessed.current = true;

      const token = searchParams.get('token');
      const role = searchParams.get('role');
      const error = searchParams.get('error');

      if (error) {
        const decodedError = decodeURIComponent(error);
        setErrorMessage(decodedError);
        setStatus('error');
        toast.error(decodedError, 'Authentication Failed');
        
        // Redirect to landing page after 3 seconds
        setTimeout(() => {
          onNavigate('landing');
        }, 3000);
        return;
      }

      if (token) {
        try {
          // Store token
          apiClient.setToken(token);
          
          // Fetch user data
          const user = await apiClient.getCurrentUser();
          
          setStatus('success');
          
          // Show success toast only once
          toast.success(`Welcome to Vilanow!`, 'Login Successful');
          
          // Notify parent of successful auth
          onAuthSuccess(user, token);
          
          // Redirect based on role after 1.5 seconds
          setTimeout(() => {
            if (user.role === 'agent') {
              // Check if agent needs KYC
              if (user.kycStatus === 'unverified') {
                onNavigate('kyc-onboarding');
              } else {
                onNavigate('dashboard');
              }
            } else {
              // Seeker goes to dashboard
              onNavigate('dashboard');
            }
          }, 1500);
        } catch (err: any) {
          console.error('Auth callback error:', err);
          const errMsg = err.message || 'Failed to complete authentication';
          setErrorMessage(errMsg);
          setStatus('error');
          toast.error(errMsg, 'Authentication Failed');
          
          // Redirect to landing after 3 seconds
          setTimeout(() => {
            onNavigate('landing');
          }, 3000);
        }
      } else {
        const errMsg = 'No authentication token received';
        setErrorMessage(errMsg);
        setStatus('error');
        toast.error(errMsg, 'Authentication Failed');
        
        // Redirect to landing after 3 seconds
        setTimeout(() => {
          onNavigate('landing');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, toast, onNavigate, onAuthSuccess]); // Include all dependencies

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-bg-secondary rounded-2xl border border-border-color p-8 max-w-md w-full text-center"
      >
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">
              Completing Sign In...
            </h2>
            <p className="text-text-secondary">
              Please wait while we set up your account.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-8 h-8 text-success" />
            </motion.div>
            <h2 className="text-xl font-bold text-text-primary mb-2">
              Welcome to Vilanow! 🎉
            </h2>
            <p className="text-text-secondary">
              Redirecting you now...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-danger" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">
              Authentication Failed
            </h2>
            <p className="text-text-secondary mb-6">
              {errorMessage}
            </p>
            <button
              onClick={() => onNavigate('landing')}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-black font-bold rounded-xl transition-colors"
            >
              Go to Home
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
