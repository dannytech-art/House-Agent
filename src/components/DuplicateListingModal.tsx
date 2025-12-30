import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Zap, Phone, Mail, MessageCircle, CheckCircle, Bookmark } from 'lucide-react';
import { DirectAgentContact } from '../types';
interface DuplicateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  directAgent: DirectAgentContact;
  onUnlock: () => void;
  onStartChat: () => void;
  credits: number;
}
export function DuplicateListingModal({
  isOpen,
  onClose,
  directAgent,
  onUnlock,
  onStartChat,
  credits
}: DuplicateListingModalProps) {
  const unlockCost = 50;
  const canAfford = credits >= unlockCost;
  const [isSaved, setIsSaved] = useState(false);
  const handleSaveContact = () => {
    // Save to localStorage
    const savedContacts = JSON.parse(localStorage.getItem('vilanow_saved_contacts') || '[]');
    const newContact = {
      id: `contact-${Date.now()}`,
      agentId: directAgent.agentId,
      agentName: directAgent.agentName,
      agentPhone: directAgent.agentPhone,
      agentEmail: directAgent.agentEmail,
      agentAvatar: directAgent.agentAvatar,
      verified: directAgent.verified,
      rating: directAgent.rating,
      agentType: 'direct',
      savedAt: new Date().toISOString()
    };
    savedContacts.push(newContact);
    localStorage.setItem('vilanow_saved_contacts', JSON.stringify(savedContacts));
    setIsSaved(true);
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
            <div className="bg-bg-secondary rounded-2xl border-2 border-primary/30 max-w-lg w-full p-6 gold-glow">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-text-primary">
                      Duplicate Listing Detected
                    </h3>
                    <p className="text-sm text-text-tertiary">
                      Direct agent already has this property
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
                  <X className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>

              {/* Content */}
              {!directAgent.unlocked ? <>
                  <div className="bg-bg-tertiary/50 rounded-xl p-4 mb-6">
                    <p className="text-text-secondary mb-4">
                      This property is already listed by a{' '}
                      <span className="text-primary font-semibold">
                        Direct Agent
                      </span>
                      . Unlock their contact details to collaborate or refer
                      clients.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-text-tertiary">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span>Verified Direct Agent</span>
                    </div>
                  </div>

                  {/* Unlock Card */}
                  <div className="bg-gradient-gold-subtle border border-primary/30 rounded-xl p-5 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-text-primary font-semibold">
                        Unlock Direct Agent
                      </span>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-warning/20 rounded-full">
                        <Zap className="w-4 h-4 text-warning" />
                        <span className="font-bold text-warning">
                          {unlockCost} credits
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-text-tertiary">
                      Get full contact details and chat access
                    </p>
                  </div>

                  {/* Your Credits */}
                  <div className="flex items-center justify-between p-4 bg-bg-tertiary/30 rounded-lg mb-6">
                    <span className="text-text-secondary">Your Credits</span>
                    <span className="font-bold text-text-primary">
                      {credits}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-6 py-3 bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary rounded-xl font-semibold transition-colors">
                      Cancel
                    </button>
                    <button onClick={onUnlock} disabled={!canAfford} className="flex-1 px-6 py-3 bg-gradient-gold hover:opacity-90 text-black rounded-xl font-bold transition-all gold-glow disabled:opacity-50 disabled:cursor-not-allowed">
                      Unlock Contact
                    </button>
                  </div>

                  {!canAfford && <p className="text-center text-sm text-danger mt-3">
                      Insufficient credits. Top up your wallet to continue.
                    </p>}
                </> : <>
                  {/* Unlocked Agent Info */}
                  <div className="bg-gradient-gold-subtle border border-primary/30 rounded-xl p-5 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      {directAgent.agentAvatar ? <img src={directAgent.agentAvatar} alt={directAgent.agentName} className="w-16 h-16 rounded-full border-2 border-primary" /> : <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center">
                          <span className="text-2xl font-bold text-black">
                            {directAgent.agentName.charAt(0)}
                          </span>
                        </div>}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-display text-lg font-bold text-text-primary">
                            {directAgent.agentName}
                          </h4>
                          {directAgent.verified && <CheckCircle className="w-5 h-5 text-success" />}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-primary font-semibold">
                            Direct Agent
                          </span>
                          <span className="text-sm text-text-tertiary">
                            • ⭐ {directAgent.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-bg-secondary/50 rounded-lg">
                        <Phone className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs text-text-tertiary">Phone</p>
                          <p className="font-semibold text-text-primary">
                            {directAgent.agentPhone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-bg-secondary/50 rounded-lg">
                        <Mail className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs text-text-tertiary">Email</p>
                          <p className="font-semibold text-text-primary">
                            {directAgent.agentEmail}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Contact Notice */}
                  {isSaved && <motion.div initial={{
              opacity: 0,
              scale: 0.95
            }} animate={{
              opacity: 1,
              scale: 1
            }} className="mb-4 p-3 bg-success/10 border border-success/30 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <p className="text-sm text-success font-semibold">
                        Contact saved! View in My Listings.
                      </p>
                    </motion.div>}

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-3">
                    <button onClick={onClose} className="px-4 py-3 bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary rounded-xl font-semibold transition-colors">
                      Close
                    </button>
                    <button onClick={handleSaveContact} disabled={isSaved} className="px-4 py-3 bg-bg-tertiary hover:bg-bg-tertiary/80 border border-primary/30 text-text-primary rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-primary text-primary' : ''}`} />
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                    <button onClick={onStartChat} className="px-4 py-3 bg-gradient-gold hover:opacity-90 text-black rounded-xl font-bold transition-all gold-glow flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </button>
                  </div>
                </>}
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}