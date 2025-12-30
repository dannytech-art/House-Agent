import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, ToggleLeft, ToggleRight, Clock, CheckCircle, Play, Pause, Edit, Trash2 } from 'lucide-react';
import { mockAutomationRules } from '../../utils/mockCIUData';

export function CIUAutomationPanel() {
  const [rules, setRules] = useState(mockAutomationRules);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule))
    );
  };

  const handleDeleteRule = (ruleId: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      setRules((prev) => prev.filter((rule) => rule.id !== ruleId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-text-primary text-xl">Automation Rules Engine</h2>
          <p className="text-sm text-text-secondary">Configure automated actions based on marketplace conditions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-black font-medium rounded-lg transition-colors"
        >
          Create Rule
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule, index) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-bg-secondary border-2 rounded-xl p-6 ${rule.enabled ? 'border-primary/50' : 'border-border-color opacity-60'}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-text-primary">{rule.name}</h3>
                  {rule.enabled && (
                    <span className="px-2 py-1 bg-success/20 text-success text-xs rounded-full flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary mb-4">{rule.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-bg-primary rounded-lg p-3">
                    <p className="text-xs text-text-tertiary mb-1">Condition</p>
                    <p className="text-sm font-medium text-text-primary font-mono">{rule.condition}</p>
                  </div>
                  <div className="bg-bg-primary rounded-lg p-3">
                    <p className="text-xs text-text-tertiary mb-1">Action</p>
                    <p className="text-sm font-medium text-text-primary font-mono">{rule.action}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 text-xs text-text-tertiary">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Executed {rule.executionCount} times
                  </span>
                  {rule.lastExecuted && (
                    <span>Last: {new Date(rule.lastExecuted).toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border-color">
              <button
                onClick={() => handleToggleRule(rule.id)}
                className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary hover:bg-bg-primary rounded-lg transition-colors"
              >
                {rule.enabled ? (
                  <>
                    <ToggleRight className="w-5 h-5 text-success" />
                    <span className="text-sm font-medium text-text-primary">Disable</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-5 h-5 text-text-tertiary" />
                    <span className="text-sm font-medium text-text-secondary">Enable</span>
                  </>
                )}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-3 py-2 bg-bg-tertiary hover:bg-bg-primary text-text-secondary rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="px-3 py-2 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Rules', value: rules.length, icon: Settings },
          { label: 'Active Rules', value: rules.filter((r) => r.enabled).length, icon: Play, color: 'text-success' },
          {
            label: 'Total Executions',
            value: rules.reduce((sum, r) => sum + r.executionCount, 0),
            icon: CheckCircle,
            color: 'text-primary',
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

