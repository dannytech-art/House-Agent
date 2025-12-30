import { Property, Agent, Interest, PropertyRequest } from '../types';

// CIU Data Models
export interface MarketplaceHealth {
  totalActiveListings: number;
  totalActiveAgents: number;
  totalSeekerRequests: number;
  interestsLast24h: number;
  interestsLast7d: number;
  creditUsageDaily: number;
  creditUsageWeekly: number;
  demandLevel: 'high' | 'medium' | 'low';
}

export interface ListingIntelligence extends Property {
  listingAge: number; // days
  interestCount: number;
  tags: string[];
  aiPriceAnalysis?: {
    isOverpriced: boolean;
    isUnderpriced: boolean;
    marketFit: number; // 0-100
  };
  statusFlags: {
    overpriced: boolean;
    underpriced: boolean;
    highInterest: boolean;
    stagnant: boolean;
  };
}

export interface AgentBehaviorMetrics {
  agentId: string;
  agentName: string;
  responseTime: number; // average in hours
  interestUnlockRate: number; // percentage
  listingAccuracy: number; // 0-100
  dealConversionRate: number; // percentage
  creditPurchaseTotal: number;
  creditSpent: number;
  scores: {
    trust: number; // 0-100
    performance: number; // 0-100
    risk: number; // 0-100
  };
  recentActivity: string[];
  warnings: number;
}

export interface SeekerIntelligence {
  seekerId: string;
  seekerName: string;
  interestsSubmitted: number;
  viewingAttendanceRate: number; // percentage
  budgetRealism: number; // 0-100
  areaFlexibility: number; // 0-100
  classification: 'high-intent' | 'serious' | 'window-shopper' | 'at-risk';
  trustLevel: number; // 0-100
  churnRisk: number; // 0-100
}

export interface InterestConnection {
  interestId: string;
  seekerId: string;
  seekerName: string;
  propertyId: string;
  propertyTitle: string;
  agentId: string;
  agentName: string;
  status: 'pending' | 'responded' | 'viewing-scheduled' | 'closed' | 'abandoned';
  createdAt: string;
  agentRespondedAt?: string;
  viewingScheduledAt?: string;
  closedAt?: string;
  timeDelays?: {
    responseDelay?: number; // hours
    viewingDelay?: number; // hours
    closureDelay?: number; // hours
  };
  dropOffPoint?: 'interest' | 'response' | 'viewing' | 'closure';
}

export interface ClosableDeal {
  dealId: string;
  propertyId: string;
  propertyTitle: string;
  agentId: string;
  agentName: string;
  highIntentInterests: number;
  totalInterests: number;
  responseTimeExceeded: boolean;
  pricingInRange: boolean;
  urgency: 'high' | 'medium' | 'low';
  estimatedValue: number;
  status: 'new' | 'contacted' | 'viewing-scheduled' | 'closed';
  assignedTo?: string;
  assignedAt?: string;
  closingProbability: number; // 0-100
}

export interface VilanowTask {
  taskId: string;
  dealId: string;
  propertyTitle: string;
  assignedAgent: string;
  status: 'assigned' | 'in-progress' | 'viewing-scheduled' | 'closed' | 'lost';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  deadline?: string;
  notes: string[];
  revenue: number;
}

export interface AgentCollaboration {
  id: string;
  type: 'lead-exchange' | 'co-broking' | 'credit-transaction';
  fromAgent: string;
  toAgent: string;
  propertyId?: string;
  credits: number;
  status: 'pending' | 'completed' | 'reversed';
  timestamp: string;
  flagged: boolean;
  reason?: string;
}

export interface CreditIntelligence {
  totalPurchases: number;
  totalConsumption: number;
  topSpenders: Array<{
    agentId: string;
    agentName: string;
    amount: number;
  }>;
  dailyPurchases: Array<{ date: string; amount: number }>;
  dailyConsumption: Array<{ date: string; amount: number }>;
  unusualSpikes: Array<{
    agentId: string;
    agentName: string;
    spikeType: 'purchase' | 'consumption';
    amount: number;
    timestamp: string;
  }>;
}

export interface RiskFlag {
  id: string;
  entityType: 'listing' | 'agent' | 'seeker' | 'transaction';
  entityId: string;
  riskType: 'duplicate' | 'fraud' | 'collusion' | 'abuse' | 'compliance';
  severity: 'high' | 'medium' | 'low';
  detectedAt: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  evidence: string[];
  autoFlagged: boolean;
}

export interface DemandSupplyData {
  areas: Array<{
    name: string;
    demand: number; // 0-100
    supply: number; // 0-100
    imbalance: number; // supply - demand
    trend: 'rising' | 'stable' | 'falling';
  }>;
  searchPrompts: Array<{
    prompt: string;
    frequency: number;
    area?: string;
  }>;
  popularAreas: Array<{
    area: string;
    searchCount: number;
    swipeCount: number;
    trend: 'rising' | 'stable' | 'falling';
  }>;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  enabled: boolean;
  executionCount: number;
  lastExecuted?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  automated: boolean;
}

