import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Clock, AlertCircle, CheckCircle, XCircle, ArrowRight, User, Building2 } from 'lucide-react';
import { mockInterestConnections } from '../../utils/mockCIUData';

export function CIUInterestsPanel() {
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);

  const handleEscalate = (interestId: string) => {
    alert(`Escalating interest ${interestId} for platform intervention`);
  };

  const handleAssign = (interestId: string) => {
    alert(`Assigning interest ${interestId} to Vilanow agent`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed':
        return 'bg-success/20 text-success';
      case 'viewing-scheduled':
        return 'bg-primary/20 text-primary';
      case 'responded':
        return 'bg-warning/20 text-warning';
      case 'pending':
        return 'bg-danger/20 text-danger';
      default:
        return 'bg-text-tertiary/20 text-text-tertiary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Flow Visualization */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
        <h3 className="font-bold text-text-primary mb-4">Interest Connection Lifecycle</h3>
        <div className="flex items-center justify-between mb-6">
          {['Seeker', 'Listing', 'Agent', 'Response', 'Viewing', 'Closure'].map((stage, index) => (
            <div key={stage} className="flex items-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                  <span className="text-primary font-bold">{index + 1}</span>
                </div>
                <p className="text-xs text-text-secondary">{stage}</p>
              </div>
              {index < 5 && <ArrowRight className="w-4 h-4 text-text-tertiary mx-2" />}
            </div>
          ))}
        </div>
      </div>

      {/* Connection List */}
      <div className="bg-bg-secondary border border-border-color rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border-color">
          <h3 className="font-bold text-text-primary">Active Interest Connections</h3>
        </div>
        <div className="divide-y divide-border-color">
          {mockInterestConnections.map((connection, index) => (
            <motion.div
              key={connection.interestId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 hover:bg-bg-primary transition-colors ${
                connection.status === 'pending' ? 'bg-danger/5 border-l-4 border-danger' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-text-tertiary" />
                      <span className="font-medium text-text-primary">{connection.seekerName}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-tertiary" />
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-text-tertiary" />
                      <span className="font-medium text-text-primary">{connection.propertyTitle}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-tertiary" />
                    <span className="text-text-secondary">{connection.agentName}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-text-tertiary mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Created {new Date(connection.createdAt).toLocaleDateString()}
                    </span>
                    {connection.timeDelays?.responseDelay && (
                      <span className="text-warning">
                        Response delay: {connection.timeDelays.responseDelay}h
                      </span>
                    )}
                    {connection.dropOffPoint && (
                      <span className="text-danger">Dropped at: {connection.dropOffPoint}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(connection.status)}`}>
                      {connection.status}
                    </span>
                    {connection.status === 'pending' && connection.timeDelays?.responseDelay && (
                      <span className="px-2 py-1 bg-danger/20 text-danger text-xs rounded-full">
                        Needs Attention
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {connection.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleEscalate(connection.interestId)}
                        className="px-3 py-1.5 bg-warning/20 hover:bg-warning/30 text-warning text-sm font-medium rounded-lg transition-colors"
                      >
                        Escalate
                      </button>
                      <button
                        onClick={() => handleAssign(connection.interestId)}
                        className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary text-sm font-medium rounded-lg transition-colors"
                      >
                        Assign Vilanow
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Connections', value: mockInterestConnections.length, icon: GitBranch },
          {
            label: 'Pending Response',
            value: mockInterestConnections.filter((c) => c.status === 'pending').length,
            icon: Clock,
            color: 'text-danger',
          },
          {
            label: 'Viewing Scheduled',
            value: mockInterestConnections.filter((c) => c.status === 'viewing-scheduled').length,
            icon: CheckCircle,
            color: 'text-primary',
          },
          {
            label: 'Closed',
            value: mockInterestConnections.filter((c) => c.status === 'closed').length,
            icon: CheckCircle,
            color: 'text-success',
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-bg-secondary border border-border-color rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-5 h-5 ${stat.color || 'text-primary'}`} />
                <p className="text-sm text-text-secondary">{stat.label}</p>
              </div>
              <p className={`text-2xl font-bold ${stat.color || 'text-text-primary'}`}>{stat.value}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

