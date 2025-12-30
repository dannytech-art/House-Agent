import { success, errorResponse, notFound } from '../../_lib/utils';
import { getItem, setItem, createId, findItems } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  // Extract chat ID from URL
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const chatIdIndex = pathParts.findIndex(part => part === 'chats') + 1;
  const chatId = pathParts[chatIdIndex];

  if (request.method === 'GET') {
    return handleGetMessages(chatId);
  } else if (request.method === 'POST') {
    return handleSendMessage(request, chatId);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetMessages(chatId: string) {
  try {
    // Get chat session
    const chat = await getItem('chat_sessions', chatId);
    if (!chat) {
      return notFound('Chat session not found');
    }

    // Get messages for this chat
    const messages = await findItems('chat_messages', { chat_session_id: chatId });
    
    // Sort by timestamp
    messages.sort((a: any, b: any) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return success(messages);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch messages', 500);
  }
}

async function handleSendMessage(request: Request, chatId: string) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const body = await request.json();
    
    if (!body.message) {
      return errorResponse('Message is required', 400);
    }

    // Get chat session
    const chat = await getItem('chat_sessions', chatId);
    if (!chat) {
      return notFound('Chat session not found');
    }

    // Verify user is a participant
    if (!chat.participant_ids?.includes(auth.userId)) {
      return errorResponse('Not authorized to send message in this chat', 403);
    }

    // Get user info
    const user = await getItem('users', auth.userId);
    if (!user) {
      return errorResponse('User not found', 404);
    }

    const messageId = createId('message');
    const message = {
      id: messageId,
      chat_session_id: chatId,
      sender_id: auth.userId,
      sender_name: user.name,
      sender_avatar: user.avatar || null,
      message: body.message,
      timestamp: new Date().toISOString(),
      type: body.type || 'text',
      metadata: body.metadata || null,
    };

    // Save message to database
    await setItem('chat_messages', messageId, message);

    // Update chat session last_message_at
    await setItem('chat_sessions', chatId, {
      ...chat,
      last_message_at: new Date().toISOString(),
    });

    return success(message, 'Message sent successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to send message', 500);
  }
}

