import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Briefcase, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFormValidation } from '../hooks/useFormValidation';
import { UserRole } from '../types';
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
  const {
    signup,
    isLoading,
    error,
    clearError
  } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [step, setStep] = useState(1);
  const {
    values,
    errors,
    handleChange,
    handleSubmit
  } = useFormValidation({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    licenseNumber: '',
    specialization: 'Residential',
    budget: '',
    location: ''
  }, {
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
      matches: 'password',
      message: 'Passwords must match'
    },
    fullName: {
      required: true
    },
    phone: {
      required: true,
      phone: true
    }
  });
  const onSubmit = async (formData: typeof values) => {
    if (!role) return;
    const userData = {
      name: formData.fullName,
      phone: formData.phone,
      ...(role === 'agent' ? {
        licenseNumber: formData.licenseNumber,
        specialization: formData.specialization
      } : {
        budget: formData.budget,
        preferredLocation: formData.location
      })
    };
    await signup(formData.email, formData.password, role, userData);
    if (!error) {
      onClose();
    }
  };
  useEffect(() => {
    if (!isOpen) {
      setRole(null);
      setStep(1);
      clearError();
    }
  }, [isOpen, clearError]);
  const renderRoleSelection = () => <div className="space-y-4">
      <h3 className="text-center text-text-secondary mb-6">
        Choose your account type
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => {
        setRole('seeker');
        setStep(2);
      }} className="p-6 rounded-xl border-2 border-border-color hover:border-primary hover:bg-primary/5 transition-all group text-center">
          <div className="w-12 h-12 mx-auto bg-bg-tertiary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
            <User className="w-6 h-6 text-text-secondary group-hover:text-primary" />
          </div>
          <h4 className="font-bold text-text-primary mb-1">House Seeker</h4>
          <p className="text-xs text-text-tertiary">
            I'm looking for a property
          </p>
        </button>

        <button onClick={() => {
        setRole('agent');
        setStep(2);
      }} className="p-6 rounded-xl border-2 border-border-color hover:border-primary hover:bg-primary/5 transition-all group text-center">
          <div className="w-12 h-12 mx-auto bg-bg-tertiary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
            <Briefcase className="w-6 h-6 text-text-secondary group-hover:text-primary" />
          </div>
          <h4 className="font-bold text-text-primary mb-1">Agent</h4>
          <p className="text-xs text-text-tertiary">I'm listing properties</p>
        </button>
      </div>
    </div>;
  const renderForm = () => <form onSubmit={e => {
    e.preventDefault();
    handleSubmit(onSubmit);
  }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Full Name
          </label>
          <input type="text" value={values.fullName} onChange={e => handleChange('fullName', e.target.value)} className={`w-full px-3 py-2 bg-bg-tertiary border rounded-lg text-text-primary text-sm focus:outline-none transition-all ${errors.fullName ? 'border-danger' : 'border-border-color focus:border-primary'}`} />
          {errors.fullName && <p className="text-xs text-danger mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Phone
          </label>
          <input type="tel" value={values.phone} onChange={e => handleChange('phone', e.target.value)} className={`w-full px-3 py-2 bg-bg-tertiary border rounded-lg text-text-primary text-sm focus:outline-none transition-all ${errors.phone ? 'border-danger' : 'border-border-color focus:border-primary'}`} />
          {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">
          Email Address
        </label>
        <input type="email" value={values.email} onChange={e => handleChange('email', e.target.value)} className={`w-full px-3 py-2 bg-bg-tertiary border rounded-lg text-text-primary text-sm focus:outline-none transition-all ${errors.email ? 'border-danger' : 'border-border-color focus:border-primary'}`} />
        {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Password
          </label>
          <input type="password" value={values.password} onChange={e => handleChange('password', e.target.value)} className={`w-full px-3 py-2 bg-bg-tertiary border rounded-lg text-text-primary text-sm focus:outline-none transition-all ${errors.password ? 'border-danger' : 'border-border-color focus:border-primary'}`} />
          {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Confirm
          </label>
          <input type="password" value={values.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} className={`w-full px-3 py-2 bg-bg-tertiary border rounded-lg text-text-primary text-sm focus:outline-none transition-all ${errors.confirmPassword ? 'border-danger' : 'border-border-color focus:border-primary'}`} />
          {errors.confirmPassword && <p className="text-xs text-danger mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>

      {role === 'agent' ? <div className="pt-2 border-t border-border-color">
          <p className="text-xs font-bold text-primary mb-3">Agent Details</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                License (Optional)
              </label>
              <input type="text" value={values.licenseNumber} onChange={e => handleChange('licenseNumber', e.target.value)} className="w-full px-3 py-2 bg-bg-tertiary border border-border-color rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Specialization
              </label>
              <select value={values.specialization} onChange={e => handleChange('specialization', e.target.value)} className="w-full px-3 py-2 bg-bg-tertiary border border-border-color rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                <option>Residential</option>
                <option>Commercial</option>
                <option>Land</option>
              </select>
            </div>
          </div>
        </div> : <div className="pt-2 border-t border-border-color">
          <p className="text-xs font-bold text-primary mb-3">Preferences</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Preferred Location
              </label>
              <select value={values.location} onChange={e => handleChange('location', e.target.value)} className="w-full px-3 py-2 bg-bg-tertiary border border-border-color rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                <option value="">Select location</option>
                <option value="Lekki">Lekki</option>
                <option value="Ikate">Ikate</option>
                <option value="Ajah">Ajah</option>
                <option value="Victoria Island">Victoria Island</option>
                <option value="Ikoyi">Ikoyi</option>
                <option value="Yaba">Yaba</option>
                <option value="Surulere">Surulere</option>
                <option value="Ikeja">Ikeja</option>
                <option value="Maryland">Maryland</option>
                <option value="Gbagada">Gbagada</option>
                <option value="Lekki Phase 1">Lekki Phase 1</option>
                <option value="Lekki Phase 2">Lekki Phase 2</option>
                <option value="Banana Island">Banana Island</option>
                <option value="Sangotedo">Sangotedo</option>
                <option value="Chevron">Chevron</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Max Budget
              </label>
              <select value={values.budget} onChange={e => handleChange('budget', e.target.value)} className="w-full px-3 py-2 bg-bg-tertiary border border-border-color rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                <option value="">Select budget</option>
                <option value="20000000">Up to ₦20M</option>
                <option value="30000000">Up to ₦30M</option>
                <option value="50000000">Up to ₦50M</option>
                <option value="70000000">Up to ₦70M</option>
                <option value="100000000">Up to ₦100M</option>
                <option value="150000000">Up to ₦150M</option>
                <option value="200000000">Up to ₦200M</option>
                <option value="300000000">Up to ₦300M</option>
                <option value="500000000">Up to ₦500M</option>
                <option value="1000000000">₦500M+</option>
              </select>
            </div>
          </div>
        </div>}

      <div className="pt-2">
        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" required className="mt-1 w-3 h-3 text-primary rounded border-border-color focus:ring-primary" />
          <span className="text-xs text-text-secondary">
            I agree to the{' '}
            <span className="text-primary underline">Terms of Service</span> and{' '}
            <span className="text-primary underline">Privacy Policy</span>
          </span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 bg-bg-tertiary hover:bg-bg-primary border border-border-color text-text-primary font-semibold rounded-xl transition-colors">
          Back
        </button>
        <button type="submit" disabled={isLoading} className="flex-[2] py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
        </button>
      </div>
    </form>;
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
            <div className="bg-bg-secondary w-full max-w-lg rounded-2xl border border-primary/30 shadow-2xl overflow-hidden pointer-events-auto gold-glow max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-2xl font-bold text-text-primary">
                    {step === 1 ? 'Join Vilanow' : `Sign up as ${role === 'agent' ? 'Agent' : 'Seeker'}`}
                  </h2>
                  <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-full transition-colors">
                    <X className="w-5 h-5 text-text-tertiary" />
                  </button>
                </div>

                {error && <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-danger">{error}</p>
                  </div>}

                {step === 1 ? renderRoleSelection() : renderForm()}

                <div className="mt-6 text-center border-t border-border-color pt-4">
                  <p className="text-text-secondary text-sm">
                    Already have an account?{' '}
                    <button onClick={() => {
                  onClose();
                  onOpenLogin();
                }} className="text-primary font-bold hover:underline">
                      Sign In
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}