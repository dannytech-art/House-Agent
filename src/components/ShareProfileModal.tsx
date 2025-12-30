import React, { useState, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2, MessageCircle } from 'lucide-react';
interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  agentName: string;
}
export function ShareProfileModal({
  isOpen,
  onClose,
  agentId,
  agentName
}: ShareProfileModalProps) {
  const [copied, setCopied] = useState(false);
  const profileUrl = `${window.location.origin}/agent/${agentId}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleWhatsAppShare = () => {
    const message = `Check out my Vilanow profile! View my property listings and get in touch: ${profileUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };
  const handleTwitterShare = () => {
    const message = `Check out my property listings on @Vilanow! ${profileUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank');
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
                  <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center">
                    <Share2 className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-text-primary">
                      Share Your Profile
                    </h3>
                    <p className="text-sm text-text-tertiary">
                      Let clients view your listings
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
                  <X className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>

              {/* Profile URL */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Your Profile Link
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 bg-bg-tertiary border border-border-color rounded-xl text-text-primary text-sm truncate">
                    {profileUrl}
                  </div>
                  <button onClick={handleCopyLink} className="px-4 py-3 bg-gradient-gold hover:opacity-90 text-black rounded-xl font-semibold transition-all gold-glow flex items-center gap-2">
                    {copied ? <>
                        <Check className="w-5 h-5" />
                        <span>Copied!</span>
                      </> : <>
                        <Copy className="w-5 h-5" />
                        <span>Copy</span>
                      </>}
                  </button>
                </div>
              </div>

              {/* Share Options */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  Share via
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleWhatsAppShare} className="p-4 bg-success/10 hover:bg-success/20 border border-success/30 rounded-xl transition-all flex items-center justify-center gap-2 group">
                    <MessageCircle className="w-5 h-5 text-success" />
                    <span className="font-semibold text-success">WhatsApp</span>
                  </button>

                  <button onClick={handleTwitterShare} className="p-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl transition-all flex items-center justify-center gap-2 group">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    <span className="font-semibold text-primary">Twitter</span>
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                <p className="text-sm text-text-secondary">
                  <span className="font-semibold text-primary">Tip:</span> Share
                  this link on your social media, business cards, or email
                  signature to let potential clients view your listings and
                  contact you directly.
                </p>
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}