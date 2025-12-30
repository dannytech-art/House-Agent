import { success, errorResponse, notFound } from '../../_lib/utils';
import { getStore, getItem, setItem, createId } from '../../_lib/data-store';
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
    return handleGetRisk(id);
  } else if (request.method === 'PUT' || request.method === 'PATCH') {
    return handleUpdateRisk(request, id);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetRisk(id: string) {
  try {
    const store = getStore();
    if (!store.riskFlags) {
      return notFound('Risk not found');
    }

    const risk = getItem(store.riskFlags, id);

    if (!risk) {
      return notFound('Risk not found');
    }

    return success(risk);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch risk', 500);
  }
}

async function handleUpdateRisk(request: Request, id: string) {
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

    if (!store.riskFlags) {
      return notFound('Risk not found');
    }

    const risk = getItem(store.riskFlags, id);

    if (!risk) {
      return notFound('Risk not found');
    }

    const body = await request.json();
    
    const updatedRisk = {
      ...risk,
      ...body,
      id, // Prevent ID change
    };

    // Handle risk resolution
    if (body.status === 'resolved' || body.status === 'dismissed') {
      updatedRisk.resolvedAt = new Date().toISOString();
      updatedRisk.resolvedBy = userId;
      if (body.resolutionNotes) {
        updatedRisk.resolutionNotes = body.resolutionNotes;
      }
    }

    setItem(store.riskFlags, id, updatedRisk);

    // Log admin action
    const actionId = createId('admin-action');
    if (!store.adminActions) {
      store.adminActions = new Map();
    }
    store.adminActions.set(actionId, {
      id: actionId,
      adminId: userId,
      action: 'risk_resolved',
      entityType: risk.entityType,
      entityId: risk.entityId,
      details: body,
      timestamp: new Date().toISOString(),
    });

    return success(updatedRisk, 'Risk updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update risk', 500);
  }
}

