import { success, errorResponse, notFound } from '../_lib/utils';
import { getItem, setItem, deleteItem } from '../_lib/data-store';
import { requireAuth } from '../_lib/middleware';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  // Extract ID from URL
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];

  if (request.method === 'GET') {
    return handleGetInterest(id);
  } else if (request.method === 'PUT' || request.method === 'PATCH') {
    return handleUpdateInterest(request, id);
  } else if (request.method === 'DELETE') {
    return handleDeleteInterest(request, id);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetInterest(id: string) {
  try {
    const interest = await getItem('interests', id);

    if (!interest) {
      return notFound('Interest not found');
    }

    return success(interest);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch interest', 500);
  }
}

async function handleUpdateInterest(request: Request, id: string) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const interest = await getItem('interests', id);

    if (!interest) {
      return notFound('Interest not found');
    }

    // Check authorization - agent can update status, seeker can update message
    const user = await getItem('users', auth.userId);
    const property = interest.property_id ? await getItem('properties', interest.property_id) : null;
    
    const canUpdate = 
      interest.seeker_id === auth.userId || // Seeker owns the interest
      (user?.role === 'agent' && property?.agent_id === auth.userId) || // Agent owns the property
      user?.role === 'admin'; // Admin can update

    if (!canUpdate) {
      return errorResponse('Unauthorized to update this interest', 403);
    }

    const body = await request.json();
    
    const updatedInterest = {
      ...interest,
      ...body,
      id, // Prevent ID change
      seeker_id: interest.seeker_id, // Prevent seeker change
      property_id: interest.property_id, // Prevent property change
      updated_at: new Date().toISOString(),
    };

    await setItem('interests', id, updatedInterest);

    return success(updatedInterest, 'Interest updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update interest', 500);
  }
}

async function handleDeleteInterest(request: Request, id: string) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const interest = await getItem('interests', id);

    if (!interest) {
      return notFound('Interest not found');
    }

    // Only seeker can delete their own interest, or admin
    if (interest.seeker_id !== auth.userId) {
      const user = await getItem('users', auth.userId);
      if (user?.role !== 'admin') {
        return errorResponse('Unauthorized to delete this interest', 403);
      }
    }

    await deleteItem('interests', id);

    return success({ id }, 'Interest deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete interest', 500);
  }
}

