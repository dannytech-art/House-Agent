import { success, errorResponse, getQueryParams } from '../_lib/utils';
import { createId, getAllItems, getItem, setItem } from '../_lib/data-store';
import { requireAuth } from '../_lib/middleware';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetProperties(request);
  } else if (request.method === 'POST') {
    return handleCreateProperty(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetProperties(request: Request) {
  try {
    const queryParams = getQueryParams(request);
    
    // Build filters object
    const filters: Record<string, any> = {};
    const location = queryParams.get('location');
    const type = queryParams.get('type');
    const agentId = queryParams.get('agentId');
    const featured = queryParams.get('featured');

    if (type) filters.type = type;
    if (agentId) filters.agentId = agentId;
    if (featured === 'true') filters.featured = true;

    // Get properties from database (Supabase or in-memory)
    let properties = await getAllItems('properties', Object.keys(filters).length > 0 ? filters : undefined);

    // Apply additional filters that need custom logic
    if (location) {
      properties = properties.filter((p: any) => 
        p.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    const minPrice = queryParams.get('minPrice');
    const maxPrice = queryParams.get('maxPrice');

    if (minPrice) {
      properties = properties.filter((p: any) => Number(p.price) >= Number(minPrice));
    }

    if (maxPrice) {
      properties = properties.filter((p: any) => Number(p.price) <= Number(maxPrice));
    }

    // TODO: Add pagination
    
    return success(properties);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch properties', 500);
  }
}

async function handleCreateProperty(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const body = await request.json();
    
    const required = ['title', 'type', 'price', 'location', 'description'];
    const missing = required.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    // Get user to check if agent
    const user = await getItem('users', auth.userId);
    
    if (!user || user.role !== 'agent') {
      return errorResponse('Only agents can create properties', 403);
    }

    const propertyId = createId('property');
    const property = {
      id: propertyId,
      ...body,
      agentId: auth.userId,
      agentName: user.name,
      agentType: user.agentType || 'direct',
      agentVerified: user.verified || false,
      images: body.images || [],
      videos: body.videos || [],
      amenities: body.amenities || [],
      postedAt: new Date().toISOString(),
      featured: false,
      status: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to database (Supabase or in-memory)
    await setItem('properties', propertyId, property);

    return success(property, 'Property created successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create property', 500);
  }
}

