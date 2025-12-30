import React from 'react';
import { motion } from 'framer-motion';
import { BoxIcon } from 'lucide-react';
interface EmptyStateProps {
  icon: BoxIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return <motion.div initial={{
    opacity: 0,
    scale: 0.95
  }} animate={{
    opacity: 1,
    scale: 1
  }} className="text-center py-16 px-4 bg-bg-primary rounded-2xl border border-border-color border-dashed flex flex-col items-center justify-center h-full min-h-[300px]">
      <div className="w-16 h-16 bg-bg-tertiary rounded-full flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-text-tertiary" />
      </div>
      <h3 className="font-display text-xl font-bold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-text-secondary max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && <button onClick={onAction} className="px-6 py-2 bg-bg-secondary hover:bg-bg-tertiary border border-border-color text-text-primary font-medium rounded-xl transition-colors">
          {actionLabel}
        </button>}
    </motion.div>;
}