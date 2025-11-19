/**
 * Authentication Callback Route Handler
 * 
 * Handles OAuth callbacks from Supabase authentication providers.
 * This route is called after successful OAuth authentication (Google, GitHub, etc.)
 * 
 * Flow:
 * 1. User clicks OAuth button (Google/GitHub)
 * 2. Redirected to provider's login page
 * 3. After successful auth, provider redirects here with auth code
 * 4. Exchange code for session
 * 5. Redirect to dashboard
 * 
 * @route
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Successful authentication - redirect to dashboard
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Authentication failed - redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=authentication_failed`);
}
