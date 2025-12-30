import { Agent, Property, Transaction } from '../types';
import { mockProperties, mockAgent, mockLeaderboardAgents } from './mockData';
export interface AdminMetrics {
  totalUsers: number;
  totalAgents: number;
  totalSeekers: number;
  activeListings: number;
  totalRevenue: number;
  pendingKYC: number;
  flaggedContent: number;
  monthlyGrowth: number;
}
export interface AdminActivity {
  id: string;
  type: 'user_signup' | 'listing_posted' | 'kyc_submitted' | 'transaction' | 'report';
  description: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  severity?: 'low' | 'medium' | 'high';
}
export const mockAdminMetrics: AdminMetrics = {
  totalUsers: 2847,
  totalAgents: 342,
  totalSeekers: 2505,
  activeListings: 1289,
  totalRevenue: 45680000,
  pendingKYC: 23,
  flaggedContent: 7,
  monthlyGrowth: 18.5
};
export const mockAdminActivities: AdminActivity[] = [{
  id: 'act-1',
  type: 'kyc_submitted',
  description: 'Chidi Okafor submitted KYC documents',
  timestamp: '2024-01-20T14:30:00Z',
  userId: 'agent-1',
  userName: 'Chidi Okafor',
  severity: 'medium'
}, {
  id: 'act-2',
  type: 'listing_posted',
  description: 'New luxury apartment posted in Lekki',
  timestamp: '2024-01-20T14:15:00Z',
  userId: 'agent-2',
  userName: 'Fatima Ibrahim',
  severity: 'low'
}, {
  id: 'act-3',
  type: 'report',
  description: 'Property flagged as duplicate',
  timestamp: '2024-01-20T13:45:00Z',
  severity: 'high'
}, {
  id: 'act-4',
  type: 'user_signup',
  description: 'New seeker registered',
  timestamp: '2024-01-20T13:30:00Z',
  userId: 'seeker-45',
  userName: 'Adebayo Johnson',
  severity: 'low'
}, {
  id: 'act-5',
  type: 'transaction',
  description: '₦50,000 credit purchase',
  timestamp: '2024-01-20T13:00:00Z',
  userId: 'agent-5',
  userName: 'Tunde Adebayo',
  severity: 'low'
}];
export const mockPendingKYC: Agent[] = mockLeaderboardAgents.slice(0, 5).map((agent, index) => ({
  ...agent,
  kycStatus: 'pending' as const,
  kycCompletedAt: new Date(Date.now() - index * 86400000).toISOString()
}));
export const mockFlaggedListings: Property[] = mockProperties.slice(0, 3).map(prop => ({
  ...prop,
  status: 'pending' as const
}));
export const mockRevenueData = [{
  month: 'Jul',
  revenue: 2500000
}, {
  month: 'Aug',
  revenue: 3200000
}, {
  month: 'Sep',
  revenue: 2800000
}, {
  month: 'Oct',
  revenue: 4100000
}, {
  month: 'Nov',
  revenue: 3900000
}, {
  month: 'Dec',
  revenue: 4800000
}, {
  month: 'Jan',
  revenue: 5400000
}];
export const mockUserGrowthData = [{
  month: 'Jul',
  agents: 180,
  seekers: 1200
}, {
  month: 'Aug',
  agents: 210,
  seekers: 1450
}, {
  month: 'Sep',
  agents: 245,
  seekers: 1680
}, {
  month: 'Oct',
  agents: 275,
  seekers: 1920
}, {
  month: 'Nov',
  agents: 305,
  seekers: 2180
}, {
  month: 'Dec',
  agents: 328,
  seekers: 2420
}, {
  month: 'Jan',
  agents: 342,
  seekers: 2505
}];