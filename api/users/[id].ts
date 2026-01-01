import { success, errorResponse, notFound } from '../_lib/utils';
import { getItem, setItem, deleteItem } from '../_lib/data-store';
import { requireAuth } from '../_lib/middleware';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  // Extract ID from URL
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];

  if (request.method === 'GET') {
    return handleGetUser(id);
  } else if (request.method === 'PUT' || request.method === 'PATCH') {
    return handleUpdateUser(request, id);
  } else if (request.method === 'DELETE') {
    return handleDeleteUser(request, id);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetUser(id: string) {
  try {
    const user = await getItem('users', id);

    if (!user) {
      return notFound('User not found');
    }

    // Remove sensitive data
    const { password_hash: _, ...userWithoutPassword } = user as any;

    return success(userWithoutPassword);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch user', 500);
  }
}

async function handleUpdateUser(request: Request, id: string) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    // Users can only update their own profile (or admin can update any)
    if (id !== auth.userId && auth.role !== 'admin') {
      return errorResponse('Unauthorized to update this user', 403);
    }

    const user = await getItem('users', id);
    if (!user) {
      return notFound('User not found');
    }

    const body = await request.json();
    
    // Prevent role changes (only admin can do this)
    const updatedUser = {
      ...user,
      ...body,
      id, // Prevent ID change
      role: auth.role === 'admin' ? ((body as any).role || (user as any).role) : (user as any).role, // Only admin can change role
      updated_at: new Date().toISOString(),
    } as any;

    await setItem('users', id, updatedUser);

    // Remove sensitive data
    const { password_hash: _, ...userWithoutPassword } = updatedUser as any;

    return success(userWithoutPassword, 'User updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update user', 500);
  }
}

async function handleDeleteUser(request: Request, id: string) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    // Only admin can delete users, or users can delete themselves
    if (id !== auth.userId && auth.role !== 'admin') {
      return errorResponse('Unauthorized to delete this user', 403);
    }

    const user = await getItem('users', id);
    if (!user) {
      return notFound('User not found');
    }

    // Soft delete: mark as inactive instead of hard delete
    const body = await request.json();
    const hardDelete = (body as any).hardDelete === true && auth.role === 'admin';

    if (hardDelete) {
      // Hard delete (admin only)
      await deleteItem('users', id);
      return success({ id }, 'User permanently deleted');
    } else {
      // Soft delete: mark as inactive
      const updatedUser = {
        ...user,
        active: false,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await setItem('users', id, updatedUser);
      return success({ id }, 'User deactivated successfully');
    }
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete user', 500);
  }
}

