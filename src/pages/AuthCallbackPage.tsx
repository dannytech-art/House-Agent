import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { apiClient } from '../lib/api-client';
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

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const role = searchParams.get('role');
      const error = searchParams.get('error');

      if (error) {
        setErrorMessage(decodeURIComponent(error));
        setStatus('error');
        toast.error(decodeURIComponent(error), 'Authentication Failed');
        return;
      }

      if (token) {
        try {
          // Store token
          apiClient.setToken(token);
          
          // Fetch user data
          const user = await apiClient.getCurrentUser();
          
          setStatus('success');
          toast.success('Welcome to Vilanow!', 'Login Successful');
          
          // Notify parent of successful auth
          onAuthSuccess(user, token);
          
          // Navigate to dashboard after a short delay
          setTimeout(() => {
            onNavigate('dashboard');
          }, 1500);
        } catch (err: any) {
          console.error('Auth callback error:', err);
          setErrorMessage(err.message || 'Failed to complete authentication');
          setStatus('error');
          toast.error('Failed to complete authentication', 'Error');
        }
      } else {
        setErrorMessage('No authentication token received');
        setStatus('error');
        toast.error('No authentication token received', 'Error');
      }
    };

    handleCallback();
  }, [searchParams, onNavigate, onAuthSuccess, toast]);

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
              Redirecting you to your dashboard...
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

