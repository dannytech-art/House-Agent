import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Filter, Clock, CheckCircle, XCircle, TrendingUp, Users, DollarSign, Building2, Award } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  description: string;
  lastGenerated: string;
  type: 'Users' | 'Finance' | 'Listings' | 'Agents';
  status: 'scheduled' | 'completed' | 'failed';
  format: 'PDF' | 'CSV' | 'Excel';
}

export function AdminReportsPage() {
  const [reportType, setReportType] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const reports: Report[] = [
    {
      id: '1',
      name: 'User Growth Report',
      description: 'Monthly user acquisition and retention metrics',
      lastGenerated: '2024-01-20',
      type: 'Users',
      status: 'completed',
      format: 'PDF'
    },
    {
      id: '2',
      name: 'Revenue Report',
      description: 'Financial performance and transaction details',
      lastGenerated: '2024-01-20',
      type: 'Finance',
      status: 'completed',
      format: 'Excel'
    },
    {
      id: '3',
      name: 'Listing Performance',
      description: 'Property listing analytics and engagement',
      lastGenerated: '2024-01-19',
      type: 'Listings',
      status: 'completed',
      format: 'CSV'
    },
    {
      id: '4',
      name: 'Agent Performance',
      description: 'Agent rankings, metrics, and territory analysis',
      lastGenerated: '2024-01-19',
      type: 'Agents',
      status: 'scheduled',
      format: 'PDF'
    }
  ];

  const reportTypes = [
    { value: 'user-growth', label: 'User Growth', icon: Users },
    { value: 'revenue', label: 'Revenue', icon: DollarSign },
    { value: 'listings', label: 'Listings', icon: Building2 },
    { value: 'agents', label: 'Agents', icon: Award }
  ];

  const handleGenerateReport = () => {
    if (!reportType) {
      alert('Please select a report type');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('Report generated successfully!');
    }, 2000);
  };

  const handleDownloadReport = (reportId: string) => {
    alert(`Downloading report ${reportId}...`);
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'Users': return Users;
      case 'Finance': return DollarSign;
      case 'Listings': return Building2;
      case 'Agents': return Award;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Generate Custom Report */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
        <h3 className="font-bold text-text-primary mb-4">Generate Custom Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
          >
            <option value="">Select Report Type</option>
            {reportTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
            placeholder="End Date"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating || !reportType}
            className="px-6 py-2 bg-gradient-gold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </button>
          {reportType && (
            <div className="text-sm text-text-secondary">
              Selected: {reportTypes.find(t => t.value === reportType)?.label}
            </div>
          )}
        </div>
      </div>

      {/* Available Reports */}
      <div>
        <h3 className="font-bold text-text-primary mb-4">Available Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report, index) => {
            const Icon = getReportIcon(report.type);
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
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-text-primary">{report.name}</h3>
                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-medium rounded-full">
                          {report.type}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mb-2">{report.description}</p>
                      <div className="flex items-center gap-3 text-xs text-text-tertiary flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(report.lastGenerated).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {report.format}
                        </span>
                        <span>•</span>
                        <span
                          className={`flex items-center gap-1 ${
                            report.status === 'completed'
                              ? 'text-success'
                              : report.status === 'scheduled'
                              ? 'text-warning'
                              : 'text-danger'
                          }`}
                        >
                          {report.status === 'completed' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : report.status === 'scheduled' ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {report.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadReport(report.id)}
                    className="flex-1 px-4 py-2 bg-bg-tertiary hover:bg-bg-primary text-text-primary text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary text-sm font-medium rounded-lg transition-colors">
                    Schedule
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
        <h3 className="font-bold text-text-primary mb-4">Scheduled Reports</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg">
            <div>
              <p className="text-sm font-medium text-text-primary">Weekly User Growth Report</p>
              <p className="text-xs text-text-tertiary">Every Monday at 9:00 AM</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-warning/20 text-warning text-xs rounded-full">Active</span>
              <button className="px-3 py-1 bg-danger/20 hover:bg-danger/30 text-danger text-xs rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg">
            <div>
              <p className="text-sm font-medium text-text-primary">Monthly Revenue Report</p>
              <p className="text-xs text-text-tertiary">1st of every month at 8:00 AM</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-warning/20 text-warning text-xs rounded-full">Active</span>
              <button className="px-3 py-1 bg-danger/20 hover:bg-danger/30 text-danger text-xs rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}