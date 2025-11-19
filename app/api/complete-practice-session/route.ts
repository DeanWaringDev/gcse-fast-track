/**
 * Complete Practice Session API Route
 * 
 * Updates a practice session with final statistics when user completes all questions.
 * Calculates accuracy percentage and records completion time.
 * 
 * @route POST /api/complete-practice-session
 * @access Protected - Requires authentication
 * 
 * @body {string} sessionId - Session UUID to update
 * @body {number} questionsAttempted - Total questions in session
 * @body {number} questionsCorrect - Number answered correctly
 * @body {number} durationSeconds - Total time spent in session
 * 
 * @returns {Object} { success: boolean }
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { sessionId, questionsAttempted, questionsCorrect, durationSeconds } = await request.json();

    if (!sessionId || questionsAttempted === undefined || questionsCorrect === undefined || durationSeconds === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const accuracyPercentage = questionsAttempted > 0 
      ? Math.round((questionsCorrect / questionsAttempted) * 100) 
      : 0;

    // Update practice session
    const { error: updateError } = await supabase
      .from('practice_sessions')
      .update({
        questions_attempted: questionsAttempted,
        questions_correct: questionsCorrect,
        accuracy_percentage: accuracyPercentage,
        duration_seconds: durationSeconds,
        completed_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating practice session:', updateError);
      return NextResponse.json(
        { error: 'Failed to update practice session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in complete-practice-session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
