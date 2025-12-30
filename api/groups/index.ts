import { success, errorResponse } from '../_lib/utils';
import { getAllItems, createId, getItem, setItem, findItems } from '../_lib/data-store';
import { requireAuth } from '../_lib/middleware';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetGroups(request);
  } else if (request.method === 'POST') {
    return handleCreateGroup(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetGroups(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    // Get all groups and filter by membership
    const allGroups = await getAllItems('groups');
    
    // Filter groups where user is a member (check member_ids array)
    const userGroups = allGroups.filter((group: any) =>
      group.member_ids && group.member_ids.includes(auth.userId)
    );

    return success(userGroups);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch groups', 500);
  }
}

async function handleCreateGroup(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const body = await request.json();
    
    const required = ['name', 'description'];
    const missing = required.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    const user = await getItem('users', auth.userId);
    if (!user) {
      return errorResponse('User not found', 404);
    }

    const groupId = createId('group');
    const group = {
      id: groupId,
      name: body.name,
      description: body.description,
      avatar: body.avatar || null,
      member_ids: [auth.userId], // Start with creator as member
      created_by: auth.userId,
      is_public: body.isPublic || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save to database
    await setItem('groups', groupId, group);

    return success(group, 'Group created successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create group', 500);
  }
}

