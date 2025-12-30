import { success, errorResponse } from '../../_lib/utils';
import { getStore, getAllItems, createId, getItem, setItem, deleteItem } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetLocations(request);
  } else if (request.method === 'POST') {
    return handleCreateLocation(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetLocations(request: Request) {
  try {
    // Locations can be public or admin-only
    const queryParams = new URL(request.url).searchParams;
    const store = getStore();
    
    if (!store.locations) {
      return success([]);
    }

    let locations = getAllItems(store.locations);

    // Filter by area/state
    const area = queryParams.get('area');
    if (area) {
      locations = locations.filter((l: any) => 
        l.area?.toLowerCase().includes(area.toLowerCase()) ||
        l.name?.toLowerCase().includes(area.toLowerCase())
      );
    }

    // Filter by state
    const state = queryParams.get('state');
    if (state) {
      locations = locations.filter((l: any) => l.state === state);
    }

    // Search
    const search = queryParams.get('search');
    if (search) {
      const searchLower = search.toLowerCase();
      locations = locations.filter((l: any) =>
        l.name?.toLowerCase().includes(searchLower) ||
        l.area?.toLowerCase().includes(searchLower) ||
        l.state?.toLowerCase().includes(searchLower)
      );
    }

    return success(locations);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch locations', 500);
  }
}

async function handleCreateLocation(request: Request) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    // Only admin can create locations
    const store = getStore();
    const user = store.users.get(userId);
    
    if (!user || user.role !== 'admin') {
      return errorResponse('Admin access required', 403);
    }

    const body = await request.json();
    
    const required = ['name', 'area', 'state'];
    const missing = required.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    const locationId = createId('location');
    const location = {
      id: locationId,
      name: body.name,
      area: body.area,
      state: body.state || 'Lagos',
      coordinates: body.coordinates || null,
      boundaries: body.boundaries || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!store.locations) {
      store.locations = new Map();
    }
    store.locations.set(locationId, location);

    return success(location, 'Location created successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create location', 500);
  }
}

