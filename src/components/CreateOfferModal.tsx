import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Handshake, Home, AlertCircle } from 'lucide-react';
interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateOffer: (offer: {
    type: 'lead' | 'co-broking' | 'access';
    description: string;
    price: number;
  }) => void;
  currentCredits: number;
}
export function CreateOfferModal({
  isOpen,
  onClose,
  onCreateOffer,
  currentCredits
}: CreateOfferModalProps) {
  const [offerType, setOfferType] = useState<'lead' | 'co-broking' | 'access'>('lead');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(50);
  const offerTypes = [{
    type: 'lead' as const,
    icon: User,
    label: 'Buyer Lead',
    description: 'Sell a verified buyer lead to other agents',
    suggestedPrice: 50
  }, {
    type: 'co-broking' as const,
    icon: Handshake,
    label: 'Co-Broking',
    description: 'Offer co-broking access to your listing',
    suggestedPrice: 100
  }, {
    type: 'access' as const,
    icon: Home,
    label: 'Property Access',
    description: 'Grant direct agent contact for a property',
    suggestedPrice: 75
  }];
  const handleSubmit = () => {
    if (!description.trim()) {
      alert('Please add a description');
      return;
    }
    if (price < 10) {
      alert('Minimum price is 10 credits');
      return;
    }
    onCreateOffer({
      type: offerType,
      description,
      price
    });
    setDescription('');
    setPrice(50);
    onClose();
  };
  return <AnimatePresence>
      {isOpen && <>
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />

          {/* Modal */}
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
      }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-bg-secondary rounded-2xl border-2 border-primary/30 max-w-2xl w-full p-6 gold-glow max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-text-primary mb-1">
                    Create Marketplace Offer
                  </h3>
                  <p className="text-sm text-text-tertiary">
                    List your lead, co-broking opportunity, or property access
                  </p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
                  <X className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>

              {/* Offer Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-text-primary mb-3">
                  Offer Type
                </label>
                <div className="grid md:grid-cols-3 gap-3">
                  {offerTypes.map(type => {
                const Icon = type.icon;
                const isSelected = offerType === type.type;
                return <button key={type.type} onClick={() => {
                  setOfferType(type.type);
                  setPrice(type.suggestedPrice);
                }} className={`p-4 rounded-xl border-2 transition-all text-left ${isSelected ? 'border-primary bg-primary/10' : 'border-border-color hover:border-primary/30'}`}>
                        <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-primary' : 'text-text-tertiary'}`} />
                        <p className={`font-semibold mb-1 ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                          {type.label}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {type.description}
                        </p>
                      </button>;
              })}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Description
                </label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your offer in detail..." className="w-full px-4 py-3 bg-bg-tertiary border border-border-color rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors resize-none" rows={4} />
                <p className="text-xs text-text-tertiary mt-2">
                  Be specific about what you're offering to attract serious
                  buyers
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Price (Credits)
                </label>
                <div className="flex items-center gap-4">
                  <input type="number" value={price} onChange={e => setPrice(parseInt(e.target.value) || 0)} min={10} className="flex-1 px-4 py-3 bg-bg-tertiary border border-border-color rounded-xl text-text-primary focus:outline-none focus:border-primary transition-colors" />
                  <div className="px-4 py-3 bg-primary/10 border border-primary/30 rounded-xl">
                    <span className="text-sm font-bold text-primary">
                      Suggested:{' '}
                      {offerTypes.find(t => t.type === offerType)?.suggestedPrice}{' '}
                      credits
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-primary/5 border border-primary/30 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-primary mb-1">
                      Marketplace Guidelines
                    </p>
                    <ul className="text-xs text-text-secondary space-y-1">
                      <li>
                        • Ensure all information is accurate and up-to-date
                      </li>
                      <li>• Respond promptly to interested agents</li>
                      <li>
                        • Honor all agreements made through the marketplace
                      </li>
                      <li>
                        • Vilanow takes a 10% platform fee on all transactions
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="flex-1 px-6 py-3 bg-bg-tertiary hover:bg-bg-primary border border-border-color text-text-primary rounded-xl font-semibold transition-colors">
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={!description.trim() || price < 10} className="flex-1 px-6 py-3 bg-gradient-gold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-xl font-semibold transition-all gold-glow">
                  Create Offer
                </button>
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}