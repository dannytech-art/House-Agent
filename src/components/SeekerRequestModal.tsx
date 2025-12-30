import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, DollarSign, Home, Bed, FileText, Loader2 } from 'lucide-react';
import { useFormValidation } from '../hooks/useFormValidation';
import { PropertyType } from '../types';
interface SeekerRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}
export function SeekerRequestModal({
  isOpen,
  onClose,
  onSubmit
}: SeekerRequestModalProps) {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting
  } = useFormValidation({
    type: 'apartment' as PropertyType,
    location: '',
    minBudget: '',
    maxBudget: '',
    bedrooms: '',
    description: ''
  }, {
    location: {
      required: true,
      minLength: 3
    },
    minBudget: {
      required: true
    },
    maxBudget: {
      required: true
    },
    bedrooms: {
      required: true
    },
    description: {
      required: true,
      minLength: 10
    }
  });
  const handleFormSubmit = async (formData: typeof values) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSubmit({
      ...formData,
      minBudget: Number(formData.minBudget),
      maxBudget: Number(formData.maxBudget),
      bedrooms: Number(formData.bedrooms),
      createdAt: new Date().toISOString(),
      status: 'active',
      matches: 0
    });
    onClose();
  };
  const propertyTypes: PropertyType[] = ['apartment', 'house', 'duplex', 'penthouse', 'studio', 'land'];
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
                  <div>
                    <h2 className="font-display text-2xl font-bold text-text-primary">
                      Post a Request
                    </h2>
                    <p className="text-sm text-text-secondary">
                      Tell agents exactly what you're looking for
                    </p>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-full transition-colors">
                    <X className="w-5 h-5 text-text-tertiary" />
                  </button>
                </div>

                <form onSubmit={e => {
              e.preventDefault();
              handleSubmit(handleFormSubmit);
            }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Property Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {propertyTypes.map(type => <button key={type} type="button" onClick={() => handleChange('type', type)} className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${values.type === type ? 'bg-primary text-black' : 'bg-bg-tertiary text-text-secondary hover:bg-bg-tertiary/80'}`}>
                          {type}
                        </button>)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                      <input type="text" value={values.location} onChange={e => handleChange('location', e.target.value)} className={`w-full pl-10 pr-4 py-3 bg-bg-tertiary border rounded-xl text-text-primary focus:outline-none transition-all ${errors.location ? 'border-danger' : 'border-border-color focus:border-primary'}`} placeholder="e.g. Lekki Phase 1" />
                    </div>
                    {errors.location && <p className="text-xs text-danger mt-1">
                        {errors.location}
                      </p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Min Budget (₦)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                        <input type="number" value={values.minBudget} onChange={e => handleChange('minBudget', e.target.value)} className={`w-full pl-9 pr-4 py-3 bg-bg-tertiary border rounded-xl text-text-primary focus:outline-none transition-all ${errors.minBudget ? 'border-danger' : 'border-border-color focus:border-primary'}`} placeholder="Min" />
                      </div>
                      {errors.minBudget && <p className="text-xs text-danger mt-1">
                          {errors.minBudget}
                        </p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Max Budget (₦)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                        <input type="number" value={values.maxBudget} onChange={e => handleChange('maxBudget', e.target.value)} className={`w-full pl-9 pr-4 py-3 bg-bg-tertiary border rounded-xl text-text-primary focus:outline-none transition-all ${errors.maxBudget ? 'border-danger' : 'border-border-color focus:border-primary'}`} placeholder="Max" />
                      </div>
                      {errors.maxBudget && <p className="text-xs text-danger mt-1">
                          {errors.maxBudget}
                        </p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Bedrooms
                    </label>
                    <div className="relative">
                      <Bed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                      <input type="number" value={values.bedrooms} onChange={e => handleChange('bedrooms', e.target.value)} className={`w-full pl-10 pr-4 py-3 bg-bg-tertiary border rounded-xl text-text-primary focus:outline-none transition-all ${errors.bedrooms ? 'border-danger' : 'border-border-color focus:border-primary'}`} placeholder="e.g. 3" />
                    </div>
                    {errors.bedrooms && <p className="text-xs text-danger mt-1">
                        {errors.bedrooms}
                      </p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Description
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-4 w-5 h-5 text-text-tertiary" />
                      <textarea value={values.description} onChange={e => handleChange('description', e.target.value)} rows={3} className={`w-full pl-10 pr-4 py-3 bg-bg-tertiary border rounded-xl text-text-primary focus:outline-none transition-all resize-none ${errors.description ? 'border-danger' : 'border-border-color focus:border-primary'}`} placeholder="Describe your specific needs, preferences, or must-haves..." />
                    </div>
                    {errors.description && <p className="text-xs text-danger mt-1">
                        {errors.description}
                      </p>}
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Post Request'}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}