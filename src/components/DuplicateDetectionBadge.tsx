import React from 'react';
import { motion } from 'framer-motion';
import { Copy, AlertTriangle, CheckCircle } from 'lucide-react';
interface DuplicateDetectionBadgeProps {
  isDuplicate: boolean;
  isDirectAgent: boolean;
  duplicateCount?: number;
  compact?: boolean;
}
export function DuplicateDetectionBadge({
  isDuplicate,
  isDirectAgent,
  duplicateCount = 1,
  compact = false
}: DuplicateDetectionBadgeProps) {
  if (!isDuplicate) return null;
  if (compact) {
    return <motion.div initial={{
      scale: 0.9,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${isDirectAgent ? 'bg-success/20 border-success/30 text-success' : 'bg-warning/20 border-warning/30 text-warning'}`}>
        {isDirectAgent ? <>
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">Direct Agent</span>
          </> : <>
            <Copy className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">Semi-Direct</span>
          </>}
      </motion.div>;
  }
  return <motion.div initial={{
    y: 10,
    opacity: 0
  }} animate={{
    y: 0,
    opacity: 1
  }} className={`rounded-xl p-3 border ${isDirectAgent ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isDirectAgent ? 'bg-success/20' : 'bg-warning/20'}`}>
          {isDirectAgent ? <CheckCircle className="w-5 h-5 text-success" /> : <AlertTriangle className="w-5 h-5 text-warning" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-bold ${isDirectAgent ? 'text-success' : 'text-warning'}`}>
              {isDirectAgent ? 'Original Listing' : 'Duplicate Detected'}
            </span>
          </div>
          <p className="text-xs text-text-secondary">
            {isDirectAgent ? 'This is the original listing from the direct agent' : `This property has ${duplicateCount} other listing${duplicateCount > 1 ? 's' : ''}. Contact direct agent for best terms.`}
          </p>
        </div>
      </div>
    </motion.div>;
}