import { success, errorResponse } from '../_lib/utils';
import { createId, getAllItems, getItem, setItem, findItems } from '../_lib/data-store';
import { requireAuth } from '../_lib/middleware';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetInterests(request);
  } else if (request.method === 'POST') {
    return handleCreateInterest(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetInterests(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const queryParams = new URL(request.url).searchParams;
    
    // Build filters
    const filters: Record<string, any> = {};
    const propertyId = queryParams.get('propertyId');
    const seekerId = queryParams.get('seekerId');

    if (propertyId) filters.property_id = propertyId;
    if (seekerId) filters.seeker_id = seekerId;

    // Get interests from database (Supabase or in-memory)
    let interests = await getAllItems('interests', Object.keys(filters).length > 0 ? filters : undefined);

    // TODO: Add pagination, sorting
    
    return success(interests);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch interests', 500);
  }
}

async function handleCreateInterest(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const body = await request.json();
    
    const required = ['propertyId', 'message'];
    const missing = required.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    // Get user (must be seeker)
    const user = await getItem('users', auth.userId);
    
    if (!user || user.role !== 'seeker') {
      return errorResponse('Only seekers can express interest', 403);
    }

    // Verify property exists
    const property = await getItem('properties', body.propertyId);
    if (!property) {
      return errorResponse('Property not found', 404);
    }

    const interestId = createId('interest');
    const interest = {
      id: interestId,
      property_id: body.propertyId,
      seeker_id: auth.userId,
      seeker_name: user.name,
      seeker_phone: user.phone,
      message: body.message,
      seriousness_score: body.seriousnessScore || 50,
      created_at: new Date().toISOString(),
      unlocked: false,
      status: 'pending',
    };

    // Save to database (Supabase or in-memory)
    await setItem('interests', interestId, interest);

    return success(interest, 'Interest expressed successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create interest', 500);
  }
}

