import { success, errorResponse, notFound } from '../_lib/utils';
import { getItem, setItem, deleteItem, findItems } from '../_lib/data-store';
import { requireAuth } from '../_lib/middleware';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];

  if (request.method === 'GET') {
    return handleGetGroup(id);
  } else if (request.method === 'PUT' || request.method === 'PATCH') {
    return handleUpdateGroup(request, id);
  } else if (request.method === 'DELETE') {
    return handleDeleteGroup(request, id);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetGroup(id: string) {
  try {
    const group = await getItem('groups', id);

    if (!group) {
      return notFound('Group not found');
    }

    return success(group);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch group', 500);
  }
}

async function handleUpdateGroup(request: Request, id: string) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const group = await getItem('groups', id);
    if (!group) {
      return notFound('Group not found');
    }

    // Check if user is admin of the group
    const memberIds = (group as any).member_ids || [];
    const isMember = memberIds.includes(auth.userId);
    const isAdmin = (group as any).created_by === auth.userId;

    if (!isAdmin && auth.role !== 'admin') {
      return errorResponse('Only group admins can update the group', 403);
    }

    const body = await request.json();
    
    // Handle adding/removing members
    let updatedMemberIds = [...memberIds];
    
    if (body.addMember) {
      if (!updatedMemberIds.includes(body.addMember)) {
        updatedMemberIds.push(body.addMember);
      }
    }

    if (body.removeMember) {
      updatedMemberIds = updatedMemberIds.filter((id: string) => id !== body.removeMember);
    }

    const updatedGroup = {
      ...group,
      ...body,
      id, // Prevent ID change
      member_ids: updatedMemberIds,
      updated_at: new Date().toISOString(),
    };

    // Remove addMember/removeMember from update
    delete (updatedGroup as any).addMember;
    delete (updatedGroup as any).removeMember;

    await setItem('groups', id, updatedGroup);

    return success(updatedGroup, 'Group updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update group', 500);
  }
}

async function handleDeleteGroup(request: Request, id: string) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const group = await getItem('groups', id);
    if (!group) {
      return notFound('Group not found');
    }

    // Only creator or admin can delete group
    if ((group as any).created_by !== auth.userId && auth.role !== 'admin') {
      return errorResponse('Only group creator or admin can delete the group', 403);
    }

    // Delete all group messages first
    const groupMessages = await findItems('group_messages', { group_id: id });
    for (const message of groupMessages) {
      await deleteItem('group_messages', message.id);
    }

    // Delete the group
    await deleteItem('groups', id);

    return success({ id }, 'Group deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete group', 500);
  }
}

