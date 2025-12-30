import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2 } from 'lucide-react';
import { useFormValidation } from '../hooks/useFormValidation';
import { Property } from '../types';
interface EditListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  onSave: (updatedProperty: Property) => void;
}
export function EditListingModal({
  isOpen,
  onClose,
  property,
  onSave
}: EditListingModalProps) {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting
  } = useFormValidation({
    title: property.title,
    price: property.price,
    description: property.description,
    location: property.location
  }, {
    title: {
      required: true
    },
    price: {
      required: true
    },
    description: {
      required: true
    },
    location: {
      required: true
    }
  });
  const handleSave = async (formData: typeof values) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave({
      ...property,
      ...formData,
      price: Number(formData.price)
    });
    onClose();
  };
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
            <div className="bg-bg-secondary w-full max-w-lg rounded-2xl border border-primary/30 shadow-2xl overflow-hidden pointer-events-auto gold-glow">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-xl font-bold text-text-primary">
                    Edit Listing
                  </h2>
                  <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-full transition-colors">
                    <X className="w-5 h-5 text-text-tertiary" />
                  </button>
                </div>

                <form onSubmit={e => {
              e.preventDefault();
              handleSubmit(handleSave);
            }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Title
                    </label>
                    <input type="text" value={values.title} onChange={e => handleChange('title', e.target.value)} className="w-full px-4 py-2 bg-bg-tertiary border border-border-color rounded-xl text-text-primary focus:outline-none focus:border-primary" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Price (₦)
                    </label>
                    <input type="number" value={values.price} onChange={e => handleChange('price', e.target.value)} className="w-full px-4 py-2 bg-bg-tertiary border border-border-color rounded-xl text-text-primary focus:outline-none focus:border-primary" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Location
                    </label>
                    <input type="text" value={values.location} onChange={e => handleChange('location', e.target.value)} className="w-full px-4 py-2 bg-bg-tertiary border border-border-color rounded-xl text-text-primary focus:outline-none focus:border-primary" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Description
                    </label>
                    <textarea value={values.description} onChange={e => handleChange('description', e.target.value)} rows={4} className="w-full px-4 py-2 bg-bg-tertiary border border-border-color rounded-xl text-text-primary focus:outline-none focus:border-primary resize-none" />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-bg-tertiary hover:bg-bg-primary border border-border-color text-text-primary rounded-xl font-medium transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-70">
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
                          <Save className="w-4 h-4" /> Save Changes
                        </>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}