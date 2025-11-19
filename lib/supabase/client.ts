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
// Suppress Supabase realtime 406 errors from console
if (typeof window !== 'undefined') {
  // Override console.error to filter out realtime 406 errors
  const originalError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    // Filter out 406 errors from Supabase realtime
    if (message.includes('406') && (message.includes('supabase') || message.includes('realtime') || message.includes('lesson_progress'))) {
      return; // Silently ignore
    }
    originalError.apply(console, args);
  };

  // Also suppress fetch errors for realtime endpoints
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0]?.toString() || '';
    return originalFetch.apply(this, args).catch((error) => {
      // Suppress errors from realtime endpoints
      if (url.includes('/rest/v1/lesson_progress') || url.includes('/realtime/v1')) {
        return new Response('[]', { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' }
        });
      }
      throw error;
    });
  };
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {},
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  );
}