// Mock Data Generators
export const mockMarketplaceHealth: MarketplaceHealth = {
  totalActiveListings: 1247,
  totalActiveAgents: 342,
  totalSeekerRequests: 892,
  interestsLast24h: 156,
  interestsLast7d: 1043,
  creditUsageDaily: 2840,
  creditUsageWeekly: 19850,
  demandLevel: 'high',
};

export const generateListingIntelligence = (properties: Property[]): ListingIntelligence[] => {
  return properties.map((prop, idx) => {
    const daysSincePosted = Math.floor((Date.now() - new Date(prop.postedAt).getTime()) / (1000 * 60 * 60 * 24));
    const interestCount = Math.floor(Math.random() * 20) + (prop.featured ? 10 : 0);
    const isOverpriced = prop.price > 100000000;
    const isUnderpriced = prop.price < 30000000;
    const isHighInterest = interestCount > 10;
    const isStagnant = daysSincePosted > 30 && interestCount < 3;

    return {
      ...prop,
      listingAge: daysSincePosted,
      interestCount,
      tags: [
        ...(isOverpriced ? ['overpriced'] : []),
        ...(isUnderpriced ? ['underpriced'] : []),
        ...(isHighInterest ? ['high-interest'] : []),
        ...(isStagnant ? ['stagnant'] : []),
      ],
      statusFlags: {
        overpriced: isOverpriced,
        underpriced: isUnderpriced,
        highInterest: isHighInterest,
        stagnant: isStagnant,
      },
      aiPriceAnalysis: {
        isOverpriced,
        isUnderpriced,
        marketFit: Math.floor(Math.random() * 40) + 60,
      },
    };
  });
};

export const mockAgentBehaviorMetrics: AgentBehaviorMetrics[] = [
  {
    agentId: 'agent-1',
    agentName: 'Chidi Okafor',
    responseTime: 2.5,
    interestUnlockRate: 85,
    listingAccuracy: 92,
    dealConversionRate: 34,
    creditPurchaseTotal: 500000,
    creditSpent: 420000,
    scores: {
      trust: 95,
      performance: 88,
      risk: 5,
    },
    recentActivity: ['New listing posted', 'Responded to 3 interests', 'Closed 1 deal'],
    warnings: 0,
  },
  {
    agentId: 'agent-2',
    agentName: 'Fatima Ibrahim',
    responseTime: 4.2,
    interestUnlockRate: 72,
    listingAccuracy: 78,
    dealConversionRate: 28,
    creditPurchaseTotal: 350000,
    creditSpent: 380000,
    scores: {
      trust: 82,
      performance: 75,
      risk: 15,
    },
    recentActivity: ['Updated listing', 'Unlocked 2 leads'],
    warnings: 1,
  },
];

export const mockSeekerIntelligence: SeekerIntelligence[] = [
  {
    seekerId: 'seeker-1',
    seekerName: 'Adebayo Johnson',
    interestsSubmitted: 8,
    viewingAttendanceRate: 87,
    budgetRealism: 92,
    areaFlexibility: 75,
    classification: 'high-intent',
    trustLevel: 95,
    churnRisk: 10,
  },
  {
    seekerId: 'seeker-2',
    seekerName: 'Chioma Okonkwo',
    interestsSubmitted: 15,
    viewingAttendanceRate: 45,
    budgetRealism: 68,
    areaFlexibility: 90,
    classification: 'window-shopper',
    trustLevel: 65,
    churnRisk: 45,
  },
];

export const mockInterestConnections: InterestConnection[] = [
  {
    interestId: 'int-1',
    seekerId: 'seeker-1',
    seekerName: 'Adebayo Johnson',
    propertyId: '1',
    propertyTitle: 'Luxury 3 Bedroom Apartment in Ikate',
    agentId: 'agent-1',
    agentName: 'Chidi Okafor',
    status: 'responded',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    agentRespondedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    timeDelays: {
      responseDelay: 0.5,
    },
  },
  {
    interestId: 'int-2',
    seekerId: 'seeker-2',
    seekerName: 'Chioma Okonkwo',
    propertyId: '2',
    propertyTitle: 'Modern 4 Bedroom Duplex',
    agentId: 'agent-2',
    agentName: 'Fatima Ibrahim',
    status: 'pending',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    timeDelays: {},
    dropOffPoint: 'interest',
  },
];

