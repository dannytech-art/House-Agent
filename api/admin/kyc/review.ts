import { success, errorResponse, notFound } from '../../_lib/utils';
import { getItem, setItem, getAllItems, findItems } from '../../_lib/data-store';
import { requireRole, checkRole } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetPendingKYC(request);
  } else if (request.method === 'POST') {
    return handleReviewKYC(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetPendingKYC(request: Request) {
  try {
    // Check if user is admin
    const roleCheck = await checkRole(request, ['admin']);
    if (roleCheck) {
      return roleCheck; // Returns 403 if not admin
    }

    const auth = await requireRole(request, ['admin']);
    if (!auth) {
      return errorResponse('Admin access required', 403);
    }

    // Get all agents with pending KYC
    const allUsers = await getAllItems('users');
    const agents = allUsers.filter((u: any) => 
      u.role === 'agent' && u.kycStatus === 'pending'
    );

    return success(agents);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch pending KYC', 500);
  }
}

async function handleReviewKYC(request: Request) {
  try {
    // Check if user is admin
    const roleCheck = await checkRole(request, ['admin']);
    if (roleCheck) {
      return roleCheck; // Returns 403 if not admin
    }

    const auth = await requireRole(request, ['admin']);
    if (!auth) {
      return errorResponse('Admin access required', 403);
    }
    
    const userId = auth.userId;

    const body = await request.json();
    
    if (!body.agentId || !body.status) {
      return errorResponse('Agent ID and status are required', 400);
    }

    const agent = await getItem('users', body.agentId);
    if (!agent || agent.role !== 'agent') {
      return errorResponse('Agent not found', 404);
    }

    // Update KYC status
    const updates: any = {
      kycStatus: body.status, // 'verified' or 'rejected'
      kycReviewedAt: new Date().toISOString(),
      kycReviewedBy: userId,
    };
    
    if (body.status === 'verified') {
      updates.verified = true;
    }

    if (body.notes) {
      updates.kycNotes = body.notes;
    }

    // Save updated agent
    await setItem('users', body.agentId, { ...agent, ...updates });

    return success({
      agentId: body.agentId,
      status: agent.kycStatus,
      message: `KYC ${body.status}`,
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to review KYC', 500);
  }
}

