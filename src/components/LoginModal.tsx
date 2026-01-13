import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Loader2, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFormValidation } from '../hooks/useFormValidation';
import { useToast, getErrorMessage } from '../contexts/ToastContext';
import { OtpVerificationModal } from './OtpVerificationModal';

// Google Icon SVG
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignup: () => void;
  onLoginSuccess?: () => void;
}

export function LoginModal({
  isOpen,
  onClose,
  onOpenSignup,
  onLoginSuccess
}: LoginModalProps) {
  const toast = useToast();
  const {
    login,
    loginWithGoogle,
    isLoading,
    error,
    clearError
  } = useAuth();

  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  // Memoize form config
  const initialValues = useMemo(() => ({
    email: '',
    password: ''
  }), []);

  const validationRules = useMemo(() => ({
    email: { required: true, email: true },
    password: { required: true }
  }), []);

  const {
    values,
    errors: formErrors,
    handleChange,
    handleSubmit,
    setValues
  } = useFormValidation(initialValues, validationRules);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setView('login');
      setShowOtpModal(false);
      setPendingEmail('');
      clearError();
      setValues(initialValues);
    }
  }, [isOpen, clearError, setValues, initialValues]);

  const onSubmit = useCallback(async (formData: typeof values) => {
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.requiresVerification) {
        // Show OTP modal for verification
        setPendingEmail(result.email || formData.email);
        setShowOtpModal(true);
        toast.info('Please verify your email to continue', 'Verification Required');
      } else {
        toast.success('Welcome back!', 'Login Successful');
        onClose();
        onLoginSuccess?.();
      }
    } catch (err: any) {
      // If requires verification, show OTP modal
      if (err.message?.includes('verify')) {
        setPendingEmail(formData.email);
        setShowOtpModal(true);
      } else {
        toast.error(getErrorMessage(err), 'Login Failed');
      }
    }
  }, [login, toast, onClose, onLoginSuccess]);

  const handleOtpSuccess = useCallback(() => {
    toast.success('Email verified! Welcome back.', 'Success');
    setShowOtpModal(false);
    onClose();
    onLoginSuccess?.();
  }, [toast, onClose, onLoginSuccess]);

  const handleGoogleLogin = () => {
    loginWithGoogle('seeker');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !showOtpModal && (
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
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    {view === 'forgot' ? (
                      <button
                        onClick={() => setView('login')}
                        className="p-2 hover:bg-bg-tertiary rounded-full transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5 text-text-tertiary" />
                      </button>
                    ) : (
                      <div />
                    )}
                    <h2 className="font-display text-2xl font-bold text-text-primary">
                      {view === 'login' ? 'Welcome Back' : 'Reset Password'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-full transition-colors">
                      <X className="w-5 h-5 text-text-tertiary" />
                    </button>
                  </div>

                  {view === 'login' ? (
                    /* Login Form */
                    <>
                      <button
                        onClick={handleGoogleLogin}
                        className="w-full py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-xl transition-all flex items-center justify-center gap-3 border border-gray-200 mb-4"
                      >
                        <GoogleIcon />
                        Continue with Google
                      </button>

                      <div className="flex items-center gap-4 my-5">
                        <div className="flex-1 h-px bg-border-color" />
                        <span className="text-text-tertiary text-sm">or sign in with email</span>
                        <div className="flex-1 h-px bg-border-color" />
                      </div>

                      {error && (
                        <div className="mb-4 flex items-center gap-2 text-danger text-sm bg-danger/10 p-3 rounded-lg">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {error}
                        </div>
                      )}

                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                            <input
                              type="email"
                              value={values.email}
                              onChange={(e) => handleChange('email', e.target.value)}
                              placeholder="Enter your email"
                              className="w-full pl-10 pr-4 py-3 bg-bg-tertiary border border-border-color rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-text-primary placeholder:text-text-tertiary"
                            />
                          </div>
                          {formErrors.email && <p className="text-danger text-xs mt-1">{formErrors.email}</p>}
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-medium text-text-secondary">Password</label>
                            <button
                              type="button"
                              onClick={() => setView('forgot')}
                              className="text-sm text-primary hover:underline"
                            >
                              Forgot?
                            </button>
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                            <input
                              type="password"
                              value={values.password}
                              onChange={(e) => handleChange('password', e.target.value)}
                              placeholder="Enter your password"
                              className="w-full pl-10 pr-4 py-3 bg-bg-tertiary border border-border-color rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-text-primary placeholder:text-text-tertiary"
                            />
                          </div>
                          {formErrors.password && <p className="text-danger text-xs mt-1">{formErrors.password}</p>}
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            'Sign In'
                          )}
                        </button>
                      </form>

                      <p className="text-center text-text-secondary mt-6">
                        Don't have an account?{' '}
                        <button onClick={onOpenSignup} className="text-primary hover:underline font-semibold">
                          Create One
                        </button>
                      </p>
                    </>
                  ) : (
                    /* Forgot Password Form */
                    <>
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <KeyRound className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-text-secondary text-sm">
                          Enter your email and we'll send you a code to reset your password.
                        </p>
                      </div>

                      {error && (
                        <div className="mb-4 flex items-center gap-2 text-danger text-sm bg-danger/10 p-3 rounded-lg">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {error}
                        </div>
                      )}

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          // Send password reset OTP
                          toast.info('Password reset feature coming soon!', 'Coming Soon');
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                            <input
                              type="email"
                              value={values.email}
                              onChange={(e) => handleChange('email', e.target.value)}
                              placeholder="Enter your email"
                              className="w-full pl-10 pr-4 py-3 bg-bg-tertiary border border-border-color rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-text-primary placeholder:text-text-tertiary"
                            />
                          </div>
                          {formErrors.email && <p className="text-danger text-xs mt-1">{formErrors.email}</p>}
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            'Send Reset Code'
                          )}
                        </button>
                      </form>

                      <p className="text-center text-text-secondary mt-6">
                        Remember your password?{' '}
                        <button onClick={() => setView('login')} className="text-primary hover:underline font-semibold">
                          Back to Login
                        </button>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
          onClose();
        }}
        email={pendingEmail}
        type="email_verification"
        onSuccess={handleOtpSuccess}
      />
    </>
  );
}
