import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFormValidation } from '../hooks/useFormValidation';
interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}
export function ForgotPasswordModal({
  isOpen,
  onClose,
  onOpenLogin
}: ForgotPasswordModalProps) {
  const {
    sendPasswordReset,
    isLoading,
    error,
    clearError
  } = useAuth();
  const [isSent, setIsSent] = useState(false);
  const {
    values,
    errors,
    handleChange,
    handleSubmit
  } = useFormValidation({
    email: ''
  }, {
    email: {
      required: true,
      email: true
    }
  });
  const onSubmit = async (formData: typeof values) => {
    await sendPasswordReset(formData.email);
    if (!error) {
      setIsSent(true);
    }
  };
  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setIsSent(false);
      clearError();
    }
  }, [isOpen, clearError]);
  return <AnimatePresence>
      {isOpen && <>
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" />
          <motion.div initial={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-bg-secondary w-full max-w-md rounded-2xl border border-primary/30 shadow-2xl overflow-hidden pointer-events-auto gold-glow">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-2xl font-bold text-text-primary">
                    Reset Password
                  </h2>
                  <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-full transition-colors">
                    <X className="w-5 h-5 text-text-tertiary" />
                  </button>
                </div>

                {isSent ? <div className="text-center py-6">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-success" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                      Check your email
                    </h3>
                    <p className="text-text-secondary mb-6">
                      We've sent a password reset link to{' '}
                      <span className="text-primary font-medium">
                        {values.email}
                      </span>
                    </p>
                    <button onClick={() => {
                onClose();
                onOpenLogin();
              }} className="w-full py-3 bg-bg-tertiary hover:bg-bg-primary border border-border-color text-text-primary font-semibold rounded-xl transition-colors">
                      Back to Login
                    </button>
                  </div> : <>
                    <p className="text-text-secondary mb-6">
                      Enter your email address and we'll send you instructions
                      to reset your password.
                    </p>

                    <form onSubmit={e => {
                e.preventDefault();
                handleSubmit(onSubmit);
              }} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                          <input type="email" value={values.email} onChange={e => handleChange('email', e.target.value)} className={`w-full pl-10 pr-4 py-3 bg-bg-tertiary border rounded-xl text-text-primary focus:outline-none transition-all ${errors.email ? 'border-danger focus:border-danger' : 'border-border-color focus:border-primary'}`} placeholder="you@example.com" />
                        </div>
                        {errors.email && <p className="text-xs text-danger mt-1">
                            {errors.email}
                          </p>}
                      </div>

                      <button type="submit" disabled={isLoading} className="w-full py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                      </button>
                    </form>

                    <div className="mt-6 text-center">
                      <button onClick={() => {
                  onClose();
                  onOpenLogin();
                }} className="flex items-center justify-center gap-2 text-text-secondary hover:text-primary transition-colors mx-auto">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Back to Login
                        </span>
                      </button>
                    </div>
                  </>}
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}