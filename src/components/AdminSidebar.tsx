import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Building2, DollarSign, Flag, Map, Settings, FileText, Shield, TrendingUp, Brain } from 'lucide-react';

interface AdminSidebarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [{
  id: 'overview',
  label: 'Overview',
  icon: LayoutDashboard
}, {
  id: 'ciu',
  label: 'Central Intelligence Unit',
  icon: Brain
}, {
  id: 'users',
  label: 'Users',
  icon: Users
}, {
  id: 'listings',
  label: 'Listings',
  icon: Building2
}, {
  id: 'financials',
  label: 'Financials',
  icon: DollarSign
}, {
  id: 'moderation',
  label: 'Moderation',
  icon: Flag
}, {
  id: 'territories',
  label: 'Territories',
  icon: Map
}, {
  id: 'analytics',
  label: 'Analytics',
  icon: TrendingUp
}, {
  id: 'kyc',
  label: 'KYC Review',
  icon: Shield
}, {
  id: 'reports',
  label: 'Reports',
  icon: FileText
}, {
  id: 'settings',
  label: 'Settings',
  icon: Settings
}];

export function AdminSidebar({
  currentSection,
  onNavigate
}: AdminSidebarProps) {
  return (
    <div className="w-64 h-screen bg-bg-secondary border-r border-border-color fixed left-0 top-0 pt-20 overflow-y-auto">
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">
            Admin Panel
          </h2>
        </div>

        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30
                    }}
                  />
                )}
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
