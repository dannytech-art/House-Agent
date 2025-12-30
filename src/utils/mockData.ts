import { Property, Agent, Interest, PropertyRequest } from '../types';
export const agentAvatars: Record<string, string> = {
  Chidi: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chidi&backgroundColor=D4AF37',
  Fatima: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima&backgroundColor=D4AF37',
  Emeka: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emeka&backgroundColor=D4AF37',
  Ngozi: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ngozi&backgroundColor=D4AF37',
  Tunde: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde&backgroundColor=D4AF37',
  Zainab: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zainab&backgroundColor=D4AF37',
  Olu: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olu&backgroundColor=D4AF37',
  Kemi: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kemi&backgroundColor=D4AF37'
};
export const mockProperties: Property[] = [{
  id: '1',
  title: 'Luxury 3 Bedroom Apartment in Ikate',
  type: 'apartment',
  price: 85000000,
  location: 'Ikate, Lekki',
  area: 'Ikate',
  bedrooms: 3,
  bathrooms: 4,
  images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80', 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=800&q=80', 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80'],
  amenities: ['Swimming Pool', 'Gym', '24/7 Power', 'Security'],
  description: 'A stunning 3 bedroom apartment located in the heart of Ikate. Features include a spacious living room, modern kitchen, and all rooms ensuite.',
  agentId: 'agent-1',
  agentType: 'direct',
  agentName: 'Chidi Okafor',
  agentVerified: true,
  postedAt: '2024-01-20T10:00:00Z',
  featured: true,
  matchScore: 95,
  status: 'available',
  aiMatchScore: {
    score: 95,
    reasons: ['budget-match', 'location-preference', 'amenity-match'],
    explanation: 'Perfect match for your budget and location preferences. Includes all your requested amenities.',
    confidence: 'high'
  },
  aiPriceAnalysis: {
    score: 85,
    label: 'fair',
    marketAverage: 82000000,
    difference: 3.6,
    explanation: 'Priced slightly above market average due to premium finishes.',
    comparables: 12
  },
  demandSignal: {
    area: 'Ikate',
    trend: 'rising',
    changePercent: 12,
    urgency: 'high',
    message: 'Prices in Ikate are up 12% this month',
    icon: 'trending-up'
  }
}, {
  id: '2',
  title: 'Modern 4 Bedroom Duplex',
  type: 'duplex',
  price: 150000000,
  location: 'Chevron Drive, Lekki',
  area: 'Lekki',
  bedrooms: 4,
  bathrooms: 5,
  images: ['https://images.unsplash.com/photo-1600596542815-22b8c36ec800?w=800&q=80', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80'],
  amenities: ['BQ', 'Cinema', 'Automation', 'Pool'],
  description: 'Contemporary duplex with smart home features and cinema room.',
  agentId: 'agent-2',
  agentType: 'semi-direct',
  agentName: 'Fatima Ibrahim',
  agentVerified: true,
  postedAt: '2024-01-19T15:30:00Z',
  featured: false,
  matchScore: 88,
  status: 'available',
  isDuplicate: true,
  duplicateGroup: 'dup-group-1',
  directAgentId: 'agent-direct-1'
}, {
  id: '3',
  title: 'Cozy 2 Bedroom Flat',
  type: 'apartment',
  price: 45000000,
  location: 'Sangotedo, Ajah',
  area: 'Ajah',
  bedrooms: 2,
  bathrooms: 3,
  images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
  amenities: ['Parking', 'Security', 'Water Treatment'],
  description: 'Affordable luxury in a serene environment.',
  agentId: 'agent-3',
  agentType: 'direct',
  agentName: 'Emeka Nnamdi',
  agentVerified: false,
  postedAt: '2024-01-18T09:15:00Z',
  featured: false,
  matchScore: 75,
  status: 'available'
}];
export const mockAgent: Agent = {
  id: 'agent-1',
  name: 'Chidi Okafor',
  email: 'chidi@vilanow.com',
  phone: '+234 803 123 4567',
  role: 'agent',
  agentType: 'direct',
  verified: true,
  kycStatus: 'verified',
  level: 5,
  xp: 4500,
  credits: 1250,
  walletBalance: 150000,
  streak: 12,
  totalListings: 15,
  totalInterests: 48,
  responseTime: 15,
  rating: 4.8,
  joinedDate: '2023-06-15',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chidi&backgroundColor=D4AF37',
  tier: 'area-broker',
  territories: [{
    area: 'Ikate',
    dominance: 35,
    activeListings: 8,
    monthlyDeals: 3,
    rank: 2
  }, {
    area: 'Lekki Phase 1',
    dominance: 15,
    activeListings: 4,
    monthlyDeals: 1,
    rank: 12
  }],
  challenges: [{
    id: 'c1',
    title: 'Listing Master',
    description: 'Upload 5 new verified listings this week',
    type: 'upload',
    progress: 3,
    target: 5,
    reward: {
      xp: 500,
      credits: 50
    },
    deadline: '2024-01-28T23:59:59Z',
    completed: false
  }, {
    id: 'c2',
    title: 'Deal Closer',
    description: 'Close 2 deals in your territory',
    type: 'deal',
    progress: 1,
    target: 2,
    reward: {
      xp: 1000,
      credits: 100,
      badge: 'deal-maker'
    },
    deadline: '2024-01-31T23:59:59Z',
    completed: false
  }],
  badges: ['verified-agent', 'fast-responder', 'top-rated']
};
export const mockInterests: Interest[] = [{
  id: 'int-1',
  propertyId: '1',
  seekerId: 'seeker-1',
  seekerName: 'Hidden Buyer',
  seekerPhone: '+234 *** *** ****',
  message: "I'm interested in this property. Is it still available?",
  seriousnessScore: 85,
  createdAt: '2024-01-20T14:30:00Z',
  unlocked: false,
  status: 'pending'
}, {
  id: 'int-2',
  propertyId: '1',
  seekerId: 'seeker-2',
  seekerName: 'Oluwaseun Adeyemi',
  seekerPhone: '+234 805 987 6543',
  message: 'Can we schedule a viewing for this weekend?',
  seriousnessScore: 92,
  createdAt: '2024-01-19T11:20:00Z',
  unlocked: true,
  status: 'contacted'
}];
export const mockRequests: PropertyRequest[] = [{
  id: 'req-1',
  seekerId: 'seeker-1',
  type: 'apartment',
  location: 'Lekki Phase 1',
  minBudget: 50000000,
  maxBudget: 70000000,
  bedrooms: 2,
  description: 'Looking for a modern 2 bed apartment with good security and parking.',
  status: 'active',
  createdAt: '2024-01-15T10:00:00Z',
  matches: 3
}, {
  id: 'req-2',
  seekerId: 'seeker-1',
  type: 'house',
  location: 'Ajah',
  minBudget: 80000000,
  maxBudget: 100000000,
  bedrooms: 4,
  description: 'Family house needed, preferably in a gated estate.',
  status: 'fulfilled',
  createdAt: '2023-12-10T14:30:00Z',
  matches: 5
}];

// Leaderboard agents for LeaderboardPage
export const mockLeaderboardAgents: Agent[] = [{
  ...mockAgent,
  id: 'agent-1',
  name: 'Chidi Okafor',
  xp: 8500,
  level: 8,
  tier: 'territory-leader',
  totalListings: 42,
  weeklyRank: 1,
  verified: true
}, {
  ...mockAgent,
  id: 'agent-2',
  name: 'Fatima Ibrahim',
  avatar: agentAvatars.Fatima,
  xp: 7200,
  level: 7,
  tier: 'market-dealer',
  totalListings: 38,
  weeklyRank: 2,
  verified: true
}, {
  ...mockAgent,
  id: 'agent-3',
  name: 'Emeka Nnamdi',
  avatar: agentAvatars.Emeka,
  xp: 6800,
  level: 6,
  tier: 'market-dealer',
  totalListings: 35,
  weeklyRank: 3,
  verified: true
}, {
  ...mockAgent,
  id: 'agent-4',
  name: 'Ngozi Eze',
  avatar: agentAvatars.Ngozi,
  xp: 6200,
  level: 6,
  tier: 'area-broker',
  totalListings: 31,
  weeklyRank: 4,
  verified: true
}, {
  ...mockAgent,
  id: 'agent-5',
  name: 'Tunde Adebayo',
  avatar: agentAvatars.Tunde,
  xp: 5900,
  level: 5,
  tier: 'area-broker',
  totalListings: 28,
  weeklyRank: 5,
  verified: true
}, {
  ...mockAgent,
  id: 'agent-6',
  name: 'Zainab Mohammed',
  avatar: agentAvatars.Zainab,
  xp: 5400,
  level: 5,
  tier: 'area-broker',
  totalListings: 25,
  weeklyRank: 6,
  verified: true
}, {
  ...mockAgent,
  id: 'agent-7',
  name: 'Olu Williams',
  avatar: agentAvatars.Olu,
  xp: 4900,
  level: 5,
  tier: 'area-broker',
  totalListings: 22,
  weeklyRank: 7,
  verified: true
}, {
  ...mockAgent,
  id: 'agent-8',
  name: 'Kemi Ogunlade',
  avatar: agentAvatars.Kemi,
  xp: 4500,
  level: 5,
  tier: 'area-broker',
  totalListings: 20,
  weeklyRank: 8,
  verified: true
}];