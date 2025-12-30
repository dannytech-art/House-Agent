import { success, errorResponse } from '../_lib/utils';
import { getAllItems } from '../_lib/data-store';
import { requireAuth } from '../_lib/middleware';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'GET') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    // Get transactions for this user
    const userTransactions = await getAllItems('transactions', { user_id: auth.userId });

    // Sort by timestamp (newest first)
    userTransactions.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return success(userTransactions);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch transactions', 500);
  }
}

