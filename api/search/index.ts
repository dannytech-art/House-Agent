import { success, errorResponse } from '../_lib/utils';
import { getStore, getAllItems } from '../_lib/data-store';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'GET') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const queryParams = new URL(request.url).searchParams;
    const query = queryParams.get('q') || '';
    
    if (!query) {
      return errorResponse('Search query is required', 400);
    }

    const store = getStore();
    let properties = getAllItems(store.properties);

    // Simple search across title, description, and location
    const searchLower = query.toLowerCase();
    properties = properties.filter((p: any) => {
      return (
        p.title?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.location?.toLowerCase().includes(searchLower) ||
        p.area?.toLowerCase().includes(searchLower)
      );
    });

    // TODO: Add more sophisticated search with ranking, filters, etc.
    // TODO: Add pagination

    return success({
      query,
      results: properties,
      count: properties.length,
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Search failed', 500);
  }
}

