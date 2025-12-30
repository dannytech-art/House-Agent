import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Users, UserCheck, UserX, Ban, CheckCircle, XCircle, Eye, MoreVertical, X, CreditCard, TrendingUp, Award, Calendar, Mail, Phone, Shield, AlertTriangle } from 'lucide-react';
import { mockAdminAgents, mockAdminSeekers } from '../../utils/mockAdminUsers';
import { Agent } from '../../types';
import { apiClient } from '../../lib/api-client';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: (Agent & { status: 'active' | 'suspended' | 'banned' }) | typeof mockAdminSeekers[0] | null;
  userType: 'agent' | 'seeker';
  onAction: (action: string, userId: string) => void;
}

function UserDetailModal({ isOpen, onClose, user, userType, onAction }: UserDetailModalProps) {
  if (!user || !isOpen) return null;

  const isAgent = userType === 'agent' && 'tier' in user;
  const agent = isAgent ? user as Agent & { status: 'active' | 'suspended' | 'banned' } : null;

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
            <div className="bg-bg-secondary rounded-2xl border-2 border-primary/30 max-w-3xl w-full p-6 gold-glow max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-primary" />
                  <div>
                    <h3 className="font-display text-2xl font-bold text-text-primary mb-1">
                      {user.name}
                    </h3>
                    <p className="text-sm text-text-tertiary">{user.email}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
                  <X className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-text-tertiary uppercase mb-1 block">Contact Information</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-text-primary">
                        <Mail className="w-4 h-4 text-text-tertiary" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-primary">
                        <Phone className="w-4 h-4 text-text-tertiary" />
                        {user.phone}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-tertiary uppercase mb-1 block">Account Status</label>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${user.status === 'active' ? 'bg-success/20 text-success' : user.status === 'suspended' ? 'bg-warning/20 text-warning' : 'bg-danger/20 text-danger'}`}>
                        {user.status}
                      </span>
                      <span className="text-xs text-text-tertiary">
                        Joined {new Date(user.joinedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {isAgent && agent && (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-text-tertiary uppercase mb-1 block">Agent Performance</label>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-bg-tertiary rounded-lg p-3">
                            <p className="text-xs text-text-tertiary mb-1">Level</p>
                            <p className="text-lg font-bold text-primary">{agent.level}</p>
                          </div>
                          <div className="bg-bg-tertiary rounded-lg p-3">
                            <p className="text-xs text-text-tertiary mb-1">XP</p>
                            <p className="text-lg font-bold text-text-primary">{agent.xp.toLocaleString()}</p>
                          </div>
                          <div className="bg-bg-tertiary rounded-lg p-3">
                            <p className="text-xs text-text-tertiary mb-1">Listings</p>
                            <p className="text-lg font-bold text-text-primary">{agent.totalListings}</p>
                          </div>
                          <div className="bg-bg-tertiary rounded-lg p-3">
                            <p className="text-xs text-text-tertiary mb-1">Rating</p>
                            <p className="text-lg font-bold text-primary">{agent.rating.toFixed(1)} ⭐</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-text-tertiary uppercase mb-1 block">Credits & Wallet</label>
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-xs text-text-tertiary mb-1">Credits</p>
                            <p className="text-lg font-bold text-primary">{agent.credits}</p>
                          </div>
                          <div>
                            <p className="text-xs text-text-tertiary mb-1">Wallet</p>
                            <p className="text-lg font-bold text-success">₦{agent.walletBalance.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  {isAgent && agent && (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-text-tertiary uppercase mb-1 block">Tier & Badges</label>
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-text-primary capitalize">{agent.tier.replace('-', ' ')}</span>
                        </div>
                        {agent.badges.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {agent.badges.slice(0, 5).map((badge, idx) => (
                              <span key={idx} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-text-tertiary uppercase mb-1 block">Verification</label>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Shield className={`w-4 h-4 ${agent.verified ? 'text-success' : 'text-warning'}`} />
                            <span className="text-sm text-text-primary">
                              KYC: {agent.kycStatus}
                            </span>
                          </div>
                          {agent.verified && (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span className="text-sm text-success">Verified Agent</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {userType === 'seeker' && (
                    <div>
                      <label className="text-xs font-semibold text-text-tertiary uppercase mb-1 block">Activity</label>
                      <div className="bg-bg-tertiary rounded-lg p-3">
                        <p className="text-lg font-bold text-text-primary">{user.totalActivity}</p>
                        <p className="text-xs text-text-tertiary">Total Activities</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-border-color pt-4">
                <div className="flex gap-3">
                  {user.status === 'active' ? (
                    <>
                      <button
                        onClick={() => {
                          onAction('suspend', user.id);
                          onClose();
                        }}
                        className="flex-1 px-4 py-2 bg-warning/20 hover:bg-warning/30 text-warning rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Suspend
                      </button>
                      <button
                        onClick={() => {
                          onAction('ban', user.id);
                          onClose();
                        }}
                        className="flex-1 px-4 py-2 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Ban className="w-4 h-4" />
                        Ban
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        onAction('activate', user.id);
                        onClose();
                      }}
                      className="flex-1 px-4 py-2 bg-success/20 hover:bg-success/30 text-success rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Activate
                    </button>
                  )}
                  {isAgent && (
                    <button
                      onClick={() => {
                        onAction('adjust-credits', user.id);
                      }}
                      className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Adjust Credits
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<'agents' | 'seekers'>('agents');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'banned'>('all');
  const [selectedUser, setSelectedUser] = useState<typeof mockAdminAgents[0] | typeof mockAdminSeekers[0] | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const agents = mockAdminAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const seekers = mockAdminSeekers.filter(seeker => {
    const matchesSearch = seeker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         seeker.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || seeker.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const currentData = activeTab === 'agents' ? agents : seekers;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const paginatedData = currentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleViewUser = (user: typeof mockAdminAgents[0] | typeof mockAdminSeekers[0]) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleUserAction = async (action: string, userId: string) => {
    try {
      if (action === 'delete') {
        if (!window.confirm(`Are you sure you want to delete user ${userId}?`)) {
          return;
        }
        const response = await apiClient.deleteUser(userId);
        if (response.success) {
          alert('User deleted successfully');
          // Refresh users list
          window.location.reload();
        } else {
          alert(`Error: ${response.error || 'Failed to delete user'}`);
        }
      } else if (action === 'activate' || action === 'deactivate') {
        const response = await apiClient.updateUser(userId, {
          active: action === 'activate',
        });
        if (response.success) {
          alert(`User ${action === 'activate' ? 'activated' : 'deactivated'} successfully`);
          window.location.reload();
        } else {
          alert(`Error: ${response.error || 'Failed to update user'}`);
        }
      } else {
        alert(`${action} action performed on user ${userId}`);
      }
    } catch (error: any) {
      console.error('Error performing user action:', error);
      alert(`Failed to ${action} user: ${error.message || 'Please try again'}`);
    }
  };

  const stats = [
    { label: 'Total Agents', value: mockAdminAgents.length, color: 'text-primary' },
    { label: 'Active Agents', value: mockAdminAgents.filter(a => a.status === 'active').length, color: 'text-success' },
    { label: 'Total Seekers', value: mockAdminSeekers.length, color: 'text-primary' },
    { label: 'Active Seekers', value: mockAdminSeekers.filter(s => s.status === 'active').length, color: 'text-success' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
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

      {/* Filters */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex bg-bg-primary p-1 rounded-lg">
            <button
              onClick={() => {
                setActiveTab('agents');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'agents' ? 'bg-primary text-black' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Agents ({mockAdminAgents.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('seekers');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'seekers' ? 'bg-primary text-black' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Seekers ({mockAdminSeekers.length})
            </button>
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-bg-secondary border border-border-color rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-tertiary border-b border-border-color">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Joined</th>
                {activeTab === 'agents' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Performance</th>
                )}
                <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {paginatedData.map((user) => {
                const isAgent = activeTab === 'agents';
                const agent = isAgent ? user as typeof mockAdminAgents[0] : null;
                const seeker = !isAgent ? user as typeof mockAdminSeekers[0] : null;

                return (
                  <tr key={user.id} className="hover:bg-bg-primary transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-border-color" />
                        <div>
                          <p className="font-medium text-text-primary">{user.name}</p>
                          {isAgent && agent && (
                            <p className="text-xs text-text-tertiary">Level {agent.level} • {agent.tier.replace('-', ' ')}</p>
                          )}
                          {seeker && (
                            <p className="text-xs text-text-tertiary">{seeker.totalActivity} activities</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-text-primary">{user.email}</p>
                      <p className="text-xs text-text-tertiary">{user.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === 'active'
                            ? 'bg-success/20 text-success'
                            : user.status === 'suspended'
                            ? 'bg-warning/20 text-warning'
                            : 'bg-danger/20 text-danger'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {new Date(user.joinedDate).toLocaleDateString()}
                    </td>
                    {isAgent && agent && (
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-text-primary">{agent.totalListings} listings</p>
                          <p className="text-text-tertiary text-xs">{agent.xp} XP • {agent.rating.toFixed(1)}⭐</p>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border-color flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, currentData.length)} of {currentData.length} users
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-bg-tertiary hover:bg-bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-text-primary rounded-lg text-sm transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-bg-tertiary hover:bg-bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-text-primary rounded-lg text-sm transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        userType={activeTab}
        onAction={handleUserAction}
      />
    </div>
  );
}