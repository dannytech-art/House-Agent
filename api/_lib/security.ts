// Security utilities for password hashing and JWT
// Compatible with Vercel Edge Runtime

import { SignJWT, jwtVerify } from 'jose';
import { config } from './config';

// Password hashing using Web Crypto API (works in Edge Runtime)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Use Web Crypto API to hash password
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Add salt and hash again for better security (simple approach for Edge Runtime)
  // In production with Supabase, use bcrypt which is more secure
  const saltedData = encoder.encode(hashHex + config.jwtSecret);
  const finalHashBuffer = await crypto.subtle.digest('SHA-256', saltedData);
  const finalHashArray = Array.from(new Uint8Array(finalHashBuffer));
  const finalHash = finalHashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return finalHash;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // Check if it's a bcrypt hash (starts with $2a$, $2b$, or $2y$)
  if (hashedPassword.startsWith('$2')) {
    // For bcrypt hashes, use Supabase RPC function
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
      
      if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Supabase credentials not configured for bcrypt verification');
        return false;
      }
      
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { data, error } = await supabase.rpc('verify_bcrypt_password', {
        input_password: password,
        stored_hash: hashedPassword,
      });
      
      if (error) {
        console.error('Bcrypt verification error:', error);
        return false;
      }
      
      return data === true;
    } catch (error) {
      console.error('Error verifying bcrypt password:', error);
      return false;
    }
  }
  
  // For SHA-256 hashes (our custom format)
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
}

// JWT token generation and verification
export async function generateToken(payload: {
  userId: string;
  email: string;
  role: string;
}): Promise<string> {
  const secret = new TextEncoder().encode(config.jwtSecret);
  
  const token = await new SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(config.jwtExpiresIn)
    .sign(secret);
  
  return token;
}

export async function verifyToken(token: string): Promise<{
  userId: string;
  email: string;
  role: string;
} | null> {
  try {
    const secret = new TextEncoder().encode(config.jwtSecret);
    const { payload } = await jwtVerify(token, secret);
    
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch (error) {
    return null;
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

