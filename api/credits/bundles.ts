import { success, errorResponse } from '../_lib/utils';
import { getAllItems } from '../_lib/data-store';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    try {
      // Get credit bundles from database (Supabase or in-memory)
      const bundles = await getAllItems('credit_bundles', { active: true });
      
      // If no bundles in database, return default bundles
      if (bundles.length === 0) {
        const defaultBundles = [
          { id: 'bundle-1', name: 'Starter Pack', credits: 10, price: 1000, bonus_credits: 0, popular: false, active: true },
          { id: 'bundle-2', name: 'Popular Choice', credits: 25, price: 2000, bonus_credits: 5, popular: true, active: true },
          { id: 'bundle-3', name: 'Value Pack', credits: 50, price: 3500, bonus_credits: 10, popular: false, active: true },
          { id: 'bundle-4', name: 'Premium Bundle', credits: 100, price: 6000, bonus_credits: 25, popular: true, active: true },
        ];
        return success(defaultBundles);
      }
      
      return success(bundles);
    } catch (error: any) {
      return errorResponse(error.message || 'Failed to fetch credit bundles', 500);
    }
  }

  return errorResponse('Method not allowed', 405);
}

