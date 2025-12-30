import React from 'react';
import { motion } from 'framer-motion';
import { BoxIcon } from 'lucide-react';
interface StatCardProps {
  title: string;
  value: string | number;
  icon: BoxIcon;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'danger';
}
export function DashboardStats({
  stats
}: {
  stats: StatCardProps[];
}) {
  const colorMap = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger'
  };
  return <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
      const Icon = stat.icon;
      const colorClass = colorMap[stat.color || 'primary'];
      return <motion.div key={stat.title} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: index * 0.1
      }} className="bg-bg-primary border border-border-color rounded-2xl p-4 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              {stat.trend && <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.positive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                  {stat.trend.positive ? '+' : ''}
                  {stat.trend.value}%
                </span>}
            </div>

            <h3 className="text-text-secondary text-sm font-medium mb-1">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            {stat.trend && <p className="text-xs text-text-tertiary mt-1">
                {stat.trend.label}
              </p>}
          </motion.div>;
    })}
    </div>;
}