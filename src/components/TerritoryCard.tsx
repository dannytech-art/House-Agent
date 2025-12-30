import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, Home, Award, ChevronRight } from 'lucide-react';
import { AgentTerritory } from '../types';
interface TerritoryCardProps {
  territory: AgentTerritory;
  onClick?: () => void;
}
export function TerritoryCard({
  territory,
  onClick
}: TerritoryCardProps) {
  const {
    area,
    dominance,
    activeListings,
    monthlyDeals,
    rank
  } = territory;
  const getDominanceColor = (dominance: number) => {
    if (dominance >= 80) return 'text-success';
    if (dominance >= 60) return 'text-primary';
    if (dominance >= 40) return 'text-warning';
    return 'text-text-tertiary';
  };
  const getDominanceLabel = (dominance: number) => {
    if (dominance >= 80) return 'Dominant';
    if (dominance >= 60) return 'Strong';
    if (dominance >= 40) return 'Growing';
    return 'Emerging';
  };
  return <motion.button onClick={onClick} initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} whileHover={{
    scale: 1.02,
    y: -2
  }} whileTap={{
    scale: 0.98
  }} className="w-full bg-bg-primary border border-border-color hover:border-primary/30 rounded-xl p-5 transition-all text-left group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <MapPin className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
              {area}
            </h3>
            <p className="text-xs text-text-tertiary">Rank #{rank} in area</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-text-tertiary group-hover:text-primary transition-colors" />
      </div>

      {/* Dominance Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-text-secondary">
            Territory Control
          </span>
          <span className={`text-sm font-bold ${getDominanceColor(dominance)}`}>
            {dominance}% {getDominanceLabel(dominance)}
          </span>
        </div>
        <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
          <motion.div initial={{
          width: 0
        }} animate={{
          width: `${dominance}%`
        }} transition={{
          duration: 1,
          ease: 'easeOut'
        }} className={`h-full rounded-full ${dominance >= 80 ? 'bg-success' : dominance >= 60 ? 'bg-primary' : dominance >= 40 ? 'bg-warning' : 'bg-text-tertiary'}`} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-2 bg-bg-secondary rounded-lg">
          <Home className="w-4 h-4 text-primary" />
          <div>
            <p className="text-xs text-text-tertiary">Active</p>
            <p className="text-sm font-bold text-text-primary">
              {activeListings}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-bg-secondary rounded-lg">
          <Award className="w-4 h-4 text-success" />
          <div>
            <p className="text-xs text-text-tertiary">Deals/mo</p>
            <p className="text-sm font-bold text-text-primary">
              {monthlyDeals}
            </p>
          </div>
        </div>
      </div>

      {/* Passive Earnings Indicator */}
      {dominance >= 60 && <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-success/10 border border-success/30 rounded-lg">
          <TrendingUp className="w-4 h-4 text-success" />
          <span className="text-xs font-semibold text-success">
            Earning +{Math.floor(dominance / 10)} credits/day
          </span>
        </div>}
    </motion.button>;
}