import { success } from './_lib/utils';
import type { Request } from './_lib/types';
import { errorResponse } from './_lib/utils';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return success({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
}

