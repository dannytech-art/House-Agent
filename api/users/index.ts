import { success, errorResponse, unauthorized, forbidden } from '../_lib/utils';
import { requireRole, checkRole } from '../_lib/middleware';
import { getAllItems } from '../_lib/data-store';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  // Get all users (admin only)
  if (request.method === 'GET') {
    return handleGetUsers(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetUsers(request: Request) {
  try {
    // Check if user is admin
    const roleCheck = await checkRole(request, ['admin']);
    if (roleCheck) {
      return roleCheck; // Returns 403 if not admin
    }

    // Get users from database (Supabase or in-memory)
    const users = await getAllItems('users');

    // Remove sensitive data (passwordHash instead of password)
    const sanitizedUsers = users.map(({ passwordHash: _, ...user }: any) => user);

    // TODO: Add pagination, filtering, sorting
    
    return success(sanitizedUsers);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch users', 500);
  }
}

