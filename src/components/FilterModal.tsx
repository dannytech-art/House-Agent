import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { SearchFilters } from '../hooks/useSearch';
import { PropertyType } from '../types';
interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onApply: (filters: SearchFilters) => void;
}
export function FilterModal({
  isOpen,
  onClose,
  filters,
  onApply
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const propertyTypes: (PropertyType | 'all')[] = ['all', 'apartment', 'house', 'duplex', 'penthouse', 'land'];
  const amenitiesList = ['Pool', 'Gym', 'Security', 'Parking', 'BQ', 'Inverter'];
  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };
  const toggleAmenity = (amenity: string) => {
    setLocalFilters(prev => {
      const current = prev.amenities || [];
      const updated = current.includes(amenity) ? current.filter(a => a !== amenity) : [...current, amenity];
      return {
        ...prev,
        amenities: updated
      };
    });
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
        x: '100%'
      }} animate={{
        opacity: 1,
        x: 0
      }} exit={{
        opacity: 0,
        x: '100%'
      }} transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300
      }} className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-bg-secondary border-l border-primary/30 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border-color">
              <h2 className="font-display text-xl font-bold text-text-primary">
                Filters
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-full transition-colors">
                <X className="w-5 h-5 text-text-tertiary" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Property Type */}
              <section>
                <h3 className="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider">
                  Property Type
                </h3>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map(type => <button key={type} onClick={() => setLocalFilters(prev => ({
                ...prev,
                propertyType: type
              }))} className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${localFilters.propertyType === type ? 'bg-primary text-black' : 'bg-bg-tertiary text-text-secondary hover:bg-bg-primary border border-transparent hover:border-primary/30'}`}>
                      {type}
                    </button>)}
                </div>
              </section>

              {/* Price Range */}
              <section>
                <h3 className="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider">
                  Price Range (₦)
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-text-tertiary mb-1 block">
                      Min Price
                    </label>
                    <input type="number" value={localFilters.minPrice || ''} onChange={e => setLocalFilters(prev => ({
                  ...prev,
                  minPrice: Number(e.target.value) || undefined
                }))} className="w-full px-4 py-2 bg-bg-tertiary border border-border-color rounded-xl text-text-primary focus:outline-none focus:border-primary" placeholder="Any" />
                  </div>
                  <div className="text-text-tertiary">-</div>
                  <div className="flex-1">
                    <label className="text-xs text-text-tertiary mb-1 block">
                      Max Price
                    </label>
                    <input type="number" value={localFilters.maxPrice || ''} onChange={e => setLocalFilters(prev => ({
                  ...prev,
                  maxPrice: Number(e.target.value) || undefined
                }))} className="w-full px-4 py-2 bg-bg-tertiary border border-border-color rounded-xl text-text-primary focus:outline-none focus:border-primary" placeholder="Any" />
                  </div>
                </div>
              </section>

              {/* Bedrooms & Bathrooms */}
              <section>
                <h3 className="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider">
                  Rooms
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-text-primary mb-2 block">
                      Bedrooms
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(num => <button key={num} onClick={() => setLocalFilters(prev => ({
                    ...prev,
                    bedrooms: prev.bedrooms === num ? undefined : num
                  }))} className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${localFilters.bedrooms === num ? 'bg-primary text-black' : 'bg-bg-tertiary text-text-secondary hover:border-primary/50 border border-transparent'}`}>
                          {num}+
                        </button>)}
                    </div>
                  </div>
                </div>
              </section>

              {/* Amenities */}
              <section>
                <h3 className="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {amenitiesList.map(amenity => {
                const isSelected = localFilters.amenities?.includes(amenity);
                return <button key={amenity} onClick={() => toggleAmenity(amenity)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isSelected ? 'bg-primary/10 border-primary text-primary' : 'bg-bg-tertiary border-transparent text-text-secondary hover:border-primary/30'}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-text-tertiary'}`}>
                          {isSelected && <Check className="w-3 h-3 text-black" />}
                        </div>
                        <span className="text-sm font-medium">{amenity}</span>
                      </button>;
              })}
                </div>
              </section>
            </div>

            <div className="p-6 border-t border-border-color bg-bg-secondary">
              <div className="flex gap-4">
                <button onClick={() => setLocalFilters({
              propertyType: 'all'
            })} className="flex-1 py-3 bg-bg-tertiary hover:bg-bg-primary border border-border-color text-text-primary font-bold rounded-xl transition-colors">
                  Reset
                </button>
                <button onClick={handleApply} className="flex-[2] py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all gold-glow">
                  Show Results
                </button>
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}