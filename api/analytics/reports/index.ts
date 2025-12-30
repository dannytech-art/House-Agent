import { success, errorResponse } from '../../_lib/utils';
import { getStore, getAllItems, createId } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetReports(request);
  } else if (request.method === 'POST') {
    return handleGenerateReport(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetReports(request: Request) {
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

    if (!store.reports) {
      return success([]);
    }

    const reports = getAllItems(store.reports);

    // Sort by created date (newest first)
    reports.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return success(reports);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch reports', 500);
  }
}

async function handleGenerateReport(request: Request) {
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

    const body = await request.json();
    
    if (!body.type) {
      return errorResponse('Report type is required', 400);
    }

    const reportId = createId('report');
    
    // Generate report based on type
    let reportData: any = {};

    switch (body.type) {
      case 'users':
        reportData = {
          totalUsers: getAllItems(store.users).length,
          totalAgents: getAllItems(store.users).filter((u: any) => u.role === 'agent').length,
          totalSeekers: getAllItems(store.users).filter((u: any) => u.role === 'seeker').length,
          newUsersThisMonth: getAllItems(store.users).filter((u: any) => {
            const created = new Date(u.createdAt);
            const now = new Date();
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
          }).length,
        };
        break;

      case 'properties':
        reportData = {
          totalProperties: getAllItems(store.properties).length,
          activeProperties: getAllItems(store.properties).filter((p: any) => p.status === 'available').length,
          soldProperties: getAllItems(store.properties).filter((p: any) => p.status === 'sold').length,
          featuredProperties: getAllItems(store.properties).filter((p: any) => p.featured).length,
        };
        break;

      case 'interests':
        reportData = {
          totalInterests: getAllItems(store.interests).length,
          pendingInterests: getAllItems(store.interests).filter((i: any) => i.status === 'pending').length,
          closedInterests: getAllItems(store.interests).filter((i: any) => i.status === 'closed').length,
        };
        break;

      case 'financial':
        const allTransactions = getAllItems(store.transactions);
        reportData = {
          totalTransactions: allTransactions.length,
          totalRevenue: allTransactions
            .filter((t: any) => t.type === 'credit_purchase')
            .reduce((sum: number, t: any) => sum + (t.amount || 0), 0),
          totalCreditsPurchased: allTransactions
            .filter((t: any) => t.type === 'credit_purchase')
            .reduce((sum: number, t: any) => sum + (t.credits || 0), 0),
        };
        break;

      default:
        return errorResponse('Invalid report type', 400);
    }

    const report = {
      id: reportId,
      type: body.type,
      data: reportData,
      generatedBy: userId,
      createdAt: new Date().toISOString(),
      parameters: body.parameters || {},
    };

    if (!store.reports) {
      store.reports = new Map();
    }
    store.reports.set(reportId, report);

    return success(report, 'Report generated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to generate report', 500);
  }
}

