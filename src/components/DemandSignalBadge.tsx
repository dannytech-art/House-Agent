import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, TrendingDown } from 'lucide-react';
import { DemandSignal } from '../types';
import { getDemandUrgencyColor } from '../utils/aiIntelligence';
interface DemandSignalBadgeProps {
  demandSignal: DemandSignal;
  compact?: boolean;
}
export function DemandSignalBadge({
  demandSignal,
  compact = false
}: DemandSignalBadgeProps) {
  const {
    trend,
    message,
    urgency,
    icon
  } = demandSignal;
  const colorClass = getDemandUrgencyColor(urgency);
  const Icon = trend === 'rising' ? TrendingUp : trend === 'falling' ? TrendingDown : Activity;
  if (compact) {
    return <motion.div initial={{
      scale: 0.9,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-full ${colorClass}`}>
        <span className="text-xs">{icon}</span>
        <Icon className="w-3.5 h-3.5" />
        <span className="text-xs font-bold capitalize">{trend}</span>
      </motion.div>;
  }
  return <motion.div initial={{
    y: 10,
    opacity: 0
  }} animate={{
    y: 0,
    opacity: 1
  }} transition={{
    delay: 0.2
  }} className={`border rounded-xl p-3 ${colorClass}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <Icon className="w-4 h-4" />
            <span className="text-sm font-bold">Market Signal</span>
          </div>
          <p className="text-xs font-medium">{message}</p>
        </div>
      </div>
    </motion.div>;
}