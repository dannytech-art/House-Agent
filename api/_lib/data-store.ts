// Data store with Supabase support
// Falls back to in-memory store if Supabase is not configured

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './config';

// In-memory store (fallback for development)
interface DataStore {
  users: Map<string, any>;
  properties: Map<string, any>;
  interests: Map<string, any>;
  chats: Map<string, any>;
  transactions: Map<string, any>;
  propertyRequests?: Map<string, any>;
  watchlist?: Map<string, any>;
  creditBundles?: Map<string, any>;
  kycDocuments?: Map<string, any>;
  challenges?: Map<string, any>;
  quests?: Map<string, any>;
  badges?: Map<string, any>;
  territories?: Map<string, any>;
  marketplaceOffers?: Map<string, any>;
  collaborations?: Map<string, any>;
  groups?: Map<string, any>;
  groupMessages?: Map<string, any>;
  flaggedContent?: Map<string, any>;
  adminActions?: Map<string, any>;
  systemSettings?: Map<string, any>;
  reports?: Map<string, any>;
  analyticsEvents?: Map<string, any>;
  notifications?: Map<string, any>;
  locations?: Map<string, any>;
  closableDeals?: Map<string, any>;
  vilanowTasks?: Map<string, any>;
  riskFlags?: Map<string, any>;
  automationRules?: Map<string, any>;
}

// Global in-memory store (fallback)
const store: DataStore = {
  users: new Map(),
  properties: new Map(),
  interests: new Map(),
  chats: new Map(),
  transactions: new Map(),
  propertyRequests: new Map(),
  watchlist: new Map(),
  creditBundles: new Map(),
  kycDocuments: new Map(),
  challenges: new Map(),
  quests: new Map(),
  badges: new Map(),
  territories: new Map(),
  marketplaceOffers: new Map(),
  collaborations: new Map(),
  groups: new Map(),
  groupMessages: new Map(),
  flaggedContent: new Map(),
  adminActions: new Map(),
  systemSettings: new Map(),
  reports: new Map(),
  analyticsEvents: new Map(),
  notifications: new Map(),
  locations: new Map(),
  closableDeals: new Map(),
  vilanowTasks: new Map(),
  riskFlags: new Map(),
  automationRules: new Map(),
};

// Supabase client (initialized if configured)
let supabaseClient: SupabaseClient | null = null;

// Initialize Supabase if configured
function initSupabase(): SupabaseClient | null {
  if (config.features.useSupabase && config.supabase.url && config.supabase.serviceKey) {
    if (!supabaseClient) {
      supabaseClient = createClient(config.supabase.url, config.supabase.serviceKey, {
        auth: {
          persistSession: false, // Edge runtime doesn't support session persistence
        },
      });
    }
    return supabaseClient;
  }
  return null;
}

// Check if Supabase is available
export function useSupabase(): boolean {
  return config.features.useSupabase && !!initSupabase();
}

// Get Supabase client
export function getSupabase(): SupabaseClient | null {
  return initSupabase();
}

// Get in-memory store (for backward compatibility)
export function getStore(): DataStore {
  return store;
}

// Helper to create UUID (for Supabase) or custom ID (for in-memory)
export function createId(prefix: string = 'id'): string {
  if (useSupabase()) {
    // Supabase uses UUIDs, but we'll generate a simple one for compatibility
    // In production, let Supabase generate UUIDs
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// Supabase Helper Functions
// ============================================

// Get single item from Supabase
export async function getItemFromSupabase<T>(table: string, id: string): Promise<T | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching ${table} with id ${id}:`, error);
    return null;
  }

  return data as T;
}

// Get all items from Supabase
export async function getAllItemsFromSupabase<T>(
  table: string,
  filters?: Record<string, any>
): Promise<T[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  let query = supabase.from(table).select('*');

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching ${table}:`, error);
    return [];
  }

  return (data || []) as T[];
}

// Insert item into Supabase
export async function insertItemToSupabase<T>(table: string, item: Partial<T>): Promise<T | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.from(table).insert(item).select().single();

  if (error) {
    console.error(`Error inserting into ${table}:`, error);
    return null;
  }

  return data as T;
}

