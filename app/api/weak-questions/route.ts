/**
 * Weak Questions API Route
 * 
 * Returns question IDs for questions the user answered incorrectly
 * (most recent attempt was wrong).
 * 
 * Query Parameters:
 * - courseSlug: Course identifier (e.g., 'maths')
 * - lessonId: Lesson ID number
 * 
 * Returns:
 * - Array of question IDs (strings) that were answered incorrectly
 * 
 * Used by:
 * - PracticeSession component for weak_areas practice mode
 * 
 * Database:
 * - Queries weak_questions view which shows questions with is_correct = false
 *   on most recent attempt
 * 
 * @route GET /api/weak-questions
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseSlug = searchParams.get('courseSlug');
    const lessonId = searchParams.get('lessonId');

    if (!courseSlug || !lessonId) {
      return NextResponse.json(
        { error: 'Missing required parameters: courseSlug and lessonId' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get weak questions from view
    const { data: weakQuestions, error: weakError } = await supabase
      .from('weak_questions')
      .select('question_id')
      .eq('user_id', user.id)
      .eq('course_slug', courseSlug)
      .eq('lesson_id', parseInt(lessonId));

    if (weakError) {
      console.error('Error fetching weak questions:', weakError);
      return NextResponse.json(
        { error: 'Failed to fetch weak questions' },
        { status: 500 }
      );
    }

    // Extract just the question IDs
    const questionIds = weakQuestions?.map(q => q.question_id) || [];

    return NextResponse.json(questionIds);
  } catch (error) {
    console.error('Error in weak-questions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
