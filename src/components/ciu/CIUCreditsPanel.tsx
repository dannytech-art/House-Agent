import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, AlertCircle, DollarSign, CreditCard } from 'lucide-react';
import { mockCreditIntelligence } from '../../utils/mockCIUData';

export function CIUCreditsPanel() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const handleAction = (action: string, agentId: string) => {
    alert(`${action} action performed for agent ${agentId}`);
  };

  const maxPurchase = Math.max(...mockCreditIntelligence.dailyPurchases.map((d) => d.amount));
  const maxConsumption = Math.max(...mockCreditIntelligence.dailyConsumption.map((d) => d.amount));

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-secondary border border-border-color rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-success" />
            <p className="text-sm text-text-secondary">Total Purchases</p>
          </div>
          <p className="text-2xl font-bold text-text-primary">₦{(mockCreditIntelligence.totalPurchases / 1000000).toFixed(1)}M</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-bg-secondary border border-border-color rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <p className="text-sm text-text-secondary">Total Consumption</p>
          </div>
          <p className="text-2xl font-bold text-text-primary">₦{(mockCreditIntelligence.totalConsumption / 1000000).toFixed(1)}M</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-bg-secondary border border-border-color rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-warning" />
            <p className="text-sm text-text-secondary">Net Balance</p>
          </div>
          <p className="text-2xl font-bold text-success">
            ₦{((mockCreditIntelligence.totalPurchases - mockCreditIntelligence.totalConsumption) / 1000000).toFixed(1)}M
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-bg-secondary border border-border-color rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-danger" />
            <p className="text-sm text-text-secondary">Unusual Spikes</p>
          </div>
          <p className="text-2xl font-bold text-text-primary">{mockCreditIntelligence.unusualSpikes.length}</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchases Chart */}
        <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text-primary">Credit Purchases</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-1 bg-bg-primary border border-border-color rounded-lg text-xs focus:border-primary focus:outline-none"
            >
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
            </select>
          </div>
          <div className="flex items-end justify-between gap-2 h-48">
            {mockCreditIntelligence.dailyPurchases.map((day, index) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-40 bg-bg-tertiary rounded-t overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.amount / maxPurchase) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="w-full bg-gradient-gold rounded-t"
                  />
                </div>
                <span className="text-xs text-text-tertiary">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="text-xs font-medium text-text-primary">₦{(day.amount / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>

        {/* Consumption Chart */}
        <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
          <h3 className="font-bold text-text-primary mb-4">Credit Consumption</h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {mockCreditIntelligence.dailyConsumption.map((day, index) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-40 bg-bg-tertiary rounded-t overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.amount / maxConsumption) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="w-full bg-primary/70 rounded-t"
                  />
                </div>
                <span className="text-xs text-text-tertiary">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="text-xs font-medium text-text-primary">₦{(day.amount / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Spenders */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
        <h3 className="font-bold text-text-primary mb-4">Top Credit Spenders</h3>
        <div className="space-y-3">
          {mockCreditIntelligence.topSpenders.map((spender, index) => (
            <div key={spender.agentId} className="flex items-center justify-between p-3 bg-bg-primary rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-text-primary">{spender.agentName}</p>
                  <p className="text-xs text-text-tertiary">Agent ID: {spender.agentId}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-text-primary">₦{spender.amount.toLocaleString()}</p>
                  <p className="text-xs text-text-tertiary">Total spent</p>
                </div>
                <button
                  onClick={() => handleAction('view-wallet', spender.agentId)}
                  className="px-3 py-1 bg-bg-tertiary hover:bg-bg-primary text-text-secondary text-sm rounded-lg transition-colors"
                >
                  View Wallet
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unusual Spikes */}
      {mockCreditIntelligence.unusualSpikes.length > 0 && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-warning" />
            <h3 className="font-bold text-text-primary">Unusual Activity Spikes</h3>
          </div>
          <div className="space-y-3">
            {mockCreditIntelligence.unusualSpikes.map((spike) => (
              <div key={spike.agentId} className="flex items-center justify-between p-3 bg-bg-primary rounded-lg">
                <div>
                  <p className="font-medium text-text-primary">{spike.agentName}</p>
                  <p className="text-xs text-text-tertiary">
                    {spike.spikeType === 'purchase' ? 'Unusual purchase' : 'Unusual consumption'} of ₦
                    {spike.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {new Date(spike.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleAction('investigate', spike.agentId)}
                  className="px-3 py-1 bg-warning/20 hover:bg-warning/30 text-warning text-sm rounded-lg transition-colors"
                >
                  Investigate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

