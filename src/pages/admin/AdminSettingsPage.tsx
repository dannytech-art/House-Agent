import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, DollarSign, Zap, Save, AlertCircle, CheckCircle, Database, Globe, Lock, CreditCard, Eye, EyeOff } from 'lucide-react';

interface Setting {
  id: string;
  label: string;
  description?: string;
  type: 'toggle' | 'number' | 'text' | 'password' | 'select';
  value: any;
  options?: { value: string; label: string }[];
}

interface SettingSection {
  title: string;
  icon: any;
  settings: Setting[];
}

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingSection[]>([
    {
      title: 'Platform Settings',
      icon: Settings,
      settings: [
        {
          id: 'maintenance-mode',
          label: 'Maintenance Mode',
          description: 'Disable platform access for all users except admins',
          type: 'toggle',
          value: false
        },
        {
          id: 'user-registration',
          label: 'User Registration',
          description: 'Allow new users to register',
          type: 'toggle',
          value: true
        },
        {
          id: 'auto-approve-listings',
          label: 'Auto-approve Listings',
          description: 'Automatically approve new property listings',
          type: 'toggle',
          value: false
        },
        {
          id: 'platform-language',
          label: 'Default Language',
          type: 'select',
          value: 'en',
          options: [
            { value: 'en', label: 'English' },
            { value: 'fr', label: 'French' },
            { value: 'es', label: 'Spanish' }
          ]
        }
      ]
    },
    {
      title: 'Notification Settings',
      icon: Bell,
      settings: [
        {
          id: 'email-notifications',
          label: 'Email Notifications',
          description: 'Send email notifications to users',
          type: 'toggle',
          value: true
        },
        {
          id: 'sms-notifications',
          label: 'SMS Notifications',
          description: 'Send SMS notifications (requires SMS gateway)',
          type: 'toggle',
          value: false
        },
        {
          id: 'push-notifications',
          label: 'Push Notifications',
          description: 'Enable browser push notifications',
          type: 'toggle',
          value: true
        }
      ]
    },
    {
      title: 'Security Settings',
      icon: Shield,
      settings: [
        {
          id: 'two-factor-auth',
          label: 'Two-Factor Authentication',
          description: 'Require 2FA for admin accounts',
          type: 'toggle',
          value: true
        },
        {
          id: 'session-timeout',
          label: 'Session Timeout (minutes)',
          description: 'Auto-logout inactive users after this time',
          type: 'number',
          value: 30
        },
        {
          id: 'max-login-attempts',
          label: 'Max Login Attempts',
          description: 'Maximum failed login attempts before account lock',
          type: 'number',
          value: 5
        },
        {
          id: 'password-min-length',
          label: 'Minimum Password Length',
          type: 'number',
          value: 8
        }
      ]
    },
    {
      title: 'Pricing Settings',
      icon: DollarSign,
      settings: [
        {
          id: 'credit-price',
          label: 'Credit Price (₦ per credit)',
          description: 'Price of a single credit in Nigerian Naira',
          type: 'number',
          value: 100
        },
        {
          id: 'commission-rate',
          label: 'Commission Rate (%)',
          description: 'Platform commission on transactions',
          type: 'number',
          value: 5
        },
        {
          id: 'lead-unlock-cost',
          label: 'Lead Unlock Cost (credits)',
          description: 'Credits required to unlock a buyer lead',
          type: 'number',
          value: 50
        }
      ]
    },
    {
      title: 'Payment Settings',
      icon: CreditCard,
      settings: [
        {
          id: 'paystack-public-key',
          label: 'Paystack Public Key',
          description: 'Your Paystack public key (starts with pk_)',
          type: 'password',
          value: ''
        },
        {
          id: 'paystack-secret-key',
          label: 'Paystack Secret Key',
          description: 'Your Paystack secret key (starts with sk_). Keep this secure!',
          type: 'password',
          value: ''
        },
        {
          id: 'paystack-test-mode',
          label: 'Test Mode',
          description: 'Use Paystack test mode (for development)',
          type: 'toggle',
          value: true
        }
      ]
    },
    {
      title: 'System Settings',
      icon: Database,
      settings: [
        {
          id: 'max-file-size',
          label: 'Max File Upload Size (MB)',
          description: 'Maximum size for property images and documents',
          type: 'number',
          value: 10
        },
        {
          id: 'backup-frequency',
          label: 'Backup Frequency',
          type: 'select',
          value: 'daily',
          options: [
            { value: 'hourly', label: 'Hourly' },
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' }
          ]
        },
        {
          id: 'cache-ttl',
          label: 'Cache TTL (seconds)',
          description: 'Time-to-live for cached data',
          type: 'number',
          value: 3600
        }
      ]
    }
  ]);

  const [hasChanges, setHasChanges] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState<{ [key: string]: boolean }>({});

  const handleSettingChange = (sectionIndex: number, settingId: string, newValue: any) => {
    setSettings((prev) => {
      const updated = [...prev];
      updated[sectionIndex].settings = updated[sectionIndex].settings.map((setting) =>
        setting.id === settingId ? { ...setting, value: newValue } : setting
      );
      return updated;
    });
    setHasChanges(true);
    setSaved(false);
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    setHasChanges(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const ToggleSwitch = ({ value, onChange }: { value: boolean; onChange: (val: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        value ? 'bg-primary' : 'bg-bg-tertiary'
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
          value ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-success/20 border border-success/30 rounded-xl p-4 flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-success" />
          <p className="text-sm font-medium text-success">Settings saved successfully!</p>
        </motion.div>
      )}

      {settings.map((section, sectionIndex) => {
        const Icon = section.icon;
        return (
          <motion.div
            key={sectionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-bg-secondary border border-border-color rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-text-primary">{section.title}</h3>
            </div>
            <div className="space-y-4">
              {section.settings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-start justify-between py-3 border-b border-border-color last:border-0"
                >
                  <div className="flex-1">
                    <label className="text-sm font-medium text-text-primary block mb-1">
                      {setting.label}
                    </label>
                    {setting.description && (
                      <p className="text-xs text-text-tertiary">{setting.description}</p>
                    )}
                  </div>
                  <div className="ml-4">
                    {setting.type === 'toggle' ? (
                      <ToggleSwitch
                        value={setting.value}
                        onChange={(val) => handleSettingChange(sectionIndex, setting.id, val)}
                      />
                    ) : setting.type === 'select' ? (
                      <select
                        value={setting.value}
                        onChange={(e) => handleSettingChange(sectionIndex, setting.id, e.target.value)}
                        className="px-3 py-1.5 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none min-w-[150px]"
                      >
                        {setting.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : setting.type === 'password' ? (
                      <div className="relative">
                        <input
                          type={showPasswordFields[setting.id] ? 'text' : 'password'}
                          value={setting.value}
                          onChange={(e) =>
                            handleSettingChange(sectionIndex, setting.id, e.target.value)
                          }
                          placeholder="Enter API key"
                          className="w-80 px-3 py-1.5 pr-10 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswordFields((prev) => ({
                              ...prev,
                              [setting.id]: !prev[setting.id]
                            }))
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-bg-tertiary rounded transition-colors"
                        >
                          {showPasswordFields[setting.id] ? (
                            <EyeOff className="w-4 h-4 text-text-tertiary" />
                          ) : (
                            <Eye className="w-4 h-4 text-text-tertiary" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <input
                        type={setting.type}
                        value={setting.value}
                        onChange={(e) =>
                          handleSettingChange(
                            sectionIndex,
                            setting.id,
                            setting.type === 'number' ? Number(e.target.value) : e.target.value
                          )
                        }
                        className={`${
                          setting.type === 'text' ? 'w-80' : 'w-24'
                        } px-3 py-1.5 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none`}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      <div className="flex items-center justify-between">
        {hasChanges && (
          <div className="flex items-center gap-2 text-sm text-warning">
            <AlertCircle className="w-4 h-4" />
            <span>You have unsaved changes</span>
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className="px-6 py-3 bg-gradient-gold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all flex items-center gap-2 ml-auto"
        >
          <Save className="w-5 h-5" />
          Save All Changes
        </button>
      </div>
    </div>
  );
}