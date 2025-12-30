import { Property, AIMatchScore, AIPriceAnalysis, DemandSignal, MatchReason, PriceScore } from '../types';

/**
 * AI Intelligence Engine for Vilanow
 * Provides smart matching, pricing analysis, and demand prediction
 */

// Mock AI Match Score Generator
export function generateAIMatchScore(property: Property, userPreferences?: any): AIMatchScore {
  // Simulate AI matching algorithm
  const baseScore = Math.floor(Math.random() * 30) + 70; // 70-100 for demo

  const reasons: MatchReason[] = [];

  // Add match reasons based on property attributes
  if (property.price < 20000000) reasons.push('budget-match');
  if (property.location.includes('Lekki') || property.location.includes('Ikate')) {
    reasons.push('location-preference');
  }
  if (property.amenities.length > 3) reasons.push('amenity-match');
  if (property.bedrooms && property.bedrooms >= 3) reasons.push('size-match');
  const confidence = baseScore > 85 ? 'high' : baseScore > 70 ? 'medium' : 'low';
  const explanations = {
    'budget-match': 'Within your budget range',
    'location-preference': 'Matches your preferred neighborhoods',
    'amenity-match': 'Has amenities you typically look for',
    'size-match': 'Right size for your needs',
    'style-preference': 'Matches your style preferences',
    'neighborhood-fit': 'Great neighborhood match'
  };
  const explanation = reasons.map(r => explanations[r]).join(', ');
  return {
    score: baseScore,
    reasons,
    explanation: explanation || 'Good overall match',
    confidence
  };
}

// Mock AI Price Analysis Generator
export function generateAIPriceAnalysis(property: Property): AIPriceAnalysis {
  // Simulate pricing intelligence
  const marketAverage = property.price * (0.9 + Math.random() * 0.2); // ±10%
  const difference = (property.price - marketAverage) / marketAverage * 100;
  let label: PriceScore;
  let score: number;
  if (difference < -10) {
    label = 'great-deal';
    score = 95;
  } else if (difference < -5) {
    label = 'below-market';
    score = 85;
  } else if (difference < 5) {
    label = 'fair';
    score = 75;
  } else if (difference < 15) {
    label = 'slightly-overpriced';
    score = 60;
  } else {
    label = 'overpriced';
    score = 40;
  }
  const explanations = {
    'great-deal': `${Math.abs(difference).toFixed(0)}% below market average`,
    'below-market': `${Math.abs(difference).toFixed(0)}% below market average`,
    fair: 'Priced at market average',
    'slightly-overpriced': `${difference.toFixed(0)}% above market average`,
    overpriced: `${difference.toFixed(0)}% above market average`
  };
  return {
    score,
    label,
    marketAverage,
    difference,
    explanation: explanations[label],
    comparables: Math.floor(Math.random() * 20) + 10
  };
}

// Mock Demand Signal Generator
export function generateDemandSignal(area: string): DemandSignal {
  const trends: Array<'rising' | 'stable' | 'falling'> = ['rising', 'stable', 'falling'];
  const trend = trends[Math.floor(Math.random() * trends.length)];
  const changePercent = trend === 'rising' ? Math.floor(Math.random() * 40) + 10 : trend === 'falling' ? -(Math.floor(Math.random() * 20) + 5) : Math.floor(Math.random() * 10) - 5;
  const urgency = Math.abs(changePercent) > 25 ? 'high' : Math.abs(changePercent) > 10 ? 'medium' : 'low';
  const messages = {
    rising: `${area} demand up ${changePercent}% this week`,
    stable: `${area} market stable`,
    falling: `${area} supply increasing, prices stabilizing`
  };
  const icons = {
    rising: '🔥',
    stable: '📊',
    falling: '📉'
  };
  return {
    area,
    trend,
    changePercent,
    urgency,
    message: messages[trend],
    icon: icons[trend]
  };
}

// Enhance property with AI intelligence
export function enhancePropertyWithAI(property: Property): Property {
  return {
    ...property,
    aiMatchScore: generateAIMatchScore(property),
    aiPriceAnalysis: generateAIPriceAnalysis(property),
    demandSignal: generateDemandSignal(property.area)
  };
}

// Batch enhance properties
export function enhancePropertiesWithAI(properties: Property[]): Property[] {
  return properties.map(enhancePropertyWithAI);
}

// Get price badge color
export function getPriceBadgeColor(label: PriceScore): string {
  const colors = {
    'great-deal': 'bg-success/20 text-success border-success/30',
    'below-market': 'bg-success/10 text-success border-success/20',
    fair: 'bg-primary/10 text-primary border-primary/20',
    'slightly-overpriced': 'bg-warning/10 text-warning border-warning/20',
    overpriced: 'bg-danger/10 text-danger border-danger/20'
  };
  return colors[label];
}

// Get price badge label
export function getPriceBadgeLabel(label: PriceScore): string {
  const labels = {
    'great-deal': 'Great Deal',
    'below-market': 'Below Market',
    fair: 'Fair Price',
    'slightly-overpriced': 'Slightly High',
    overpriced: 'Overpriced'
  };
  return labels[label];
}

// Get match score color
export function getMatchScoreColor(score: number): string {
  if (score >= 90) return 'text-success';
  if (score >= 75) return 'text-primary';
  if (score >= 60) return 'text-warning';
  return 'text-text-tertiary';
}

// Get demand urgency color
export function getDemandUrgencyColor(urgency: 'high' | 'medium' | 'low'): string {
  const colors = {
    high: 'bg-danger/10 text-danger border-danger/30',
    medium: 'bg-warning/10 text-warning border-warning/30',
    low: 'bg-primary/10 text-primary border-primary/30'
  };
  return colors[urgency];
}