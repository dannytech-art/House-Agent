import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFormValidation } from '../hooks/useFormValidation';
import { useSearchParams, useNavigate } from 'react-router-dom';
export function ResetPasswordPage() {
  const {
    resetPassword,
    isLoading,
    error
  } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  // In a real app, you'd validate the token from URL
  const token = searchParams.get('token');
  const {
    values,
    errors,
    handleChange,
    handleSubmit
  } = useFormValidation({
    password: '',
    confirmPassword: ''
  }, {
    password: {
      required: true,
      minLength: 6
    },
    confirmPassword: {
      required: true,
      matches: 'password',
      message: 'Passwords must match'
    }
  });
  const onSubmit = async (formData: typeof values) => {
    if (!token) return;
    await resetPassword(token, formData.password);
    if (!error) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };
  if (!token) {
    return <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Invalid Link
          </h1>
          <p className="text-text-secondary mb-4">
            This password reset link is invalid or has expired.
          </p>
          <button onClick={() => navigate('/')} className="text-primary hover:underline">
            Go Home
          </button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="w-full max-w-md bg-bg-secondary rounded-2xl border border-primary/30 shadow-2xl p-8 gold-glow">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-black" />
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Set New Password
          </h1>
        </div>

        {isSuccess ? <div className="text-center py-4">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Password Reset!
            </h3>
            <p className="text-text-secondary">Redirecting you to login...</p>
          </div> : <form onSubmit={e => {
        e.preventDefault();
        handleSubmit(onSubmit);
      }} className="space-y-4">
            {error && <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-sm text-danger flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>}

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                New Password
              </label>
              <input type="password" value={values.password} onChange={e => handleChange('password', e.target.value)} className={`w-full px-4 py-3 bg-bg-tertiary border rounded-xl text-text-primary focus:outline-none transition-all ${errors.password ? 'border-danger' : 'border-border-color focus:border-primary'}`} placeholder="••••••••" />
              {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Confirm Password
              </label>
              <input type="password" value={values.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} className={`w-full px-4 py-3 bg-bg-tertiary border rounded-xl text-text-primary focus:outline-none transition-all ${errors.confirmPassword ? 'border-danger' : 'border-border-color focus:border-primary'}`} placeholder="••••••••" />
              {errors.confirmPassword && <p className="text-xs text-danger mt-1">
                  {errors.confirmPassword}
                </p>}
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
            </button>
          </form>}
      </motion.div>
    </div>;
}