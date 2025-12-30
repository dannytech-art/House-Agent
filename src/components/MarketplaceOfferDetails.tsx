import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ShieldCheck, Clock, DollarSign } from 'lucide-react';
import { MarketplaceOffer } from '../types';
interface MarketplaceOfferDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  offer: MarketplaceOffer | null;
  onPurchase: (offer: MarketplaceOffer) => void;
}
export function MarketplaceOfferDetails({
  isOpen,
  onClose,
  offer,
  onPurchase
}: MarketplaceOfferDetailsProps) {
  if (!offer) return null;
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
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-primary/10 text-primary mb-2 uppercase tracking-wider">
                      {offer.type} Offer
                    </span>
                    <h2 className="font-display text-xl font-bold text-text-primary">
                      Offer Details
                    </h2>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-full transition-colors">
                    <X className="w-5 h-5 text-text-tertiary" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-bg-primary p-4 rounded-xl border border-border-color">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-bg-tertiary rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-text-secondary" />
                      </div>
                      <div>
                        <p className="font-bold text-text-primary">
                          {offer.agentName}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          Verified Agent • 4.8 Rating
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {offer.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-bg-tertiary/50 rounded-lg">
                      <div className="flex items-center gap-2 text-text-tertiary mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">Posted</span>
                      </div>
                      <p className="text-sm font-medium text-text-primary">
                        2 hours ago
                      </p>
                    </div>
                    <div className="p-3 bg-bg-tertiary/50 rounded-lg">
                      <div className="flex items-center gap-2 text-text-tertiary mb-1">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs">Verification</span>
                      </div>
                      <p className="text-sm font-medium text-success">
                        Verified Lead
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border-color">
                    <div>
                      <p className="text-sm text-text-tertiary">Price</p>
                      <p className="text-2xl font-bold text-gradient-gold">
                        {offer.price} Credits
                      </p>
                    </div>
                    <button onClick={() => onPurchase(offer)} className="px-6 py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all shadow-lg flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Purchase Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}