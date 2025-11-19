/**
 * Supabase Client Configuration
 * 
 * Creates and exports a browser-side Supabase client for authentication
 * and database operations in client components.
 * 
 * Environment Variables Required:
 * - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anonymous/public key
 * 
 * Usage:
 * - Import in client components ('use client')
 * - Use for auth operations (signIn, signUp, signOut)
 * - Use for database queries from client
 * 
 * @module
 */

import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for browser-side operations
 * Uses public environment variables safe for client-side exposure
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
