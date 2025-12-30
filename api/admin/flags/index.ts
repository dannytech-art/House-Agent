import { success, errorResponse } from '../../_lib/utils';
import { getStore, getAllItems, createId, getItem, setItem } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetFlags(request);
  } else if (request.method === 'POST') {
    return handleCreateFlag(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetFlags(request: Request) {
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
    
    if (!store.flaggedContent) {
      return success([]);
    }

    let flags = getAllItems(store.flaggedContent);

    // Filter by type
    const entityType = queryParams.get('entityType');
    if (entityType) {
      flags = flags.filter((f: any) => f.entityType === entityType);
    }

    // Filter by status
    const status = queryParams.get('status');
    if (status) {
      flags = flags.filter((f: any) => f.status === status);
    }

    // Filter by severity
    const severity = queryParams.get('severity');
    if (severity) {
      flags = flags.filter((f: any) => f.severity === severity);
    }

    return success(flags);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch flags', 500);
  }
}

async function handleCreateFlag(request: Request) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    const body = await request.json();
    
    const required = ['entityType', 'entityId', 'reason'];
    const missing = required.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    const store = getStore();
    const flagId = createId('flag');
    
    const flag = {
      id: flagId,
      entityType: body.entityType, // 'property', 'user', 'interest', etc.
      entityId: body.entityId,
      reason: body.reason,
      severity: body.severity || 'medium', // 'high', 'medium', 'low'
      status: 'pending',
      flaggedBy: userId,
      flaggedAt: new Date().toISOString(),
      evidence: body.evidence || [],
      resolvedAt: null,
      resolvedBy: null,
    };

    if (!store.flaggedContent) {
      store.flaggedContent = new Map();
    }
    store.flaggedContent.set(flagId, flag);

    return success(flag, 'Content flagged successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to flag content', 500);
  }
}

