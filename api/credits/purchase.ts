import { success, errorResponse } from '../_lib/utils';
import { createId, getItem, setItem } from '../_lib/data-store';
import { requireAuth } from '../_lib/middleware';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    const body = await request.json();
    
    if (!body.bundleId) {
      return errorResponse('Bundle ID is required', 400);
    }

    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const user = await getItem('users', auth.userId);
    if (!user) {
      return errorResponse('User not found', 404);
    }

    // Get bundle from database
    const bundle = await getItem('credit_bundles', body.bundleId);
    if (!bundle || !bundle.active) {
      return errorResponse('Invalid or inactive bundle', 400);
    }

    // TODO: Integrate with Paystack payment gateway
    // For now, simulate successful purchase
    
    const totalCredits = bundle.credits + (bundle.bonus_credits || 0);
    
    // Update user credits
    const updatedUser = {
      ...user,
      credits: (user.credits || 0) + totalCredits,
      updated_at: new Date().toISOString(),
    };
    await setItem('users', auth.userId, updatedUser);

    // Create transaction record
    const transactionId = createId('transaction');
    const transaction = {
      id: transactionId,
      user_id: auth.userId,
      type: 'credit_purchase',
      amount: bundle.price,
      credits: totalCredits,
      description: `Purchased ${bundle.credits} credits${bundle.bonus_credits > 0 ? ` + ${bundle.bonus_credits} bonus` : ''}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      bundle_id: body.bundleId,
    };

    await setItem('transactions', transactionId, transaction);

    return success({
      transaction,
      newBalance: updatedUser.credits,
    }, 'Credits purchased successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to purchase credits', 500);
  }
}

