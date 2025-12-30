import { success, errorResponse } from '../../_lib/utils';
import { getAllItems, createId, getItem, setItem, findItems } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetOffers(request);
  } else if (request.method === 'POST') {
    return handleCreateOffer(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetOffers(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const queryParams = new URL(request.url).searchParams;
    
    // Build filters
    const filters: Record<string, any> = {};
    const agentId = queryParams.get('agentId');
    const type = queryParams.get('type');
    const status = queryParams.get('status');

    if (agentId) filters.agent_id = agentId;
    if (type) filters.type = type;
    if (status) filters.status = status;

    // Get offers from database
    const offers = await getAllItems('marketplace_offers', Object.keys(filters).length > 0 ? filters : undefined);

    return success(offers);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch marketplace offers', 500);
  }
}

async function handleCreateOffer(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const body = await request.json();
    
    const required = ['type', 'description', 'price'];
    const missing = required.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    // Verify user is an agent
    const agent = await getItem('users', auth.userId);
    
    if (!agent || agent.role !== 'agent') {
      return errorResponse('Only agents can create marketplace offers', 403);
    }

    const offerId = createId('offer');
    const offer = {
      id: offerId,
      agent_id: auth.userId,
      type: body.type, // 'property_share', 'referral', 'collaboration', 'service'
      title: body.title || body.description.substring(0, 50),
      description: body.description,
      property_id: body.propertyId || null,
      credit_cost: body.price || body.credit_cost || 0,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save to database
    await setItem('marketplace_offers', offerId, offer);

    return success(offer, 'Marketplace offer created successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create marketplace offer', 500);
  }
}

