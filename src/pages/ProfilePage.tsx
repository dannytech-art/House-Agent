import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Mail, Phone, Calendar, Award, TrendingUp, Home, Heart, Zap, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { mockAgent } from '../utils/mockData';
export function ProfilePage() {
  const {
    user,
    isAgent
  } = useAuth();
  const agent = isAgent ? user as typeof mockAgent : null;
  const stats = agent ? [{
    icon: Home,
    label: 'Total Listings',
    value: agent.totalListings,
    color: 'text-primary'
  }, {
    icon: Heart,
    label: 'Interests Received',
    value: agent.totalInterests,
    color: 'text-danger'
  }, {
    icon: Zap,
    label: 'Credits',
    value: agent.credits,
    color: 'text-warning'
  }, {
    icon: TrendingUp,
    label: 'Level',
    value: agent.level,
    color: 'text-success'
  }] : [];
  const achievements = [{
    title: 'Early Adopter',
    description: 'Joined in the first month',
    icon: '🎖️',
    unlocked: true
  }, {
    title: 'Deal Master',
    description: 'Closed 10 deals',
    icon: '🏆',
    unlocked: true
  }, {
    title: 'Top Performer',
    description: 'Reached Level 10',
    icon: '⭐',
    unlocked: true
  }, {
    title: 'Community Leader',
    description: 'Created 3 groups',
    icon: '👥',
    unlocked: false
  }];
  return <div className="min-h-screen bg-bg-secondary pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-6">
          <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
            Profile
          </h1>
          <p className="text-text-secondary">
            Manage your account and view your stats
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.1
      }} className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-primary" /> : <div className="w-24 h-24 rounded-full bg-gradient-gold flex items-center justify-center border-4 border-primary">
                  <span className="text-4xl font-bold text-black">
                    {user?.name.charAt(0)}
                  </span>
                </div>}
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center border-2 border-bg-primary gold-glow">
                <Edit className="w-4 h-4 text-black" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-text-primary mb-1">
                    {user?.name}
                  </h2>
                  {agent && <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-semibold rounded-full">
                        {agent.agentType === 'direct' ? 'Direct Agent' : 'Semi-Direct Agent'}
                      </span>
                      {agent.verified && <span className="text-success">✓ Verified</span>}
                    </div>}
                </div>
                <button className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{user?.phone}</span>
                </div>
                {agent && <div className="flex items-center gap-2 text-text-secondary">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Joined{' '}
                      {new Date(agent.joinedDate).toLocaleDateString('en-NG', {
                    month: 'long',
                    year: 'numeric'
                  })}
                    </span>
                  </div>}
              </div>
            </div>
          </div>

          {/* XP Progress */}
          {agent && <div className="mt-6 pt-6 border-t border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-text-primary">
                    Level {agent.level}
                  </span>
                </div>
                <span className="text-sm text-text-tertiary">
                  {agent.xp} / 3000 XP
                </span>
              </div>
              <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                <motion.div initial={{
              width: 0
            }} animate={{
              width: `${agent.xp / 3000 * 100}%`
            }} transition={{
              duration: 1,
              ease: 'easeOut'
            }} className="h-full bg-gradient-gold rounded-full" />
              </div>
            </div>}
        </motion.div>

        {/* Stats Grid */}
        {agent && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => {
          const Icon = stat.icon;
          return <motion.div key={index} initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 0.2 + index * 0.05
          }} className="bg-bg-primary rounded-xl p-4 border border-border-color text-center">
                  <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                  <p className="text-2xl font-bold text-text-primary mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-text-tertiary">{stat.label}</p>
                </motion.div>;
        })}
          </motion.div>}

        {/* Achievements */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }}>
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">
            Achievements
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => <motion.div key={index} initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.3 + index * 0.05
          }} className={`bg-bg-primary rounded-xl p-4 border transition-all ${achievement.unlocked ? 'border-primary/30 hover:border-primary/50' : 'border-border-color opacity-60'}`}>
                <div className="flex items-center gap-4">
                  <div className={`text-4xl ${!achievement.unlocked && 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-text-tertiary">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                      <span className="text-success">✓</span>
                    </div>}
                </div>
              </motion.div>)}
          </div>
        </motion.div>
      </div>
    </div>;
}