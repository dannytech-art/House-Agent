import { Group, GroupMessage } from '../types';
export const mockGroups: Group[] = [{
  id: 'group-1',
  name: 'Lekki Agents Network',
  description: 'Connect with fellow agents in Lekki area',
  avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Lekki&backgroundColor=D4AF37',
  members: [{
    id: 'agent-1',
    name: 'Chidi Okafor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chidi&backgroundColor=D4AF37',
    role: 'admin',
    joinedAt: '2024-01-15T10:00:00Z'
  }, {
    id: 'agent-2',
    name: 'Amaka Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amaka&backgroundColor=D4AF37',
    role: 'member',
    joinedAt: '2024-01-16T14:30:00Z'
  }, {
    id: 'agent-3',
    name: 'Tunde Bakare',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde&backgroundColor=D4AF37',
    role: 'member',
    joinedAt: '2024-01-17T09:15:00Z'
  }],
  createdBy: 'agent-1',
  createdAt: '2024-01-15T10:00:00Z',
  lastMessageAt: '2024-01-22T14:30:00Z',
  unreadCount: 3
}, {
  id: 'group-2',
  name: 'Direct Agents Only',
  description: 'Exclusive group for verified direct agents',
  avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Direct&backgroundColor=10B981',
  members: [{
    id: 'agent-1',
    name: 'Chidi Okafor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chidi&backgroundColor=D4AF37',
    role: 'member',
    joinedAt: '2024-01-18T10:00:00Z'
  }, {
    id: 'agent-4',
    name: 'Funmi Adeyemi',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Funmi&backgroundColor=D4AF37',
    role: 'admin',
    joinedAt: '2024-01-18T10:00:00Z'
  }],
  createdBy: 'agent-4',
  createdAt: '2024-01-18T10:00:00Z',
  lastMessageAt: '2024-01-22T11:20:00Z',
  unreadCount: 0
}, {
  id: 'group-3',
  name: 'VI & Ikoyi Properties',
  description: 'High-end properties in Victoria Island and Ikoyi',
  avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=VI&backgroundColor=F59E0B',
  members: [{
    id: 'agent-1',
    name: 'Chidi Okafor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chidi&backgroundColor=D4AF37',
    role: 'member',
    joinedAt: '2024-01-20T10:00:00Z'
  }, {
    id: 'agent-5',
    name: 'Ibrahim Musa',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ibrahim&backgroundColor=D4AF37',
    role: 'admin',
    joinedAt: '2024-01-20T10:00:00Z'
  }, {
    id: 'agent-7',
    name: 'David Okonkwo',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=D4AF37',
    role: 'member',
    joinedAt: '2024-01-21T15:00:00Z'
  }],
  createdBy: 'agent-5',
  createdAt: '2024-01-20T10:00:00Z',
  lastMessageAt: '2024-01-22T16:45:00Z',
  unreadCount: 5
}];
export const mockGroupMessages: Record<string, GroupMessage[]> = {
  'group-1': [{
    id: 'msg-1',
    groupId: 'group-1',
    senderId: 'agent-2',
    senderName: 'Amaka Johnson',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amaka&backgroundColor=D4AF37',
    message: 'Good morning everyone! Any new listings in Ikate?',
    timestamp: '2024-01-22T09:30:00Z',
    type: 'text'
  }, {
    id: 'msg-2',
    groupId: 'group-1',
    senderId: 'agent-1',
    senderName: 'Chidi Okafor',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chidi&backgroundColor=D4AF37',
    message: 'Yes! I just listed a 3-bedroom apartment. Very nice property.',
    timestamp: '2024-01-22T09:45:00Z',
    type: 'text'
  }, {
    id: 'msg-3',
    groupId: 'group-1',
    senderId: 'agent-3',
    senderName: 'Tunde Bakare',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde&backgroundColor=D4AF37',
    message: 'Can you share the details?',
    timestamp: '2024-01-22T10:15:00Z',
    type: 'text'
  }]
};