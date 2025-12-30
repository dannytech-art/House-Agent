import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFormValidation } from '../hooks/useFormValidation';
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignup: () => void;
  onOpenForgotPassword: () => void;
}
export function LoginModal({
  isOpen,
  onClose,
  onOpenSignup,
  onOpenForgotPassword
}: LoginModalProps) {
  const {
    login,
    isLoading,
    error,
    clearError
  } = useAuth();
  const {
    values,
    errors,
    handleChange,
    handleSubmit
  } = useFormValidation({
    email: '',
    password: ''
  }, {
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      minLength: 6
    }
  });
  const onSubmit = async (formData: typeof values) => {
    await login(formData.email, formData.password, 'agent');
    // Close modal after a short delay to allow state to update
    setTimeout(() => {
      if (!error) {
        onClose();
      }
    }, 100);
  };
  const handleDemoLogin = async (email: string, password: string) => {
    // Clear any existing errors
    clearError();
    // Update form values for display
    handleChange('email', email);
    handleChange('password', password);
    // Perform login
    await login(email, password, 'agent');
    // Close modal after a short delay to ensure auth state is updated
    setTimeout(() => {
      onClose();
    }, 100);
  };
  useEffect(() => {
    if (!isOpen) clearError();
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
            <div className="bg-bg-secondary w-full max-w-md rounded-2xl border border-primary/30 shadow-2xl overflow-hidden pointer-events-auto gold-glow max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-2xl font-bold text-text-primary">
                    Welcome Back
                  </h2>
                  <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-full transition-colors">
                    <X className="w-5 h-5 text-text-tertiary" />
                  </button>
                </div>

                {/* Demo Accounts Section */}
                <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
                  <h3 className="text-sm font-bold text-primary mb-3">
                    Demo Accounts
                  </h3>
                  <div className="space-y-2">
                    <button onClick={() => handleDemoLogin('seeker@demo.com', 'demo123')} disabled={isLoading} className="w-full text-left p-3 bg-bg-primary hover:bg-bg-tertiary border border-border-color rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                            House Seeker
                          </p>
                          <p className="text-xs text-text-tertiary">
                            seeker@demo.com
                          </p>
                        </div>
                        <span className="text-xs text-text-tertiary">
                          demo123
                        </span>
                      </div>
                    </button>

                    <button onClick={() => handleDemoLogin('agent@demo.com', 'demo123')} disabled={isLoading} className="w-full text-left p-3 bg-bg-primary hover:bg-bg-tertiary border border-border-color rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                            Agent
                          </p>
                          <p className="text-xs text-text-tertiary">
                            agent@demo.com
                          </p>
                        </div>
                        <span className="text-xs text-text-tertiary">
                          demo123
                        </span>
                      </div>
                    </button>

                    <button onClick={() => handleDemoLogin('admin@demo.com', 'demo123')} disabled={isLoading} className="w-full text-left p-3 bg-bg-primary hover:bg-bg-tertiary border border-border-color rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                            Admin
                          </p>
                          <p className="text-xs text-text-tertiary">
                            admin@demo.com
                          </p>
                        </div>
                        <span className="text-xs text-text-tertiary">
                          demo123
                        </span>
                      </div>
                    </button>
                  </div>

                  {isLoading && <div className="mt-3 flex items-center justify-center gap-2 text-sm text-primary">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </div>}
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-color"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-bg-secondary text-text-tertiary">
                      Or sign in with your account
                    </span>
                  </div>
                </div>

                {error && <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-danger">{error}</p>
                  </div>}

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
                    {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                      <input type="password" value={values.password} onChange={e => handleChange('password', e.target.value)} className={`w-full pl-10 pr-4 py-3 bg-bg-tertiary border rounded-xl text-text-primary focus:outline-none transition-all ${errors.password ? 'border-danger focus:border-danger' : 'border-border-color focus:border-primary'}`} placeholder="••••••••" />
                    </div>
                    {errors.password && <p className="text-xs text-danger mt-1">
                        {errors.password}
                      </p>}
                  </div>

                  <div className="flex justify-end">
                    <button type="button" onClick={() => {
                  onClose();
                  onOpenForgotPassword();
                }} className="text-sm text-primary hover:text-primary/80 font-medium">
                      Forgot Password?
                    </button>
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-text-secondary text-sm">
                    Don't have an account?{' '}
                    <button onClick={() => {
                  onClose();
                  onOpenSignup();
                }} className="text-primary font-bold hover:underline">
                      Sign Up
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}