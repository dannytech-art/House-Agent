import { success, errorResponse, parseRequestBody, validateRequiredFields } from '../_lib/utils';
import { findItems, setItem, createId } from '../_lib/data-store';
import { hashPassword } from '../_lib/security';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge', // Edge runtime for Vercel
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const body = await parseRequestBody(request);
    
    // Validate required fields
    const required = ['email', 'password', 'name', 'phone', 'role'];
    const missing = validateRequiredFields(body, required);
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    const { email, password, name, phone, role } = body;

    // Validate role
    if (!['seeker', 'agent', 'admin'].includes(role)) {
      return errorResponse('Invalid role', 400);
    }

    // Validate password strength
    if (password.length < 8) {
      return errorResponse('Password must be at least 8 characters long', 400);
    }

    // Check if user already exists
    const existingUsers = await findItems('users', { email });
    
    if (existingUsers.length > 0) {
      return errorResponse('User with this email already exists', 409);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userId = createId('user');
    const user = {
      id: userId,
      email,
      passwordHash, // Store hashed password
      name,
      phone,
      role,
      avatar: body.avatar || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Role-specific fields
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

    // Save user to database (Supabase or in-memory)
    await setItem('users', userId, user);

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    return success(userWithoutPassword, 'User registered successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Registration failed', 500);
  }
}

