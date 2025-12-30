import { success, errorResponse, notFound } from '../../_lib/utils';
import { getStore, getItem, setItem } from '../../_lib/data-store';
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
    return handleGetDeal(id);
  } else if (request.method === 'PUT' || request.method === 'PATCH') {
    return handleUpdateDeal(request, id);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetDeal(id: string) {
  try {
    const store = getStore();
    if (!store.closableDeals) {
      return notFound('Deal not found');
    }

    const deal = getItem(store.closableDeals, id);

    if (!deal) {
      return notFound('Deal not found');
    }

    return success(deal);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch deal', 500);
  }
}

async function handleUpdateDeal(request: Request, id: string) {
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

    if (!store.closableDeals) {
      return notFound('Deal not found');
    }

    const deal = getItem(store.closableDeals, id);

    if (!deal) {
      return notFound('Deal not found');
    }

    const body = await request.json();
    
    const updatedDeal = {
      ...deal,
      ...body,
      id, // Prevent ID change
      updatedAt: new Date().toISOString(),
    };

    // If assigning to agent, update assignment date
    if (body.assignedTo && !deal.assignedTo) {
      updatedDeal.assignedAt = new Date().toISOString();
    }

    setItem(store.closableDeals, id, updatedDeal);

    return success(updatedDeal, 'Deal updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update deal', 500);
  }
}

