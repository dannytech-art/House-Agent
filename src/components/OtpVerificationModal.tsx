import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Loader2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast, getErrorMessage } from '../contexts/ToastContext';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  type: 'email_verification' | 'password_reset';
  onSuccess?: () => void;
  onResendSuccess?: () => void;
}

export function OtpVerificationModal({
  isOpen,
  onClose,
  email,
  type,
  onSuccess,
  onResendSuccess
}: OtpVerificationModalProps) {
  const toast = useToast();
  const { verifyOtp, sendOtp, isLoading, error, clearError } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setResendTimer(60);
      setIsVerified(false);
      clearError();
      // Focus first input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen, clearError]);

  // Countdown timer
  useEffect(() => {
    if (resendTimer > 0 && isOpen) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer, isOpen]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    const numValue = value.replace(/\D/g, '');
    if (numValue.length > 1) {
      // Handle paste
      const digits = numValue.slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      // Focus the next empty input or the last one
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }
    
    const newOtp = [...otp];
    newOtp[index] = numValue;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (numValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code', 'Invalid Code');
      return;
    }

    try {
      const result = await verifyOtp(email, otpCode, type);
      
      if (type === 'email_verification') {
        setIsVerified(true);
        toast.success('Your email has been verified!', 'Success');
        
        // Wait a moment then close and call onSuccess
        setTimeout(() => {
          onClose();
          onSuccess?.();
        }, 1500);
      } else if (type === 'password_reset' && result.resetToken) {
        onSuccess?.();
        onClose();
      }
    } catch (err: any) {
      toast.error(getErrorMessage(err), 'Verification Failed');
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await sendOtp(email, type);
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      toast.success('A new code has been sent to your email', 'Code Sent');
      onResendSuccess?.();
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      toast.error(getErrorMessage(err), 'Failed to Send Code');
    } finally {
      setIsResending(false);
    }
  };

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    if (otp.every(digit => digit !== '') && !isLoading && !isVerified) {
      handleVerify();
    }
  }, [otp]);

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-bg-secondary w-full max-w-md rounded-2xl border border-primary/30 shadow-2xl overflow-hidden pointer-events-auto gold-glow">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div />
                  <h2 className="font-display text-2xl font-bold text-text-primary">
                    {isVerified ? 'Email Verified!' : 'Verify Your Email'}
                  </h2>
                  {!isVerified && (
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-bg-tertiary rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-text-tertiary" />
                    </button>
                  )}
                  {isVerified && <div />}
                </div>

                {isVerified ? (
                  /* Success State */
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-success" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                      You're All Set! 🎉
                    </h3>
                    <p className="text-text-secondary">
                      Redirecting you to your dashboard...
                    </p>
                  </motion.div>
                ) : (
                  /* OTP Input State */
                  <div className="space-y-6">
                    {/* Email Icon */}
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-text-secondary">
                        We sent a 6-digit code to
                      </p>
                      <p className="font-semibold text-text-primary mt-1">
                        {maskedEmail}
                      </p>
                    </div>

                    {/* OTP Input */}
                    <div className="flex justify-center gap-2 sm:gap-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={el => inputRefs.current[index] = el}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          disabled={isLoading}
                          className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-bg-tertiary border-2 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-primary disabled:opacity-50 ${
                            digit ? 'border-primary' : 'border-border-color'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="flex items-center gap-2 text-danger text-sm bg-danger/10 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </div>
                    )}

                    {/* Verify Button */}
                    <button
                      onClick={handleVerify}
                      disabled={isLoading || otp.some(d => !d)}
                      className="w-full py-3.5 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify Email'
                      )}
                    </button>

                    {/* Resend Code */}
                    <div className="text-center">
                      <p className="text-sm text-text-tertiary mb-2">
                        Didn't receive the code?
                      </p>
                      {resendTimer > 0 ? (
                        <p className="text-sm text-text-secondary">
                          Resend code in <span className="font-bold text-primary">{resendTimer}s</span>
                        </p>
                      ) : (
                        <button
                          onClick={handleResend}
                          disabled={isResending}
                          className="text-primary hover:underline font-medium flex items-center gap-2 mx-auto"
                        >
                          {isResending ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4" />
                              Resend Code
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Help Text */}
                    <p className="text-xs text-text-tertiary text-center">
                      Check your spam folder if you don't see the email.
                      <br />
                      The code expires in 10 minutes.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
