import { success, errorResponse } from '../_lib/utils';
import { createId, getAllItems, getItem, setItem, findItems, deleteItem } from '../_lib/data-store';
import { requireAuth } from '../_lib/middleware';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetWatchlist(request);
  } else if (request.method === 'POST') {
    return handleAddToWatchlist(request);
  } else if (request.method === 'DELETE') {
    return handleRemoveFromWatchlist(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetWatchlist(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    // Get watchlist items for this user
    const watchlistItems = await getAllItems('watchlist', { user_id: auth.userId });

    // Get property details for each item
    const properties = await Promise.all(
      watchlistItems.map(async (item: any) => {
        const property = await getItem('properties', item.property_id);
        return property ? { ...item, property } : null;
      })
    );

    // Filter out nulls
    const validProperties = properties.filter(item => item !== null);

    return success(validProperties);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch watchlist', 500);
  }
}

async function handleAddToWatchlist(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const body = await request.json();
    
    if (!body.propertyId) {
      return errorResponse('Property ID is required', 400);
    }
    
    // Verify property exists
    const property = await getItem('properties', body.propertyId);
    if (!property) {
      return errorResponse('Property not found', 404);
    }

    // Check if already in watchlist
    const existing = await findItems('watchlist', {
      user_id: auth.userId,
      property_id: body.propertyId,
    });
    
    if (existing.length > 0) {
      return errorResponse('Property already in watchlist', 409);
    }

    const watchlistId = createId('watchlist');
    const watchlistItem = {
      id: watchlistId,
      user_id: auth.userId,
      property_id: body.propertyId,
      created_at: new Date().toISOString(),
    };

    // Save to database
    await setItem('watchlist', watchlistId, watchlistItem);

    return success(watchlistItem, 'Added to watchlist successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to add to watchlist', 500);
  }
}

async function handleRemoveFromWatchlist(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const queryParams = new URL(request.url).searchParams;
    const propertyId = queryParams.get('propertyId');
    
    if (!propertyId) {
      return errorResponse('Property ID is required', 400);
    }

    // Find watchlist item
    const items = await findItems('watchlist', {
      user_id: auth.userId,
      property_id: propertyId,
    });

    if (items.length === 0) {
      return errorResponse('Watchlist item not found', 404);
    }

    const itemToRemove = items[0];

    // Delete from database
    await deleteItem('watchlist', itemToRemove.id);

    return success({ id: itemToRemove.id }, 'Removed from watchlist successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to remove from watchlist', 500);
  }
}

