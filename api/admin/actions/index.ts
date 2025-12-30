import { success, errorResponse } from '../../_lib/utils';
import { getStore, getAllItems, createId } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetActions(request);
  } else if (request.method === 'POST') {
    return handleLogAction(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetActions(request: Request) {
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

    const queryParams = new URL(request.url).searchParams;
    
    if (!store.adminActions) {
      return success([]);
    }

    let actions = getAllItems(store.adminActions);

    // Filter by admin
    const adminId = queryParams.get('adminId');
    if (adminId) {
      actions = actions.filter((a: any) => a.adminId === adminId);
    }

    // Filter by action type
    const actionType = queryParams.get('action');
    if (actionType) {
      actions = actions.filter((a: any) => a.action === actionType);
    }

    // Filter by entity type
    const entityType = queryParams.get('entityType');
    if (entityType) {
      actions = actions.filter((a: any) => a.entityType === entityType);
    }

    // Sort by timestamp (newest first)
    actions.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return success(actions);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch admin actions', 500);
  }
}

async function handleLogAction(request: Request) {
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

    const body = await request.json();
    
    if (!body.action) {
      return errorResponse('Action type is required', 400);
    }

    const actionId = createId('admin-action');
    const action = {
      id: actionId,
      adminId: userId,
      action: body.action,
      entityType: body.entityType || null,
      entityId: body.entityId || null,
      details: body.details || {},
      timestamp: new Date().toISOString(),
    };

    if (!store.adminActions) {
      store.adminActions = new Map();
    }
    store.adminActions.set(actionId, action);

    return success(action, 'Action logged successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to log action', 500);
  }
}

