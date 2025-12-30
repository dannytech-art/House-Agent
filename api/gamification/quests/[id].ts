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
    return handleGetQuest(id);
  } else if (request.method === 'PUT' || request.method === 'PATCH') {
    return handleUpdateQuest(request, id);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetQuest(id: string) {
  try {
    const store = getStore();
    if (!store.quests) {
      return notFound('Quest not found');
    }

    const quest = getItem(store.quests, id);

    if (!quest) {
      return notFound('Quest not found');
    }

    return success(quest);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch quest', 500);
  }
}

async function handleUpdateQuest(request: Request, id: string) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    const store = getStore();
    if (!store.quests) {
      return notFound('Quest not found');
    }

    const quest = getItem(store.quests, id);

    if (!quest) {
      return notFound('Quest not found');
    }

    const body = await request.json();
    
    // Update progress or complete quest
    const updatedQuest = {
      ...quest,
      ...body,
      id, // Prevent ID change
      updatedAt: new Date().toISOString(),
    };

    // If marking as completed, award rewards
    if (body.completed && !quest.completed) {
      const questUserId = quest.userId || userId;
      const user = store.users.get(questUserId);
      if (user && quest.reward) {
        if (user.role === 'agent') {
          user.xp = (user.xp || 0) + (quest.reward.xp || 0);
        }
        user.credits = (user.credits || 0) + (quest.reward.credits || 0);
        store.users.set(questUserId, user);
      }
    }

    setItem(store.quests, id, updatedQuest);

    return success(updatedQuest, 'Quest updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update quest', 500);
  }
}

