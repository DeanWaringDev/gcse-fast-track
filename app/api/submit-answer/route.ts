/**
 * Submit Answer API Route
 * 
 * Records a user's answer to a practice question in the question_attempts table.
 * Performs case-insensitive comparison and tracks timing data.
 * 
 * @route POST /api/submit-answer
 * @access Protected - Requires authentication
 * 
 * @body {string} courseSlug - Course identifier (e.g., 'maths')
 * @body {number} lessonId - Lesson ID number
 * @body {string} lessonSlug - Lesson slug
 * @body {string} questionId - Question identifier
 * @body {string} sectionId - Section identifier (optional)
 * @body {string} userAnswer - User's submitted answer
 * @body {string} correctAnswer - Correct answer for comparison
 * @body {string} practiceMode - Practice mode (practice, timed, expert, weak_areas)
 * @body {number} timeTakenSeconds - Time spent on question (optional)
 * 
 * @returns {Object} { success: boolean, isCorrect: boolean, correctAnswer: string }
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to submit answers' },
        { status: 401 }
      );
    }

    const { 
      courseSlug, 
      lessonId, 
      lessonSlug, 
      questionId, 
      sectionId,
      userAnswer, 
      correctAnswer, 
      practiceMode,
      timeTakenSeconds 
    } = await request.json();

    // Validate required fields
    if (!courseSlug || !lessonId || !lessonSlug || !questionId || userAnswer === undefined || !correctAnswer) {
      const missingFields = [];
      if (!courseSlug) missingFields.push('courseSlug');
      if (!lessonId) missingFields.push('lessonId');
      if (!lessonSlug) missingFields.push('lessonSlug');
      if (!questionId) missingFields.push('questionId');
      if (userAnswer === undefined) missingFields.push('userAnswer');
      if (!correctAnswer) missingFields.push('correctAnswer');
      
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Determine if answer is correct (case-insensitive comparison, trimmed)
    const isCorrect = userAnswer.toString().trim().toLowerCase() === correctAnswer.toString().trim().toLowerCase();

    // Save question attempt
    const { error: insertError } = await supabase
      .from('question_attempts')
      .insert({
        user_id: user.id,
        course_slug: courseSlug,
        lesson_id: lessonId,
        lesson_slug: lessonSlug,
        question_id: questionId,
        section_id: sectionId,
        user_answer: userAnswer.toString(),
        correct_answer: correctAnswer.toString(),
        is_correct: isCorrect,
        practice_mode: practiceMode || 'practice',
        time_taken_seconds: timeTakenSeconds || null,
      });

    if (insertError) {
      console.error('Error saving question attempt:', insertError);
      return NextResponse.json(
        { error: 'Failed to save answer' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      isCorrect,
      correctAnswer 
    });

  } catch (error) {
    console.error('Error in submit-answer API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
