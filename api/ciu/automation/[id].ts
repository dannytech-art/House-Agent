import { success, errorResponse, notFound } from '../../_lib/utils';
import { getStore, getItem, setItem, deleteItem } from '../../_lib/data-store';
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
    return handleGetRule(id);
  } else if (request.method === 'PUT' || request.method === 'PATCH') {
    return handleUpdateRule(request, id);
  } else if (request.method === 'DELETE') {
    return handleDeleteRule(request, id);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetRule(id: string) {
  try {
    const store = getStore();
    if (!store.automationRules) {
      return notFound('Rule not found');
    }

    const rule = getItem(store.automationRules, id);

    if (!rule) {
      return notFound('Rule not found');
    }

    return success(rule);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch rule', 500);
  }
}

async function handleUpdateRule(request: Request, id: string) {
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

    if (!store.automationRules) {
      return notFound('Rule not found');
    }

    const rule = getItem(store.automationRules, id);

    if (!rule) {
      return notFound('Rule not found');
    }

    const body = await request.json();
    
    const updatedRule = {
      ...rule,
      ...body,
      id, // Prevent ID change
      updatedAt: new Date().toISOString(),
    };

    setItem(store.automationRules, id, updatedRule);

    return success(updatedRule, 'Rule updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update rule', 500);
  }
}

async function handleDeleteRule(request: Request, id: string) {
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

    if (!store.automationRules) {
      return notFound('Rule not found');
    }

    const rule = getItem(store.automationRules, id);

    if (!rule) {
      return notFound('Rule not found');
    }

    deleteItem(store.automationRules, id);

    return success({ id }, 'Rule deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete rule', 500);
  }
}

