import { success, errorResponse } from '../_lib/utils';
import { getStore, getItem, setItem } from '../_lib/data-store';
import { requireAuth } from '../_lib/middleware';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetPreferences(request);
  } else if (request.method === 'PUT' || request.method === 'PATCH') {
    return handleUpdatePreferences(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetPreferences(request: Request) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    const store = getStore();
    const user = store.users.get(userId);

    if (!user) {
      return errorResponse('User not found', 404);
    }

    // Return notification preferences (defaults if not set)
    const preferences = user.notificationPreferences || {
      email: true,
      push: true,
      sms: false,
      inApp: true,
      types: {
        interests: true,
        messages: true,
        deals: true,
        system: true,
        marketing: false,
      },
    };

    return success(preferences);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch preferences', 500);
  }
}

async function handleUpdatePreferences(request: Request) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    const body = await request.json();
    const store = getStore();
    const user = store.users.get(userId);

    if (!user) {
      return errorResponse('User not found', 404);
    }

    // Update preferences
    user.notificationPreferences = {
      ...(user.notificationPreferences || {}),
      ...body,
    };

    setItem(store.users, userId, user);

    return success(user.notificationPreferences, 'Preferences updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update preferences', 500);
  }
}

