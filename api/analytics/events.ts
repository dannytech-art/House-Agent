import { success, errorResponse } from '../_lib/utils';
import { getStore, createId, getAllItems } from '../_lib/data-store';
import { requireAuth } from '../_lib/middleware';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'POST') {
    return handleTrackEvent(request);
  } else if (request.method === 'GET') {
    return handleGetEvents(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleTrackEvent(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.event || !body.userId) {
      return errorResponse('Event type and user ID are required', 400);
    }

    const store = getStore();
    const eventId = createId('event');
    
    const event = {
      id: eventId,
      userId: body.userId,
      event: body.event, // 'page_view', 'property_view', 'interest_created', etc.
      entityType: body.entityType || null,
      entityId: body.entityId || null,
      metadata: body.metadata || {},
      timestamp: new Date().toISOString(),
    };

    if (!store.analyticsEvents) {
      store.analyticsEvents = new Map();
    }
    store.analyticsEvents.set(eventId, event);

    return success(event, 'Event tracked successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to track event', 500);
  }
}

async function handleGetEvents(request: Request) {
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

    const queryParams = new URL(request.url).searchParams;
    
    if (!store.analyticsEvents) {
      return success([]);
    }

    let events = getAllItems(store.analyticsEvents);

    // Filter by event type
    const eventType = queryParams.get('event');
    if (eventType) {
      events = events.filter((e: any) => e.event === eventType);
    }

    // Filter by user
    const filterUserId = queryParams.get('userId');
    if (filterUserId) {
      events = events.filter((e: any) => e.userId === filterUserId);
    }

    // Filter by date range
    const startDate = queryParams.get('startDate');
    const endDate = queryParams.get('endDate');
    if (startDate) {
      events = events.filter((e: any) => new Date(e.timestamp) >= new Date(startDate));
    }
    if (endDate) {
      events = events.filter((e: any) => new Date(e.timestamp) <= new Date(endDate));
    }

    // Sort by timestamp (newest first)
    events.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return success(events);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch events', 500);
  }
}

