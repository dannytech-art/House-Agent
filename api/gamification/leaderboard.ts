import { success, errorResponse } from '../_lib/utils';
import { getAllItems, findItems } from '../_lib/data-store';
import { requireAuth } from '../_lib/middleware';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'GET') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    await requireAuth(request); // Optional auth - can be public leaderboard

    const queryParams = new URL(request.url).searchParams;
    
    // Get all agents from database
    const allUsers = await getAllItems('users');
    const agents = allUsers.filter((u: any) => u.role === 'agent');

    // Sort by various metrics
    const sortBy = queryParams.get('sortBy') || 'xp';
    const limit = parseInt(queryParams.get('limit') || '10');

    let sortedAgents = [...agents];

    switch (sortBy) {
      case 'xp':
        sortedAgents.sort((a: any, b: any) => (b.xp || 0) - (a.xp || 0));
        break;
      case 'credits':
        sortedAgents.sort((a: any, b: any) => (b.credits || 0) - (a.credits || 0));
        break;
      case 'listings':
        sortedAgents.sort((a: any, b: any) => (b.total_listings || 0) - (a.total_listings || 0));
        break;
      case 'deals':
        // Calculate from interests with status 'closed'
        const allInterests = await getAllItems('interests');
        const closedInterests = allInterests.filter((i: any) => i.status === 'closed');
        const allProperties = await getAllItems('properties');
        
        sortedAgents.forEach((agent: any) => {
          agent.closedDeals = closedInterests.filter((i: any) => {
            const property = allProperties.find((p: any) => p.id === i.property_id);
            return property?.agent_id === agent.id;
          }).length;
        });
        sortedAgents.sort((a: any, b: any) => (b.closedDeals || 0) - (a.closedDeals || 0));
        break;
      default:
        sortedAgents.sort((a: any, b: any) => (b.xp || 0) - (a.xp || 0));
    }

    // Add rank
    sortedAgents = sortedAgents.slice(0, limit).map((agent: any, index: number) => ({
      ...agent,
      rank: index + 1,
    }));

    // Remove sensitive data
    const leaderboard = sortedAgents.map(({ password_hash: _, ...agent }: any) => agent);

    return success({
      sortBy,
      leaderboard,
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch leaderboard', 500);
  }
}

