import { success, errorResponse } from '../_lib/utils';
import { getStore, getAllItems } from '../_lib/data-store';
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
    const metricType = queryParams.get('type') || 'overview';

    let metrics: any = {};

    switch (metricType) {
      case 'overview':
        metrics = {
          users: {
            total: getAllItems(store.users).length,
            agents: getAllItems(store.users).filter((u: any) => u.role === 'agent').length,
            seekers: getAllItems(store.users).filter((u: any) => u.role === 'seeker').length,
          },
          properties: {
            total: getAllItems(store.properties).length,
            active: getAllItems(store.properties).filter((p: any) => p.status === 'available').length,
            sold: getAllItems(store.properties).filter((p: any) => p.status === 'sold').length,
          },
          interests: {
            total: getAllItems(store.interests).length,
            pending: getAllItems(store.interests).filter((i: any) => i.status === 'pending').length,
            closed: getAllItems(store.interests).filter((i: any) => i.status === 'closed').length,
          },
          financial: {
            totalCredits: getAllItems(store.users)
              .reduce((sum: number, u: any) => sum + (u.credits || 0), 0),
            totalTransactions: getAllItems(store.transactions).length,
            totalRevenue: getAllItems(store.transactions)
              .filter((t: any) => t.type === 'credit_purchase')
              .reduce((sum: number, t: any) => sum + (t.amount || 0), 0),
          },
        };
        break;

      case 'users':
        const users = getAllItems(store.users);
        metrics = {
          total: users.length,
          byRole: {
            agents: users.filter((u: any) => u.role === 'agent').length,
            seekers: users.filter((u: any) => u.role === 'seeker').length,
            admins: users.filter((u: any) => u.role === 'admin').length,
          },
          verifiedAgents: users.filter((u: any) => u.role === 'agent' && u.verified).length,
          pendingKYC: users.filter((u: any) => u.role === 'agent' && u.kycStatus === 'pending').length,
        };
        break;

      case 'properties':
        const properties = getAllItems(store.properties);
        metrics = {
          total: properties.length,
          byStatus: {
            available: properties.filter((p: any) => p.status === 'available').length,
            pending: properties.filter((p: any) => p.status === 'pending').length,
            sold: properties.filter((p: any) => p.status === 'sold').length,
          },
          featured: properties.filter((p: any) => p.featured).length,
          byType: {
            apartment: properties.filter((p: any) => p.type === 'apartment').length,
            house: properties.filter((p: any) => p.type === 'house').length,
            duplex: properties.filter((p: any) => p.type === 'duplex').length,
          },
        };
        break;

      case 'conversions':
        const interests = getAllItems(store.interests);
        metrics = {
          totalInterests: interests.length,
          conversionRate: interests.length > 0
            ? (interests.filter((i: any) => i.status === 'closed').length / interests.length) * 100
            : 0,
          averageResponseTime: 0, // TODO: Calculate from timestamps
          topPerformingAgents: [], // TODO: Calculate
        };
        break;

      default:
        return errorResponse('Invalid metric type', 400);
    }

    return success(metrics);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch metrics', 500);
  }
}

