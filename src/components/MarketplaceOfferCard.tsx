import React from 'react';
import { motion } from 'framer-motion';
import { User, Home, Handshake, Star, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { MarketplaceOffer } from '../types';
interface MarketplaceOfferCardProps {
  offer: MarketplaceOffer;
  onPurchase: (offer: MarketplaceOffer) => void;
  currentUserId?: string;
}
const offerTypeConfig = {
  lead: {
    icon: User,
    label: 'Buyer Lead',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30'
  },
  'co-broking': {
    icon: Handshake,
    label: 'Co-Broking',
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30'
  },
  access: {
    icon: Home,
    label: 'Property Access',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30'
  }
};
export function MarketplaceOfferCard({
  offer,
  onPurchase,
  currentUserId
}: MarketplaceOfferCardProps) {
  const {
    type,
    agentName,
    description,
    price,
    status,
    createdAt
  } = offer;
  const config = offerTypeConfig[type];
  const Icon = config.icon;
  const isOwnOffer = currentUserId === offer.agentId;
  const isPending = status === 'pending';
  const isCompleted = status === 'completed';
  const timeAgo = () => {
    const now = new Date();
    const created = new Date(createdAt);
    const diff = now.getTime() - created.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };
  return <motion.div initial={{
    opacity: 0,
    scale: 0.95
  }} animate={{
    opacity: 1,
    scale: 1
  }} whileHover={!isOwnOffer && status === 'active' ? {
    scale: 1.02,
    y: -2
  } : {}} className={`relative bg-bg-primary rounded-xl border-2 p-5 transition-all ${isCompleted ? 'opacity-60 border-border-color' : isPending ? 'border-warning/30' : isOwnOffer ? 'border-primary/30' : 'border-border-color hover:border-primary/40'}`}>
      {/* Status Badge */}
      {(isPending || isCompleted) && <div className="absolute top-3 right-3">
          {isPending && <div className="flex items-center gap-1.5 px-2.5 py-1 bg-warning/20 border border-warning/30 rounded-full">
              <Clock className="w-3.5 h-3.5 text-warning" />
              <span className="text-xs font-bold text-warning">Pending</span>
            </div>}
          {isCompleted && <div className="flex items-center gap-1.5 px-2.5 py-1 bg-success/20 border border-success/30 rounded-full">
              <CheckCircle className="w-3.5 h-3.5 text-success" />
              <span className="text-xs font-bold text-success">Completed</span>
            </div>}
        </div>}

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-14 h-14 rounded-xl ${config.bgColor} border ${config.borderColor} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-7 h-7 ${config.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-bold ${config.color}`}>
              {config.label}
            </span>
            {isOwnOffer && <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                Your Offer
              </span>}
          </div>
          <h3 className="font-semibold text-text-primary line-clamp-1 mb-1">
            {description}
          </h3>

          {/* Agent Info */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-gold rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-black">
                {agentName.charAt(0)}
              </span>
            </div>
            <span className="text-sm text-text-secondary">{agentName}</span>
            <CheckCircle className="w-4 h-4 text-success" />
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-primary fill-primary" />
              <span className="text-xs font-semibold text-text-secondary">
                4.8
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary mb-4 line-clamp-2">
        {type === 'lead' && 'Verified buyer lead with serious intent. Pre-qualified and ready to view properties.'}
        {type === 'co-broking' && 'Share commission on this exclusive listing. Direct access to property owner.'}
        {type === 'access' && 'Get direct agent contact for this premium property. Skip the middleman.'}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border-color">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-text-tertiary" />
            <span className="text-xs text-text-tertiary">{timeAgo()}</span>
          </div>
          {type === 'lead' && <div className="flex items-center gap-1.5 px-2 py-1 bg-success/10 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
              <span className="text-xs font-bold text-success">Hot Lead</span>
            </div>}
        </div>

        {!isOwnOffer && status === 'active' ? <button onClick={() => onPurchase(offer)} className="px-4 py-2 bg-gradient-gold hover:opacity-90 text-black rounded-lg font-bold transition-all gold-glow flex items-center gap-2">
            <span>{price} Credits</span>
          </button> : isOwnOffer ? <div className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-bold">
            {price} Credits
          </div> : <div className="px-4 py-2 bg-bg-tertiary text-text-tertiary rounded-lg font-bold">
            {price} Credits
          </div>}
      </div>
    </motion.div>;
}