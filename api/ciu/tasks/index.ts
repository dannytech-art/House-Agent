import { success, errorResponse } from '../../_lib/utils';
import { getStore, getAllItems, createId, getItem, setItem } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return handleGetTasks(request);
  } else if (request.method === 'POST') {
    return handleCreateTask(request);
  }

  return errorResponse('Method not allowed', 405);
}

async function handleGetTasks(request: Request) {
  try {
    const userId = await requireAuth(request);
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    // Check if admin or assigned Vilanow agent
    const store = getStore();
    const user = store.users.get(userId);
    
    const queryParams = new URL(request.url).searchParams;
    
    if (!store.vilanowTasks) {
      return success([]);
    }

    let tasks = getAllItems(store.vilanowTasks);

    // If not admin, only show assigned tasks
    if (!user || user.role !== 'admin') {
      tasks = tasks.filter((t: any) => t.assignedAgent === userId);
    }

    // Filter by status
    const status = queryParams.get('status');
    if (status) {
      tasks = tasks.filter((t: any) => t.status === status);
    }

    // Filter by priority
    const priority = queryParams.get('priority');
    if (priority) {
      tasks = tasks.filter((t: any) => t.priority === priority);
    }

    // Filter by assigned agent
    const assignedAgent = queryParams.get('assignedAgent');
    if (assignedAgent) {
      tasks = tasks.filter((t: any) => t.assignedAgent === assignedAgent);
    }

    // Sort by priority and deadline
    tasks.sort((a: any, b: any) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority as keyof typeof priorityOrder] !== priorityOrder[b.priority as keyof typeof priorityOrder]) {
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      }
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return 0;
    });

    return success(tasks);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch tasks', 500);
  }
}

async function handleCreateTask(request: Request) {
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
    
    const required = ['dealId', 'propertyTitle', 'assignedAgent'];
    const missing = required.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    // Verify assigned agent exists
    const assignedAgent = store.users.get(body.assignedAgent);
    if (!assignedAgent || assignedAgent.role !== 'agent') {
      return errorResponse('Assigned agent not found', 404);
    }

    const taskId = createId('task');
    const task = {
      id: taskId,
      dealId: body.dealId,
      propertyTitle: body.propertyTitle,
      assignedAgent: body.assignedAgent,
      status: 'assigned', // 'assigned', 'in-progress', 'viewing-scheduled', 'closed', 'lost'
      priority: body.priority || 'medium', // 'high', 'medium', 'low'
      createdAt: new Date().toISOString(),
      deadline: body.deadline || null,
      notes: body.notes || [],
      revenue: body.revenue || 0,
    };

    if (!store.vilanowTasks) {
      store.vilanowTasks = new Map();
    }
    store.vilanowTasks.set(taskId, task);

    return success(task, 'Task created successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create task', 500);
  }
}

