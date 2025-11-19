/**
 * Complete Lesson API Route
 * 
 * Marks a lesson's content as completed after user views all slides.
 * Updates lesson_completed and lesson_completed_at fields in lesson_progress table.
 * Creates progress record if it doesn't exist.
 * 
 * @route POST /api/complete-lesson
 * @access Protected - Requires authentication
 * 
 * @body {string} courseSlug - Course identifier
 * @body {number} lessonId - Lesson ID number
 * @body {string} lessonSlug - Lesson slug
 * 
 * @returns {Object} { success: boolean }
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

    // Check if progress record exists
    const { data: existing, error: fetchError } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_slug', courseSlug)
      .eq('lesson_id', lessonId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching lesson progress:', fetchError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('lesson_progress')
        .update({
          lesson_completed: true,
          lesson_completed_at: new Date().toISOString(),
          is_completed: true,
          completed_at: new Date().toISOString(),
        })
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
          lesson_completed: true,
          lesson_completed_at: new Date().toISOString(),
          is_completed: true,
          completed_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error creating lesson progress:', insertError);
        return NextResponse.json(
          { error: 'Failed to create progress' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in complete-lesson API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
