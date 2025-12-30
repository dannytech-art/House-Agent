import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Download, CreditCard, Wallet, CheckCircle, Clock, Search, Filter, Calendar } from 'lucide-react';
import { mockAdminTransactions, mockAdminAgents } from '../../utils/mockAdminUsers';
import { mockRevenueData } from '../../utils/mockAdminData';

export function AdminFinancialsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'credit_purchase' | 'credit_spent' | 'payout' | 'refund'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const totalRevenue = mockAdminTransactions
    .filter(t => t.type === 'credit_purchase' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingPayouts = mockAdminTransactions
    .filter(t => t.type === 'payout' && t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalPayouts = mockAdminTransactions
    .filter(t => t.type === 'payout' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const netRevenue = totalRevenue - totalPayouts;

  const filteredTransactions = mockAdminTransactions.filter(txn => {
    const matchesSearch = txn.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         txn.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
    const matchesType = typeFilter === 'all' || txn.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = [
    {
      label: 'Total Revenue',
      value: `₦${(totalRevenue / 1000000).toFixed(1)}M`,
      trend: '+24.5%',
      positive: true,
      icon: DollarSign
    },
    {
      label: 'Net Revenue',
      value: `₦${(netRevenue / 1000000).toFixed(1)}M`,
      trend: '+18.2%',
      positive: true,
      icon: TrendingUp
    },
    {
      label: 'Pending Payouts',
      value: `₦${(pendingPayouts / 1000).toFixed(0)}K`,
      trend: `${mockAdminTransactions.filter(t => t.type === 'payout' && t.status === 'pending').length} pending`,
      positive: false,
      icon: Clock
    },
    {
      label: 'Transactions',
      value: mockAdminTransactions.length,
      trend: '+12 today',
      positive: true,
      icon: CreditCard
    }
  ];

  const handleExport = () => {
    alert('Exporting financial data...');
  };

  const handleApprovePayout = (txnId: string) => {
    alert(`Approving payout ${txnId}`);
  };

  const maxRevenue = Math.max(...mockRevenueData.map(d => d.revenue));

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-bg-secondary border border-border-color rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-xs ${stat.positive ? 'text-success' : 'text-warning'}`}>
                  {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{stat.trend}</span>
                </div>
              </div>
              <p className="text-sm text-text-secondary mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-text-primary">Revenue Trend (Last 7 Months)</h3>
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span>Revenue</span>
            </div>
          </div>
        </div>
        <div className="flex items-end justify-between gap-2 h-48">
          {mockRevenueData.map((data, index) => (
            <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-40 bg-bg-tertiary rounded-t overflow-hidden">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="w-full bg-gradient-gold rounded-t"
                />
              </div>
              <span className="text-xs text-text-tertiary">{data.month}</span>
              <span className="text-xs font-medium text-text-primary">₦{(data.revenue / 1000000).toFixed(1)}M</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search transactions..."
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
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="credit_purchase">Credit Purchase</option>
            <option value="credit_spent">Credit Spent</option>
            <option value="payout">Payout</option>
            <option value="refund">Refund</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-bg-secondary border border-border-color rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border-color flex items-center justify-between">
          <h3 className="font-bold text-text-primary">Transactions ({filteredTransactions.length})</h3>
          <button
            onClick={handleExport}
            className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-tertiary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Transaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {paginatedTransactions.map(txn => (
                <tr key={txn.id} className="hover:bg-bg-primary transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-text-primary text-sm">{txn.description}</p>
                      <p className="text-xs text-text-tertiary capitalize">{txn.type.replace('_', ' ')}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary">{txn.userName}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-text-primary">
                      {txn.amount > 0 ? `₦${txn.amount.toLocaleString()}` : '-'}
                    </p>
                    {txn.credits && (
                      <p className="text-xs text-text-tertiary">{txn.credits} credits</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        txn.status === 'completed'
                          ? 'bg-success/20 text-success'
                          : txn.status === 'pending'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-danger/20 text-danger'
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {new Date(txn.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {txn.type === 'payout' && txn.status === 'pending' && (
                      <button
                        onClick={() => handleApprovePayout(txn.id)}
                        className="px-3 py-1 bg-success/20 hover:bg-success/30 text-success text-xs font-medium rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border-color flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
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
    </div>
  );
}