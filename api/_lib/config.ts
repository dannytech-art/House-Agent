// Configuration for API
// Environment variables will be used in production

// Validate required environment variables
function validateEnv() {
  const required = ['JWT_SECRET'];
  const missing: string[] = [];
  
  for (const key of required) {
    if (!process.env[key] && process.env.NODE_ENV === 'production') {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Only validate in production
if (process.env.NODE_ENV === 'production') {
  validateEnv();
}

export const config = {
  // API Configuration
  apiVersion: 'v1',
  
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' 
    ? (() => { throw new Error('JWT_SECRET must be set in production'); })()
    : 'dev-secret-key-change-in-production'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? '' : '*'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  },
  
  // Pagination defaults
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  
  // Supabase Configuration (will be used later)
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
  },
  
  // Feature flags
  features: {
    useSupabase: process.env.USE_SUPABASE === 'true',
    enableRealTime: process.env.ENABLE_REAL_TIME === 'true',
  },
};

