import { success, errorResponse, parseRequestBody, validateRequiredFields } from '../_lib/utils';
import { findItems, setItem, createId } from '../_lib/data-store';
import { hashPassword, generateToken } from '../_lib/security';
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

    const required = ['email', 'password', 'name', 'phone', 'role'];
    const missing = validateRequiredFields(body, required);

    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    const { email, password, name, phone, role } = body;

    if (!['seeker', 'agent', 'admin'].includes(role)) {
      return errorResponse('Invalid role', 400);
    }

    if (password.length < 8) {
      return errorResponse('Password must be at least 8 characters long', 400);
    }

    const existingUsers = await findItems('users', { email });
    if (existingUsers.length > 0) {
      return errorResponse('User with this email already exists', 409);
    }

    const passwordHash = await hashPassword(password);
    const userId = createId('user');

    const user = {
      id: userId,
      email,
      passwordHash, // stored securely
      name,
      phone,
      role,
      avatar: body.avatar || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      ...(role === 'agent' && {
        agentType: body.agentType || 'direct',
        verified: false,
        kycStatus: 'unverified',
        level: 1,
        xp: 0,
        credits: 0,
        walletBalance: 0,
        streak: 0,
        totalListings: 0,
        totalInterests: 0,
        responseTime: 0,
        rating: 0,
        tier: 'street-scout',
        territories: [],
        challenges: [],
        badges: [],
      }),
    };

    await setItem('users', userId, user);

    // Generate JWT token for immediate authentication after signup
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Optionally create a session to mirror login behavior
    // For in-memory store, just persist a session-like record on users map if needed
    // Remove password before response
    const cleanUser: any = { ...user };
    delete cleanUser.password;
    delete cleanUser.passwordHash;

    return success(
      { user: cleanUser, token },
      'User registered successfully'
    );

  } catch (error: any) {
    return errorResponse(error.message || 'Registration failed', 500);
  }
}
