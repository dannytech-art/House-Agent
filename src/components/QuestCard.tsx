import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Zap, TrendingUp } from 'lucide-react';
import { Quest } from '../types';
interface QuestCardProps {
  quest: Quest;
  index: number;
}
export function QuestCard({
  quest,
  index
}: QuestCardProps) {
  const progress = quest.progress / quest.target * 100;
  const isDaily = quest.type === 'daily';
  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const hours = Math.floor((expires.getTime() - now.getTime()) / (1000 * 60 * 60));
    if (hours < 24) {
      return `${hours}h remaining`;
    }
    const days = Math.floor(hours / 24);
    return `${days}d remaining`;
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay: index * 0.05
  }} className={`relative bg-bg-primary rounded-xl p-5 border-2 transition-all ${quest.completed ? 'border-success bg-success/5' : 'border-border-color hover:border-primary/50'}`}>
      {/* Type Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isDaily ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
          {isDaily ? 'DAILY' : 'WEEKLY'}
        </span>

        {quest.completed ? <div className="flex items-center gap-1 text-success">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-bold">Completed</span>
          </div> : <div className="flex items-center gap-1 text-text-tertiary">
            <Clock className="w-4 h-4" />
            <span className="text-xs">{getTimeRemaining(quest.expiresAt)}</span>
          </div>}
      </div>

      {/* Title & Description */}
      <h3 className="font-display text-lg font-bold text-text-primary mb-2">
        {quest.title}
      </h3>
      <p className="text-sm text-text-secondary mb-4">{quest.description}</p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-text-tertiary">
            Progress: {quest.progress}/{quest.target}
          </span>
          <span className="font-bold text-primary">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
          <motion.div initial={{
          width: 0
        }} animate={{
          width: `${progress}%`
        }} transition={{
          duration: 0.5,
          ease: 'easeOut'
        }} className={`h-full rounded-full ${quest.completed ? 'bg-success' : 'bg-primary'}`} />
        </div>
      </div>

      {/* Rewards */}
      <div className="flex items-center gap-4 pt-4 border-t border-border-color">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-warning" />
          <span className="text-sm font-semibold text-text-primary">
            +{quest.reward.xp} XP
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-text-primary">
            +{quest.reward.credits} Credits
          </span>
        </div>
      </div>

      {/* Completed Overlay */}
      {quest.completed && <motion.div initial={{
      scale: 0
    }} animate={{
      scale: 1
    }} className="absolute top-4 right-4 w-12 h-12 bg-success rounded-full flex items-center justify-center shadow-lg">
          <CheckCircle className="w-7 h-7 text-white" />
        </motion.div>}
    </motion.div>;
}