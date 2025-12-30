import { success, errorResponse } from '../../_lib/utils';
import { getStore, getAllItems, createId, getItem, setItem, deleteItem } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetRules(request);
  } else if (request.method === 'POST') {
    return handleCreateRule(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetRules(request: Request) {
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
    
    if (!store.automationRules) {
      return success([]);
    }

    let rules = getAllItems(store.automationRules);

    // Filter by enabled status
    const enabled = queryParams.get('enabled');
    if (enabled !== null) {
      const isEnabled = enabled === 'true';
      rules = rules.filter((r: any) => r.enabled === isEnabled);
    }

    return success(rules);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch automation rules', 500);
  }
}

async function handleCreateRule(request: Request) {
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
    
    const required = ['name', 'condition', 'action'];
    const missing = required.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    const ruleId = createId('rule');
    const rule = {
      id: ruleId,
      name: body.name,
      description: body.description || '',
      condition: body.condition, // e.g., { interestCount: { gt: 5 }, responseTime: { gt: 24 } }
      action: body.action, // e.g., { type: 'flag_closable', assignTo: 'vilanow-agent' }
      enabled: body.enabled !== undefined ? body.enabled : true,
      priority: body.priority || 1,
      executionCount: 0,
      lastExecutedAt: null,
      createdAt: new Date().toISOString(),
      createdBy: userId,
      updatedAt: new Date().toISOString(),
    };

    if (!store.automationRules) {
      store.automationRules = new Map();
    }
    store.automationRules.set(ruleId, rule);

    return success(rule, 'Automation rule created successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create automation rule', 500);
  }
}

