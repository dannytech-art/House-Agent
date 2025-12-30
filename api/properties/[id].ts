import { success, errorResponse, notFound } from '../_lib/utils';
import { getItem, setItem, deleteItem } from '../_lib/data-store';
import { requireAuth, requireRole, checkRole } from '../_lib/middleware';
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
    return handleGetProperty(id);
  } else if (request.method === 'PUT' || request.method === 'PATCH') {
    return handleUpdateProperty(request, id);
  } else if (request.method === 'DELETE') {
    return handleDeleteProperty(request, id);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetProperty(id: string) {
  try {
    const property = await getItem('properties', id);

    if (!property) {
      return notFound('Property not found');
    }

    return success(property);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch property', 500);
  }
}

async function handleUpdateProperty(request: Request, id: string) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const property = await getItem('properties', id);

    if (!property) {
      return notFound('Property not found');
    }

    // Check ownership or admin
    if (property.agent_id !== auth.userId && auth.role !== 'admin') {
      return errorResponse('Unauthorized to update this property', 403);
    }

    const body = await request.json();
    
    const updatedProperty = {
      ...property,
      ...body,
      id, // Prevent ID change
      agent_id: property.agent_id, // Prevent agent change
      updated_at: new Date().toISOString(),
    };

    await setItem('properties', id, updatedProperty);

    return success(updatedProperty, 'Property updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update property', 500);
  }
}

async function handleDeleteProperty(request: Request, id: string) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const property = await getItem('properties', id);

    if (!property) {
      return notFound('Property not found');
    }

    // Check ownership or admin
    if (property.agent_id !== auth.userId && auth.role !== 'admin') {
      return errorResponse('Unauthorized to delete this property', 403);
    }

    await deleteItem('properties', id);

    return success({ id }, 'Property deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete property', 500);
  }
}

