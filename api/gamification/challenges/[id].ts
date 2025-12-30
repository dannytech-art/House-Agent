import { success, errorResponse, notFound } from '../../_lib/utils';
import { getStore, getItem, setItem } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];

  if (request.method === 'GET') {
    return handleGetChallenge(id);
  } else if (request.method === 'PUT' || request.method === 'PATCH') {
    return handleUpdateChallenge(request, id);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetChallenge(id: string) {
  try {
    const store = getStore();
    if (!store.challenges) {
      return notFound('Challenge not found');
    }

    const challenge = getItem(store.challenges, id);

    if (!challenge) {
      return notFound('Challenge not found');
    }

    return success(challenge);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch challenge', 500);
  }
}

async function handleUpdateChallenge(request: Request, id: string) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    const store = getStore();
    if (!store.challenges) {
      return notFound('Challenge not found');
    }

    const challenge = getItem(store.challenges, id);

    if (!challenge) {
      return notFound('Challenge not found');
    }

    const body = await request.json();
    
    // Update progress or complete challenge
    const updatedChallenge = {
      ...challenge,
      ...body,
      id, // Prevent ID change
      updatedAt: new Date().toISOString(),
    };

    // If marking as completed, award rewards
    if (body.completed && !challenge.completed) {
      // TODO: Award XP, credits, badges to agent
      const agentId = challenge.agentId || userId;
      const agent = store.users.get(agentId);
      if (agent && challenge.reward) {
        agent.xp = (agent.xp || 0) + (challenge.reward.xp || 0);
        agent.credits = (agent.credits || 0) + (challenge.reward.credits || 0);
        if (challenge.reward.badge) {
          agent.badges = agent.badges || [];
          if (!agent.badges.includes(challenge.reward.badge)) {
            agent.badges.push(challenge.reward.badge);
          }
        }
        store.users.set(agentId, agent);
      }
    }

    setItem(store.challenges, id, updatedChallenge);

    return success(updatedChallenge, 'Challenge updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update challenge', 500);
  }
}

