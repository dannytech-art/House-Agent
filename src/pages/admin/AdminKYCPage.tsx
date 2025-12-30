import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, XCircle, Eye, Clock, X, FileText, Search, User, Mail, Phone, Award, Building2, AlertCircle, Download } from 'lucide-react';
import { mockPendingKYC } from '../../utils/mockAdminData';
import { Agent } from '../../types';

interface KYCDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: (Agent & { kycCompletedAt?: string }) | null;
  onApprove: (agentId: string) => void;
  onReject: (agentId: string) => void;
}

function KYCDetailModal({ isOpen, onClose, agent, onApprove, onReject }: KYCDetailModalProps) {
  if (!agent || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-bg-secondary rounded-2xl border-2 border-primary/30 max-w-4xl w-full p-6 gold-glow max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img src={agent.avatar} alt={agent.name} className="w-16 h-16 rounded-full border-2 border-primary" />
                  <div>
                    <h3 className="font-display text-2xl font-bold text-text-primary mb-1">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-text-tertiary">{agent.email}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
                  <X className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-text-tertiary uppercase mb-2 block">Contact Information</label>
                    <div className="bg-bg-tertiary rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-text-primary">
                        <Mail className="w-4 h-4 text-text-tertiary" />
                        {agent.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-primary">
                        <Phone className="w-4 h-4 text-text-tertiary" />
                        {agent.phone}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-tertiary uppercase mb-2 block">Agent Profile</label>
                    <div className="bg-bg-tertiary rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Level</span>
                        <span className="text-sm font-medium text-primary">{agent.level}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">XP</span>
                        <span className="text-sm font-medium text-text-primary">{agent.xp.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Listings</span>
                        <span className="text-sm font-medium text-text-primary">{agent.totalListings}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Tier</span>
                        <span className="text-sm font-medium text-primary capitalize">{agent.tier.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-text-tertiary uppercase mb-2 block">KYC Documents</label>
                    <div className="bg-bg-tertiary rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between p-3 bg-bg-primary rounded-lg border border-border-color">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-sm text-text-primary">Identity Document</span>
                        </div>
                        <button className="px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary text-xs rounded-lg transition-colors">
                          View
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-bg-primary rounded-lg border border-border-color">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-sm text-text-primary">Business License</span>
                        </div>
                        <button className="px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary text-xs rounded-lg transition-colors">
                          View
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-bg-primary rounded-lg border border-border-color">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-sm text-text-primary">Proof of Address</span>
                        </div>
                        <button className="px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary text-xs rounded-lg transition-colors">
                          View
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-tertiary uppercase mb-2 block">Submission Info</label>
                    <div className="bg-bg-tertiary rounded-xl p-4">
                      <div className="flex items-center gap-2 text-sm text-text-primary mb-2">
                        <Clock className="w-4 h-4 text-text-tertiary" />
                        Submitted: {agent.kycCompletedAt ? new Date(agent.kycCompletedAt).toLocaleString() : 'N/A'}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-warning/20 text-warning text-xs rounded-full">Pending Review</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border-color pt-4 flex gap-3">
                <button
                  onClick={() => {
                    onApprove(agent.id);
                    onClose();
                  }}
                  className="flex-1 px-4 py-2 bg-success/20 hover:bg-success/30 text-success rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve KYC
                </button>
                <button
                  onClick={() => {
                    onReject(agent.id);
                    onClose();
                  }}
                  className="flex-1 px-4 py-2 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject KYC
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-bg-tertiary hover:bg-bg-primary text-text-secondary rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function AdminKYCPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<(Agent & { kycCompletedAt?: string }) | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredKYC = mockPendingKYC.filter(agent => {
    return agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           agent.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleReview = (agent: typeof mockPendingKYC[0]) => {
    setSelectedAgent(agent);
    setIsDetailModalOpen(true);
  };

  const handleApprove = (agentId: string) => {
    alert(`KYC approved for agent ${agentId}`);
  };

  const handleReject = (agentId: string) => {
    alert(`KYC rejected for agent ${agentId}`);
  };

  const stats = [
    { label: 'Pending Review', value: mockPendingKYC.length, color: 'text-warning' },
    { label: 'Approved Today', value: 12, color: 'text-success' },
    { label: 'Rejected', value: 3, color: 'text-danger' },
    { label: 'Avg Review Time', value: '2.5h', color: 'text-primary' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-bg-secondary border border-border-color rounded-xl p-4"
          >
            <p className="text-sm text-text-secondary mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredKYC.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-bg-secondary border border-border-color rounded-xl p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <img src={agent.avatar} alt={agent.name} className="w-16 h-16 rounded-full border-2 border-primary" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-text-primary">{agent.name}</h3>
                  <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full capitalize">
                    {agent.tier.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mb-2">
                  {agent.email} • {agent.phone}
                </p>
                <div className="flex items-center gap-3 text-xs text-text-tertiary flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Submitted {agent.kycCompletedAt ? new Date(agent.kycCompletedAt).toLocaleDateString() : 'N/A'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Level {agent.level}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {agent.totalListings} listings
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleReview(agent)}
                  className="px-4 py-2 bg-bg-tertiary hover:bg-bg-primary text-text-secondary text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Review
                </button>
                <button
                  onClick={() => handleApprove(agent.id)}
                  className="px-4 py-2 bg-success/20 hover:bg-success/30 text-success text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(agent.id)}
                  className="px-4 py-2 bg-danger/20 hover:bg-danger/30 text-danger text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredKYC.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
          <p className="text-text-secondary">No pending KYC reviews found</p>
        </div>
      )}

      <KYCDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedAgent(null);
        }}
        agent={selectedAgent}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}