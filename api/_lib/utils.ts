import { ApiResponse, ApiError } from './types';

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function errorResponse(error: string | ApiError, statusCode: number = 400): Response {
  const errorObj: ApiError = typeof error === 'string' 
    ? { code: 'ERROR', message: error }
    : error;

  return new Response(
    JSON.stringify({
      success: false,
      error: errorObj.message,
      code: errorObj.code,
      details: errorObj.details,
    }),
    {
      status: statusCode,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export function success<T>(data: T, message?: string): Response {
  return new Response(
    JSON.stringify(successResponse(data, message)),
    {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export function unauthorized(message: string = 'Unauthorized'): Response {
  return errorResponse(message, 401);
}

export function forbidden(message: string = 'Forbidden'): Response {
  return errorResponse(message, 403);
}

export function notFound(message: string = 'Not found'): Response {
  return errorResponse(message, 404);
}

export function badRequest(message: string = 'Bad request'): Response {
  return errorResponse(message, 400);
}

export function serverError(message: string = 'Internal server error'): Response {
  return errorResponse(message, 500);
}

export async function parseRequestBody<T>(request: Request): Promise<T> {
  try {
    return await request.json();
  } catch (error) {
    throw new Error('Invalid JSON in request body');
  }
}

export function getQueryParams(request: Request): URLSearchParams {
  const url = new URL(request.url);
  return url.searchParams;
}

export async function extractUserId(request: Request): Promise<string | null> {
  // Use the proper auth middleware
  const { getUserId } = await import('./middleware');
  return await getUserId(request);
}

export function validateRequiredFields(data: any, fields: string[]): string[] {
  const missing: string[] = [];
  for (const field of fields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missing.push(field);
    }
  }
  return missing;
}
