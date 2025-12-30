import { success, errorResponse } from '../_lib/utils';
import { getAllItems, createId, getItem, setItem, deleteItem, findItems } from '../_lib/data-store';
import { requireAuth } from '../_lib/middleware';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetNotifications(request);
  } else if (request.method === 'POST') {
    return handleCreateNotification(request);
  } else if (request.method === 'PUT' || request.method === 'PATCH') {
    return handleUpdateNotifications(request);
  } else if (request.method === 'DELETE') {
    return handleDeleteNotification(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetNotifications(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const queryParams = new URL(request.url).searchParams;
    
    // Build filters
    const filters: Record<string, any> = {
      target_user_id: auth.userId,
    };

    // Filter by read status
    const read = queryParams.get('read');
    if (read !== null) {
      filters.read = read === 'true';
    }

    // Filter by type
    const type = queryParams.get('type');
    if (type) {
      filters.type = type;
    }

    // Get notifications from database
    let notifications = await getAllItems('notifications', filters);

    // Sort by timestamp (newest first)
    notifications.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return success(notifications);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch notifications', 500);
  }
}

async function handleCreateNotification(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    // Check if admin (for sending notifications to other users)
    const user = await getItem('users', auth.userId);
    
    const body = await request.json();
    
    if (!body.targetUserId && !body.broadcast) {
      return errorResponse('targetUserId or broadcast flag is required', 400);
    }

    if (body.targetUserId && body.targetUserId !== auth.userId && user?.role !== 'admin') {
      return errorResponse('Only admins can send notifications to other users', 403);
    }

    const required = ['title', 'message', 'type'];
    const missing = required.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    const notifications: any[] = [];

    // Broadcast to all users or send to specific user
    if (body.broadcast) {
      const allUsers = await getAllItems('users');
      for (const targetUser of allUsers) {
        const notificationId = createId('notification');
        const notification = {
          id: notificationId,
          target_user_id: targetUser.id,
          title: body.title,
          message: body.message,
          type: body.type,
          read: false,
          metadata: body.metadata || {},
          created_at: new Date().toISOString(),
        };
        notifications.push(notification);
        await setItem('notifications', notificationId, notification);
      }
    } else {
      const notificationId = createId('notification');
      const notification = {
        id: notificationId,
        target_user_id: body.targetUserId || auth.userId,
        title: body.title,
        message: body.message,
        type: body.type,
        read: false,
        metadata: body.metadata || {},
        created_at: new Date().toISOString(),
      };
      notifications.push(notification);
      await setItem('notifications', notificationId, notification);
    }

    return success(body.broadcast ? { count: notifications.length } : notifications[0], 
      body.broadcast ? 'Notifications broadcast successfully' : 'Notification created successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create notification', 500);
  }
}

async function handleUpdateNotifications(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const body = await request.json();

    // Mark all as read or mark specific notification
    if (body.markAllAsRead) {
      const userNotifications = await findItems('notifications', {
        target_user_id: auth.userId,
        read: false,
      });
      
      let updatedCount = 0;
      for (const notification of userNotifications) {
        const updated = {
          ...notification,
          read: true,
          read_at: new Date().toISOString(),
        };
        await setItem('notifications', notification.id, updated);
        updatedCount++;
      }

      return success({ updated: updatedCount }, 'All notifications marked as read');
    }

    // Update specific notification
    if (body.notificationId) {
      const notification = await getItem('notifications', body.notificationId);
      if (!notification || notification.target_user_id !== auth.userId) {
        return errorResponse('Notification not found', 404);
      }

      const updatedNotification = {
        ...notification,
        ...body,
        id: body.notificationId,
      };

      if (body.read && !notification.read) {
        updatedNotification.read_at = new Date().toISOString();
      }

      await setItem('notifications', body.notificationId, updatedNotification);
      return success(updatedNotification, 'Notification updated successfully');
    }

    return errorResponse('notificationId or markAllAsRead is required', 400);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update notifications', 500);
  }
}

async function handleDeleteNotification(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const queryParams = new URL(request.url).searchParams;
    const notificationId = queryParams.get('id');
    const deleteAll = queryParams.get('deleteAll') === 'true';

    if (deleteAll) {
      // Delete all user's notifications
      const userNotifications = await findItems('notifications', {
        target_user_id: auth.userId,
      });
      
      let deletedCount = 0;
      for (const notification of userNotifications) {
        await deleteItem('notifications', notification.id);
        deletedCount++;
      }

      return success({ deleted: deletedCount }, 'All notifications deleted');
    }

    if (!notificationId) {
      return errorResponse('Notification ID is required', 400);
    }

    const notification = await getItem('notifications', notificationId);
    if (!notification || notification.target_user_id !== auth.userId) {
      return errorResponse('Notification not found', 404);
    }

    await deleteItem('notifications', notificationId);

    return success({ id: notificationId }, 'Notification deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete notification', 500);
  }
}

