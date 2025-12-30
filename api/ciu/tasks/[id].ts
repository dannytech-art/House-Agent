import { success, errorResponse, notFound } from '../../_lib/utils';
import { getStore, getItem, setItem } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];

  if (request.method === 'GET') {
    return handleGetTask(id);
  } else if (request.method === 'PUT' || request.method === 'PATCH') {
    return handleUpdateTask(request, id);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetTask(id: string) {
  try {
    const store = getStore();
    if (!store.vilanowTasks) {
      return notFound('Task not found');
    }

    const task = getItem(store.vilanowTasks, id);

    if (!task) {
      return notFound('Task not found');
    }

    return success(task);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch task', 500);
  }
}

async function handleUpdateTask(request: Request, id: string) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    const store = getStore();
    const user = store.users.get(userId);
    
    if (!store.vilanowTasks) {
      return notFound('Task not found');
    }

    const task = getItem(store.vilanowTasks, id);

    if (!task) {
      return notFound('Task not found');
    }

    // Check authorization - admin or assigned agent can update
    if (task.assignedAgent !== userId && user?.role !== 'admin') {
      return errorResponse('Unauthorized to update this task', 403);
    }

    const body = await request.json();
    
    const updatedTask = {
      ...task,
      ...body,
      id, // Prevent ID change
    };

    // Handle adding notes
    if (body.addNote) {
      updatedTask.notes = [...(task.notes || []), {
        note: body.addNote,
        addedBy: userId,
        addedAt: new Date().toISOString(),
      }];
    }

    // If closing task, update revenue
    if (body.status === 'closed' && body.revenue) {
      updatedTask.revenue = body.revenue;
    }

    setItem(store.vilanowTasks, id, updatedTask);

    return success(updatedTask, 'Task updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update task', 500);
  }
}

