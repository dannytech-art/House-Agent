import { success, errorResponse, notFound } from '../_lib/utils';
import { createId, getAllItems, getItem, setItem, findItems, deleteItem } from '../_lib/data-store';
import { requireAuth } from '../_lib/middleware';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetPropertyRequests(request);
  } else if (request.method === 'POST') {
    return handleCreatePropertyRequest(request);
  } else if (request.method === 'DELETE') {
    return handleDeletePropertyRequest(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetPropertyRequests(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const queryParams = new URL(request.url).searchParams;
    
    // Build filters
    const filters: Record<string, any> = {};
    const seekerId = queryParams.get('seekerId');
    const status = queryParams.get('status');

    if (seekerId) filters.seeker_id = seekerId;
    if (status) filters.status = status;

    // Get property requests from database
    const requests = await getAllItems('property_requests', Object.keys(filters).length > 0 ? filters : undefined);

    return success(requests);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch property requests', 500);
  }
}

async function handleCreatePropertyRequest(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const body = await request.json();
    
    const required = ['type', 'location', 'minBudget', 'maxBudget', 'bedrooms'];
    const missing = required.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    const user = await getItem('users', auth.userId);
    
    if (!user || user.role !== 'seeker') {
      return errorResponse('Only seekers can create property requests', 403);
    }

    const requestId = createId('request');
    const propertyRequest = {
      id: requestId,
      seeker_id: auth.userId,
      type: body.type,
      location: body.location,
      min_budget: body.minBudget,
      max_budget: body.maxBudget,
      bedrooms: body.bedrooms,
      description: body.description || '',
      status: 'active',
      matches: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save to database
    await setItem('property_requests', requestId, propertyRequest);

    return success(propertyRequest, 'Property request created successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create property request', 500);
  }
}

async function handleDeletePropertyRequest(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const queryParams = new URL(request.url).searchParams;
    const requestId = queryParams.get('id');
    
    if (!requestId) {
      return errorResponse('Request ID is required', 400);
    }

    const propertyRequest = await getItem('property_requests', requestId);
    if (!propertyRequest) {
      return notFound('Property request not found');
    }

    // Only seeker who created it or admin can delete
    if ((propertyRequest as any).seeker_id !== auth.userId && auth.role !== 'admin') {
      return errorResponse('Unauthorized to delete this property request', 403);
    }

    await deleteItem('property_requests', requestId);

    return success({ id: requestId }, 'Property request deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete property request', 500);
  }
}

