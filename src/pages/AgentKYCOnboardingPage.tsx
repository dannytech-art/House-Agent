import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, User, Briefcase, Camera, CheckCircle, ChevronRight, ChevronLeft, AlertCircle, Upload } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
export function AgentKYCOnboardingPage() {
  const {
    user,
    updateUser
  } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    licenseNumber: '',
    experience: '',
    specialization: 'Residential',
    nin: ''
  });
  const totalSteps = 4;
  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateUser({
      kycStatus: 'verified',
      verified: true
    });
    // Redirect happens automatically via App.tsx logic or we can force reload
    window.location.href = '/';
  };
  const handleSkip = () => {
    const confirmed = window.confirm('Are you sure? Unverified agents have limited visibility and cannot claim territories.');
    if (confirmed) {
      updateUser({
        kycStatus: 'pending'
      });
      window.location.href = '/';
    }
  };
  return <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div initial={{
          scale: 0
        }} animate={{
          scale: 1
        }} className="w-16 h-16 bg-gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-black" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
            Agent Verification
          </h1>
          <p className="text-text-secondary">
            Complete your profile to unlock full access to Vilanow
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-text-secondary mb-2">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round(step / totalSteps * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
            <motion.div initial={{
            width: 0
          }} animate={{
            width: `${step / totalSteps * 100}%`
          }} className="h-full bg-primary" />
          </div>
        </div>

        {/* Form Card */}
        <motion.div layout className="bg-bg-secondary border border-border-color rounded-2xl p-6 md:p-8 shadow-xl">
          <AnimatePresence mode="wait">
            {step === 1 && <motion.div key="step1" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }} className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">
                    Personal Information
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Full Name
                  </label>
                  <input type="text" value={formData.fullName} onChange={e => setFormData({
                ...formData,
                fullName: e.target.value
              })} className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Phone Number
                  </label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({
                ...formData,
                phone: e.target.value
              })} className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Email Address
                  </label>
                  <input type="email" value={formData.email} onChange={e => setFormData({
                ...formData,
                email: e.target.value
              })} className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl focus:border-primary focus:outline-none" />
                </div>
              </motion.div>}

            {step === 2 && <motion.div key="step2" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }} className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">
                    Professional Details
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Real Estate License / RC Number
                  </label>
                  <input type="text" value={formData.licenseNumber} onChange={e => setFormData({
                ...formData,
                licenseNumber: e.target.value
              })} placeholder="e.g. RC123456" className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Years of Experience
                  </label>
                  <select value={formData.experience} onChange={e => setFormData({
                ...formData,
                experience: e.target.value
              })} className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl focus:border-primary focus:outline-none">
                    <option value="">Select experience...</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Primary Specialization
                  </label>
                  <select value={formData.specialization} onChange={e => setFormData({
                ...formData,
                specialization: e.target.value
              })} className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-xl focus:border-primary focus:outline-none">
                    <option value="Residential">Residential Sales</option>
                    <option value="Commercial">Commercial Real Estate</option>
                    <option value="Rentals">Luxury Rentals</option>
                    <option value="Land">Land & Development</option>
                  </select>
                </div>
              </motion.div>}

            {step === 3 && <motion.div key="step3" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Camera className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">
                    Identity Verification
                  </h2>
                </div>

                <div className="p-4 border-2 border-dashed border-border-color rounded-xl hover:border-primary/50 transition-colors cursor-pointer text-center">
                  <Upload className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
                  <p className="font-medium text-text-primary">
                    Upload Government ID
                  </p>
                  <p className="text-sm text-text-tertiary">
                    Passport, Driver's License, or NIN Slip
                  </p>
                </div>

                <div className="p-4 border-2 border-dashed border-border-color rounded-xl hover:border-primary/50 transition-colors cursor-pointer text-center">
                  <Camera className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
                  <p className="font-medium text-text-primary">Take a Selfie</p>
                  <p className="text-sm text-text-tertiary">
                    Make sure your face is clearly visible
                  </p>
                </div>

                <div className="bg-primary/5 p-4 rounded-xl flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-text-secondary">
                    Your data is encrypted and securely stored. We only use this
                    for verification purposes in compliance with regulatory
                    requirements.
                  </p>
                </div>
              </motion.div>}

            {step === 4 && <motion.div key="step4" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">
                    Review & Submit
                  </h2>
                </div>

                <div className="space-y-4 bg-bg-primary p-4 rounded-xl border border-border-color">
                  <div className="flex justify-between border-b border-border-color pb-2">
                    <span className="text-text-secondary">Name</span>
                    <span className="font-medium text-text-primary">
                      {formData.fullName}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border-color pb-2">
                    <span className="text-text-secondary">License</span>
                    <span className="font-medium text-text-primary">
                      {formData.licenseNumber || 'Not provided'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border-color pb-2">
                    <span className="text-text-secondary">Specialization</span>
                    <span className="font-medium text-text-primary">
                      {formData.specialization}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Documents</span>
                    <span className="font-medium text-success">Uploaded ✓</span>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 w-4 h-4 text-primary rounded border-border-color focus:ring-primary" />
                  <span className="text-sm text-text-secondary">
                    I agree to the{' '}
                    <span className="text-primary underline">
                      Terms of Service
                    </span>{' '}
                    and confirm that all provided information is accurate.
                  </span>
                </label>
              </motion.div>}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-border-color">
            {step > 1 ? <button onClick={handleBack} className="flex-1 px-6 py-3 bg-bg-primary hover:bg-bg-tertiary border border-border-color text-text-primary rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                <ChevronLeft className="w-5 h-5" />
                Back
              </button> : <button onClick={handleSkip} className="flex-1 px-6 py-3 bg-transparent text-text-tertiary hover:text-text-secondary font-medium transition-colors">
                Skip for now
              </button>}

            <button onClick={step === totalSteps ? handleSubmit : handleNext} disabled={isSubmitting} className="flex-1 px-6 py-3 bg-gradient-gold hover:opacity-90 text-black rounded-xl font-bold transition-all gold-glow flex items-center justify-center gap-2 disabled:opacity-70">
              {isSubmitting ? 'Verifying...' : step === totalSteps ? 'Submit Verification' : <>
                  Next Step
                  <ChevronRight className="w-5 h-5" />
                </>}
            </button>
          </div>
        </motion.div>
      </div>
    </div>;
}