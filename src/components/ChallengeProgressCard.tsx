import React from 'react';
import { motion } from 'framer-motion';
import { Target, Upload, DollarSign, Users, CheckCircle, Clock } from 'lucide-react';
import { AgentChallenge } from '../types';
interface ChallengeProgressCardProps {
  challenge: AgentChallenge;
}
const challengeIcons = {
  upload: Upload,
  pricing: DollarSign,
  deal: Target,
  collaboration: Users
};
export function ChallengeProgressCard({
  challenge
}: ChallengeProgressCardProps) {
  const {
    title,
    description,
    type,
    progress,
    target,
    reward,
    deadline,
    completed
  } = challenge;
  const Icon = challengeIcons[type];
  const progressPercent = progress / target * 100;
  const timeLeft = () => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h left`;
    const days = Math.floor(hours / 24);
    return `${days}d left`;
  };
  return <motion.div initial={{
    opacity: 0,
    scale: 0.95
  }} animate={{
    opacity: 1,
    scale: 1
  }} className={`relative overflow-hidden rounded-xl border-2 p-5 transition-all ${completed ? 'bg-success/5 border-success/30' : 'bg-bg-primary border-border-color hover:border-primary/30'}`}>
      {/* Completed Overlay */}
      {completed && <div className="absolute top-3 right-3">
          <CheckCircle className="w-6 h-6 text-success" />
        </div>}

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${completed ? 'bg-success/20' : 'bg-primary/10'}`}>
          <Icon className={`w-6 h-6 ${completed ? 'text-success' : 'text-primary'}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary mb-1">{title}</h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-text-secondary">
            Progress
          </span>
          <span className={`text-sm font-bold ${completed ? 'text-success' : 'text-primary'}`}>
            {progress}/{target}
          </span>
        </div>
        <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
          <motion.div initial={{
          width: 0
        }} animate={{
          width: `${progressPercent}%`
        }} transition={{
          duration: 0.8,
          ease: 'easeOut'
        }} className={`h-full rounded-full ${completed ? 'bg-success' : 'bg-gradient-gold'}`} />
        </div>
      </div>

      {/* Rewards & Deadline */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/30 rounded-full">
            <span className="text-xs font-bold text-primary">
              +{reward.xp} XP
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-warning/10 border border-warning/30 rounded-full">
            <span className="text-xs font-bold text-warning">
              +{reward.credits} Credits
            </span>
          </div>
          {reward.badge && <div className="flex items-center gap-1.5 px-2.5 py-1 bg-success/10 border border-success/30 rounded-full">
              <span className="text-xs font-bold text-success">🏆 Badge</span>
            </div>}
        </div>

        {!completed && <div className="flex items-center gap-1.5 text-text-tertiary">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{timeLeft()}</span>
          </div>}
      </div>
    </motion.div>;
}