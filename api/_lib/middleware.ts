import { Request } from './types';
import { unauthorized, errorResponse, forbidden } from './utils';
import { verifyToken, extractTokenFromHeader } from './security';
import { getItem } from './data-store';
import { config } from './config';

// Get CORS origin from config
function getCorsOrigin(): string {
  const origin = config.cors.origin;
  if (origin === '*' || !origin) {
    // In production, should not use wildcard
    return process.env.NODE_ENV === 'production' ? '' : '*';
  }
  return origin;
}

// CORS middleware
export function cors(request: Request): Response | null {
  if (request.method === 'OPTIONS') {
    const corsOrigin = getCorsOrigin();
    const headers: HeadersInit = {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    if (corsOrigin) {
      headers['Access-Control-Allow-Origin'] = corsOrigin;
    }
    
    if (config.cors.credentials) {
      headers['Access-Control-Allow-Credentials'] = 'true';
    }
    
    return new Response(null, {
      status: 200,
      headers,
    });
  }
  
  return null;
}

// Add CORS headers to response
export function addCorsHeaders(response: Response): Response {
  const newHeaders = new Headers(response.headers);
  const corsOrigin = getCorsOrigin();
  
  if (corsOrigin) {
    newHeaders.set('Access-Control-Allow-Origin', corsOrigin);
  }
  newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (config.cors.credentials) {
    newHeaders.set('Access-Control-Allow-Credentials', 'true');
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

// Authentication middleware - returns user info or null
export async function requireAuth(request: Request): Promise<{
  userId: string;
  email: string;
  role: string;
} | null> {
  const authHeader = request.headers.get('Authorization');
  const token = extractTokenFromHeader(authHeader);
  
  if (!token) {
    return null;
  }
  
  // Verify JWT token
  const payload = await verifyToken(token);
  if (!payload) {
    return null;
  }
  
  // Verify user still exists in database
  const user = await getItem('users', payload.userId);
  if (!user) {
    return null;
  }
  
  return payload;
}

// Get user ID from request (for backward compatibility)
export async function getUserId(request: Request): Promise<string | null> {
  const auth = await requireAuth(request);
  return auth?.userId || null;
}

// Role-based authorization
export async function requireRole(
  request: Request, 
  allowedRoles: string[]
): Promise<{
  userId: string;
  email: string;
  role: string;
} | null> {
  const auth = await requireAuth(request);
  
  if (!auth) {
    return null;
  }
  
  if (!allowedRoles.includes(auth.role)) {
    return null;
  }
  
  return auth;
}

// Middleware helper to check if user has required role
export async function checkRole(
  request: Request,
  allowedRoles: string[]
): Promise<Response | null> {
  const auth = await requireRole(request, allowedRoles);
  
  if (!auth) {
    return forbidden('Insufficient permissions');
  }
  
  return null; // User has required role
}

// Error handler
export function errorHandler(error: any): Response {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    return errorResponse(error.message, 500);
  }
  
  return errorResponse('Internal server error', 500);
}

