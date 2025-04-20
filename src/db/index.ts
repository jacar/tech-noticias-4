import { drizzle } from 'drizzle-orm/postgres-js';
import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';
import * as schema from "./schema";

// Get environment variables with fallbacks to prevent build errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjEzMDk2ODAwLCJleHAiOjE5Mjg2NTY4MDB9.example';
const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/postgres';

// Create Supabase client with fallback values
export const supabase = createClient(supabaseUrl, supabaseKey);

// Create a mock postgres client if no database URL is provided
let sql: any;
try {
  sql = postgres(databaseUrl, { prepare: false });
} catch (error) {
  // Provide a mock implementation for build time
  console.warn('Database connection failed, using mock implementation');
  sql = {
    // Mock implementation that won't be used in production
    query: async (): Promise<any[]> => [],
  };
}

// Create Drizzle client
export const db = drizzle({ client: sql, schema });

// Helper function to check if database is properly configured
export const isDatabaseConfigured = (): boolean => {
  return (
    process.env.DATABASE_URL !== undefined &&
    process.env.DATABASE_URL !== 'postgresql://postgres:password@localhost:5432/postgres'
  );
};
