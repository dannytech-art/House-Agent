import { success, errorResponse } from '../../_lib/utils';
import { getStore, getAllItems, createId, getItem, setItem } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetRisks(request);
  } else if (request.method === 'POST') {
    return handleCreateRisk(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetRisks(request: Request) {
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
    
    if (!store.riskFlags) {
      return success([]);
    }

    let risks = getAllItems(store.riskFlags);

    // Filter by type
    const type = queryParams.get('type');
    if (type) {
      risks = risks.filter((r: any) => r.type === type);
    }

    // Filter by severity
    const severity = queryParams.get('severity');
    if (severity) {
      risks = risks.filter((r: any) => r.severity === severity);
    }

    // Filter by status
    const status = queryParams.get('status');
    if (status) {
      risks = risks.filter((r: any) => r.status === status);
    }

    // Sort by severity (high first) then by created date
    risks.sort((a: any, b: any) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      if (severityOrder[a.severity as keyof typeof severityOrder] !== severityOrder[b.severity as keyof typeof severityOrder]) {
        return severityOrder[b.severity as keyof typeof severityOrder] - severityOrder[a.severity as keyof typeof severityOrder];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return success(risks);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch risks', 500);
  }
}

async function handleCreateRisk(request: Request) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    // Check if admin (or auto-detected by system)
    const store = getStore();
    const user = store.users.get(userId);
    
    // Allow admin or system (if no user, it's system-generated)
    if (user && user.role !== 'admin') {
      return errorResponse('Admin access required', 403);
    }

    const body = await request.json();
    
    const required = ['entityType', 'entityId', 'type', 'severity'];
    const missing = required.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    const riskId = createId('risk');
    const risk = {
      id: riskId,
      entityType: body.entityType, // 'property', 'user', 'interest', etc.
      entityId: body.entityId,
      type: body.type, // 'duplicate', 'fraud', 'collusion', 'abuse', etc.
      severity: body.severity, // 'high', 'medium', 'low'
      status: 'pending', // 'pending', 'investigating', 'resolved', 'dismissed'
      evidence: body.evidence || [],
      description: body.description || '',
      detectedBy: userId || 'system',
      detectedAt: new Date().toISOString(),
      resolvedAt: null,
      resolvedBy: null,
      resolutionNotes: null,
    };

    if (!store.riskFlags) {
      store.riskFlags = new Map();
    }
    store.riskFlags.set(riskId, risk);

    return success(risk, 'Risk flag created successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create risk flag', 500);
  }
}

