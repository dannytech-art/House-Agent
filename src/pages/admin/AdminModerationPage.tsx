import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag, AlertCircle, CheckCircle, XCircle, Search, Filter, Eye, User, Building2, MessageSquare } from 'lucide-react';
import { mockAdminReports } from '../../utils/mockAdminUsers';

export function AdminModerationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'resolved' | 'dismissed'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'listing' | 'user' | 'message'>('all');

  const filteredReports = mockAdminReports.filter(report => {
    const matchesSearch = report.reportedItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reportedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || report.severity === severityFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    return matchesSearch && matchesStatus && matchesSeverity && matchesType;
  });

  const handleAction = (action: string, reportId: string) => {
    alert(`${action} action performed on report ${reportId}`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'listing': return Building2;
      case 'user': return User;
      case 'message': return MessageSquare;
      default: return Flag;
    }
  };

  const stats = [
    { label: 'Total Reports', value: mockAdminReports.length, color: 'text-primary' },
    { label: 'Pending', value: mockAdminReports.filter(r => r.status === 'pending').length, color: 'text-warning' },
    { label: 'Resolved', value: mockAdminReports.filter(r => r.status === 'resolved').length, color: 'text-success' },
    { label: 'High Priority', value: mockAdminReports.filter(r => r.severity === 'high').length, color: 'text-danger' }
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

      {/* Filters */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="listing">Listing</option>
            <option value="user">User</option>
            <option value="message">Message</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReports.map((report, index) => {
          const TypeIcon = getTypeIcon(report.type);
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-bg-secondary border border-border-color rounded-xl p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      report.severity === 'high'
                        ? 'bg-danger/20'
                        : report.severity === 'medium'
                        ? 'bg-warning/20'
                        : 'bg-primary/20'
                    }`}
                  >
                    <TypeIcon
                      className={`w-5 h-5 ${
                        report.severity === 'high'
                          ? 'text-danger'
                          : report.severity === 'medium'
                          ? 'text-warning'
                          : 'text-primary'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-text-primary">{report.reportedItem}</h3>
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full capitalize">
                        {report.type}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">{report.description}</p>
                    <div className="flex items-center gap-3 text-xs text-text-tertiary flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Reported by: {report.reportedBy}
                      </span>
                      <span>•</span>
                      <span>Reason: {report.reason}</span>
                      <span>•</span>
                      <span>{new Date(report.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === 'pending'
                        ? 'bg-warning/20 text-warning'
                        : report.status === 'resolved'
                        ? 'bg-success/20 text-success'
                        : report.status === 'reviewed'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-text-tertiary/20 text-text-tertiary'
                    }`}
                  >
                    {report.status}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.severity === 'high'
                        ? 'bg-danger/20 text-danger'
                        : report.severity === 'medium'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-primary/20 text-primary'
                    }`}
                  >
                    {report.severity} priority
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction('view', report.id)}
                  className="px-3 py-1.5 bg-bg-tertiary hover:bg-bg-primary text-text-secondary text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                {report.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction('resolve', report.id)}
                      className="px-3 py-1.5 bg-success/20 hover:bg-success/30 text-success text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Resolve
                    </button>
                    <button
                      onClick={() => handleAction('dismiss', report.id)}
                      className="px-3 py-1.5 bg-danger/20 hover:bg-danger/30 text-danger text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Dismiss
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
          <p className="text-text-secondary">No reports found matching your filters</p>
        </div>
      )}
    </div>
  );
}