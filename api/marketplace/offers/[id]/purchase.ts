import { success, errorResponse, notFound } from '../../../_lib/utils';
import { getItem, setItem, createId } from '../../../_lib/data-store';
import { requireAuth } from '../../../_lib/middleware';
import type { Request } from '../../../_lib/types';

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

    // Extract offer ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const offerId = pathParts[pathParts.length - 2]; // [id] is before purchase

    // Get offer
    const offer = await getItem('marketplace_offers', offerId);
    if (!offer) {
      return notFound('Offer not found');
    }

    // Check if offer is active
    if ((offer as any).status !== 'active') {
      return errorResponse('This offer is no longer available', 400);
    }

    // Check if user is trying to purchase their own offer
    if ((offer as any).agent_id === auth.userId) {
      return errorResponse('You cannot purchase your own offer', 400);
    }

    // Get buyer user
    const buyer = await getItem('users', auth.userId);
    if (!buyer) {
      return errorResponse('User not found', 404);
    }

    // Check if buyer has enough credits
    const creditCost = (offer as any).credit_cost || 0;
    if ((buyer.credits || 0) < creditCost) {
      return errorResponse('Insufficient credits!', 400);
    }

    // Deduct credits from buyer
    const updatedBuyer = {
      ...buyer,
      credits: (buyer.credits || 0) - creditCost,
      updated_at: new Date().toISOString(),
    };
    await setItem('users', auth.userId, updatedBuyer);

    // Add credits to seller (optional - could be commission split)
    const seller = await getItem('users', (offer as any).agent_id);
    if (seller) {
      const updatedSeller = {
        ...seller,
        credits: (seller.credits || 0) + creditCost,
        updated_at: new Date().toISOString(),
      };
      await setItem('users', (offer as any).agent_id, updatedSeller);
    }

    // Update offer status
    const updatedOffer = {
      ...offer,
      status: 'completed',
      purchased_by: auth.userId,
      purchased_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await setItem('marketplace_offers', offerId, updatedOffer);

    // Create transaction record for buyer
    const transactionId = createId('transaction');
    const transaction = {
      id: transactionId,
      user_id: auth.userId,
      type: 'marketplace_purchase',
      amount: 0,
      credits: creditCost,
      description: `Purchased ${(offer as any).type} offer: ${(offer as any).title || (offer as any).description?.substring(0, 50)}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      metadata: { offer_id: offerId, offer_type: (offer as any).type },
    };
    await setItem('transactions', transactionId, transaction);

    // Create collaboration record if applicable
    if ((offer as any).type === 'co-broking' || (offer as any).type === 'collaboration') {
      const collaborationId = createId('collab');
      const collaboration = {
        id: collaborationId,
        type: (offer as any).type,
        from_agent_id: (offer as any).agent_id,
        to_agent_id: auth.userId,
        property_id: (offer as any).property_id,
        credit_cost: creditCost,
        status: 'active',
        created_at: new Date().toISOString(),
        flagged: false,
      };
      await setItem('collaborations', collaborationId, collaboration);
    }

    return success({
      offer: updatedOffer,
      newBalance: updatedBuyer.credits,
      transaction,
      message: 'Purchase successful! Contact details unlocked.',
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to purchase offer', 500);
  }
}

