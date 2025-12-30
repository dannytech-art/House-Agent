import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, User, Clock, DollarSign, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import { mockVilanowTasks } from '../../utils/mockCIUData';

export function CIUTaskboardPanel() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'assigned' | 'in-progress' | 'viewing-scheduled' | 'closed' | 'lost'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredTasks = mockVilanowTasks.filter((task) => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const handleCreateTask = () => {
    alert('Create new Vilanow task');
  };

  const handleUpdateTask = (taskId: string, action: string) => {
    alert(`${action} action on task ${taskId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed':
        return 'bg-success/20 text-success';
      case 'in-progress':
        return 'bg-primary/20 text-primary';
      case 'viewing-scheduled':
        return 'bg-warning/20 text-warning';
      case 'lost':
        return 'bg-danger/20 text-danger';
      default:
        return 'bg-text-tertiary/20 text-text-tertiary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-danger/20 text-danger';
      case 'medium':
        return 'bg-warning/20 text-warning';
      default:
        return 'bg-primary/20 text-primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-text-primary text-xl">Vilanow Internal Agent Taskboard</h2>
          <p className="text-sm text-text-secondary">Manage platform-led deal closures</p>
        </div>
        <button
          onClick={handleCreateTask}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-black font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="viewing-scheduled">Viewing Scheduled</option>
            <option value="closed">Closed</option>
            <option value="lost">Lost</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-bg-secondary border border-border-color rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-tertiary border-b border-border-color">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Assigned Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Timeline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {filteredTasks.map((task) => (
                <tr key={task.taskId} className="hover:bg-bg-primary transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-text-primary">{task.propertyTitle}</p>
                      <p className="text-xs text-text-tertiary">Deal ID: {task.dealId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-text-tertiary" />
                      <span className="text-sm text-text-primary">{task.assignedAgent}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-text-primary">
                        Created {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                      {task.deadline && (
                        <p className="text-xs text-text-tertiary">
                          Deadline: {new Date(task.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-success" />
                      <span className="font-medium text-success">₦{(task.revenue / 1000000).toFixed(1)}M</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {task.status === 'in-progress' && (
                        <button
                          onClick={() => handleUpdateTask(task.taskId, 'schedule-viewing')}
                          className="px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-medium rounded-lg transition-colors"
                        >
                          Schedule Viewing
                        </button>
                      )}
                      {task.status !== 'closed' && task.status !== 'lost' && (
                        <button
                          onClick={() => handleUpdateTask(task.taskId, 'close')}
                          className="px-3 py-1 bg-success/20 hover:bg-success/30 text-success text-xs font-medium rounded-lg transition-colors"
                        >
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                          Close
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: mockVilanowTasks.length, icon: ClipboardList },
          {
            label: 'In Progress',
            value: mockVilanowTasks.filter((t) => t.status === 'in-progress').length,
            icon: Clock,
            color: 'text-primary',
          },
          {
            label: 'Closed',
            value: mockVilanowTasks.filter((t) => t.status === 'closed').length,
            icon: CheckCircle,
            color: 'text-success',
          },
          {
            label: 'Total Revenue',
            value: `₦${(mockVilanowTasks.reduce((sum, t) => sum + t.revenue, 0) / 1000000).toFixed(1)}M`,
            icon: DollarSign,
            color: 'text-success',
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

