import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, DollarSign, AlertCircle, TrendingUp, Shield, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminMetricCard } from '../components/AdminMetricCard';
import { AdminMapView } from '../components/AdminMapView';
import { mockAdminMetrics, mockAdminActivities, mockPendingKYC, mockFlaggedListings } from '../utils/mockAdminData';
import { mockProperties } from '../utils/mockData';
import { AdminUsersPage } from './admin/AdminUsersPage';
import { AdminListingsPage } from './admin/AdminListingsPage';
import { AdminFinancialsPage } from './admin/AdminFinancialsPage';
import { AdminModerationPage } from './admin/AdminModerationPage';
import { AdminTerritoriesPage } from './admin/AdminTerritoriesPage';
import { AdminAnalyticsPage } from './admin/AdminAnalyticsPage';
import { AdminKYCPage } from './admin/AdminKYCPage';
import { AdminReportsPage } from './admin/AdminReportsPage';
import { AdminSettingsPage } from './admin/AdminSettingsPage';
import { CIUDashboardPage } from './admin/CIUDashboardPage';
export function AdminDashboardPage() {
  const [currentSection, setCurrentSection] = useState('overview');
  const renderOverview = () => <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard title="Total Users" value={mockAdminMetrics.totalUsers.toLocaleString()} icon={Users} trend={{
        value: mockAdminMetrics.monthlyGrowth,
        isPositive: true
      }} subtitle={`${mockAdminMetrics.totalAgents} agents, ${mockAdminMetrics.totalSeekers} seekers`} delay={0} />
        <AdminMetricCard title="Active Listings" value={mockAdminMetrics.activeListings.toLocaleString()} icon={Building2} trend={{
        value: 12.3,
        isPositive: true
      }} delay={0.1} />
        <AdminMetricCard title="Total Revenue" value={`₦${(mockAdminMetrics.totalRevenue / 1000000).toFixed(1)}M`} icon={DollarSign} trend={{
        value: 24.5,
        isPositive: true
      }} subtitle="This month" delay={0.2} />
        <AdminMetricCard title="Pending Actions" value={mockAdminMetrics.pendingKYC + mockAdminMetrics.flaggedContent} icon={AlertCircle} subtitle={`${mockAdminMetrics.pendingKYC} KYC, ${mockAdminMetrics.flaggedContent} flags`} delay={0.3} />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }} className="bg-bg-secondary border border-border-color rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text-primary">Recent Activity</h3>
            <button className="text-xs text-primary hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {mockAdminActivities.map(activity => <div key={activity.id} className="flex items-start gap-3 p-3 bg-bg-primary rounded-lg border border-border-color">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.severity === 'high' ? 'bg-danger' : activity.severity === 'medium' ? 'bg-warning' : 'bg-success'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary">
                    {activity.description}
                  </p>
                  <p className="text-xs text-text-tertiary mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>)}
          </div>
        </motion.div>

        {/* Pending KYC Reviews */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5
      }} className="bg-bg-secondary border border-border-color rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-text-primary">Pending KYC</h3>
            </div>
            <span className="px-2 py-1 bg-warning/20 text-warning text-xs font-bold rounded">
              {mockPendingKYC.length}
            </span>
          </div>

          <div className="space-y-3">
            {mockPendingKYC.map(agent => <div key={agent.id} className="flex items-center gap-3 p-3 bg-bg-primary rounded-lg border border-border-color hover:border-primary/50 transition-colors">
                <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full border-2 border-border-color" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary text-sm">
                    {agent.name}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    Submitted{' '}
                    {new Date(agent.kycCompletedAt!).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-success/20 hover:bg-success/30 text-success rounded-lg transition-colors">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg transition-colors">
                    <XCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-bg-tertiary hover:bg-bg-primary text-text-secondary rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>)}
          </div>
        </motion.div>
      </div>

      {/* God's Eye View Map */}
      <motion.div 
        initial={{
          opacity: 0,
          y: 20
        }} 
        animate={{
          opacity: 1,
          y: 0
        }} 
        transition={{
          delay: 0.6
        }}
        className="h-[600px]"
      >
        <AdminMapView properties={mockProperties} height="600px" />
      </motion.div>


      {/* Flagged Listings */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.6
    }} className="bg-bg-secondary border border-border-color rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-danger" />
            <h3 className="font-bold text-text-primary">Flagged Listings</h3>
          </div>
          <span className="px-2 py-1 bg-danger/20 text-danger text-xs font-bold rounded">
            {mockFlaggedListings.length}
          </span>
        </div>

        <div className="space-y-3">
          {mockFlaggedListings.map(listing => <div key={listing.id} className="flex items-start gap-4 p-4 bg-bg-primary rounded-lg border border-border-color hover:border-primary/50 transition-colors">
              <img src={listing.images[0]} alt={listing.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-text-primary mb-1">
                  {listing.title}
                </h4>
                <p className="text-sm text-text-secondary mb-2">
                  ₦{listing.price.toLocaleString()} • {listing.location}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 bg-danger/20 text-danger rounded">
                    Duplicate Suspected
                  </span>
                  <span className="text-text-tertiary">
                    by {listing.agentName}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-success/20 hover:bg-success/30 text-success text-sm font-medium rounded-lg transition-colors">
                  Approve
                </button>
                <button className="px-4 py-2 bg-danger/20 hover:bg-danger/30 text-danger text-sm font-medium rounded-lg transition-colors">
                  Remove
                </button>
              </div>
            </div>)}
        </div>
      </motion.div>
    </div>;
  const renderSection = () => {
    switch (currentSection) {
      case 'overview':
        return renderOverview();
      case 'ciu':
        return <CIUDashboardPage />;
      case 'users':
        return <AdminUsersPage />;
      case 'listings':
        return <AdminListingsPage />;
      case 'financials':
        return <AdminFinancialsPage />;
      case 'moderation':
        return <AdminModerationPage />;
      case 'territories':
        return <AdminTerritoriesPage />;
      case 'analytics':
        return <AdminAnalyticsPage />;
      case 'kyc':
        return <AdminKYCPage />;
      case 'reports':
        return <AdminReportsPage />;
      case 'settings':
        return <AdminSettingsPage />;
      default:
        return renderOverview();
    }
  };
  return <div className="min-h-screen bg-bg-primary">
      <AdminSidebar currentSection={currentSection} onNavigate={setCurrentSection} />

      <div className="ml-64 pt-20 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
              {currentSection === 'overview' ? 'Admin Dashboard' : currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
            </h1>
            <p className="text-text-secondary">
              {currentSection === 'overview' ? 'Manage and monitor the Vilanow platform' : `Manage ${currentSection}`}
            </p>
          </div>

          {/* Content */}
          {renderSection()}
        </div>
      </div>
    </div>;
}