import { success, errorResponse } from '../_lib/utils';
import { getItem } from '../_lib/data-store';
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

    const user = await getItem('users', auth.userId);
    if (!user) {
      return errorResponse('User not found', 404);
    }

    return success({
      credits: user.credits || 0,
      walletBalance: user.wallet_balance || 0,
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch balance', 500);
  }
}

