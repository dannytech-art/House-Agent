import { success, errorResponse } from '../_lib/utils';
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

    // Check if payments/credits system is available
    const paystackKey = process.env.VITE_PAYSTACK_PUBLIC_KEY || process.env.PAYSTACK_PUBLIC_KEY;
    
    return success({
      status: 'available',
      configured: !!paystackKey,
      paymentGateway: 'paystack',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get payment status';
    return errorResponse(errorMessage, 500);
  }
}
