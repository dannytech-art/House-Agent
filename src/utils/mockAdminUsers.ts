import { Agent } from '../types';
import { mockLeaderboardAgents } from './mockData';
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'seeker' | 'agent';
  status: 'active' | 'suspended' | 'banned';
  joinedDate: string;
  lastActive: string;
  totalActivity: number;
  avatar?: string;
}
export const mockAdminAgents: (Agent & {
  status: 'active' | 'suspended' | 'banned';
})[] = mockLeaderboardAgents.map((agent, index) => ({
  ...agent,
  status: index === 7 ? 'suspended' : 'active',
  lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
}));
export const mockAdminSeekers: AdminUser[] = [{
  id: 'seeker-1',
  name: 'Adebayo Johnson',
  email: 'adebayo.j@email.com',
  phone: '+234 803 456 7890',
  role: 'seeker',
  status: 'active',
  joinedDate: '2024-01-15T10:00:00Z',
  lastActive: '2024-01-20T14:30:00Z',
  totalActivity: 45,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adebayo&backgroundColor=D4AF37'
}, {
  id: 'seeker-2',
  name: 'Chioma Okonkwo',
  email: 'chioma.o@email.com',
  phone: '+234 805 123 4567',
  role: 'seeker',
  status: 'active',
  joinedDate: '2024-01-10T09:00:00Z',
  lastActive: '2024-01-20T16:45:00Z',
  totalActivity: 67,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma&backgroundColor=D4AF37'
}, {
  id: 'seeker-3',
  name: 'Ibrahim Musa',
  email: 'ibrahim.m@email.com',
  phone: '+234 807 890 1234',
  role: 'seeker',
  status: 'active',
  joinedDate: '2024-01-18T11:30:00Z',
  lastActive: '2024-01-19T10:20:00Z',
  totalActivity: 23,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ibrahim&backgroundColor=D4AF37'
}, {
  id: 'seeker-4',
  name: 'Blessing Eze',
  email: 'blessing.e@email.com',
  phone: '+234 809 234 5678',
  role: 'seeker',
  status: 'suspended',
  joinedDate: '2023-12-20T14:00:00Z',
  lastActive: '2024-01-15T09:30:00Z',
  totalActivity: 12,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Blessing&backgroundColor=D4AF37'
}];
export interface AdminTransaction {
  id: string;
  type: 'credit_purchase' | 'credit_spent' | 'payout' | 'refund';
  userId: string;
  userName: string;
  amount: number;
  credits?: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  description: string;
}
export const mockAdminTransactions: AdminTransaction[] = [{
  id: 'txn-1',
  type: 'credit_purchase',
  userId: 'agent-1',
  userName: 'Chidi Okafor',
  amount: 50000,
  credits: 500,
  status: 'completed',
  timestamp: '2024-01-20T14:30:00Z',
  description: '500 Credits Bundle'
}, {
  id: 'txn-2',
  type: 'credit_spent',
  userId: 'agent-2',
  userName: 'Fatima Ibrahim',
  amount: 0,
  credits: 50,
  status: 'completed',
  timestamp: '2024-01-20T13:15:00Z',
  description: 'Unlocked lead for Luxury Apartment'
}, {
  id: 'txn-3',
  type: 'payout',
  userId: 'agent-3',
  userName: 'Emeka Nnamdi',
  amount: 150000,
  status: 'pending',
  timestamp: '2024-01-20T10:00:00Z',
  description: 'Commission payout for January'
}, {
  id: 'txn-4',
  type: 'credit_purchase',
  userId: 'agent-4',
  userName: 'Ngozi Eze',
  amount: 100000,
  credits: 1000,
  status: 'completed',
  timestamp: '2024-01-19T16:45:00Z',
  description: '1000 Credits Bundle'
}, {
  id: 'txn-5',
  type: 'refund',
  userId: 'agent-5',
  userName: 'Tunde Adebayo',
  amount: 25000,
  credits: 250,
  status: 'completed',
  timestamp: '2024-01-19T11:20:00Z',
  description: 'Refund for duplicate charge'
}];
export interface AdminReport {
  id: string;
  type: 'listing' | 'user' | 'message';
  reportedBy: string;
  reportedItem: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  description: string;
}
export const mockAdminReports: AdminReport[] = [{
  id: 'report-1',
  type: 'listing',
  reportedBy: 'seeker-1',
  reportedItem: 'Luxury 3 Bedroom Apartment',
  reason: 'Duplicate listing',
  status: 'pending',
  severity: 'high',
  timestamp: '2024-01-20T14:00:00Z',
  description: 'This property appears to be listed multiple times by different agents'
}, {
  id: 'report-2',
  type: 'user',
  reportedBy: 'agent-3',
  reportedItem: 'agent-7',
  reason: 'Spam behavior',
  status: 'reviewed',
  severity: 'medium',
  timestamp: '2024-01-20T10:30:00Z',
  description: 'Agent is sending unsolicited messages to multiple users'
}, {
  id: 'report-3',
  type: 'listing',
  reportedBy: 'seeker-2',
  reportedItem: 'Modern 4 Bedroom Duplex',
  reason: 'Misleading information',
  status: 'resolved',
  severity: 'medium',
  timestamp: '2024-01-19T15:20:00Z',
  description: 'Property description does not match actual property'
}];