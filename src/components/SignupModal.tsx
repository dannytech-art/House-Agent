import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Briefcase, Loader2, AlertCircle, ArrowLeft, Building2, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFormValidation } from '../hooks/useFormValidation';
import { UserRole } from '../types';
import { useToast, getErrorMessage } from '../contexts/ToastContext';

// Google Icon SVG
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export function SignupModal({
  isOpen,
  onClose,
  onOpenLogin
}: SignupModalProps) {
  const toast = useToast();
  const {
    signup,
    loginWithGoogle,
    verifyOtp,
    resendOtp,
    isLoading,
    error,
    clearError,
    pendingVerification
  } = useAuth();

  const [role, setRole] = useState<UserRole | null>(null);
  const [step, setStep] = useState(1);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);

  // Memoize form config to prevent re-renders
  const initialValues = useMemo(() => ({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    agentType: 'semi-direct' as 'direct' | 'semi-direct',
  }), []);

  const validationRules = useMemo(() => ({
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      minLength: 6
    },
    confirmPassword: {
      required: true,
      matches: 'password' as const,
      message: 'Passwords must match'
    },
    fullName: {
      required: true
    },
    phone: {
      required: true,
      phone: true
    }
  }), []);

  const {
    values,
    errors,
    handleChange,
    handleSubmit
  } = useFormValidation(initialValues, validationRules);

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`signup-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`signup-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Check if we need to show OTP input
  useEffect(() => {
    if (pendingVerification?.type === 'email_verification') {
      setShowOtpInput(true);
      setResendTimer(60);
    }
  }, [pendingVerification]);

  const onSubmit = async (formData: typeof values) => {
    if (!role) return;
    
    try {
      const result = await signup(formData.email, formData.password, role, {
        name: formData.fullName,
        phone: formData.phone,
        agentType: role === 'agent' ? formData.agentType : undefined,
      });
      
      if (result.requiresVerification) {
        setShowOtpInput(true);
        setResendTimer(60);
        toast.info('Please verify your email to complete registration', 'Verification Required');
      } else {
        toast.success('Your account has been created!', 'Welcome to Vilanow');
        onClose();
      }
    } catch (err: any) {
      toast.error(getErrorMessage(err), 'Signup Failed');
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code', 'Invalid Code');
      return;
    }

    try {
      await verifyOtp(pendingVerification?.email || values.email, otpCode, 'email_verification');
      toast.success('Email verified! Welcome to Vilanow', 'Success');
      onClose();
    } catch (err: any) {
      toast.error(getErrorMessage(err), 'Verification Failed');
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp();
      setResendTimer(60);
      toast.success('New code sent to your email', 'Code Sent');
    } catch (err: any) {
      toast.error(getErrorMessage(err), 'Failed to Send Code');
    }
  };

  const handleGoogleSignup = (selectedRole: 'seeker' | 'agent') => {
    loginWithGoogle(selectedRole);
  };

  useEffect(() => {
    if (!isOpen) {
      setRole(null);
      setStep(1);
      setShowOtpInput(false);
      setOtp(['', '', '', '', '', '']);
      clearError();
    }
  }, [isOpen, clearError]);

  const renderRoleSelection = () => (
    <div className="space-y-4">
      <p className="text-center text-text-secondary mb-6">
        Choose how you want to use Vilanow
      </p>

      <button
        onClick={() => {
          setRole('seeker');
          setStep(2);
        }}
        className="w-full p-5 rounded-xl border-2 border-border-color hover:border-primary hover:bg-primary/5 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-bg-tertiary rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Search className="w-7 h-7 text-text-secondary group-hover:text-primary" />
          </div>
          <div className="text-left">
            <h4 className="font-bold text-text-primary text-lg">I'm Looking for a Home</h4>
            <p className="text-sm text-text-tertiary">
              Find your dream property from verified agents
            </p>
          </div>
        </div>
      </button>

      <button
        onClick={() => {
          setRole('agent');
          setStep(2);
        }}
        className="w-full p-5 rounded-xl border-2 border-border-color hover:border-primary hover:bg-primary/5 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-bg-tertiary rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Building2 className="w-7 h-7 text-text-secondary group-hover:text-primary" />
          </div>
          <div className="text-left">
            <h4 className="font-bold text-text-primary text-lg">I'm a Property Agent</h4>
            <p className="text-sm text-text-tertiary">
              List properties and connect with buyers
            </p>
          </div>
        </div>
      </button>

      {/* Google Signup Options */}
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
        <button
          onClick={onOpenLogin}
          className="text-primary hover:underline font-semibold"
        >
          Sign In
        </button>
      </p>
    </div>
  );

  const renderSignupForm = () => (
    <>
      {/* Google Sign Up */}
      <button
        onClick={() => handleGoogleSignup(role!)}
        className="w-full py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-xl transition-all flex items-center justify-center gap-3 border border-gray-200 mb-4"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      {/* Divider */}
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
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            Full Name
          </label>
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
          {errors.fullName && (
            <p className="text-danger text-xs mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            Email Address
          </label>
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
          {errors.email && (
            <p className="text-danger text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            Phone Number
          </label>
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
          {errors.phone && (
            <p className="text-danger text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {role === 'agent' && (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Agent Type
            </label>
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
                <p className="font-medium text-sm">Direct Agent</p>
                <p className="text-xs text-text-tertiary">Property owner</p>
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
                <p className="text-xs text-text-tertiary">Agency rep</p>
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input
              type="password"
              value={values.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Create a password"
              className="w-full pl-10 pr-4 py-3 bg-bg-tertiary border border-border-color rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-text-primary placeholder:text-text-tertiary"
            />
          </div>
          {errors.password && (
            <p className="text-danger text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            Confirm Password
          </label>
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
          {errors.confirmPassword && (
            <p className="text-danger text-xs mt-1">{errors.confirmPassword}</p>
          )}
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
  );

  const renderOtpVerification = () => (
    <div className="space-y-6">
      <p className="text-center text-text-secondary">
        We sent a verification code to<br />
        <span className="font-semibold text-text-primary">
          {pendingVerification?.email || values.email}
        </span>
      </p>

      {/* OTP Input */}
      <div className="flex justify-center gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`signup-otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            className="w-12 h-14 text-center text-xl font-bold bg-bg-tertiary border border-border-color rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-text-primary"
          />
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-danger text-sm bg-danger/10 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <button
        onClick={handleVerifyOtp}
        disabled={isLoading || otp.join('').length !== 6}
        className="w-full py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          'Verify Email'
        )}
      </button>

      <p className="text-center text-sm text-text-tertiary">
        Didn't receive the code?{' '}
        {resendTimer > 0 ? (
          <span className="text-text-secondary">
            Resend in {resendTimer}s
          </span>
        ) : (
          <button
            onClick={handleResendOtp}
            className="text-primary hover:underline font-medium"
          >
            Resend Code
          </button>
        )}
      </p>
    </div>
  );

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
            <div className="bg-bg-secondary w-full max-w-md rounded-2xl border border-primary/30 shadow-2xl overflow-hidden pointer-events-auto gold-glow max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  {(step > 1 || showOtpInput) && (
                    <button
                      onClick={() => {
                        if (showOtpInput) {
                          setShowOtpInput(false);
                        } else {
                          setStep(1);
                          setRole(null);
                        }
                      }}
                      className="p-2 hover:bg-bg-tertiary rounded-full transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-text-tertiary" />
                    </button>
                  )}
                  {step === 1 && !showOtpInput && <div />}
                  <h2 className="font-display text-2xl font-bold text-text-primary">
                    {showOtpInput 
                      ? 'Verify Email' 
                      : step === 1 
                        ? 'Get Started' 
                        : `Join as ${role === 'agent' ? 'Agent' : 'Seeker'}`
                    }
                  </h2>
                  <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-full transition-colors">
                    <X className="w-5 h-5 text-text-tertiary" />
                  </button>
                </div>

                {showOtpInput 
                  ? renderOtpVerification()
                  : step === 1 
                    ? renderRoleSelection() 
                    : renderSignupForm()
                }
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
