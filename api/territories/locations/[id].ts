import { success, errorResponse, notFound } from '../../_lib/utils';
import { getStore, getItem, setItem, deleteItem } from '../../_lib/data-store';
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
    return handleGetLocation(id);
  } else if (request.method === 'PUT' || request.method === 'PATCH') {
    return handleUpdateLocation(request, id);
  } else if (request.method === 'DELETE') {
    return handleDeleteLocation(request, id);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetLocation(id: string) {
  try {
    const store = getStore();
    if (!store.locations) {
      return notFound('Location not found');
    }

    const location = getItem(store.locations, id);

    if (!location) {
      return notFound('Location not found');
    }

    return success(location);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch location', 500);
  }
}

async function handleUpdateLocation(request: Request, id: string) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    // Only admin can update locations
    const store = getStore();
    const user = store.users.get(userId);
    
    if (!user || user.role !== 'admin') {
      return errorResponse('Admin access required', 403);
    }

    if (!store.locations) {
      return notFound('Location not found');
    }

    const location = getItem(store.locations, id);

    if (!location) {
      return notFound('Location not found');
    }

    const body = await request.json();
    
    const updatedLocation = {
      ...location,
      ...body,
      id, // Prevent ID change
      updatedAt: new Date().toISOString(),
    };

    setItem(store.locations, id, updatedLocation);

    return success(updatedLocation, 'Location updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update location', 500);
  }
}

async function handleDeleteLocation(request: Request, id: string) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    // Only admin can delete locations
    const store = getStore();
    const user = store.users.get(userId);
    
    if (!user || user.role !== 'admin') {
      return errorResponse('Admin access required', 403);
    }

    if (!store.locations) {
      return notFound('Location not found');
    }

    const location = getItem(store.locations, id);

    if (!location) {
      return notFound('Location not found');
    }

    deleteItem(store.locations, id);

    return success({ id }, 'Location deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete location', 500);
  }
}

