import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  BarChart3, 
  List, 
  Users, 
  UserSearch, 
  GitBranch, 
  Target, 
  ClipboardList, 
  Handshake, 
  Wallet, 
  ShieldAlert, 
  TrendingUp, 
  Settings, 
  FileText, 
  Wrench,
  Activity,
  AlertCircle
} from 'lucide-react';
import { CIUOverviewPanel } from '../../components/ciu/CIUOverviewPanel';
import { CIUListingsPanel } from '../../components/ciu/CIUListingsPanel';
import { CIUAgentsPanel } from '../../components/ciu/CIUAgentsPanel';
import { CIUSeekersPanel } from '../../components/ciu/CIUSeekersPanel';
import { CIUInterestsPanel } from '../../components/ciu/CIUInterestsPanel';
import { CIUDealsPanel } from '../../components/ciu/CIUDealsPanel';
import { CIUTaskboardPanel } from '../../components/ciu/CIUTaskboardPanel';
import { CIUMarketplacePanel } from '../../components/ciu/CIUMarketplacePanel';
import { CIUCreditsPanel } from '../../components/ciu/CIUCreditsPanel';
import { CIURiskPanel } from '../../components/ciu/CIURiskPanel';
import { CIUDemandPanel } from '../../components/ciu/CIUDemandPanel';
import { CIUAutomationPanel } from '../../components/ciu/CIUAutomationPanel';
import { CIUAuditPanel } from '../../components/ciu/CIUAuditPanel';
import { CIUToolkitPanel } from '../../components/ciu/CIUToolkitPanel';

interface CIUTab {
  id: string;
  label: string;
  icon: any;
  badge?: number;
}

const ciuTabs: CIUTab[] = [
  { id: 'overview', label: 'Marketplace Overview', icon: BarChart3 },
  { id: 'listings', label: 'Listings Intelligence', icon: List, badge: 12 },
  { id: 'agents', label: 'Agent Monitor', icon: Users },
  { id: 'seekers', label: 'Seeker Intelligence', icon: UserSearch },
  { id: 'interests', label: 'Interest Connections', icon: GitBranch, badge: 5 },
  { id: 'deals', label: 'Closable Deals', icon: Target, badge: 8 },
  { id: 'taskboard', label: 'Vilanow Taskboard', icon: ClipboardList },
  { id: 'marketplace', label: 'Agent Marketplace', icon: Handshake },
  { id: 'credits', label: 'Credit Intelligence', icon: Wallet },
  { id: 'risk', label: 'Risk & Compliance', icon: ShieldAlert, badge: 3 },
  { id: 'demand', label: 'Demand & Supply', icon: TrendingUp },
  { id: 'automation', label: 'Automation Rules', icon: Settings },
  { id: 'audit', label: 'Audit Log', icon: FileText },
  { id: 'toolkit', label: 'Action Toolkit', icon: Wrench },
];

export function CIUDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEnabled, setIsEnabled] = useState(true);

  const renderPanel = () => {
    switch (activeTab) {
      case 'overview':
        return <CIUOverviewPanel />;
      case 'listings':
        return <CIUListingsPanel />;
      case 'agents':
        return <CIUAgentsPanel />;
      case 'seekers':
        return <CIUSeekersPanel />;
      case 'interests':
        return <CIUInterestsPanel />;
      case 'deals':
        return <CIUDealsPanel />;
      case 'taskboard':
        return <CIUTaskboardPanel />;
      case 'marketplace':
        return <CIUMarketplacePanel />;
      case 'credits':
        return <CIUCreditsPanel />;
      case 'risk':
        return <CIURiskPanel />;
      case 'demand':
        return <CIUDemandPanel />;
      case 'automation':
        return <CIUAutomationPanel />;
      case 'audit':
        return <CIUAuditPanel />;
      case 'toolkit':
        return <CIUToolkitPanel />;
      default:
        return <CIUOverviewPanel />;
    }
  };

  return (
    <div className="space-y-6">
      {/* CIU Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary">
              Central Intelligence Unit
            </h1>
            <p className="text-text-secondary">
              Real-time marketplace monitoring and intelligent deal management
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary rounded-lg">
            <Activity className={`w-4 h-4 ${isEnabled ? 'text-success' : 'text-text-tertiary'}`} />
            <span className={`text-sm font-medium ${isEnabled ? 'text-success' : 'text-text-tertiary'}`}>
              {isEnabled ? 'Active' : 'Disabled'}
            </span>
          </div>
          <button
            onClick={() => setIsEnabled(!isEnabled)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isEnabled
                ? 'bg-warning/20 hover:bg-warning/30 text-warning'
                : 'bg-success/20 hover:bg-success/30 text-success'
            }`}
          >
            {isEnabled ? 'Disable CIU' : 'Enable CIU'}
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {isEnabled && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary mb-1">CIU Active</p>
            <p className="text-xs text-text-secondary">
              Real-time monitoring enabled. 8 closable deals detected, 5 interest connections need attention, 3 risk flags pending review.
            </p>
          </div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {ciuTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-primary text-black'
                    : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      isActive
                        ? 'bg-black/20 text-black'
                        : 'bg-primary/20 text-primary'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderPanel()}
      </motion.div>
    </div>
  );
}

