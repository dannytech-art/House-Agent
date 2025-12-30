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
    return handleGetFlag(id);
  } else if (request.method === 'PUT' || request.method === 'PATCH') {
    return handleUpdateFlag(request, id);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetFlag(id: string) {
  try {
    const store = getStore();
    if (!store.flaggedContent) {
      return notFound('Flag not found');
    }

    const flag = getItem(store.flaggedContent, id);

    if (!flag) {
      return notFound('Flag not found');
    }

    return success(flag);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch flag', 500);
  }
}

async function handleUpdateFlag(request: Request, id: string) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    // Check if admin
    const store = getStore();
    const user = store.users.get(userId);
    
    if (!user || user.role !== 'admin') {
      return errorResponse('Admin access required', 403);
    }

    if (!store.flaggedContent) {
      return notFound('Flag not found');
    }

    const flag = getItem(store.flaggedContent, id);

    if (!flag) {
      return notFound('Flag not found');
    }

    const body = await request.json();
    
    // Handle flag resolution
    const updatedFlag = {
      ...flag,
      ...body,
      id, // Prevent ID change
    };

    if (body.status === 'resolved' || body.status === 'dismissed') {
      updatedFlag.resolvedAt = new Date().toISOString();
      updatedFlag.resolvedBy = userId;
    }

    setItem(store.flaggedContent, id, updatedFlag);

    // Log admin action
    const actionId = createId('admin-action');
    if (!store.adminActions) {
      store.adminActions = new Map();
    }
    store.adminActions.set(actionId, {
      id: actionId,
      adminId: userId,
      action: 'flag_resolved',
      entityType: flag.entityType,
      entityId: flag.entityId,
      details: body,
      timestamp: new Date().toISOString(),
    });

    return success(updatedFlag, 'Flag updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update flag', 500);
  }
}

