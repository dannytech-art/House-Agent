import { success, errorResponse, notFound } from '../../_lib/utils';
import { getItem, setItem, createId, findItems } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  // Extract group ID from URL
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const groupIdIndex = pathParts.findIndex(part => part === 'groups') + 1;
  const groupId = pathParts[groupIdIndex];

  if (request.method === 'GET') {
    return handleGetMessages(groupId);
  } else if (request.method === 'POST') {
    return handleSendMessage(request, groupId);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetMessages(groupId: string) {
  try {
    // Verify group exists
    const group = await getItem('groups', groupId);
    if (!group) {
      return notFound('Group not found');
    }

    // Get messages for this group
    const groupMessages = await findItems('group_messages', { group_id: groupId });

    // Sort by timestamp
    groupMessages.sort((a: any, b: any) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return success(groupMessages);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch messages', 500);
  }
}

async function handleSendMessage(request: Request, groupId: string) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const body = await request.json();
    
    if (!body.message) {
      return errorResponse('Message is required', 400);
    }

    // Verify group exists
    const group = await getItem('groups', groupId);
    if (!group) {
      return notFound('Group not found');
    }

    // Verify user is a member
    const isMember = group.member_ids && group.member_ids.includes(auth.userId);
    if (!isMember) {
      return errorResponse('You are not a member of this group', 403);
    }

    // Get user info
    const user = await getItem('users', auth.userId);
    if (!user) {
      return errorResponse('User not found', 404);
    }

    const messageId = createId('group-message');
    const message = {
      id: messageId,
      group_id: groupId,
      sender_id: auth.userId,
      sender_name: user.name,
      sender_avatar: user.avatar || null,
      message: body.message,
      timestamp: new Date().toISOString(),
      type: body.type || 'text',
      metadata: body.metadata || null,
    };

    // Save message to database
    await setItem('group_messages', messageId, message);

    return success(message, 'Message sent successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to send message', 500);
  }
}

