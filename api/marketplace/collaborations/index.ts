import { success, errorResponse } from '../../_lib/utils';
import { getStore, getAllItems, createId } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetCollaborations(request);
  } else if (request.method === 'POST') {
    return handleCreateCollaboration(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetCollaborations(request: Request) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    const queryParams = new URL(request.url).searchParams;
    const store = getStore();
    
    if (!store.collaborations) {
      return success([]);
    }

    let collaborations = getAllItems(store.collaborations);

    // Filter by agent (from or to)
    const agentId = queryParams.get('agentId');
    if (agentId) {
      collaborations = collaborations.filter((c: any) => 
        c.fromAgent === agentId || c.toAgent === agentId
      );
    }

    // Filter by status
    const status = queryParams.get('status');
    if (status) {
      collaborations = collaborations.filter((c: any) => c.status === status);
    }

    // Filter by type
    const type = queryParams.get('type');
    if (type) {
      collaborations = collaborations.filter((c: any) => c.type === type);
    }

    return success(collaborations);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch collaborations', 500);
  }
}

async function handleCreateCollaboration(request: Request) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    const body = await request.json();
    
    const required = ['type', 'toAgent', 'credits'];
    const missing = required.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    // Verify user is an agent
    const store = getStore();
    const agent = store.users.get(userId);
    
    if (!agent || agent.role !== 'agent') {
      return errorResponse('Only agents can create collaborations', 403);
    }

    // Verify target agent exists
    const targetAgent = store.users.get(body.toAgent);
    if (!targetAgent || targetAgent.role !== 'agent') {
      return errorResponse('Target agent not found', 404);
    }

    const collaborationId = createId('collab');
    const collaboration = {
      id: collaborationId,
      type: body.type, // 'lead-exchange', 'co-broking', 'credit-transaction'
      fromAgent: userId,
      toAgent: body.toAgent,
      propertyId: body.propertyId || null,
      credits: body.credits,
      status: 'pending',
      timestamp: new Date().toISOString(),
      flagged: false,
      reason: body.reason || null,
    };

    if (!store.collaborations) {
      store.collaborations = new Map();
    }
    store.collaborations.set(collaborationId, collaboration);

    return success(collaboration, 'Collaboration created successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create collaboration', 500);
  }
}

