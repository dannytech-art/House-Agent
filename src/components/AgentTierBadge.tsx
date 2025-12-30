import React from 'react';
import { motion } from 'framer-motion';
import { Crown, TrendingUp, Zap, Award, Trophy } from 'lucide-react';
import { AgentTier } from '../types';
interface AgentTierBadgeProps {
  tier: AgentTier;
  level: number;
  compact?: boolean;
}
const tierConfig = {
  'street-scout': {
    name: 'Street Scout',
    icon: Zap,
    color: 'from-gray-400 to-gray-600',
    textColor: 'text-gray-400',
    bgColor: 'bg-gray-400/10',
    borderColor: 'border-gray-400/30',
    minLevel: 1
  },
  'area-broker': {
    name: 'Area Broker',
    icon: TrendingUp,
    color: 'from-blue-400 to-blue-600',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/30',
    minLevel: 5
  },
  'market-dealer': {
    name: 'Market Dealer',
    icon: Award,
    color: 'from-purple-400 to-purple-600',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/30',
    minLevel: 10
  },
  'territory-leader': {
    name: 'Territory Leader',
    icon: Crown,
    color: 'from-primary to-secondary',
    textColor: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    minLevel: 20
  },
  'city-mogul': {
    name: 'City Mogul',
    icon: Trophy,
    color: 'from-yellow-400 via-primary to-yellow-600',
    textColor: 'text-primary',
    bgColor: 'bg-gradient-gold-subtle',
    borderColor: 'border-primary/50',
    minLevel: 50
  }
};
export function AgentTierBadge({
  tier,
  level,
  compact = false
}: AgentTierBadgeProps) {
  const config = tierConfig[tier];
  const Icon = config.icon;
  if (compact) {
    return <motion.div initial={{
      scale: 0.9,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.borderColor} ${config.bgColor}`}>
        <Icon className={`w-4 h-4 ${config.textColor}`} />
        <span className={`text-sm font-bold ${config.textColor}`}>
          {config.name}
        </span>
      </motion.div>;
  }
  return <motion.div initial={{
    scale: 0.95,
    opacity: 0
  }} animate={{
    scale: 1,
    opacity: 1
  }} whileHover={{
    scale: 1.02
  }} className={`relative overflow-hidden rounded-xl border-2 ${config.borderColor} ${config.bgColor} p-6`}>
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-5`} />

      {/* Content */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className={`font-display text-2xl font-bold ${config.textColor}`}>
                {config.name}
              </h3>
              <p className="text-sm text-text-tertiary">Level {level} Agent</p>
            </div>
          </div>

          {tier === 'city-mogul' && <motion.div animate={{
          rotate: [0, 10, -10, 0]
        }} transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}>
              <Trophy className="w-8 h-8 text-primary" />
            </motion.div>}
        </div>

        {/* Tier Benefits */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <div className="w-1.5 h-1.5 rounded-full bg-success" />
            <span>Unlocked at Level {config.minLevel}</span>
          </div>
          {tier === 'territory-leader' && <div className="flex items-center gap-2 text-sm text-text-secondary">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Earn passive credits from territories</span>
            </div>}
          {tier === 'city-mogul' && <div className="flex items-center gap-2 text-sm text-text-secondary">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Maximum visibility & exclusive perks</span>
            </div>}
        </div>
      </div>
    </motion.div>;
}