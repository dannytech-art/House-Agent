import { success, errorResponse } from '../../_lib/utils';
import { getStore, getAllItems, createId } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetBadges(request);
  } else if (request.method === 'POST') {
    return handleAwardBadge(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetBadges(request: Request) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    const queryParams = new URL(request.url).searchParams;
    const store = getStore();
    
    const agentId = queryParams.get('agentId') || userId;
    
    // Get agent badges
    const agent = store.users.get(agentId);
    if (!agent || agent.role !== 'agent') {
      return errorResponse('Agent not found', 404);
    }

    const badges = agent.badges || [];

    return success(badges);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch badges', 500);
  }
}

async function handleAwardBadge(request: Request) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    // Only admin can award badges (or system auto-awards)
    const store = getStore();
    const admin = store.users.get(userId);
    
    if (!admin || admin.role !== 'admin') {
      return errorResponse('Only admins can award badges', 403);
    }

    const body = await request.json();
    
    if (!body.agentId || !body.badge) {
      return errorResponse('Agent ID and badge name are required', 400);
    }

    const agent = store.users.get(body.agentId);
    if (!agent || agent.role !== 'agent') {
      return errorResponse('Agent not found', 404);
    }

    // Add badge if not already present
    agent.badges = agent.badges || [];
    if (!agent.badges.includes(body.badge)) {
      agent.badges.push(body.badge);
      store.users.set(body.agentId, agent);
    }

    return success({ agentId: body.agentId, badges: agent.badges }, 'Badge awarded successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to award badge', 500);
  }
}

