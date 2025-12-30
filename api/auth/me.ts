import { success, unauthorized, errorResponse } from '../_lib/utils';
import { requireAuth } from '../_lib/middleware';
import { getStore } from '../_lib/data-store';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'GET') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const userId = await requireAuth(request);
    
    if (!userId) {
      return unauthorized('Authentication required');
    }

    // Get user from store
    const store = getStore();
    const user = store.users.get(userId);

    if (!user) {
      return unauthorized('User not found');
    }

    // Return user without sensitive data
    const { password: _, ...userWithoutPassword } = user;
    
    return success(userWithoutPassword);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch user', 500);
  }
}

