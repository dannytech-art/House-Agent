import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, MessageSquare, Radio, AlertTriangle, CheckCircle, Users, Building2, Target } from 'lucide-react';

export function CIUToolkitPanel() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [targetUsers, setTargetUsers] = useState<string[]>([]);

  const actionTypes = [
    {
      id: 'send-message',
      label: 'Send In-App Message',
      icon: MessageSquare,
      description: 'Send targeted message to specific users or groups',
    },
    {
      id: 'broadcast',
      label: 'Broadcast Update',
      icon: Radio,
      description: 'Broadcast market update to all users',
    },
    {
      id: 'override',
      label: 'Override Decision',
      icon: AlertTriangle,
      description: 'Override automated system decisions',
    },
    {
      id: 'manual-intervention',
      label: 'Manual Intervention',
      icon: Wrench,
      description: 'Apply manual interventions to listings or users',
    },
  ];

  const handleSendMessage = () => {
    alert(`Sending message to ${targetUsers.length} users: ${message}`);
    setMessage('');
    setTargetUsers([]);
  };

  const handleBroadcast = () => {
    alert(`Broadcasting update: ${message}`);
    setMessage('');
  };

  const handleOverride = () => {
    alert('Override decision functionality');
  };

  const handleManualIntervention = () => {
    alert('Manual intervention functionality');
  };

  const executeAction = () => {
    switch (selectedAction) {
      case 'send-message':
        handleSendMessage();
        break;
      case 'broadcast':
        handleBroadcast();
        break;
      case 'override':
        handleOverride();
        break;
      case 'manual-intervention':
        handleManualIntervention();
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actionTypes.map((action, index) => {
          const Icon = action.icon;
          const isSelected = selectedAction === action.id;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedAction(action.id)}
              className={`p-6 bg-bg-secondary border-2 rounded-xl text-left transition-all ${
                isSelected ? 'border-primary bg-primary/10' : 'border-border-color hover:border-primary/50'
              }`}
            >
              <Icon className={`w-6 h-6 mb-3 ${isSelected ? 'text-primary' : 'text-text-tertiary'}`} />
              <h3 className={`font-bold mb-2 ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                {action.label}
              </h3>
              <p className="text-xs text-text-tertiary">{action.description}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Action Form */}
      {selectedAction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-secondary border border-border-color rounded-xl p-6"
        >
          <h3 className="font-bold text-text-primary mb-4">
            {actionTypes.find((a) => a.id === selectedAction)?.label}
          </h3>

          {selectedAction === 'send-message' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Target Users</label>
                <div className="flex gap-2 flex-wrap">
                  {['All Agents', 'All Seekers', 'High-Intent Seekers', 'Top Agents'].map((target) => (
                    <button
                      key={target}
                      onClick={() => {
                        if (targetUsers.includes(target)) {
                          setTargetUsers(targetUsers.filter((t) => t !== target));
                        } else {
                          setTargetUsers([...targetUsers, target]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        targetUsers.includes(target)
                          ? 'bg-primary text-black'
                          : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {target}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none resize-none"
                  rows={4}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!message || targetUsers.length === 0}
                className="px-6 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors"
              >
                Send Message
              </button>
            </div>
          )}

          {selectedAction === 'broadcast' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Broadcast Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter broadcast message..."
                  className="w-full px-4 py-3 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none resize-none"
                  rows={4}
                />
              </div>
              <button
                onClick={handleBroadcast}
                disabled={!message}
                className="px-6 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors"
              >
                Broadcast to All Users
              </button>
            </div>
          )}

          {selectedAction === 'override' && (
            <div className="space-y-4">
              <p className="text-sm text-text-secondary">
                Override automated system decisions for specific entities. Select entity type and ID to override.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">Entity Type</label>
                  <select className="w-full px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none">
                    <option>Listing</option>
                    <option>Agent</option>
                    <option>Deal</option>
                    <option>Interest</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">Entity ID</label>
                  <input
                    type="text"
                    placeholder="Enter entity ID"
                    className="w-full px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={handleOverride}
                className="px-6 py-2 bg-warning/20 hover:bg-warning/30 text-warning font-medium rounded-lg transition-colors"
              >
                Override Decision
              </button>
            </div>
          )}

          {selectedAction === 'manual-intervention' && (
            <div className="space-y-4">
              <p className="text-sm text-text-secondary">
                Apply manual interventions to listings, agents, or deals.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">Intervention Type</label>
                  <select className="w-full px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none">
                    <option>Freeze Listing</option>
                    <option>Promote Listing</option>
                    <option>Suspend Agent</option>
                    <option>Boost Visibility</option>
                    <option>Assign Deal</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">Target ID</label>
                  <input
                    type="text"
                    placeholder="Enter target ID"
                    className="w-full px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={handleManualIntervention}
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-black font-medium rounded-lg transition-colors"
              >
                Apply Intervention
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

