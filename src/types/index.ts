export type UserRole = 'seeker' | 'agent' | 'admin';
export type AgentType = 'direct' | 'semi-direct';
export type PropertyType = 'apartment' | 'house' | 'duplex' | 'penthouse' | 'studio' | 'land';

// AI Intelligence Types
export type PriceScore = 'fair' | 'slightly-overpriced' | 'overpriced' | 'below-market' | 'great-deal';
export type MatchReason = 'budget-match' | 'location-preference' | 'amenity-match' | 'size-match' | 'style-preference' | 'neighborhood-fit';
export interface AIMatchScore {
  score: number; // 0-100
  reasons: MatchReason[];
  explanation: string;
  confidence: 'high' | 'medium' | 'low';
}
export interface AIPriceAnalysis {
  score: number; // 0-100
  label: PriceScore;
  marketAverage: number;
  difference: number; // percentage
  explanation: string;
  comparables: number; // number of similar properties analyzed
}
export interface DemandSignal {
  area: string;
  trend: 'rising' | 'stable' | 'falling';
  changePercent: number;
  urgency: 'high' | 'medium' | 'low';
  message: string;
  icon: string;
}

// Agent Adventure System Types
export type AgentTier = 'street-scout' | 'area-broker' | 'market-dealer' | 'territory-leader' | 'city-mogul';
export interface AgentTerritory {
  area: string;
  dominance: number; // 0-100
  activeListings: number;
  monthlyDeals: number;
  rank: number;
}
export interface AgentChallenge {
  id: string;
  title: string;
  description: string;
  type: 'upload' | 'pricing' | 'deal' | 'collaboration';
  progress: number;
  target: number;
  reward: {
    xp: number;
    credits: number;
    badge?: string;
  };
  deadline: string;
  completed: boolean;
}
export interface MarketplaceOffer {
  id: string;
  type: 'lead' | 'co-broking' | 'access';
  agentId: string;
  agentName: string;
  propertyId?: string;
  description: string;
  price: number; // in credits
  status: 'active' | 'pending' | 'completed';
  createdAt: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}
export interface Agent extends User {
  agentType: AgentType;
  verified: boolean;
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  kycCompletedAt?: string;
  level: number;
  xp: number;
  credits: number;
  walletBalance: number;
  streak: number;
  totalListings: number;
  totalInterests: number;
  responseTime: number;
  rating: number;
  joinedDate: string;
  // Adventure System
  tier: AgentTier;
  territories: AgentTerritory[];
  challenges: AgentChallenge[];
  badges: string[];
  weeklyRank?: number;
}
export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  price: number;
  location: string;
  area: string;
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  videos?: string[];
  amenities: string[];
  description: string;
  agentId: string;
  agentType: AgentType;
  agentName: string;
  agentVerified: boolean;
  postedAt: string;
  featured: boolean;
  matchScore?: number;
  status: 'available' | 'pending' | 'sold';
  // AI Intelligence
  aiMatchScore?: AIMatchScore;
  aiPriceAnalysis?: AIPriceAnalysis;
  demandSignal?: DemandSignal;
  isDuplicate?: boolean;
  duplicateGroup?: string;
  directAgentId?: string;
}
export interface Interest {
  id: string;
  propertyId: string;
  seekerId: string;
  seekerName: string;
  seekerPhone: string;
  message: string;
  seriousnessScore: number;
  createdAt: string;
  unlocked: boolean;
  status: 'pending' | 'contacted' | 'viewing-scheduled' | 'closed';
}
export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  progress: number;
  target: number;
  reward: {
    xp: number;
    credits: number;
  };
  completed: boolean;
  expiresAt: string;
}
export interface Transaction {
  id: string;
  type: 'credit_purchase' | 'credit_spent' | 'wallet_load' | 'wallet_debit';
  amount: number;
  credits?: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}
export interface CreditBundle {
  id: string;
  credits: number;
  price: number;
  bonus: number;
  popular?: boolean;
}

// Payment Types
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'abandoned';
export type PaymentMethod = 'card' | 'bank_transfer' | 'ussd' | 'qr';

export interface PaymentInitResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaymentVerifyResponse {
  status: PaymentStatus;
  amount: number;
  credits?: number;
  newBalance?: number;
  message: string;
  reference: string;
  paidAt?: string;
}

export interface PaymentRecord {
  id: string;
  reference: string;
  amount: number;
  credits: number;
  status: PaymentStatus;
  method: PaymentMethod;
  bundleId?: string;
  createdAt: string;
  paidAt?: string;
}

export interface SearchPrompt {
  raw: string;
  parsed: {
    propertyType?: PropertyType;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    amenities?: string[];
  };
}
export interface DirectAgentContact {
  agentId: string;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  agentAvatar?: string;
  verified: boolean;
  rating: number;
  propertyId: string;
  unlocked: boolean;
}
export interface SavedContact {
  id: string;
  agentId: string;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  agentAvatar?: string;
  verified: boolean;
  rating: number;
  agentType: AgentType;
  savedAt: string;
  notes?: string;
}
export interface MyListing {
  id: string;
  property: Property;
  connectedDirectAgent?: SavedContact;
  views: number;
  interests: number;
  createdAt: string;
}
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  timestamp: string;
  type: 'text' | 'property-brief' | 'inspection-schedule' | 'document';
  metadata?: {
    propertyId?: string;
    inspectionDate?: string;
    documentUrl?: string;
  };
}
export interface ChatSession {
  id: string;
  participantIds: string[];
  propertyId?: string;
  interestId?: string;
  messages: ChatMessage[];
  createdAt: string;
  lastMessageAt: string;
  // New fields from API
  isUnlocked?: boolean;
  canSendMessage?: boolean;
  lastMessage?: {
    message: string;
    timestamp: string;
  };
  unreadCount?: number;
  property?: {
    id: string;
    title: string;
    images: string[];
  };
  otherParticipant?: {
    id: string;
    name: string;
    avatar?: string;
    role: 'seeker' | 'agent';
  };
  // For display
  participantName?: string;
  participantAvatar?: string;
  propertyTitle?: string;
}
export interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'member';
  joinedAt: string;
}
export interface Group {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  members: GroupMember[];
  createdBy: string;
  createdAt: string;
  lastMessageAt: string;
  unreadCount: number;
}
export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  timestamp: string;
  type: 'text' | 'image' | 'document' | 'system';
}
export interface PropertyRequest {
  id: string;
  seekerId: string;
  type: PropertyType;
  location: string;
  minBudget: number;
  maxBudget: number;
  bedrooms: number;
  description: string;
  status: 'active' | 'fulfilled' | 'expired';
  createdAt: string;
  matches: number;
}