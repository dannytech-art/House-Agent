import { success, errorResponse, parseRequestBody, validateRequiredFields } from '../_lib/utils';
import { findItems, createItem } from '../_lib/data-store'; // 👈 Ensure session is saved
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

    const users = await findItems('users', { email });
    const user = users[0];

    if (!user) return errorResponse('Invalid email or password', 401);

    // Ensure hash naming compatibility
    const passwordHash =
      (user as any).password_hash ||
      (user as any).passwordHash ||
      user.password; // fallback if imported users have plain passwords

    if (!passwordHash) {
      return errorResponse('Invalid email or password', 401);
    }

    const isPasswordValid = await verifyPassword(password, passwordHash);
    if (!isPasswordValid) {
      return errorResponse('Invalid email or password', 401);
    }

    // Create JWT Token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create Session
    const session = await createItem('sessions', {
      userId: user.id,
      token,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Sanitize response — remove password fields completely
    const cleanUser: any = { ...user };
    delete cleanUser.password;
    delete cleanUser.passwordHash;
    delete cleanUser.password_hash;

    return success(
      {
        user: cleanUser,
        token,
        sessionId: session.id,
      },
      'Login successful'
    );
  } catch (error: any) {
    return errorResponse(error.message || 'Login failed', 500);
  }
}
