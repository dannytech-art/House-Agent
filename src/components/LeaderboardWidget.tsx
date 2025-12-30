import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Medal, Crown } from 'lucide-react';
interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  change: number;
}
interface LeaderboardWidgetProps {
  currentUserRank?: number;
  compact?: boolean;
  onViewAll?: () => void;
}
export function LeaderboardWidget({
  currentUserRank = 15,
  compact = false,
  onViewAll
}: LeaderboardWidgetProps) {
  const topAgents: LeaderboardEntry[] = [{
    rank: 1,
    name: 'Tunde Bakare',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde&backgroundColor=D4AF37',
    score: 2450,
    change: 2
  }, {
    rank: 2,
    name: 'Funmi Adeyemi',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Funmi&backgroundColor=D4AF37',
    score: 2380,
    change: -1
  }, {
    rank: 3,
    name: 'Chidi Okafor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chidi&backgroundColor=D4AF37',
    score: 2290,
    change: 1
  }];
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-primary" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-400" />;
    return <span className="text-sm font-bold text-text-tertiary">#{rank}</span>;
  };
  if (compact) {
    return <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="bg-bg-primary border border-border-color rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-text-primary">
              Weekly Leaderboard
            </h3>
          </div>
          <button onClick={onViewAll} className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-2">
          {topAgents.slice(0, 3).map(agent => <div key={agent.rank} className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-secondary transition-colors cursor-pointer">
              <div className="w-6 flex items-center justify-center">
                {getRankIcon(agent.rank)}
              </div>
              <img src={agent.avatar} alt={agent.name} className="w-8 h-8 rounded-full border-2 border-primary/30" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">
                  {agent.name}
                </p>
              </div>
              <span className="text-xs font-bold text-primary">
                {agent.score}
              </span>
            </div>)}
        </div>

        {currentUserRank && currentUserRank > 3 && <div className="mt-3 pt-3 border-t border-border-color">
            <div className="flex items-center gap-3 p-2 bg-primary/5 rounded-lg">
              <div className="w-6 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">
                  #{currentUserRank}
                </span>
              </div>
              <div className="w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-black">You</span>
              </div>
              <span className="text-sm font-semibold text-primary">
                Your Rank
              </span>
            </div>
          </div>}
      </motion.div>;
  }
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-text-primary">
              Weekly Leaderboard
            </h3>
            <p className="text-sm text-text-tertiary">Top performing agents</p>
          </div>
        </div>
        <button onClick={onViewAll} className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-semibold text-sm transition-colors">
          View Full List
        </button>
      </div>

      <div className="space-y-3">
        {topAgents.map((agent, index) => <motion.div key={agent.rank} initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: index * 0.1
      }} className={`flex items-center gap-4 p-4 rounded-xl transition-all ${agent.rank === 1 ? 'bg-gradient-gold/20 border-2 border-primary' : 'bg-bg-primary border border-border-color'}`}>
            <div className="w-10 flex items-center justify-center">
              {getRankIcon(agent.rank)}
            </div>
            <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-full border-2 border-primary/30" />
            <div className="flex-1">
              <p className="font-semibold text-text-primary">{agent.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-primary">
                  {agent.score} pts
                </span>
                <div className={`flex items-center gap-1 text-xs ${agent.change > 0 ? 'text-success' : 'text-danger'}`}>
                  <TrendingUp className={`w-3 h-3 ${agent.change < 0 ? 'rotate-180' : ''}`} />
                  <span>{Math.abs(agent.change)}</span>
                </div>
              </div>
            </div>
          </motion.div>)}
      </div>
    </motion.div>;
}