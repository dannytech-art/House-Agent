import { success, errorResponse } from '../_lib/utils';
import { getItem, setItem, createId } from '../_lib/data-store';
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
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    // Only agents can claim territories
    const user = await getItem('users', auth.userId);
    if (!user || user.role !== 'agent') {
      return errorResponse('Only agents can claim territories', 403);
    }

    const body = await request.json();
    
    if (!body.area || !body.cost) {
      return errorResponse('Area and cost are required', 400);
    }

    // Check if user has enough credits
    if ((user.credits || 0) < body.cost) {
      return errorResponse(`Insufficient credits! You need ${body.cost} credits to claim ${body.area}.`, 400);
    }

    // Check if territory already claimed by this agent
    const { findItems } = await import('../_lib/data-store');
    const existingTerritories = await findItems('territories', {
      agent_id: auth.userId,
      area: body.area,
    });

    if (existingTerritories.length > 0) {
      return errorResponse('You already own this territory', 400);
    }

    // Deduct credits
    const updatedUser = {
      ...user,
      credits: (user.credits || 0) - body.cost,
      updated_at: new Date().toISOString(),
    };
    await setItem('users', auth.userId, updatedUser);

    // Create territory record
    const territoryId = createId('territory');
    const territory = {
      id: territoryId,
      agent_id: auth.userId,
      area: body.area,
      state: body.state || 'Lagos',
      cost: body.cost,
      claimed_at: new Date().toISOString(),
      daily_income: body.dailyIncome || 0,
      dominance_score: 0,
      total_listings: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await setItem('territories', territoryId, territory);

    // Create transaction record
    const transactionId = createId('transaction');
    const transaction = {
      id: transactionId,
      user_id: auth.userId,
      type: 'territory_claim',
      amount: 0,
      credits: body.cost,
      description: `Claimed territory: ${body.area}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      metadata: { territory_id: territoryId, area: body.area },
    };
    await setItem('transactions', transactionId, transaction);

    return success({
      territory,
      newBalance: updatedUser.credits,
      transaction,
    }, `Successfully claimed ${body.area}! 🎉`);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to claim territory', 500);
  }
}

