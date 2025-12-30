import { success, errorResponse } from '../../_lib/utils';
import { getStore, getAllItems, getItem, setItem, createId } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetSettings(request);
  } else if (request.method === 'POST') {
    return handleUpdateSetting(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetSettings(request: Request) {
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
    const key = queryParams.get('key');

    if (!store.systemSettings) {
      return success(key ? null : []);
    }

    if (key) {
      const setting = getItem(store.systemSettings, key);
      return success(setting || null);
    }

    const settings = getAllItems(store.systemSettings);
    return success(settings);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch settings', 500);
  }
}

async function handleUpdateSetting(request: Request) {
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
    
    if (!body.key || body.value === undefined) {
      return errorResponse('Key and value are required', 400);
    }

    if (!store.systemSettings) {
      store.systemSettings = new Map();
    }

    const setting = {
      key: body.key,
      value: body.value,
      description: body.description || '',
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    };

    setItem(store.systemSettings, body.key, setting);

    // Log admin action
    const actionId = createId('admin-action');
    if (!store.adminActions) {
      store.adminActions = new Map();
    }
    store.adminActions.set(actionId, {
      id: actionId,
      adminId: userId,
      action: 'setting_updated',
      entityType: 'setting',
      entityId: body.key,
      details: { oldValue: getItem(store.systemSettings, body.key)?.value, newValue: body.value },
      timestamp: new Date().toISOString(),
    });

    return success(setting, 'Setting updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update setting', 500);
  }
}

