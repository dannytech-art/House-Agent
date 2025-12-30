import { success, errorResponse } from '../../_lib/utils';
import { getStore, getAllItems, createId } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetTerritories(request);
  } else if (request.method === 'POST') {
    return handleAssignTerritory(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetTerritories(request: Request) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    const queryParams = new URL(request.url).searchParams;
    const store = getStore();
    
    if (!store.territories) {
      return success([]);
    }

    let territories = getAllItems(store.territories);

    // Filter by agent
    const agentId = queryParams.get('agentId');
    if (agentId) {
      territories = territories.filter((t: any) => t.agentId === agentId);
    }

    // Filter by area
    const area = queryParams.get('area');
    if (area) {
      territories = territories.filter((t: any) => 
        t.area.toLowerCase().includes(area.toLowerCase())
      );
    }

    return success(territories);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch territories', 500);
  }
}

async function handleAssignTerritory(request: Request) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    // Only admin can assign territories
    const store = getStore();
    const admin = store.users.get(userId);
    
    if (!admin || admin.role !== 'admin') {
      return errorResponse('Only admins can assign territories', 403);
    }

    const body = await request.json();
    
    const required = ['agentId', 'area'];
    const missing = required.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    // Verify agent exists
    const agent = store.users.get(body.agentId);
    if (!agent || agent.role !== 'agent') {
      return errorResponse('Agent not found', 404);
    }

    const territoryId = createId('territory');
    const territory = {
      id: territoryId,
      agentId: body.agentId,
      area: body.area,
      dominance: body.dominance || 0,
      activeListings: 0,
      monthlyDeals: 0,
      rank: body.rank || 0,
      createdAt: new Date().toISOString(),
    };

    if (!store.territories) {
      store.territories = new Map();
    }
    store.territories.set(territoryId, territory);

    // Update agent territories
    agent.territories = agent.territories || [];
    agent.territories.push({
      area: territory.area,
      dominance: territory.dominance,
      activeListings: territory.activeListings,
      monthlyDeals: territory.monthlyDeals,
      rank: territory.rank,
    });
    store.users.set(body.agentId, agent);

    return success(territory, 'Territory assigned successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to assign territory', 500);
  }
}

