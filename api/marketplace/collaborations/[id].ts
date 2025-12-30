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
    return handleGetCollaboration(id);
  } else if (request.method === 'PUT' || request.method === 'PATCH') {
    return handleUpdateCollaboration(request, id);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetCollaboration(id: string) {
  try {
    const store = getStore();
    if (!store.collaborations) {
      return notFound('Collaboration not found');
    }

    const collaboration = getItem(store.collaborations, id);

    if (!collaboration) {
      return notFound('Collaboration not found');
    }

    return success(collaboration);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch collaboration', 500);
  }
}

async function handleUpdateCollaboration(request: Request, id: string) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    const store = getStore();
    if (!store.collaborations) {
      return notFound('Collaboration not found');
    }

    const collaboration = getItem(store.collaborations, id);

    if (!collaboration) {
      return notFound('Collaboration not found');
    }

    // Check authorization - fromAgent, toAgent, or admin can update
    const user = store.users.get(userId);
    const isAuthorized = 
      collaboration.fromAgent === userId ||
      collaboration.toAgent === userId ||
      user?.role === 'admin';

    if (!isAuthorized) {
      return errorResponse('Unauthorized to update this collaboration', 403);
    }

    const body = await request.json();
    
    const updatedCollaboration = {
      ...collaboration,
      ...body,
      id, // Prevent ID change
      updatedAt: new Date().toISOString(),
    };

    // If completing collaboration, transfer credits
    if (body.status === 'completed' && collaboration.status === 'pending') {
      const fromAgent = store.users.get(collaboration.fromAgent);
      const toAgent = store.users.get(collaboration.toAgent);
      
      if (fromAgent && toAgent) {
        // Deduct credits from fromAgent
        fromAgent.credits = Math.max(0, (fromAgent.credits || 0) - collaboration.credits);
        // Add credits to toAgent
        toAgent.credits = (toAgent.credits || 0) + collaboration.credits;
        
        store.users.set(collaboration.fromAgent, fromAgent);
        store.users.set(collaboration.toAgent, toAgent);

        // Create transaction records
        const transactionId = createId('transaction');
        store.transactions.set(transactionId, {
          id: transactionId,
          userId: collaboration.fromAgent,
          type: 'credit_spent',
          amount: 0,
          credits: collaboration.credits,
          description: `Collaboration with ${toAgent.name}`,
          timestamp: new Date().toISOString(),
          status: 'completed',
        });
      }
    }

    setItem(store.collaborations, id, updatedCollaboration);

    return success(updatedCollaboration, 'Collaboration updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update collaboration', 500);
  }
}

