import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, Download, Calendar, User, Activity, CheckCircle } from 'lucide-react';
import { mockAuditLogs } from '../../utils/mockCIUData';

export function CIUAuditPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesEntity = entityFilter === 'all' || log.entityType === entityFilter;
    return matchesSearch && matchesAction && matchesEntity;
  });

  const handleExport = () => {
    alert('Exporting audit logs...');
  };

  const allActions = Array.from(new Set(mockAuditLogs.map((log) => log.action)));
  const allEntityTypes = Array.from(new Set(mockAuditLogs.map((log) => log.entityType)));

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search audit logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">All Actions</option>
              {allActions.map((action) => (
                <option key={action} value={action}>
                  {action.replace('_', ' ')}
                </option>
              ))}
            </select>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">All Entities</option>
              {allEntityTypes.map((entity) => (
                <option key={entity} value={entity}>
                  {entity}
                </option>
              ))}
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-bg-secondary border border-border-color rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-tertiary border-b border-border-color">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Entity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-bg-primary transition-colors">
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-text-tertiary" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-text-tertiary" />
                      <span className="text-sm text-text-primary">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                      {log.action.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {log.entityType} ({log.entityId})
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary max-w-md">{log.details}</td>
                  <td className="px-6 py-4">
                    {log.automated ? (
                      <span className="px-2 py-1 bg-warning/20 text-warning text-xs rounded-full flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        Automated
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Manual
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

