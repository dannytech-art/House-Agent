import { success, errorResponse, parseRequestBody, validateRequiredFields } from '../_lib/utils';
import { getStore, createId } from '../_lib/data-store';
import { hashPassword } from '../_lib/security';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

// Request password reset
export default async function handler(request: Request) {
  if (request.method === 'POST') {
    return handleRequestReset(request);
  } else if (request.method === 'PATCH') {
    return handleResetPassword(request);
  }
  
  return errorResponse('Method not allowed', 405);
}

async function handleRequestReset(request: Request) {
  try {
    const body = await parseRequestBody(request);
    
    const missing = validateRequiredFields(body, ['email']);
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    const { email } = body;

    // TODO: Check if user exists and send reset email
    // For now, just return success
    
    const resetToken = createId('reset');
    
    // TODO: Store reset token in database with expiration
    // TODO: Send email with reset link

    return success({
      message: 'Password reset email sent',
      token: resetToken, // Remove in production - only for testing
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to request password reset', 500);
  }
}

async function handleResetPassword(request: Request) {
  try {
    const body = await parseRequestBody(request);
    
    const missing = validateRequiredFields(body, ['token', 'newPassword']);
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    const { token, newPassword } = body;

    // Validate password strength
    if (newPassword.length < 8) {
      return errorResponse('Password must be at least 8 characters long', 400);
    }

    // TODO: Validate reset token from database and check expiration
    // For now, this is a placeholder - in production, you'd:
    // 1. Look up reset token in database
    // 2. Check if it's expired
    // 3. Get associated user ID
    // 4. Update user's password
    // 5. Invalidate/delete the reset token

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // TODO: Update user password in database
    // Example (when database is available):
    // const store = getStore();
    // const user = store.users.get(userId);
    // if (user) {
    //   user.passwordHash = passwordHash;
    //   user.updatedAt = new Date().toISOString();
    //   store.users.set(userId, user);
    // }

    return success({ message: 'Password reset successfully' });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to reset password', 500);
  }
}