export const mockClosableDeals: ClosableDeal[] = [
  {
    dealId: 'deal-1',
    propertyId: '1',
    propertyTitle: 'Luxury 3 Bedroom Apartment in Ikate',
    agentId: 'agent-1',
    agentName: 'Chidi Okafor',
    highIntentInterests: 5,
    totalInterests: 8,
    responseTimeExceeded: false,
    pricingInRange: true,
    urgency: 'high',
    estimatedValue: 85000000,
    status: 'contacted',
    closingProbability: 85,
  },
  {
    dealId: 'deal-2',
    propertyId: '2',
    propertyTitle: 'Modern 4 Bedroom Duplex',
    agentId: 'agent-2',
    agentName: 'Fatima Ibrahim',
    highIntentInterests: 3,
    totalInterests: 5,
    responseTimeExceeded: true,
    pricingInRange: true,
    urgency: 'medium',
    estimatedValue: 150000000,
    status: 'new',
    closingProbability: 72,
  },
];

export const mockVilanowTasks: VilanowTask[] = [
  {
    taskId: 'task-1',
    dealId: 'deal-2',
    propertyTitle: 'Modern 4 Bedroom Duplex',
    assignedAgent: 'Vilanow Agent 1',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: ['High-intent seeker identified', 'Agent response delayed'],
    revenue: 7500000,
  },
];

export const mockAgentCollaborations: AgentCollaboration[] = [
  {
    id: 'collab-1',
    type: 'lead-exchange',
    fromAgent: 'Chidi Okafor',
    toAgent: 'Fatima Ibrahim',
    credits: 100,
    status: 'completed',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    flagged: false,
  },
  {
    id: 'collab-2',
    type: 'co-broking',
    fromAgent: 'Emeka Nnamdi',
    toAgent: 'Ngozi Eze',
    propertyId: '3',
    credits: 150,
    status: 'pending',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    flagged: false,
  },
];

export const mockCreditIntelligence: CreditIntelligence = {
  totalPurchases: 45680000,
  totalConsumption: 38920000,
  topSpenders: [
    { agentId: 'agent-1', agentName: 'Chidi Okafor', amount: 500000 },
    { agentId: 'agent-2', agentName: 'Fatima Ibrahim', amount: 350000 },
  ],
  dailyPurchases: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    amount: Math.floor(Math.random() * 500000) + 200000,
  })),
  dailyConsumption: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    amount: Math.floor(Math.random() * 400000) + 150000,
  })),
  unusualSpikes: [
    {
      agentId: 'agent-5',
      agentName: 'Tunde Adebayo',
      spikeType: 'purchase',
      amount: 200000,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

export const mockRiskFlags: RiskFlag[] = [
  {
    id: 'risk-1',
    entityType: 'listing',
    entityId: '2',
    riskType: 'duplicate',
    severity: 'high',
    detectedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    status: 'investigating',
    evidence: ['Similar images detected', 'Same property description'],
    autoFlagged: true,
  },
];

export const mockDemandSupplyData: DemandSupplyData = {
  areas: [
    { name: 'Lekki', demand: 85, supply: 72, imbalance: -13, trend: 'rising' },
    { name: 'Victoria Island', demand: 78, supply: 65, imbalance: -13, trend: 'rising' },
    { name: 'Ikeja', demand: 65, supply: 82, imbalance: 17, trend: 'stable' },
    { name: 'Ajah', demand: 72, supply: 68, imbalance: -4, trend: 'rising' },
  ],
  searchPrompts: [
    { prompt: '3 bedroom apartment Lekki', frequency: 245, area: 'Lekki' },
    { prompt: 'affordable house Victoria Island', frequency: 189, area: 'Victoria Island' },
  ],
  popularAreas: [
    { area: 'Lekki', searchCount: 1250, swipeCount: 892, trend: 'rising' },
    { area: 'Victoria Island', searchCount: 980, swipeCount: 654, trend: 'rising' },
  ],
};

export const mockAutomationRules: AutomationRule[] = [
  {
    id: 'rule-1',
    name: 'Flag Closable Deals',
    description: 'Flag deals with >3 high-intent interests and response time >48h',
    condition: 'interests > 3 AND response_time > 48h',
    action: 'flag_as_closable',
    enabled: true,
    executionCount: 23,
    lastExecuted: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rule-2',
    name: 'Auto-Restrict Duplicate Uploads',
    description: 'Restrict agent if duplicate uploads exceed 3 in 30 days',
    condition: 'duplicate_count > 3 AND period < 30d',
    action: 'restrict_agent',
    enabled: true,
    executionCount: 2,
    lastExecuted: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    user: 'admin@demo.com',
    action: 'flagged_deal',
    entityType: 'deal',
    entityId: 'deal-2',
    details: 'Deal flagged as closable due to high interest count',
    automated: false,
  },
  {
    id: 'audit-2',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: 'system',
    action: 'auto_flag_duplicate',
    entityType: 'listing',
    entityId: '2',
    details: 'Duplicate listing detected automatically',
    automated: true,
  },
];

