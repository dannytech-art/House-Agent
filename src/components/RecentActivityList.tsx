import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, User, Home } from 'lucide-react';
interface ActivityItem {
  id: string;
  type: 'viewing' | 'listing' | 'offer' | 'system';
  title: string;
  description: string;
  timestamp: string;
  status?: 'pending' | 'completed' | 'failed';
}
export function RecentActivityList({
  activities
}: {
  activities: ActivityItem[];
}) {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'viewing':
        return User;
      case 'listing':
        return Home;
      case 'offer':
        return CheckCircle;
      default:
        return AlertCircle;
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric'
    });
  };
  return <div className="bg-bg-primary border border-border-color rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl font-bold text-text-primary">
          Recent Activity
        </h3>
        <button className="text-sm text-primary hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-6">
        {activities.map((item, index) => {
        const Icon = getIcon(item.type);
        return <motion.div key={item.id} initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          delay: index * 0.1
        }} className="flex gap-4 relative">
              {/* Timeline Line */}
              {index !== activities.length - 1 && <div className="absolute left-[19px] top-10 bottom-[-24px] w-0.5 bg-border-color" />}

              <div className="w-10 h-10 rounded-full bg-bg-tertiary border border-border-color flex items-center justify-center z-10">
                <Icon className="w-5 h-5 text-text-secondary" />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-text-primary text-sm">
                    {item.title}
                  </h4>
                  <span className="text-xs text-text-tertiary flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mt-1">
                  {item.description}
                </p>
              </div>
            </motion.div>;
      })}
      </div>
    </div>;
}