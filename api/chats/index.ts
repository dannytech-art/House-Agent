import { success, errorResponse } from '../_lib/utils';
import { createId, getAllItems, setItem, findItems } from '../_lib/data-store';
import { requireAuth } from '../_lib/middleware';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetChatSessions(request);
  } else if (request.method === 'POST') {
    return handleCreateChatSession(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetChatSessions(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    // Get all chat sessions and filter by participant
    const allChats = await getAllItems('chat_sessions');
    
    // Filter chats where user is a participant
    const userChats = allChats.filter((chat: any) =>
      chat.participant_ids && chat.participant_ids.includes(auth.userId)
    );

    return success(userChats);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch chat sessions', 500);
  }
}

async function handleCreateChatSession(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const body = await request.json();
    
    const required = ['participantIds'];
    const missing = required.filter(field => !body[field] || !Array.isArray(body[field]));
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    const chatId = createId('chat');
    
    const chatSession = {
      id: chatId,
      participant_ids: body.participantIds,
      property_id: body.propertyId || null,
      interest_id: body.interestId || null,
      created_at: new Date().toISOString(),
      last_message_at: new Date().toISOString(),
    };

    // Save to database (Supabase or in-memory)
    await setItem('chat_sessions', chatId, chatSession);

    return success(chatSession, 'Chat session created successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create chat session', 500);
  }
}

