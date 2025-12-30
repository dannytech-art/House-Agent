import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import { AIPriceAnalysis } from '../types';
import { getPriceBadgeColor, getPriceBadgeLabel } from '../utils/aiIntelligence';
interface AIPriceBadgeProps {
  priceAnalysis: AIPriceAnalysis;
  compact?: boolean;
}
export function AIPriceBadge({
  priceAnalysis,
  compact = false
}: AIPriceBadgeProps) {
  const {
    label,
    difference,
    explanation,
    comparables
  } = priceAnalysis;
  const colorClass = getPriceBadgeColor(label);
  const labelText = getPriceBadgeLabel(label);
  const Icon = difference < -5 ? TrendingDown : difference > 5 ? TrendingUp : DollarSign;
  if (compact) {
    return <motion.div initial={{
      scale: 0.9,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-full ${colorClass}`}>
        <Icon className="w-3.5 h-3.5" />
        <span className="text-xs font-bold">{labelText}</span>
      </motion.div>;
  }
  return <motion.div initial={{
    y: 10,
    opacity: 0
  }} animate={{
    y: 0,
    opacity: 1
  }} transition={{
    delay: 0.1
  }} className={`border rounded-xl p-3 ${colorClass}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${label === 'great-deal' || label === 'below-market' ? 'bg-success/20' : label === 'fair' ? 'bg-primary/20' : 'bg-warning/20'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold">{labelText}</span>
            {(label === 'slightly-overpriced' || label === 'overpriced') && <AlertCircle className="w-4 h-4" />}
          </div>
          <p className="text-xs opacity-90 mb-1">{explanation}</p>
          <p className="text-xs opacity-75">
            Based on {comparables} similar properties
          </p>
        </div>
      </div>
    </motion.div>;
}