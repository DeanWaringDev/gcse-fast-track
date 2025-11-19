/**
 * Start Practice Session API Route
 * 
 * Creates a new practice session record when user begins practicing questions.
 * Tracks session as a single unit regardless of number of questions.
 * 
 * @route POST /api/start-practice-session
 * @access Protected - Requires authentication
 * 
 * @body {string} courseSlug - Course identifier
 * @body {number} lessonId - Lesson ID number
 * @body {string} practiceMode - Practice mode (practice, timed, expert, weak_areas)
 * 
 * @returns {Object} { sessionId: string }
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

    const { courseSlug, lessonId, lessonSlug, practiceMode } = await request.json();

    if (!courseSlug || !lessonId || !lessonSlug || !practiceMode) {
      return NextResponse.json(
        { error: 'Missing required fields: courseSlug, lessonId, lessonSlug, practiceMode' },
        { status: 400 }
      );
    }

    // Create new practice session
    const { data: session, error: sessionError } = await supabase
      .from('practice_sessions')
      .insert({
        user_id: user.id,
        course_slug: courseSlug,
        lesson_id: lessonId,
        lesson_slug: lessonSlug,
        practice_mode: practiceMode,
        questions_attempted: 0,
        questions_correct: 0,
        accuracy_percentage: 0,
        duration_seconds: 0,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating practice session:', sessionError);
      return NextResponse.json(
        { error: 'Failed to create practice session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error in start-practice-session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
