import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Withdraw from course and delete all associated data
 * POST /api/withdraw-course
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseSlug } = await request.json();

    if (!courseSlug) {
      return NextResponse.json({ error: 'Course slug is required' }, { status: 400 });
    }

    // Start transaction-like operations
    // Delete in order: child tables first, then parent tables

    // 1. Delete question attempts
    const { error: attemptsError } = await supabase
      .from('question_attempts')
      .delete()
      .eq('user_id', user.id)
      .eq('course_slug', courseSlug);

    if (attemptsError) {
      console.error('Error deleting question attempts:', attemptsError);
    }

    // 2. Delete practice sessions
    const { error: sessionsError } = await supabase
      .from('practice_sessions')
      .delete()
      .eq('user_id', user.id)
      .eq('course_slug', courseSlug);

    if (sessionsError) {
      console.error('Error deleting practice sessions:', sessionsError);
    }

    // 3. Delete lesson progress
    const { error: progressError } = await supabase
      .from('lesson_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('course_slug', courseSlug);

    if (progressError) {
      console.error('Error deleting lesson progress:', progressError);
    }

    // 4. Delete study activity
    const { error: activityError } = await supabase
      .from('study_activity')
      .delete()
      .eq('user_id', user.id)
      .eq('course_slug', courseSlug);

    if (activityError) {
      console.error('Error deleting study activity:', activityError);
    }

    // 5. Update enrollment status to 'withdrawn' (don't delete)
    const { error: enrollmentError } = await supabase
      .from('enrollments')
      .update({
        status: 'withdrawn',
        withdrawn_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('course_slug', courseSlug);

    if (enrollmentError) {
      console.error('Error updating enrollment:', enrollmentError);
      return NextResponse.json(
        { error: 'Failed to withdraw from course' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully withdrawn from course. All progress data has been deleted.'
    });

  } catch (error) {
    console.error('Withdraw error:', error);
    return NextResponse.json(
      { error: 'Failed to process withdrawal' },
      { status: 500 }
    );
  }
}
