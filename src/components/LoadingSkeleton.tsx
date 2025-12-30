import React from 'react';
import { motion } from 'framer-motion';
interface LoadingSkeletonProps {
  className?: string;
  count?: number;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}
export function LoadingSkeleton({
  className = '',
  count = 1,
  variant = 'rectangular'
}: LoadingSkeletonProps) {
  const skeletons = Array(count).fill(0);
  if (variant === 'card') {
    return <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {skeletons.map((_, i) => <div key={i} className="bg-bg-secondary rounded-2xl overflow-hidden border border-border-color h-[400px]">
            <div className="h-[60%] bg-bg-tertiary animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-6 bg-bg-tertiary rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-bg-tertiary rounded w-1/2 animate-pulse" />
              <div className="flex gap-2 pt-2">
                <div className="h-4 bg-bg-tertiary rounded w-16 animate-pulse" />
                <div className="h-4 bg-bg-tertiary rounded w-16 animate-pulse" />
              </div>
            </div>
          </div>)}
      </div>;
  }
  return <>
      {skeletons.map((_, i) => <div key={i} className={`
            bg-bg-tertiary animate-pulse
            ${variant === 'circular' ? 'rounded-full' : 'rounded-md'}
            ${className}
          `} />)}
    </>;
}