import { success, errorResponse, parseRequestBody, validateRequiredFields } from '../_lib/utils';
import { findItems } from '../_lib/data-store';
import { verifyPassword, generateToken } from '../_lib/security';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const body = await parseRequestBody(request);
    
    const missing = validateRequiredFields(body, ['email', 'password']);
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    const { email, password } = body;

    // Find user (Supabase or in-memory)
    const users = await findItems('users', { email });
    const user = users.length > 0 ? users[0] : null;

    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    // Verify password - check both password_hash and passwordHash for compatibility
    const passwordHash = (user as any).password_hash || (user as any).passwordHash;
    if (!passwordHash) {
      // Legacy user without password hash - reject for security
      return errorResponse('Invalid email or password', 401);
    }

    const isPasswordValid = await verifyPassword(password, passwordHash);
    if (!isPasswordValid) {
      return errorResponse('Invalid email or password', 401);
    }

    // Generate proper JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create session
    const session = {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      createdAt: new Date().toISOString(),
    };

    // Return user and token (exclude password hash)
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    return success({
      user: userWithoutPassword,
      token,
      session,
    }, 'Login successful');
  } catch (error: any) {
    return errorResponse(error.message || 'Login failed', 500);
  }
}

