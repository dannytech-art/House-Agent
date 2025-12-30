import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Handshake, AlertCircle, CheckCircle, XCircle, Clock, CreditCard, User } from 'lucide-react';
import { mockAgentCollaborations } from '../../utils/mockCIUData';

export function CIUMarketplacePanel() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'reversed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'lead-exchange' | 'co-broking' | 'credit-transaction'>('all');

  const filteredCollaborations = mockAgentCollaborations.filter((collab) => {
    const matchesStatus = statusFilter === 'all' || collab.status === statusFilter;
    const matchesType = typeFilter === 'all' || collab.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const handleAction = (action: string, collabId: string) => {
    alert(`${action} action performed on collaboration ${collabId}`);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lead-exchange':
        return 'Lead Exchange';
      case 'co-broking':
        return 'Co-Broking';
      case 'credit-transaction':
        return 'Credit Transaction';
      default:
        return type;
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
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="reversed">Reversed</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="lead-exchange">Lead Exchange</option>
            <option value="co-broking">Co-Broking</option>
            <option value="credit-transaction">Credit Transaction</option>
          </select>
        </div>
      </div>

      {/* Collaborations List */}
      <div className="space-y-4">
        {filteredCollaborations.map((collab, index) => (
          <motion.div
            key={collab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-bg-secondary border-2 rounded-xl p-6 ${
              collab.flagged ? 'border-danger/50 bg-danger/5' : 'border-border-color'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Handshake className="w-5 h-5 text-primary" />
                  <span className="font-medium text-text-primary">{getTypeLabel(collab.type)}</span>
                  {collab.flagged && (
                    <span className="px-2 py-1 bg-danger/20 text-danger text-xs rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Flagged
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{collab.fromAgent}</span>
                  </div>
                  <span>→</span>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{collab.toAgent}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <CreditCard className="w-4 h-4" />
                    <span className="font-medium text-text-primary">{collab.credits} credits</span>
                  </div>
                </div>
                {collab.reason && (
                  <p className="text-xs text-danger mt-2">Reason: {collab.reason}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border-color">
              <div className="flex items-center gap-2 text-sm text-text-tertiary">
                <Clock className="w-4 h-4" />
                <span>{new Date(collab.timestamp).toLocaleString()}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  collab.status === 'completed'
                    ? 'bg-success/20 text-success'
                    : collab.status === 'pending'
                    ? 'bg-warning/20 text-warning'
                    : 'bg-danger/20 text-danger'
                }`}>
                  {collab.status}
                </span>
              </div>
              <div className="flex gap-2">
                {collab.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction('approve', collab.id)}
                      className="px-3 py-1.5 bg-success/20 hover:bg-success/30 text-success text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction('reverse', collab.id)}
                      className="px-3 py-1.5 bg-danger/20 hover:bg-danger/30 text-danger text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Reverse
                    </button>
                  </>
                )}
                {collab.flagged && (
                  <button
                    onClick={() => handleAction('investigate', collab.id)}
                    className="px-3 py-1.5 bg-warning/20 hover:bg-warning/30 text-warning text-sm font-medium rounded-lg transition-colors"
                  >
                    Investigate
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

