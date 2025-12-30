import { Property } from '../types';

/**
 * Duplicate Detection Engine for Vilanow
 * Automatically identifies and groups duplicate property listings
 */

// Calculate string similarity (Levenshtein distance)
function stringSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (s1 === s2) return 1;
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  if (longer.length === 0) return 1;
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }
  return matrix[str2.length][str1.length];
}

// Check if two properties are duplicates
export function areDuplicates(prop1: Property, prop2: Property): boolean {
  // Same property ID
  if (prop1.id === prop2.id) return false;

  // Address similarity check (>85% similar)
  const addressSimilarity = stringSimilarity(prop1.location, prop2.location);
  if (addressSimilarity > 0.85) {
    // Check other attributes
    const sameBedrooms = prop1.bedrooms === prop2.bedrooms;
    const sameBathrooms = prop1.bathrooms === prop2.bathrooms;
    const priceWithin10Percent = Math.abs(prop1.price - prop2.price) / prop1.price < 0.1;
    if (sameBedrooms && sameBathrooms && priceWithin10Percent) {
      return true;
    }
  }

  // Image similarity check (same first image)
  if (prop1.images[0] === prop2.images[0]) {
    return true;
  }

  // Exact title match
  if (prop1.title.toLowerCase() === prop2.title.toLowerCase()) {
    const priceWithin15Percent = Math.abs(prop1.price - prop2.price) / prop1.price < 0.15;
    if (priceWithin15Percent) {
      return true;
    }
  }
  return false;
}

// Group duplicate properties
export function groupDuplicates(properties: Property[]): Map<string, Property[]> {
  const groups = new Map<string, Property[]>();
  const processed = new Set<string>();
  properties.forEach((prop, index) => {
    if (processed.has(prop.id)) return;
    const duplicates: Property[] = [prop];
    processed.add(prop.id);

    // Find all duplicates of this property
    for (let i = index + 1; i < properties.length; i++) {
      const otherProp = properties[i];
      if (processed.has(otherProp.id)) continue;
      if (areDuplicates(prop, otherProp)) {
        duplicates.push(otherProp);
        processed.add(otherProp.id);
      }
    }

    // Only create group if there are duplicates
    if (duplicates.length > 1) {
      const groupId = `group-${prop.id}`;
      groups.set(groupId, duplicates);
    }
  });
  return groups;
}

// Identify direct agent from a group of duplicates
export function identifyDirectAgent(duplicates: Property[]): string | null {
  // Direct agent is the one with agentType === 'direct'
  const directAgents = duplicates.filter(p => p.agentType === 'direct');
  if (directAgents.length > 0) {
    // Return the earliest posted direct agent
    const sorted = directAgents.sort((a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime());
    return sorted[0].agentId;
  }

  // If no direct agent, return earliest posted agent
  const sorted = duplicates.sort((a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime());
  return sorted[0].agentId;
}

// Mark properties with duplicate information
export function markDuplicates(properties: Property[]): Property[] {
  const groups = groupDuplicates(properties);
  const marked = [...properties];
  groups.forEach((duplicates, groupId) => {
    const directAgentId = identifyDirectAgent(duplicates);
    duplicates.forEach(prop => {
      const index = marked.findIndex(p => p.id === prop.id);
      if (index !== -1) {
        marked[index] = {
          ...marked[index],
          isDuplicate: true,
          duplicateGroup: groupId,
          directAgentId: directAgentId || undefined
        };
      }
    });
  });
  return marked;
}

// Get primary listing from a duplicate group (for seekers)
export function getPrimaryListing(duplicates: Property[]): Property {
  const directAgentId = identifyDirectAgent(duplicates);

  // Return direct agent's listing if available
  const directListing = duplicates.find(p => p.agentId === directAgentId);
  if (directListing) return directListing;

  // Otherwise return earliest posted
  const sorted = duplicates.sort((a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime());
  return sorted[0];
}

// Get duplicate statistics
export function getDuplicateStats(properties: Property[]) {
  const groups = groupDuplicates(properties);
  const totalDuplicates = Array.from(groups.values()).reduce((sum, group) => sum + group.length, 0);
  return {
    totalGroups: groups.size,
    totalDuplicates,
    averagePerGroup: groups.size > 0 ? totalDuplicates / groups.size : 0,
    duplicateRate: totalDuplicates / properties.length * 100
  };
}