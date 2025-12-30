# Supabase Migration Guide

This guide outlines how to migrate from the in-memory data store to Supabase.

## Prerequisites

1. Create a Supabase project at https://supabase.com
2. Get your Supabase URL and anon key from project settings
3. Install Supabase client: `npm install @supabase/supabase-js`

## Environment Variables

Add to `.env.local` and Vercel environment variables:

```env
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key (for admin operations)
USE_SUPABASE=true
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('seeker', 'agent', 'admin')),
  avatar TEXT,
  agent_type TEXT CHECK (agent_type IN ('direct', 'semi-direct')),
  verified BOOLEAN DEFAULT false,
  kyc_status TEXT DEFAULT 'unverified' CHECK (kyc_status IN ('unverified', 'pending', 'verified', 'rejected')),
  kyc_completed_at TIMESTAMPTZ,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  credits INTEGER DEFAULT 0,
  wallet_balance DECIMAL(12, 2) DEFAULT 0,
  streak INTEGER DEFAULT 0,
  total_listings INTEGER DEFAULT 0,
  total_interests INTEGER DEFAULT 0,
  response_time INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  tier TEXT DEFAULT 'street-scout',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Properties Table
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('apartment', 'house', 'duplex', 'penthouse', 'studio', 'land')),
  price DECIMAL(12, 2) NOT NULL,
  location TEXT NOT NULL,
  area TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  images TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  agent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agent_type TEXT,
  agent_name TEXT,
  agent_verified BOOLEAN DEFAULT false,
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'pending', 'sold')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_properties_agent_id ON properties(agent_id);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_featured ON properties(featured);
```

### Interests Table
```sql
CREATE TABLE interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  seeker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  seeker_name TEXT NOT NULL,
  seeker_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  seriousness_score INTEGER DEFAULT 50,
  unlocked BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'viewing-scheduled', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_interests_property_id ON interests(property_id);
CREATE INDEX idx_interests_seeker_id ON interests(seeker_id);
CREATE INDEX idx_interests_status ON interests(status);
```

### Chat Sessions Table
```sql
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_ids UUID[] NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  interest_id UUID REFERENCES interests(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_sessions_participants ON chat_sessions USING GIN(participant_ids);
```

### Chat Messages Table
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_avatar TEXT,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'property-brief', 'inspection-schedule', 'document')),
  metadata JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_session_id ON chat_messages(chat_session_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('credit_purchase', 'credit_spent', 'wallet_load', 'wallet_debit')),
  amount DECIMAL(12, 2) NOT NULL,
  credits INTEGER,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('completed', 'pending', 'failed')),
  bundle_id TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp);
```

### Property Requests Table
```sql
CREATE TABLE property_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seeker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('apartment', 'house', 'duplex', 'penthouse', 'studio', 'land')),
  location TEXT NOT NULL,
  min_budget DECIMAL(12, 2) NOT NULL,
  max_budget DECIMAL(12, 2) NOT NULL,
  bedrooms INTEGER NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'expired')),
  matches INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_property_requests_seeker_id ON property_requests(seeker_id);
CREATE INDEX idx_property_requests_status ON property_requests(status);
```

### Watchlist Table
```sql
CREATE TABLE watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX idx_watchlist_property_id ON watchlist(property_id);
```

## Migration Steps

### Step 1: Update data-store.ts

Replace the in-memory store with Supabase client:

```typescript
import { createClient } from '@supabase/supabase-js';
import { config } from './config';

const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.serviceKey;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Replace getStore() calls with Supabase queries
export async function getItem(table: string, id: string) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}
```

### Step 2: Update Authentication

Use Supabase Auth:

```typescript
// In middleware.ts
import { supabase } from './data-store';

export async function requireAuth(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) return null;
  
  return user.id;
}
```

### Step 3: Update API Routes

Replace in-memory operations with Supabase queries:

```typescript
// Before
const store = getStore();
const user = store.users.get(id);

// After
const { data: user, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', id)
  .single();
```

### Step 4: Row Level Security (RLS)

Enable RLS policies in Supabase:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;

-- Example policies
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

## Testing Migration

1. Test all API endpoints after migration
2. Verify data integrity
3. Test authentication flow
4. Test CRUD operations for all entities
5. Verify RLS policies work correctly

## Rollback Plan

Keep the old data-store.ts code commented out for easy rollback if needed during migration.

