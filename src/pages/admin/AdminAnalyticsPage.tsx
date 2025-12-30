import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Building2, DollarSign, BarChart3, Download, Calendar, Eye, EyeOff } from 'lucide-react';
import { mockUserGrowthData, mockRevenueData } from '../../utils/mockAdminData';

export function AdminAnalyticsPage() {
  const [selectedMetric, setSelectedMetric] = useState<'users' | 'listings' | 'revenue'>('users');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const metrics = [
    {
      label: 'User Growth',
      value: '+18.5%',
      subtext: 'vs last month',
      icon: Users,
      color: 'text-success',
      actual: 2505
    },
    {
      label: 'Listing Growth',
      value: '+12.3%',
      subtext: 'vs last month',
      icon: Building2,
      color: 'text-primary',
      actual: 342
    },
    {
      label: 'Revenue Growth',
      value: '+24.5%',
      subtext: 'vs last month',
      icon: DollarSign,
      color: 'text-warning',
      actual: '₦5.4M'
    },
    {
      label: 'Engagement Rate',
      value: '68%',
      subtext: 'avg daily active',
      icon: TrendingUp,
      color: 'text-success',
      actual: '1,704 DAU'
    }
  ];

  const chartData = mockUserGrowthData.map((userData, index) => ({
    ...userData,
    revenue: mockRevenueData[index]?.revenue || 0
  }));

  const maxUsers = Math.max(...chartData.map(d => d.users + d.agents));
  const maxListings = Math.max(...chartData.map(d => d.agents));
  const maxRevenue = Math.max(...chartData.map(d => d.revenue));

  const handleExport = () => {
    alert('Exporting analytics data...');
  };

  const getChartData = () => {
    switch (selectedMetric) {
      case 'users':
        return chartData.map(d => ({ month: d.month, value: d.users + d.agents, max: maxUsers }));
      case 'listings':
        return chartData.map(d => ({ month: d.month, value: d.agents, max: maxListings }));
      case 'revenue':
        return chartData.map(d => ({ month: d.month, value: d.revenue / 1000000, max: maxRevenue / 1000000 }));
      default:
        return [];
    }
  };

  const chartDataPoints = getChartData();

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-bg-secondary border border-border-color rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-sm text-text-secondary mb-1">{metric.label}</p>
              <p className={`text-2xl font-bold ${metric.color} mb-1`}>{metric.value}</p>
              <p className="text-xs text-text-tertiary">{metric.subtext}</p>
              <p className="text-xs text-text-secondary mt-2">Current: {metric.actual}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Chart Controls */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedMetric('users')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMetric === 'users'
                  ? 'bg-primary text-black'
                  : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
              }`}
            >
              User Growth
            </button>
            <button
              onClick={() => setSelectedMetric('listings')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMetric === 'listings'
                  ? 'bg-primary text-black'
                  : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
              }`}
            >
              Listing Growth
            </button>
            <button
              onClick={() => setSelectedMetric('revenue')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMetric === 'revenue'
                  ? 'bg-primary text-black'
                  : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
              }`}
            >
              Revenue
            </button>
          </div>
          <div className="flex gap-2">
            {(['7d', '30d', '90d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-primary/20 text-primary'
                    : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                }`}
              >
                {range === 'all' ? 'All Time' : range.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-text-primary">
            {selectedMetric === 'users'
              ? 'User Growth Trend'
              : selectedMetric === 'listings'
              ? 'Listing Growth Trend'
              : 'Revenue Trend'}
          </h3>
        </div>
        <div className="space-y-4">
          {chartDataPoints.map((data, index) => (
            <div key={data.month} className="flex items-center gap-4">
              <span className="text-sm font-medium text-text-secondary w-12">{data.month}</span>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-8 bg-bg-tertiary rounded-lg overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.value / data.max) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-gold rounded-lg"
                    />
                  </div>
                  <span className="text-sm font-medium text-text-primary w-20 text-right">
                    {selectedMetric === 'revenue'
                      ? `₦${data.value.toFixed(1)}M`
                      : data.value.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
          <h4 className="font-bold text-text-primary mb-4">User Breakdown</h4>
          <div className="space-y-3">
            {chartData.map((data, index) => (
              <div key={data.month}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-text-secondary">{data.month}</span>
                  <span className="font-medium text-text-primary">
                    {data.users + data.agents} users
                  </span>
                </div>
                <div className="flex gap-1 h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.agents / maxUsers) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-primary rounded"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.users / maxUsers) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-primary/50 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
          <h4 className="font-bold text-text-primary mb-4">Top Insights</h4>
          <div className="space-y-4">
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-sm font-semibold text-success mb-1">Strong Growth</p>
              <p className="text-xs text-text-secondary">
                User base grew 18.5% month-over-month, indicating healthy platform adoption.
              </p>
            </div>
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm font-semibold text-primary mb-1">Revenue Increase</p>
              <p className="text-xs text-text-secondary">
                Revenue increased 24.5% this month, driven by credit purchases.
              </p>
            </div>
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm font-semibold text-warning mb-1">Agent Activity</p>
              <p className="text-xs text-text-secondary">
                342 active agents contributing to platform growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}