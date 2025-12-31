import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, TrendingUp, Users, Home, DollarSign, Bell, ChevronRight, Share2 } from 'lucide-react';
import { Agent } from '../types';
import { DashboardStats } from '../components/DashboardStats';
import { RecentActivityList } from '../components/RecentActivityList';
import { ChallengeProgressCard } from '../components/ChallengeProgressCard';
import { LeaderboardWidget } from '../components/LeaderboardWidget';
import { ShareProfileModal } from '../components/ShareProfileModal';
interface AgentDashboardPageProps {
  agent: Agent;
  onNavigate: (page: string) => void;
}
export function AgentDashboardPage({
  agent,
  onNavigate
}: AgentDashboardPageProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Guard against null/undefined agent
  if (!agent) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center pb-24">
        <div className="text-center">
          <p className="text-text-secondary">Loading agent dashboard...</p>
        </div>
      </div>
    );
  }
  
  const stats = [{
    title: 'Total Listings',
    value: agent.totalListings,
    icon: Home,
    color: 'primary' as const,
    trend: {
      value: 12,
      label: 'vs last month',
      positive: true
    }
  }, {
    title: 'Active Leads',
    value: agent.totalInterests,
    icon: Users,
    color: 'success' as const,
    trend: {
      value: 8,
      label: 'new this week',
      positive: true
    }
  }, {
    title: 'Wallet Balance',
    value: agent.credits,
    icon: DollarSign,
    color: 'warning' as const,
    trend: {
      value: 5,
      label: 'credits spent',
      positive: false
    }
  }, {
    title: 'Profile Views',
    value: '1.2k',
    icon: TrendingUp,
    color: 'primary' as const,
    trend: {
      value: 24,
      label: 'vs last week',
      positive: true
    }
  }];
  const activities = [{
    id: '1',
    type: 'viewing' as const,
    title: 'Viewing Scheduled',
    description: 'Oluwaseun confirmed viewing for 3-bed apartment',
    timestamp: '2024-01-20T14:30:00Z'
  }, {
    id: '2',
    type: 'offer' as const,
    title: 'New Offer Received',
    description: 'Buyer submitted offer for Duplex in Lekki',
    timestamp: '2024-01-20T10:15:00Z'
  }, {
    id: '3',
    type: 'listing' as const,
    title: 'Listing Verified',
    description: 'Your listing "Luxury Penthouse" is now live',
    timestamp: '2024-01-19T16:45:00Z'
  }];
  return <div className="min-h-screen bg-bg-secondary pb-24">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary mb-1">
              Welcome back, {agent.name?.split(' ')[0] || 'Agent'} 👋
            </h1>
            <p className="text-text-secondary">
              Here's what's happening with your listings today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowShareModal(true)} className="px-4 py-2 bg-gradient-gold hover:opacity-90 text-black font-semibold rounded-xl transition-all flex items-center gap-2 gold-glow">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share Profile</span>
            </button>
            <button onClick={() => onNavigate('notifications')} className="p-3 bg-bg-primary border border-border-color rounded-xl hover:border-primary/50 transition-colors relative">
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-danger rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <DashboardStats stats={stats} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Challenge */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-display text-xl font-bold text-text-primary">
                  Active Challenge
                </h2>
                <button onClick={() => onNavigate('quests')} className="text-sm text-primary hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              {agent.challenges && agent.challenges.length > 0 ? (
                <ChallengeProgressCard challenge={agent.challenges[0]} />
              ) : (
                <div className="bg-bg-primary border border-border-color rounded-2xl p-6 text-center">
                  <p className="text-text-secondary">No active challenges yet</p>
                  <button onClick={() => onNavigate('quests')} className="mt-3 text-sm text-primary hover:underline">
                    View available quests
                  </button>
                </div>
              )}
            </section>

            {/* Recent Activity */}
            <RecentActivityList activities={activities} />
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Leaderboard Widget */}
            <LeaderboardWidget />

            {/* Quick Actions */}
            <div className="bg-bg-primary border border-border-color rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold text-text-primary mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button onClick={() => onNavigate('add-listing')} className="w-full py-3 px-4 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" />
                  Add New Listing
                </button>
                <button onClick={() => onNavigate('marketplace')} className="w-full py-3 px-4 bg-bg-secondary hover:bg-bg-tertiary text-text-primary font-medium rounded-xl transition-colors border border-border-color">
                  Browse Marketplace
                </button>
                <button onClick={() => onNavigate('wallet')} className="w-full py-3 px-4 bg-bg-secondary hover:bg-bg-tertiary text-text-primary font-medium rounded-xl transition-colors border border-border-color">
                  Top Up Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Profile Modal */}
      <ShareProfileModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} agentId={agent.id} agentName={agent.name} />
    </div>;
}