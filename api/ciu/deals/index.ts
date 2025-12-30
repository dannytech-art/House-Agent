import { success, errorResponse } from '../../_lib/utils';
import { getStore, getAllItems, createId, getItem, setItem } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetClosableDeals(request);
  } else if (request.method === 'POST') {
    return handleCreateClosableDeal(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetClosableDeals(request: Request) {
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
    
    if (!store.closableDeals) {
      return success([]);
    }

    let deals = getAllItems(store.closableDeals);

    // Filter by status
    const status = queryParams.get('status');
    if (status) {
      deals = deals.filter((d: any) => d.status === status);
    }

    // Filter by urgency
    const urgency = queryParams.get('urgency');
    if (urgency) {
      deals = deals.filter((d: any) => d.urgency === urgency);
    }

    // Filter by assigned agent
    const assignedTo = queryParams.get('assignedTo');
    if (assignedTo) {
      deals = deals.filter((d: any) => d.assignedTo === assignedTo);
    }

    // Sort by urgency and closing probability
    deals.sort((a: any, b: any) => {
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      if (urgencyOrder[a.urgency as keyof typeof urgencyOrder] !== urgencyOrder[b.urgency as keyof typeof urgencyOrder]) {
        return urgencyOrder[b.urgency as keyof typeof urgencyOrder] - urgencyOrder[a.urgency as keyof typeof urgencyOrder];
      }
      return (b.closingProbability || 0) - (a.closingProbability || 0);
    });

    return success(deals);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch closable deals', 500);
  }
}

async function handleCreateClosableDeal(request: Request) {
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
    
    const required = ['propertyId', 'agentId'];
    const missing = required.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    // Verify property and agent exist
    const property = store.properties.get(body.propertyId);
    const agent = store.users.get(body.agentId);

    if (!property) {
      return errorResponse('Property not found', 404);
    }

    if (!agent || agent.role !== 'agent') {
      return errorResponse('Agent not found', 404);
    }

    // Get interests for this property
    const interests = getAllItems(store.interests)
      .filter((i: any) => i.propertyId === body.propertyId);

    const dealId = createId('deal');
    const deal = {
      id: dealId,
      propertyId: body.propertyId,
      propertyTitle: property.title,
      agentId: body.agentId,
      agentName: agent.name,
      highIntentInterests: interests.filter((i: any) => (i.seriousnessScore || 0) > 70).length,
      totalInterests: interests.length,
      responseTimeExceeded: body.responseTimeExceeded || false,
      pricingInRange: body.pricingInRange !== undefined ? body.pricingInRange : true,
      urgency: body.urgency || 'medium', // 'high', 'medium', 'low'
      estimatedValue: property.price,
      closingProbability: body.closingProbability || 50, // 0-100
      status: 'new', // 'new', 'contacted', 'viewing-scheduled', 'closed'
      assignedTo: body.assignedTo || null,
      assignedAt: body.assignedTo ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!store.closableDeals) {
      store.closableDeals = new Map();
    }
    store.closableDeals.set(dealId, deal);

    return success(deal, 'Closable deal created successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create closable deal', 500);
  }
}

