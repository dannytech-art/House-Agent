import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import { AIMatchScore } from '../types';
import { getMatchScoreColor } from '../utils/aiIntelligence';
interface AIMatchBadgeProps {
  matchScore: AIMatchScore;
  compact?: boolean;
}
export function AIMatchBadge({
  matchScore,
  compact = false
}: AIMatchBadgeProps) {
  const {
    score,
    confidence,
    explanation
  } = matchScore;
  const colorClass = getMatchScoreColor(score);
  if (compact) {
    return <motion.div initial={{
      scale: 0.9,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/30 rounded-full">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span className={`text-xs font-bold ${colorClass}`}>
          {score}% Match
        </span>
      </motion.div>;
  }
  return <motion.div initial={{
    y: 10,
    opacity: 0
  }} animate={{
    y: 0,
    opacity: 1
  }} className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-black" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-2xl font-bold ${colorClass}`}>{score}%</span>
            <span className="text-sm font-semibold text-text-primary">
              AI Match
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${confidence === 'high' ? 'bg-success/20 text-success' : confidence === 'medium' ? 'bg-warning/20 text-warning' : 'bg-text-tertiary/20 text-text-tertiary'}`}>
              {confidence}
            </span>
          </div>
          <p className="text-xs text-text-secondary line-clamp-2">
            {explanation}
          </p>
        </div>
      </div>
    </motion.div>;
}