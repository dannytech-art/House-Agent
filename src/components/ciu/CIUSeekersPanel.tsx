import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserCheck, TrendingUp, TrendingDown, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { mockSeekerIntelligence } from '../../utils/mockCIUData';

export function CIUSeekersPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [classificationFilter, setClassificationFilter] = useState<string>('all');

  const filteredSeekers = mockSeekerIntelligence.filter((seeker) => {
    const matchesSearch = seeker.seekerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClassification = classificationFilter === 'all' || seeker.classification === classificationFilter;
    return matchesSearch && matchesClassification;
  });

  const handleAction = (action: string, seekerId: string) => {
    alert(`${action} action performed on seeker ${seekerId}`);
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'high-intent':
        return 'bg-success/20 text-success';
      case 'serious':
        return 'bg-primary/20 text-primary';
      case 'window-shopper':
        return 'bg-warning/20 text-warning';
      case 'at-risk':
        return 'bg-danger/20 text-danger';
      default:
        return 'bg-text-tertiary/20 text-text-tertiary';
    }
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
              placeholder="Search seekers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <select
            value={classificationFilter}
            onChange={(e) => setClassificationFilter(e.target.value)}
            className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Classifications</option>
            <option value="high-intent">High Intent</option>
            <option value="serious">Serious</option>
            <option value="window-shopper">Window Shopper</option>
            <option value="at-risk">At Risk</option>
          </select>
        </div>
      </div>

      {/* Seekers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSeekers.map((seeker, index) => (
          <motion.div
            key={seeker.seekerId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-bg-secondary border border-border-color rounded-xl p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-text-primary mb-1">{seeker.seekerName}</h3>
                <p className="text-xs text-text-tertiary">ID: {seeker.seekerId}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getClassificationColor(seeker.classification)}`}>
                {seeker.classification.replace('-', ' ')}
              </span>
            </div>

            {/* Metrics */}
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-text-secondary">Trust Level</span>
                  <span className="font-medium text-text-primary">{seeker.trustLevel}/100</span>
                </div>
                <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${seeker.trustLevel}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Interests Submitted</span>
                <span className="font-medium text-text-primary">{seeker.interestsSubmitted}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Viewing Attendance</span>
                <span className="font-medium text-text-primary">{seeker.viewingAttendanceRate}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Budget Realism</span>
                <span className="font-medium text-text-primary">{seeker.budgetRealism}/100</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Area Flexibility</span>
                <span className="font-medium text-text-primary">{seeker.areaFlexibility}/100</span>
              </div>
              {seeker.churnRisk > 30 && (
                <div className="flex items-center gap-2 text-sm text-danger">
                  <AlertCircle className="w-4 h-4" />
                  <span>Churn Risk: {seeker.churnRisk}%</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-border-color">
              {seeker.classification === 'high-intent' && (
                <button
                  onClick={() => handleAction('route-to-vilanow', seeker.seekerId)}
                  className="flex-1 px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <UserCheck className="w-4 h-4" />
                  Route to Vilanow
                </button>
              )}
              {seeker.trustLevel < 80 && (
                <button
                  onClick={() => handleAction('upgrade-trust', seeker.seekerId)}
                  className="px-3 py-2 bg-success/20 hover:bg-success/30 text-success text-sm font-medium rounded-lg transition-colors"
                  title="Upgrade Trust"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              )}
              {seeker.churnRisk > 40 && (
                <button
                  onClick={() => handleAction('priority-handling', seeker.seekerId)}
                  className="px-3 py-2 bg-warning/20 hover:bg-warning/30 text-warning text-sm font-medium rounded-lg transition-colors"
                  title="Priority Handling"
                >
                  <AlertCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

