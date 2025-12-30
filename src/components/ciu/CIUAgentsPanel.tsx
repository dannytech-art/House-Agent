import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, AlertTriangle, Eye, Zap, Shield, Ban, Star } from 'lucide-react';
import { mockAgentBehaviorMetrics } from '../../utils/mockCIUData';

export function CIUAgentsPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'trust' | 'performance' | 'risk'>('trust');
  
  const filteredAgents = mockAgentBehaviorMetrics.filter((agent) =>
    agent.agentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (sortBy === 'trust') return b.scores.trust - a.scores.trust;
    if (sortBy === 'performance') return b.scores.performance - a.scores.performance;
    return a.scores.risk - b.scores.risk;
  });

  const handleAction = (action: string, agentId: string) => {
    alert(`${action} action performed on agent ${agentId}`);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
          >
            <option value="trust">Sort by Trust</option>
            <option value="performance">Sort by Performance</option>
            <option value="risk">Sort by Risk</option>
          </select>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedAgents.map((agent, index) => (
          <motion.div
            key={agent.agentId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-bg-secondary border border-border-color rounded-xl p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-text-primary mb-1">{agent.agentName}</h3>
                <p className="text-xs text-text-tertiary">Agent ID: {agent.agentId}</p>
              </div>
              {agent.warnings > 0 && (
                <span className="px-2 py-1 bg-warning/20 text-warning text-xs rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {agent.warnings}
                </span>
              )}
            </div>

            {/* Scores */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-bg-tertiary rounded-lg p-3">
                <p className="text-xs text-text-tertiary mb-1">Trust</p>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-success" />
                  <span className="font-bold text-success">{agent.scores.trust}</span>
                </div>
              </div>
              <div className="bg-bg-tertiary rounded-lg p-3">
                <p className="text-xs text-text-tertiary mb-1">Performance</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="font-bold text-primary">{agent.scores.performance}</span>
                </div>
              </div>
              <div className="bg-bg-tertiary rounded-lg p-3">
                <p className="text-xs text-text-tertiary mb-1">Risk</p>
                <div className="flex items-center gap-1">
                  <AlertTriangle className={`w-4 h-4 ${agent.scores.risk > 20 ? 'text-danger' : 'text-warning'}`} />
                  <span className={`font-bold ${agent.scores.risk > 20 ? 'text-danger' : 'text-warning'}`}>
                    {agent.scores.risk}
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Response Time</span>
                <span className="font-medium text-text-primary">{agent.responseTime}h avg</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Unlock Rate</span>
                <span className="font-medium text-text-primary">{agent.interestUnlockRate}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Conversion Rate</span>
                <span className="font-medium text-text-primary">{agent.dealConversionRate}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Credits Spent</span>
                <span className="font-medium text-text-primary">₦{agent.creditSpent.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-border-color">
              <button
                onClick={() => handleAction('view', agent.agentId)}
                className="flex-1 px-3 py-2 bg-bg-tertiary hover:bg-bg-primary text-text-secondary text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              {agent.scores.performance > 80 && (
                <button
                  onClick={() => handleAction('promote', agent.agentId)}
                  className="px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary text-sm font-medium rounded-lg transition-colors"
                  title="Promote"
                >
                  <Star className="w-4 h-4" />
                </button>
              )}
              {agent.scores.risk > 20 && (
                <button
                  onClick={() => handleAction('warn', agent.agentId)}
                  className="px-3 py-2 bg-warning/20 hover:bg-warning/30 text-warning text-sm font-medium rounded-lg transition-colors"
                  title="Issue Warning"
                >
                  <AlertTriangle className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

