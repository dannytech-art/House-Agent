import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Trophy, Medal, Crown, TrendingUp, Filter } from 'lucide-react';
import { mockLeaderboardAgents } from '../utils/mockData';
import { AgentTierBadge } from '../components/AgentTierBadge';
export function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const filteredAgents = mockLeaderboardAgents.filter(agent => agent.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400 fill-orange-400" />;
    return <span className="text-lg font-bold text-text-tertiary">#{rank}</span>;
  };
  return <div className="min-h-screen bg-bg-secondary pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-gold rounded-2xl flex items-center justify-center shadow-lg">
              <Trophy className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-text-primary">
                Agent Leaderboard
              </h1>
              <p className="text-text-secondary">
                Top performing agents across Lagos
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-bg-primary p-4 rounded-xl border border-border-color">
            {/* Tabs */}
            <div className="flex bg-bg-secondary p-1 rounded-lg">
              {['weekly', 'monthly', 'all-time'].map(t => <button key={t} onClick={() => setTimeframe(t as any)} className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${timeframe === t ? 'bg-primary text-black shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>
                  {t.replace('-', ' ')}
                </button>)}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input type="text" placeholder="Search agent..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-bg-secondary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none" />
            </div>
          </div>
        </motion.div>

        {/* List */}
        <div className="space-y-3">
          {filteredAgents.map((agent, index) => <motion.div key={agent.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.05
        }} className={`relative flex items-center gap-4 p-4 bg-bg-primary border rounded-xl hover:border-primary/50 transition-all group ${agent.weeklyRank === 15 ? 'border-primary ring-1 ring-primary/50' : 'border-border-color'}`}>
              {/* Rank */}
              <div className="w-12 flex justify-center flex-shrink-0">
                {getRankIcon(agent.weeklyRank || index + 1)}
              </div>

              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-full border-2 border-border-color group-hover:border-primary transition-colors" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-bg-primary rounded-full flex items-center justify-center border border-border-color text-[10px] font-bold">
                  {agent.level}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-text-primary truncate">
                    {agent.name}
                  </h3>
                  {agent.verified && <span className="w-4 h-4 bg-success/20 text-success rounded-full flex items-center justify-center text-[10px]">
                      ✓
                    </span>}
                </div>
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  <span>{agent.totalListings} Listings</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-success" />
                    98% Response
                  </span>
                </div>
              </div>

              {/* Tier Badge (Desktop) */}
              <div className="hidden md:block">
                <AgentTierBadge tier={agent.tier} level={agent.level} compact />
              </div>

              {/* Score */}
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-primary text-lg">
                  {agent.xp.toLocaleString()}
                </p>
                <p className="text-xs text-text-tertiary">XP</p>
              </div>
            </motion.div>)}
        </div>
      </div>
    </div>;
}