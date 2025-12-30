import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, MapPin, Home, User, CheckCircle, AlertTriangle } from 'lucide-react';
import { Property } from '../types';
interface DuplicateGroupCardProps {
  groupId: string;
  properties: Property[];
  directAgentId: string | null;
  onViewProperty: (property: Property) => void;
}
export function DuplicateGroupCard({
  groupId,
  properties,
  directAgentId,
  onViewProperty
}: DuplicateGroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const primaryProperty = properties.find(p => p.agentId === directAgentId) || properties[0];
  const duplicateCount = properties.length - 1;
  const formatPrice = (price: number) => {
    return `₦${(price / 1000000).toFixed(1)}M`;
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="bg-bg-primary border-2 border-warning/30 rounded-xl overflow-hidden">
      {/* Header - Primary Listing */}
      <div className="p-5 bg-warning/5">
        <div className="flex items-start gap-4 mb-4">
          <img src={primaryProperty.images[0]} alt={primaryProperty.title} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-display text-lg font-bold text-text-primary line-clamp-2">
                {primaryProperty.title}
              </h3>
              {primaryProperty.agentId === directAgentId && <div className="flex items-center gap-1.5 px-2.5 py-1 bg-success/20 border border-success/30 rounded-full flex-shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-success" />
                  <span className="text-xs font-bold text-success">Direct</span>
                </div>}
            </div>

            <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{primaryProperty.location}</span>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-gradient-gold">
                {formatPrice(primaryProperty.price)}
              </p>
              <div className="flex items-center gap-3 text-xs text-text-tertiary">
                {primaryProperty.bedrooms && <span>{primaryProperty.bedrooms} bed</span>}
                {primaryProperty.bathrooms && <span>{primaryProperty.bathrooms} bath</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Warning */}
        <div className="flex items-center justify-between p-3 bg-warning/10 border border-warning/30 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <span className="text-sm font-semibold text-warning">
              {duplicateCount} duplicate listing{duplicateCount > 1 ? 's' : ''}{' '}
              detected
            </span>
          </div>
          <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2 px-3 py-1.5 bg-warning/20 hover:bg-warning/30 rounded-lg transition-colors">
            <span className="text-xs font-bold text-warning">
              {isExpanded ? 'Hide' : 'View All'}
            </span>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-warning" /> : <ChevronDown className="w-4 h-4 text-warning" />}
          </button>
        </div>
      </div>

      {/* Expanded - Show All Duplicates */}
      {isExpanded && <motion.div initial={{
      height: 0,
      opacity: 0
    }} animate={{
      height: 'auto',
      opacity: 1
    }} exit={{
      height: 0,
      opacity: 0
    }} className="border-t border-warning/30">
          <div className="p-5 space-y-3">
            {properties.filter(p => p.id !== primaryProperty.id).map((property, index) => <motion.button key={property.id} initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          delay: index * 0.05
        }} onClick={() => onViewProperty(property)} className="w-full flex items-center gap-4 p-3 bg-bg-secondary hover:bg-bg-tertiary rounded-lg border border-border-color hover:border-primary/30 transition-all text-left">
                  <img src={property.images[0]} alt={property.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-text-tertiary" />
                      <span className="text-sm font-semibold text-text-primary">
                        {property.agentName}
                      </span>
                      {property.agentType === 'semi-direct' && <span className="text-xs px-2 py-0.5 bg-warning/20 text-warning rounded-full">
                          Semi-Direct
                        </span>}
                    </div>
                    <p className="text-xs text-text-secondary">
                      Listed {new Date(property.postedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">
                      {formatPrice(property.price)}
                    </p>
                  </div>
                </motion.button>)}
          </div>
        </motion.div>}
    </motion.div>;
}