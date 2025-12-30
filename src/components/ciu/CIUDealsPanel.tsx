import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, AlertCircle, Clock, CheckCircle, User, Building2, DollarSign, TrendingUp } from 'lucide-react';
import { mockClosableDeals } from '../../utils/mockCIUData';

export function CIUDealsPanel() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'viewing-scheduled' | 'closed'>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredDeals = mockClosableDeals.filter((deal) => {
    const matchesStatus = statusFilter === 'all' || deal.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || deal.urgency === urgencyFilter;
    return matchesStatus && matchesUrgency;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (a.urgency === 'high' && b.urgency !== 'high') return -1;
    if (b.urgency === 'high' && a.urgency !== 'high') return 1;
    return b.closingProbability - a.closingProbability;
  });

  const handleAction = (action: string, dealId: string) => {
    alert(`${action} action performed on deal ${dealId}`);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-danger/20 text-danger border-danger/30';
      case 'medium':
        return 'bg-warning/20 text-warning border-warning/30';
      default:
        return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="viewing-scheduled">Viewing Scheduled</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value as any)}
            className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Urgency</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedDeals.map((deal, index) => (
          <motion.div
            key={deal.dealId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-bg-secondary border-2 rounded-xl p-6 hover:border-primary/50 transition-colors ${getUrgencyColor(deal.urgency)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-text-primary">{deal.propertyTitle}</h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <User className="w-4 h-4" />
                  <span>{deal.agentName}</span>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(deal.urgency)}`}>
                {deal.urgency} urgency
              </span>
            </div>

            {/* Deal Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-bg-primary/50 rounded-lg p-3">
                <p className="text-xs text-text-tertiary mb-1">High-Intent Interests</p>
                <p className="text-lg font-bold text-primary">{deal.highIntentInterests}</p>
              </div>
              <div className="bg-bg-primary/50 rounded-lg p-3">
                <p className="text-xs text-text-tertiary mb-1">Closing Probability</p>
                <p className="text-lg font-bold text-success">{deal.closingProbability}%</p>
              </div>
              <div className="bg-bg-primary/50 rounded-lg p-3">
                <p className="text-xs text-text-tertiary mb-1">Estimated Value</p>
                <p className="text-lg font-bold text-text-primary">₦{(deal.estimatedValue / 1000000).toFixed(1)}M</p>
              </div>
              <div className="bg-bg-primary/50 rounded-lg p-3">
                <p className="text-xs text-text-tertiary mb-1">Total Interests</p>
                <p className="text-lg font-bold text-text-primary">{deal.totalInterests}</p>
              </div>
            </div>

            {/* Flags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {deal.responseTimeExceeded && (
                <span className="px-2 py-1 bg-danger/20 text-danger text-xs rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Response Delayed
                </span>
              )}
              {deal.pricingInRange && (
                <span className="px-2 py-1 bg-success/20 text-success text-xs rounded-full">
                  Price In Range
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-border-color">
              {deal.status === 'new' && (
                <>
                  <button
                    onClick={() => handleAction('assign-vilanow', deal.dealId)}
                    className="flex-1 px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary text-sm font-medium rounded-lg transition-colors"
                  >
                    Assign Vilanow Agent
                  </button>
                  <button
                    onClick={() => handleAction('notify-agent', deal.dealId)}
                    className="px-3 py-2 bg-warning/20 hover:bg-warning/30 text-warning text-sm font-medium rounded-lg transition-colors"
                  >
                    Notify Agent
                  </button>
                </>
              )}
              <button
                onClick={() => handleAction('view-details', deal.dealId)}
                className="px-3 py-2 bg-bg-tertiary hover:bg-bg-primary text-text-secondary text-sm font-medium rounded-lg transition-colors"
              >
                View
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

