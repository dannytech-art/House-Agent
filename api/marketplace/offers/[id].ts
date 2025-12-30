import { success, errorResponse, notFound } from '../../_lib/utils';
import { getItem, setItem, deleteItem, createId } from '../../_lib/data-store';
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
    return handleGetOffer(id);
  } else if (request.method === 'PUT' || request.method === 'PATCH') {
    return handleUpdateOffer(request, id);
  } else if (request.method === 'DELETE') {
    return handleDeleteOffer(request, id);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetOffer(id: string) {
  try {
    const offer = await getItem('marketplace_offers', id);

    if (!offer) {
      return notFound('Offer not found');
    }

    return success(offer);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch offer', 500);
  }
}

async function handleUpdateOffer(request: Request, id: string) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const offer = await getItem('marketplace_offers', id);
    if (!offer) {
      return notFound('Offer not found');
    }

    // Check ownership
    if ((offer as any).agent_id !== auth.userId && auth.role !== 'admin') {
      return errorResponse('Unauthorized to update this offer', 403);
    }

    const body = await request.json();
    
    // Handle offer acceptance
    if (body.status === 'pending' || body.status === 'completed') {
      // If accepting offer, create collaboration record
      if (body.acceptedBy) {
        const collaborationId = createId('collab');
        const collaboration = {
          id: collaborationId,
          type: (offer as any).type === 'co-broking' ? 'co-broking' : 'lead-exchange',
          from_agent_id: (offer as any).agent_id,
          to_agent_id: body.acceptedBy,
          property_id: (offer as any).property_id,
          credit_cost: (offer as any).credit_cost,
          status: 'pending',
          created_at: new Date().toISOString(),
          flagged: false,
        };

        await setItem('collaborations', collaborationId, collaboration);
      }
    }

    const updatedOffer = {
      ...offer,
      ...body,
      id, // Prevent ID change
      agent_id: (offer as any).agent_id, // Prevent agent change
      updated_at: new Date().toISOString(),
    };

    await setItem('marketplace_offers', id, updatedOffer);

    return success(updatedOffer, 'Offer updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update offer', 500);
  }
}

async function handleDeleteOffer(request: Request, id: string) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const offer = await getItem('marketplace_offers', id);
    if (!offer) {
      return notFound('Offer not found');
    }

    // Check ownership
    if ((offer as any).agent_id !== auth.userId && auth.role !== 'admin') {
      return errorResponse('Unauthorized to delete this offer', 403);
    }

    await deleteItem('marketplace_offers', id);

    return success({ id }, 'Offer deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete offer', 500);
  }
}

