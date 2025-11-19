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
      return NextResponse.json(
        { error: 'Missing required fields' },
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
