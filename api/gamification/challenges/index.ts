import { success, errorResponse } from '../../_lib/utils';
import { getStore, getAllItems, createId } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetChallenges(request);
  } else if (request.method === 'POST') {
    return handleCreateChallenge(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetChallenges(request: Request) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    const queryParams = new URL(request.url).searchParams;
    const store = getStore();
    
    if (!store.challenges) {
      return success([]);
    }

    let challenges = getAllItems(store.challenges);

    // Filter by user
    const userChallenges = queryParams.get('agentId') || userId;
    challenges = challenges.filter((c: any) => c.agentId === userChallenges);

    // Filter by completed status
    const completed = queryParams.get('completed');
    if (completed !== null) {
      const isCompleted = completed === 'true';
      challenges = challenges.filter((c: any) => c.completed === isCompleted);
    }

    return success(challenges);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch challenges', 500);
  }
}

async function handleCreateChallenge(request: Request) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    // Only admin can create challenges (or system generates them)
    const store = getStore();
    const user = store.users.get(userId);
    
    if (!user || user.role !== 'admin') {
      return errorResponse('Only admins can create challenges', 403);
    }

    const body = await request.json();
    
    const required = ['title', 'description', 'type', 'target', 'reward'];
    const missing = required.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    const challengeId = createId('challenge');
    const challenge = {
      id: challengeId,
      ...body,
      agentId: body.agentId || null, // null means available to all agents
      progress: 0,
      completed: false,
      createdAt: new Date().toISOString(),
      deadline: body.deadline || null,
    };

    if (!store.challenges) {
      store.challenges = new Map();
    }
    store.challenges.set(challengeId, challenge);

    return success(challenge, 'Challenge created successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create challenge', 500);
  }
}

