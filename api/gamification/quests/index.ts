import { success, errorResponse } from '../../_lib/utils';
import { getStore, getAllItems, createId } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetQuests(request);
  } else if (request.method === 'POST') {
    return handleCreateQuest(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetQuests(request: Request) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    const queryParams = new URL(request.url).searchParams;
    const store = getStore();
    
    if (!store.quests) {
      return success([]);
    }

    let quests = getAllItems(store.quests);

    // Filter by user
    const userQuests = queryParams.get('userId') || userId;
    quests = quests.filter((q: any) => q.userId === userQuests);

    // Filter by type
    const type = queryParams.get('type');
    if (type) {
      quests = quests.filter((q: any) => q.type === type);
    }

    // Filter by completed status
    const completed = queryParams.get('completed');
    if (completed !== null) {
      const isCompleted = completed === 'true';
      quests = quests.filter((q: any) => q.completed === isCompleted);
    }

    return success(quests);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch quests', 500);
  }
}

async function handleCreateQuest(request: Request) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    // Only admin can create quests (or system generates them)
    const store = getStore();
    const user = store.users.get(userId);
    
    if (!user || user.role !== 'admin') {
      return errorResponse('Only admins can create quests', 403);
    }

    const body = await request.json();
    
    const required = ['title', 'description', 'type', 'target', 'reward'];
    const missing = required.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    const questId = createId('quest');
    const quest = {
      id: questId,
      ...body,
      userId: body.userId || null, // null means available to all users
      progress: 0,
      completed: false,
      createdAt: new Date().toISOString(),
      expiresAt: body.expiresAt || null,
    };

    if (!store.quests) {
      store.quests = new Map();
    }
    store.quests.set(questId, quest);

    return success(quest, 'Quest created successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create quest', 500);
  }
}

