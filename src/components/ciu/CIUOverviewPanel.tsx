import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  UserCheck, 
  Heart, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  MapPin,
  Filter,
  Activity
} from 'lucide-react';
import { mockMarketplaceHealth } from '../../utils/mockCIUData';

export function CIUOverviewPanel() {
  const [locationFilter, setLocationFilter] = useState('all');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('all');
  const [agentTypeFilter, setAgentTypeFilter] = useState('all');
  const [demandFilter, setDemandFilter] = useState('all');

  const health = mockMarketplaceHealth;

  const metrics = [
    {
      label: 'Active Listings',
      value: health.totalActiveListings,
      icon: Building2,
      color: 'text-primary',
      trend: '+12.3%',
      positive: true,
    },
    {
      label: 'Active Agents',
      value: health.totalActiveAgents,
      icon: Users,
      color: 'text-success',
      trend: '+5.2%',
      positive: true,
    },
    {
      label: 'Seeker Requests',
      value: health.totalSeekerRequests,
      icon: UserCheck,
      color: 'text-primary',
      trend: '+18.7%',
      positive: true,
    },
    {
      label: 'Interests (24h)',
      value: health.interestsLast24h,
      icon: Heart,
      color: 'text-warning',
      trend: '+8.4%',
      positive: true,
    },
    {
      label: 'Interests (7d)',
      value: health.interestsLast7d,
      icon: Heart,
      color: 'text-warning',
      trend: '+15.2%',
      positive: true,
    },
    {
      label: 'Daily Credits',
      value: health.creditUsageDaily,
      icon: CreditCard,
      color: 'text-primary',
      trend: '+3.1%',
      positive: true,
    },
    {
      label: 'Weekly Credits',
      value: health.creditUsageWeekly,
      icon: CreditCard,
      color: 'text-primary',
      trend: '+7.8%',
      positive: true,
    },
    {
      label: 'Demand Level',
      value: health.demandLevel.toUpperCase(),
      icon: Activity,
      color: health.demandLevel === 'high' ? 'text-success' : health.demandLevel === 'medium' ? 'text-warning' : 'text-danger',
      trend: '↑',
      positive: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Health Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-bg-secondary border border-border-color rounded-xl p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${metric.color.replace('text-', 'bg-')}/20 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs ${metric.positive ? 'text-success' : 'text-danger'}`}>
                  {metric.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{metric.trend}</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-text-primary mb-1">{metric.value.toLocaleString()}</p>
              <p className="text-sm text-text-secondary">{metric.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Filters */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-text-primary">Quick Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-text-tertiary uppercase mb-2 block">Location</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">All Locations</option>
              <option value="lekki">Lekki</option>
              <option value="victoria-island">Victoria Island</option>
              <option value="ikeja">Ikeja</option>
              <option value="ajah">Ajah</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-text-tertiary uppercase mb-2 block">Property Type</label>
            <select
              value={propertyTypeFilter}
              onChange={(e) => setPropertyTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="duplex">Duplex</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-text-tertiary uppercase mb-2 block">Agent Type</label>
            <select
              value={agentTypeFilter}
              onChange={(e) => setAgentTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="direct">Direct</option>
              <option value="semi-direct">Semi-Direct</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-text-tertiary uppercase mb-2 block">Demand Level</label>
            <select
              value={demandFilter}
              onChange={(e) => setDemandFilter(e.target.value)}
              className="w-full px-3 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Marketplace Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
          <h3 className="font-bold text-text-primary mb-4">Marketplace Health Score</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-text-secondary">Overall Health</span>
                <span className="font-bold text-success">87/100</span>
              </div>
              <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '87%' }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-gold rounded-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-text-tertiary mb-1">Supply-Demand Balance</p>
                <p className="font-bold text-text-primary">Good</p>
              </div>
              <div>
                <p className="text-text-tertiary mb-1">Agent Activity</p>
                <p className="font-bold text-success">High</p>
              </div>
              <div>
                <p className="text-text-tertiary mb-1">Conversion Rate</p>
                <p className="font-bold text-primary">32%</p>
              </div>
              <div>
                <p className="text-text-tertiary mb-1">Platform Revenue</p>
                <p className="font-bold text-success">+24.5%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
          <h3 className="font-bold text-text-primary mb-4">Recent Activity Alert</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <Activity className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">8 Closable Deals Detected</p>
                <p className="text-xs text-text-tertiary mt-1">High-intent interests need agent response</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-danger/10 border border-danger/20 rounded-lg">
              <Activity className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">3 Risk Flags Pending</p>
                <p className="text-xs text-text-tertiary mt-1">Requires immediate review</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <Activity className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">5 Interest Connections Need Attention</p>
                <p className="text-xs text-text-tertiary mt-1">Delayed responses detected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

