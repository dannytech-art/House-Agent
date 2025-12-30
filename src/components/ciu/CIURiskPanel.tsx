import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Copy, Image, DollarSign, Users, CheckCircle, XCircle, Lock } from 'lucide-react';
import { mockRiskFlags } from '../../utils/mockCIUData';

export function CIURiskPanel() {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [riskTypeFilter, setRiskTypeFilter] = useState<'all' | 'duplicate' | 'fraud' | 'collusion' | 'abuse' | 'compliance'>('all');

  const filteredRisks = mockRiskFlags.filter((risk) => {
    const matchesSeverity = severityFilter === 'all' || risk.severity === severityFilter;
    const matchesType = riskTypeFilter === 'all' || risk.riskType === riskTypeFilter;
    return matchesSeverity && matchesType;
  });

  const handleAction = (action: string, riskId: string) => {
    alert(`${action} action performed on risk ${riskId}`);
  };

  const getRiskTypeIcon = (type: string) => {
    switch (type) {
      case 'duplicate':
        return Copy;
      case 'fraud':
        return AlertTriangle;
      case 'collusion':
        return Users;
      case 'abuse':
        return ShieldAlert;
      default:
        return ShieldAlert;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-danger/20 text-danger border-danger/50';
      case 'medium':
        return 'bg-warning/20 text-warning border-warning/50';
      default:
        return 'bg-primary/20 text-primary border-primary/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Severity</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={riskTypeFilter}
            onChange={(e) => setRiskTypeFilter(e.target.value as any)}
            className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Risk Types</option>
            <option value="duplicate">Duplicate</option>
            <option value="fraud">Fraud</option>
            <option value="collusion">Collusion</option>
            <option value="abuse">Abuse</option>
            <option value="compliance">Compliance</option>
          </select>
        </div>
      </div>

      {/* Risk Flags */}
      <div className="space-y-4">
        {filteredRisks.map((risk, index) => {
          const Icon = getRiskTypeIcon(risk.riskType);
          return (
            <motion.div
              key={risk.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-bg-secondary border-2 rounded-xl p-6 ${getSeverityColor(risk.severity)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getSeverityColor(risk.severity)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-text-primary capitalize">{risk.riskType} Risk</h3>
                      {risk.autoFlagged && (
                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">Auto-Flagged</span>
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(risk.severity)}`}>
                        {risk.severity} severity
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">
                      Entity: {risk.entityType} (ID: {risk.entityId})
                    </p>
                    <div className="space-y-1">
                      {risk.evidence.map((evidence, idx) => (
                        <p key={idx} className="text-xs text-text-tertiary">• {evidence}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border-color">
                <div className="flex items-center gap-2 text-sm text-text-tertiary">
                  <span>Detected: {new Date(risk.detectedAt).toLocaleString()}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    risk.status === 'resolved'
                      ? 'bg-success/20 text-success'
                      : risk.status === 'investigating'
                      ? 'bg-warning/20 text-warning'
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {risk.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  {risk.entityType === 'listing' && (
                    <button
                      onClick={() => handleAction('freeze-listing', risk.id)}
                      className="px-3 py-1.5 bg-danger/20 hover:bg-danger/30 text-danger text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Lock className="w-4 h-4" />
                      Freeze Listing
                    </button>
                  )}
                  {risk.entityType === 'agent' && (
                    <button
                      onClick={() => handleAction('suspend-agent', risk.id)}
                      className="px-3 py-1.5 bg-danger/20 hover:bg-danger/30 text-danger text-sm font-medium rounded-lg transition-colors"
                    >
                      Suspend Agent
                    </button>
                  )}
                  <button
                    onClick={() => handleAction('resolve', risk.id)}
                    className="px-3 py-1.5 bg-success/20 hover:bg-success/30 text-success text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Resolve
                  </button>
                  <button
                    onClick={() => handleAction('dismiss', risk.id)}
                    className="px-3 py-1.5 bg-bg-tertiary hover:bg-bg-primary text-text-secondary text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

