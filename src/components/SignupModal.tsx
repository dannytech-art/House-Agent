import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Briefcase, Loader2, AlertCircle, ArrowLeft, Building2, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFormValidation } from '../hooks/useFormValidation';
import { UserRole } from '../types';
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

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  onSignupSuccess?: () => void;
}

export function SignupModal({
  isOpen,
  onClose,
  onOpenLogin,
  onSignupSuccess
}: SignupModalProps) {
  const toast = useToast();
  const {
    signup,
    loginWithGoogle,
    isLoading,
    error,
    clearError
  } = useAuth();

  const [role, setRole] = useState<UserRole | null>(null);
  const [step, setStep] = useState(1);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  // Memoize form config
  const initialValues = useMemo(() => ({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    agentType: 'semi-direct' as 'direct' | 'semi-direct',
  }), []);

  const validationRules = useMemo(() => ({
    email: { required: true, email: true },
    password: { required: true, minLength: 6 },
    confirmPassword: { required: true, matches: 'password' as const, message: 'Passwords must match' },
    fullName: { required: true },
    phone: { required: true, phone: true }
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
      setRole(null);
      setStep(1);
      setShowOtpModal(false);
      setPendingEmail('');
      clearError();
      setValues(initialValues);
    }
  }, [isOpen, clearError, setValues, initialValues]);

  const onSubmit = useCallback(async (formData: typeof values) => {
    if (!role) return;
    
    try {
      const result = await signup(formData.email, formData.password, role, {
        name: formData.fullName,
        phone: formData.phone,
        agentType: role === 'agent' ? formData.agentType : undefined,
      });
      
      // Always show OTP verification after signup
      setPendingEmail(formData.email);
      setShowOtpModal(true);
      toast.info('Please verify your email to complete registration', 'Check Your Email');
      
    } catch (err: any) {
      // If error is about verification, show OTP modal
      if (err.message?.includes('verify')) {
        setPendingEmail(formData.email);
        setShowOtpModal(true);
      } else {
        toast.error(getErrorMessage(err), 'Signup Failed');
      }
    }
  }, [role, signup, toast]);

  const handleOtpSuccess = useCallback(() => {
    toast.success('Welcome to Vilanow!', 'Account Created');
    setShowOtpModal(false);
    onClose();
    // Navigate to dashboard after successful signup
    onSignupSuccess?.();
  }, [toast, onClose, onSignupSuccess]);

  const handleGoogleSignup = (selectedRole: 'seeker' | 'agent') => {
    loginWithGoogle(selectedRole);
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
        setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setRole(null);
    clearError();
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
              <div className="bg-bg-secondary w-full max-w-md rounded-2xl border border-primary/30 shadow-2xl overflow-hidden pointer-events-auto gold-glow max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    {step > 1 ? (
                      <button
                        onClick={handleBack}
                        className="p-2 hover:bg-bg-tertiary rounded-full transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5 text-text-tertiary" />
                      </button>
                    ) : (
                      <div />
                    )}
                    <h2 className="font-display text-2xl font-bold text-text-primary">
                      {step === 1 ? 'Get Started' : `Join as ${role === 'agent' ? 'Agent' : 'Seeker'}`}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-full transition-colors">
                      <X className="w-5 h-5 text-text-tertiary" />
                    </button>
          </div>

                  {step === 1 ? (
                    /* Role Selection */
                    <div className="space-y-4">
                      <p className="text-center text-text-secondary mb-6">
                        Choose how you want to use Vilanow
                      </p>

                      <button
                        onClick={() => handleRoleSelect('seeker')}
                        className="w-full p-5 rounded-xl border-2 border-border-color hover:border-primary hover:bg-primary/5 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-bg-tertiary rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Search className="w-7 h-7 text-text-secondary group-hover:text-primary" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-bold text-text-primary text-lg">I'm Looking for a Home</h4>
                            <p className="text-sm text-text-tertiary">Find your dream property</p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleRoleSelect('agent')}
                        className="w-full p-5 rounded-xl border-2 border-border-color hover:border-primary hover:bg-primary/5 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-bg-tertiary rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Building2 className="w-7 h-7 text-text-secondary group-hover:text-primary" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-bold text-text-primary text-lg">I'm a Property Agent</h4>
                            <p className="text-sm text-text-tertiary">List and manage properties</p>
                          </div>
                        </div>
        </button>

                      <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-border-color" />
                        <span className="text-text-tertiary text-sm">or continue with</span>
                        <div className="flex-1 h-px bg-border-color" />
          </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleGoogleSignup('seeker')}
                          className="py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-200 text-sm"
                        >
                          <GoogleIcon />
                          Seeker
                        </button>
                        <button
                          onClick={() => handleGoogleSignup('agent')}
                          className="py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-200 text-sm"
                        >
                          <GoogleIcon />
                          Agent
        </button>
      </div>

                      <p className="text-center text-text-secondary mt-6">
                        Already have an account?{' '}
                        <button onClick={onOpenLogin} className="text-primary hover:underline font-semibold">
                          Sign In
                        </button>
                      </p>
                    </div>
                  ) : (
                    /* Signup Form */
                    <>
                      <button
                        onClick={() => handleGoogleSignup(role!)}
                        className="w-full py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-xl transition-all flex items-center justify-center gap-3 border border-gray-200 mb-4"
                      >
                        <GoogleIcon />
                        Continue with Google
                      </button>

                      <div className="flex items-center gap-4 my-5">
                        <div className="flex-1 h-px bg-border-color" />
                        <span className="text-text-tertiary text-sm">or</span>
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
                          <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                            <input
                              type="text"
                              value={values.fullName}
                              onChange={(e) => handleChange('fullName', e.target.value)}
                              placeholder="Enter your full name"
                              className="w-full pl-10 pr-4 py-3 bg-bg-tertiary border border-border-color rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-text-primary placeholder:text-text-tertiary"
                            />
        </div>
                          {formErrors.fullName && <p className="text-danger text-xs mt-1">{formErrors.fullName}</p>}
      </div>

      <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1.5">Email Address</label>
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
                          <label className="block text-sm font-medium text-text-secondary mb-1.5">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                            <input
                              type="tel"
                              value={values.phone}
                              onChange={(e) => handleChange('phone', e.target.value)}
                              placeholder="+234 800 000 0000"
                              className="w-full pl-10 pr-4 py-3 bg-bg-tertiary border border-border-color rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-text-primary placeholder:text-text-tertiary"
                            />
        </div>
                          {formErrors.phone && <p className="text-danger text-xs mt-1">{formErrors.phone}</p>}
      </div>

                        {role === 'agent' && (
            <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Agent Type</label>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => handleChange('agentType', 'direct')}
                                className={`p-3 rounded-xl border-2 text-center transition-all ${
                                  values.agentType === 'direct'
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border-color text-text-secondary hover:border-primary/50'
                                }`}
                              >
                                <Briefcase className="w-5 h-5 mx-auto mb-1" />
                                <p className="font-medium text-sm">Direct</p>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleChange('agentType', 'semi-direct')}
                                className={`p-3 rounded-xl border-2 text-center transition-all ${
                                  values.agentType === 'semi-direct'
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border-color text-text-secondary hover:border-primary/50'
                                }`}
                              >
                                <Building2 className="w-5 h-5 mx-auto mb-1" />
                                <p className="font-medium text-sm">Semi-Direct</p>
                              </button>
            </div>
          </div>
                        )}

            <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                            <input
                              type="password"
                              value={values.password}
                              onChange={(e) => handleChange('password', e.target.value)}
                              placeholder="Create a password (min 6 chars)"
                              className="w-full pl-10 pr-4 py-3 bg-bg-tertiary border border-border-color rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-text-primary placeholder:text-text-tertiary"
                            />
            </div>
                          {formErrors.password && <p className="text-danger text-xs mt-1">{formErrors.password}</p>}
      </div>

                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1.5">Confirm Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                            <input
                              type="password"
                              value={values.confirmPassword}
                              onChange={(e) => handleChange('confirmPassword', e.target.value)}
                              placeholder="Confirm your password"
                              className="w-full pl-10 pr-4 py-3 bg-bg-tertiary border border-border-color rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-text-primary placeholder:text-text-tertiary"
                            />
      </div>
                          {formErrors.confirmPassword && <p className="text-danger text-xs mt-1">{formErrors.confirmPassword}</p>}
                </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Creating Account...
                            </>
                          ) : (
                            'Create Account'
                          )}
                    </button>
                      </form>

                      <p className="text-center text-text-secondary mt-4 text-sm">
                        By signing up, you agree to our{' '}
                        <a href="/terms" className="text-primary hover:underline">Terms</a>
                        {' '}and{' '}
                        <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
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
