import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Phone, User, TrendingUp, Clock, MessageCircle } from 'lucide-react';
import { Interest } from '../types';
interface InterestCardProps {
  interest: Interest;
  onUnlock: (interest: Interest) => void;
  onStartChat: (interest: Interest) => void;
  index: number;
}
export function InterestCard({
  interest,
  onUnlock,
  onStartChat,
  index
}: InterestCardProps) {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-NG', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  const getStatusColor = (status: Interest['status']) => {
    switch (status) {
      case 'pending':
        return 'text-warning';
      case 'contacted':
        return 'text-primary';
      case 'viewing-scheduled':
        return 'text-success';
      case 'closed':
        return 'text-text-tertiary';
    }
  };
  const getStatusLabel = (status: Interest['status']) => {
    switch (status) {
      case 'pending':
        return 'New Interest';
      case 'contacted':
        return 'Contacted';
      case 'viewing-scheduled':
        return 'Viewing Scheduled';
      case 'closed':
        return 'Closed';
    }
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay: index * 0.05
  }} className="bg-bg-primary rounded-xl p-5 border border-border-color">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm font-semibold ${getStatusColor(interest.status)}`}>
              {getStatusLabel(interest.status)}
            </span>
            <span className="text-xs text-text-tertiary">•</span>
            <span className="text-xs text-text-tertiary">
              {formatDate(interest.createdAt)}
            </span>
          </div>
          <p className="text-text-secondary text-sm">
            Property ID: {interest.propertyId}
          </p>
        </div>

        {/* Seriousness Score */}
        <div className="flex items-center gap-1 px-3 py-1.5 bg-success/10 rounded-full">
          <TrendingUp className="w-4 h-4 text-success" />
          <span className="text-sm font-bold text-success">
            {interest.seriousnessScore}%
          </span>
        </div>
      </div>

      {/* Message */}
      <div className="bg-bg-secondary rounded-lg p-3 mb-4">
        <p className="text-sm text-text-secondary italic">
          "{interest.message}"
        </p>
      </div>

      {/* Contact Details or Unlock */}
      {interest.unlocked ? <motion.div initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-success/5 rounded-lg">
            <User className="w-5 h-5 text-success" />
            <div>
              <p className="text-xs text-text-tertiary">Name</p>
              <p className="font-medium text-text-primary">
                {interest.seekerName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-success/5 rounded-lg">
            <Phone className="w-5 h-5 text-success" />
            <div>
              <p className="text-xs text-text-tertiary">Phone</p>
              <p className="font-medium text-text-primary">
                {interest.seekerPhone}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button className="px-4 py-3 bg-bg-secondary hover:bg-bg-tertiary border border-border-color text-text-primary rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Call Now
            </button>
            <button onClick={() => onStartChat(interest)} className="px-4 py-3 bg-gradient-gold hover:opacity-90 text-black rounded-lg font-bold transition-all flex items-center justify-center gap-2 gold-glow">
              <MessageCircle className="w-4 h-4" />
              Start Chat
            </button>
          </div>
        </motion.div> : <motion.button whileHover={{
      scale: 1.02
    }} whileTap={{
      scale: 0.98
    }} onClick={() => onUnlock(interest)} className="w-full px-4 py-4 bg-gradient-to-r from-warning to-warning/80 hover:from-warning/90 hover:to-warning/70 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-warning/20">
          <Unlock className="w-5 h-5" />
          <span>Unlock Contact Details</span>
          <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
            10 credits
          </span>
        </motion.button>}
    </motion.div>;
}