// Update item in Supabase
export async function updateItemInSupabase<T>(
  table: string,
  id: string,
  updates: Partial<T>
): Promise<T | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating ${table} with id ${id}:`, error);
    return null;
  }

  return data as T;
}

// Delete item from Supabase
export async function deleteItemFromSupabase(table: string, id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { error } = await supabase.from(table).delete().eq('id', id);

  if (error) {
    console.error(`Error deleting from ${table} with id ${id}:`, error);
    return false;
  }

  return true;
}

// Find items in Supabase
export async function findItemsInSupabase<T>(
  table: string,
  predicate: Record<string, any>
): Promise<T[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  let query = supabase.from(table).select('*');

  Object.entries(predicate).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        query = query.in(key, value);
      } else {
        query = query.eq(key, value);
      }
    }
  });

  const { data, error } = await query;

  if (error) {
    console.error(`Error finding items in ${table}:`, error);
    return [];
  }

  return (data || []) as T[];
}

// ============================================
// Hybrid Helper Functions (works with both)
// ============================================

// Get item (Supabase or in-memory)
export async function getItem<T>(table: string, id: string): Promise<T | null> {
  if (useSupabase()) {
    return getItemFromSupabase<T>(table, id);
  }

  // Fallback to in-memory
  const collectionMap: Record<string, Map<string, T>> = {
    users: store.users as Map<string, T>,
    properties: store.properties as Map<string, T>,
    interests: store.interests as Map<string, T>,
    transactions: store.transactions as Map<string, T>,
    propertyRequests: store.propertyRequests as Map<string, T>,
    watchlist: store.watchlist as Map<string, T>,
  };

  const collection = collectionMap[table];
  if (!collection) return null;

  return collection.get(id) || null;
}

// Get all items (Supabase or in-memory)
export async function getAllItems<T>(table: string, filters?: Record<string, any>): Promise<T[]> {
  if (useSupabase()) {
    return getAllItemsFromSupabase<T>(table, filters);
  }

  // Fallback to in-memory
  const collectionMap: Record<string, Map<string, T>> = {
    users: store.users as Map<string, T>,
    properties: store.properties as Map<string, T>,
    interests: store.interests as Map<string, T>,
    transactions: store.transactions as Map<string, T>,
    propertyRequests: store.propertyRequests as Map<string, T>,
    watchlist: store.watchlist as Map<string, T>,
  };

  const collection = collectionMap[table];
  if (!collection) return [];

  const items = Array.from(collection.values());

  // Apply filters if provided
  if (filters) {
    return items.filter((item: any) => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null) return true;
        return item[key] === value;
      });
    });
  }

  return items;
}

// Set item (Supabase or in-memory)
export async function setItem<T>(table: string, id: string, item: T): Promise<T | null> {
  if (useSupabase()) {
    // Check if item exists
    const existing = await getItemFromSupabase<T>(table, id);
    if (existing) {
      return updateItemInSupabase<T>(table, id, item as Partial<T>);
    } else {
      return insertItemToSupabase<T>(table, { ...item, id } as Partial<T>);
    }
  }

  // Fallback to in-memory
  const collectionMap: Record<string, Map<string, T>> = {
    users: store.users as Map<string, T>,
    properties: store.properties as Map<string, T>,
    interests: store.interests as Map<string, T>,
    transactions: store.transactions as Map<string, T>,
    propertyRequests: store.propertyRequests as Map<string, T>,
    watchlist: store.watchlist as Map<string, T>,
  };

  const collection = collectionMap[table];
  if (!collection) return null;

  collection.set(id, item);
  return item;
}

// Delete item (Supabase or in-memory)
export async function deleteItem(table: string, id: string): Promise<boolean> {
  if (useSupabase()) {
    return deleteItemFromSupabase(table, id);
  }

  // Fallback to in-memory
  const collectionMap: Record<string, Map<string, any>> = {
    users: store.users,
    properties: store.properties,
    interests: store.interests,
    transactions: store.transactions,
    propertyRequests: store.propertyRequests,
    watchlist: store.watchlist,
  };

  const collection = collectionMap[table];
  if (!collection) return false;

  return collection.delete(id);
}

// Find items (Supabase or in-memory)
export async function findItems<T>(
  table: string,
  predicate: Record<string, any>
): Promise<T[]> {
  if (useSupabase()) {
    return findItemsInSupabase<T>(table, predicate);
  }

  // Fallback to in-memory
  const collectionMap: Record<string, Map<string, T>> = {
    users: store.users as Map<string, T>,
    properties: store.properties as Map<string, T>,
    interests: store.interests as Map<string, T>,
    transactions: store.transactions as Map<string, T>,
    propertyRequests: store.propertyRequests as Map<string, T>,
    watchlist: store.watchlist as Map<string, T>,
  };

  const collection = collectionMap[table];
  if (!collection) return [];

  const items = Array.from(collection.values());

  return items.filter((item: any) => {
    return Object.entries(predicate).every(([key, value]) => {
      if (value === undefined || value === null) return true;
      if (Array.isArray(value)) {
        return value.includes(item[key]);
      }
      return item[key] === value;
    });
  });
}

// Initialize store (for backward compatibility)
export function initializeStore() {
  // Supabase doesn't need initialization
  // In-memory store is already initialized
}

// Legacy helper functions (for backward compatibility with Map-based code)
export function getItemFromMap<T>(collection: Map<string, T>, id: string): T | undefined {
  return collection.get(id);
}

export function setItemToMap<T>(collection: Map<string, T>, id: string, item: T): void {
  collection.set(id, item);
}

export function deleteItemFromMap<T>(collection: Map<string, T>, id: string): boolean {
  return collection.delete(id);
}

export function getAllItemsFromMap<T>(collection: Map<string, T>): T[] {
  return Array.from(collection.values());
}

export function findItemsInMap<T>(
  collection: Map<string, T>,
  predicate: (item: T) => boolean
): T[] {
  return Array.from(collection.values()).filter(predicate);
}
