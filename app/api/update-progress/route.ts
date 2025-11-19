/**
 * Update Progress API Route
 * 
 * Updates lesson progress statistics after a practice session.
 * Fetches aggregated stats from lesson_accuracy_stats view and updates lesson_progress table.
 * Creates progress record if it doesn't exist.
 * 
 * @route POST /api/update-progress
 * @access Protected - Requires authentication
 * 
 * @body {string} courseSlug - Course identifier
 * @body {number} lessonId - Lesson ID number
 * @body {string} lessonSlug - Lesson slug
 * 
 * @returns {Object} { success: boolean, stats: { accuracy, totalAttempts, correctAnswers, uniqueQuestions } }
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { courseSlug, lessonId, lessonSlug } = await request.json();

    if (!courseSlug || !lessonId || !lessonSlug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get accuracy stats from lesson_accuracy_stats view
    const { data: stats, error: statsError } = await supabase
      .from('lesson_accuracy_stats')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_slug', courseSlug)
      .eq('lesson_id', lessonId)
      .single();

    if (statsError && statsError.code !== 'PGRST116') {
      console.error('Error fetching accuracy stats:', statsError);
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      );
    }

    // Check if progress record exists
    const { data: existing, error: fetchError } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_slug', courseSlug)
      .eq('lesson_id', lessonId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching lesson progress:', fetchError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    // Calculate total time spent from all completed sessions
    const { data: sessions } = await supabase
      .from('practice_sessions')
      .select('duration_seconds')
      .eq('user_id', user.id)
      .eq('course_slug', courseSlug)
      .eq('lesson_id', lessonId)
      .not('completed_at', 'is', null);

    const totalSeconds = sessions?.reduce((sum, session) => sum + (session.duration_seconds || 0), 0) || 0;
    const totalMinutes = Math.floor(totalSeconds / 60);

    const updateData = {
      accuracy_score: stats?.accuracy_percentage || 0,
      attempts: stats?.total_attempts || 0,
      time_spent_minutes: totalMinutes,
      last_attempt_at: new Date().toISOString(),
    };

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('lesson_progress')
        .update(updateData)
        .eq('id', existing.id);

      if (updateError) {
        console.error('Error updating lesson progress:', updateError);
        return NextResponse.json(
          { error: 'Failed to update progress' },
          { status: 500 }
        );
      }
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('lesson_progress')
        .insert({
          user_id: user.id,
          course_slug: courseSlug,
          lesson_id: lessonId,
          lesson_slug: lessonSlug,
          ...updateData,
        });

      if (insertError) {
        console.error('Error creating lesson progress:', insertError);
        return NextResponse.json(
          { error: 'Failed to create progress' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ 
      success: true,
      stats: {
        accuracy: stats?.accuracy_percentage || 0,
        totalAttempts: stats?.total_attempts || 0,
        correctAnswers: stats?.correct_answers || 0,
        uniqueQuestions: stats?.unique_questions_attempted || 0,
      }
    });

  } catch (error) {
    console.error('Error in update-progress API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
